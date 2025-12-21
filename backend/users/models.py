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
