"""
Subscription models for SaaS functionality.
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal

User = get_user_model()


class SubscriptionTier(models.Model):
    """Subscription tier definition (Free, Basic, Pro, Enterprise)."""
    
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    price_yearly = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    stripe_price_id_monthly = models.CharField(max_length=255, null=True, blank=True)
    stripe_price_id_yearly = models.CharField(max_length=255, null=True, blank=True)
    features = models.JSONField(default=dict, help_text="Feature list as JSON")
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = "Subscription Tier"
        verbose_name_plural = "Subscription Tiers"
    
    def __str__(self):
        return self.name
    
    def get_features_list(self):
        """Get features as a list."""
        if isinstance(self.features, dict):
            return self.features.get('features', [])
        return []


class Feature(models.Model):
    """Feature definition for subscription gating."""
    
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    required_tier = models.ForeignKey(
        SubscriptionTier,
        on_delete=models.CASCADE,
        related_name='features'
    )
    is_usage_based = models.BooleanField(default=False)
    usage_limit = models.IntegerField(null=True, blank=True, help_text="Usage limit per period")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = "Feature"
        verbose_name_plural = "Features"
    
    def __str__(self):
        return self.name
    
    def check_access(self, user):
        """Check if user has access to this feature."""
        if not user.is_authenticated:
            return False
        
        subscription = user.get_active_subscription() if hasattr(user, 'get_active_subscription') else None
        if not subscription:
            # Check if Free tier has access
            free_tier = SubscriptionTier.objects.filter(slug='free').first()
            if free_tier and self.required_tier == free_tier:
                return True
            return False
        
        # Check if user's tier is equal or higher than required tier
        required_order = self.required_tier.display_order
        user_tier_order = subscription.tier.display_order
        return user_tier_order >= required_order


class Subscription(models.Model):
    """User's active subscription."""
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('trialing', 'Trialing'),
        ('cancelled', 'Cancelled'),
        ('past_due', 'Past Due'),
        ('unpaid', 'Unpaid'),
    ]
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='subscription'
    )
    tier = models.ForeignKey(
        SubscriptionTier,
        on_delete=models.PROTECT,
        related_name='subscriptions'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    current_period_start = models.DateTimeField()
    current_period_end = models.DateTimeField()
    stripe_subscription_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    stripe_customer_id = models.CharField(max_length=255)
    cancel_at_period_end = models.BooleanField(default=False)
    trial_ends_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Subscription"
        verbose_name_plural = "Subscriptions"
    
    def __str__(self):
        return f"{self.user.email} - {self.tier.name}"
    
    def is_active(self):
        """Check if subscription is currently active."""
        return self.status == 'active' and timezone.now() < self.current_period_end
    
    def is_trialing(self):
        """Check if subscription is in trial period."""
        if self.trial_ends_at:
            return timezone.now() < self.trial_ends_at and self.status == 'trialing'
        return False
    
    def days_remaining(self):
        """Get number of days remaining in current period."""
        if self.current_period_end:
            delta = self.current_period_end - timezone.now()
            return max(0, delta.days)
        return 0
    
    def cancel(self, at_period_end=True):
        """Cancel subscription."""
        self.cancel_at_period_end = at_period_end
        if not at_period_end:
            self.status = 'cancelled'
        self.save(update_fields=['cancel_at_period_end', 'status'])
    
    def resume(self):
        """Resume cancelled subscription."""
        self.cancel_at_period_end = False
        self.status = 'active'
        self.save(update_fields=['cancel_at_period_end', 'status'])


class Payment(models.Model):
    """Payment history."""
    
    STATUS_CHOICES = [
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('pending', 'Pending'),
        ('refunded', 'Refunded'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        related_name='payments',
        null=True,
        blank=True
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='EUR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    stripe_payment_intent_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    stripe_invoice_id = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Payment"
        verbose_name_plural = "Payments"
    
    def __str__(self):
        return f"{self.user.email} - {self.amount} {self.currency} - {self.status}"
    
    def is_successful(self):
        """Check if payment was successful."""
        return self.status == 'succeeded'


class Usage(models.Model):
    """Track feature usage for rate-limited features."""
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='usage_records'
    )
    feature = models.ForeignKey(
        Feature,
        on_delete=models.CASCADE,
        related_name='usage_records'
    )
    count = models.IntegerField(default=0)
    period_start = models.DateTimeField()
    period_end = models.DateTimeField()
    metadata = models.JSONField(default=dict, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-period_start']
        unique_together = ['user', 'feature', 'period_start']
        verbose_name = "Usage"
        verbose_name_plural = "Usage Records"
    
    def __str__(self):
        return f"{self.user.email} - {self.feature.name} - {self.count}"
    
    def increment(self, amount=1):
        """Increment usage count."""
        self.count += amount
        self.save(update_fields=['count', 'updated_at'])
    
    def reset(self):
        """Reset usage count."""
        self.count = 0
        self.save(update_fields=['count', 'updated_at'])
    
    def is_within_limit(self):
        """Check if usage is within limit."""
        if not self.feature.is_usage_based or not self.feature.usage_limit:
            return True
        return self.count < self.feature.usage_limit

