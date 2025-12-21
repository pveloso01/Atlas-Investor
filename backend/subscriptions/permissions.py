"""
Permission classes for subscription-based feature gating.
"""

from rest_framework import permissions
from .models import Feature, SubscriptionTier


class HasSubscriptionPermission(permissions.BasePermission):
    """Check if user has required subscription tier."""
    
    def __init__(self, required_tier_slug):
        self.required_tier_slug = required_tier_slug
    
    def has_permission(self, request, view):
        """Check if user has required tier."""
        if not request.user or not request.user.is_authenticated:
            return False
        
        subscription = request.user.get_active_subscription()
        if not subscription:
            # Check if Free tier is required
            try:
                free_tier = SubscriptionTier.objects.get(slug='free')
                required_tier = SubscriptionTier.objects.get(slug=self.required_tier_slug)
                return required_tier.display_order <= free_tier.display_order
            except SubscriptionTier.DoesNotExist:
                return False
        
        try:
            required_tier = SubscriptionTier.objects.get(slug=self.required_tier_slug)
            user_tier_order = subscription.tier.display_order
            required_tier_order = required_tier.display_order
            return user_tier_order >= required_tier_order
        except SubscriptionTier.DoesNotExist:
            return False


class HasFeatureAccess(permissions.BasePermission):
    """Check if user has access to specific feature."""
    
    def __init__(self, feature_slug):
        self.feature_slug = feature_slug
    
    def has_permission(self, request, view):
        """Check if user has feature access."""
        if not request.user or not request.user.is_authenticated:
            return False
        
        return request.user.has_feature_access(self.feature_slug)


class WithinUsageLimit(permissions.BasePermission):
    """Check if user is within usage limits for a feature."""
    
    def __init__(self, feature_slug):
        self.feature_slug = feature_slug
    
    def has_permission(self, request, view):
        """Check if user is within usage limit."""
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            from .models import Feature, Usage
            from django.utils import timezone
            from datetime import timedelta
            
            feature = Feature.objects.get(slug=self.feature_slug)
            
            if not feature.is_usage_based or not feature.usage_limit:
                return True
            
            # Get current period usage
            period_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            period_end = (period_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            
            usage, _ = Usage.objects.get_or_create(
                user=request.user,
                feature=feature,
                period_start=period_start,
                defaults={'period_end': period_end}
            )
            
            return usage.is_within_limit()
        except Feature.DoesNotExist:
            return False
        except Exception:
            return False

