from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    """Custom user model extending Django's AbstractUser."""

    email = models.EmailField(unique=True, blank=False, null=False)
    
    # Authentication fields
    email_verified = models.BooleanField(default=False)
    failed_login_attempts = models.IntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
    activation_token_created = models.DateTimeField(null=True, blank=True)
    
    # Subscription fields
    stripe_customer_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    trial_ends_at = models.DateTimeField(null=True, blank=True)

    # Additional fields can be added here in the future
    # phone_number = models.CharField(max_length=20, blank=True)
    # profile_picture = models.ImageField(upload_to='profiles/', blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"

    def __str__(self) -> str:
        return str(self.email)
    
    def is_locked(self):
        """Check if account is currently locked."""
        if self.locked_until is None:
            return False
        if timezone.now() < self.locked_until:
            return True
        # Lock expired, unlock account
        self.locked_until = None
        self.failed_login_attempts = 0
        self.save(update_fields=["locked_until", "failed_login_attempts"])
        return False
    
    def lock_account(self, minutes=15):
        """Lock account for specified number of minutes."""
        self.locked_until = timezone.now() + timezone.timedelta(minutes=minutes)
        self.save(update_fields=["locked_until"])
    
    def unlock_account(self):
        """Unlock account and reset failed login attempts."""
        self.locked_until = None
        self.failed_login_attempts = 0
        self.save(update_fields=["locked_until", "failed_login_attempts"])
    
    def get_active_subscription(self):
        """Get user's active subscription."""
        try:
            subscription = self.subscription
            if subscription and subscription.is_active():
                return subscription
        except AttributeError:
            pass
        return None
    
    def has_feature_access(self, feature_slug):
        """Check if user has access to a specific feature."""
        try:
            from subscriptions.models import Feature
            feature = Feature.objects.get(slug=feature_slug)
            return feature.check_access(self)
        except Exception:
            return False
    
    def get_usage_count(self, feature_slug, period_start=None):
        """Get usage count for a feature in the current period."""
        try:
            from subscriptions.models import Feature, Usage
            from django.utils import timezone
            from datetime import timedelta
            
            feature = Feature.objects.get(slug=feature_slug)
            if not period_start:
                # Default to current month
                period_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                period_end = (period_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            else:
                period_end = period_start + timedelta(days=30)
            
            usage, _ = Usage.objects.get_or_create(
                user=self,
                feature=feature,
                period_start=period_start,
                defaults={'period_end': period_end}
            )
            return usage.count
        except Exception:
            return 0
