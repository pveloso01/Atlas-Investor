"""
Utility functions for subscription and feature gating.
"""

from django.contrib.auth import get_user_model
from .models import Feature, Usage
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


def check_feature_access(user, feature_slug):
    """
    Check if user has access to a feature.
    
    Args:
        user: User instance
        feature_slug: Feature slug
    
    Returns:
        bool: True if user has access, False otherwise
    """
    if not user or not user.is_authenticated:
        return False
    
    return user.has_feature_access(feature_slug)


def increment_usage(user, feature_slug, amount=1):
    """
    Increment usage counter for a feature.
    
    Args:
        user: User instance
        feature_slug: Feature slug
        amount: Amount to increment (default: 1)
    """
    try:
        feature = Feature.objects.get(slug=feature_slug)
        
        if feature.is_usage_based:
            period_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            period_end = (period_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            
            usage, _ = Usage.objects.get_or_create(
                user=user,
                feature=feature,
                period_start=period_start,
                defaults={'period_end': period_end}
            )
            
            usage.increment(amount)
    except Feature.DoesNotExist:
        pass
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to increment usage for {feature_slug}: {e}")


def get_usage_count(user, feature_slug, period_start=None):
    """
    Get usage count for a feature in a period.
    
    Args:
        user: User instance
        feature_slug: Feature slug
        period_start: Period start datetime (default: current month)
    
    Returns:
        int: Usage count
    """
    return user.get_usage_count(feature_slug, period_start)


def is_within_limit(user, feature_slug):
    """
    Check if user is within usage limit for a feature.
    
    Args:
        user: User instance
        feature_slug: Feature slug
    
    Returns:
        bool: True if within limit, False otherwise
    """
    try:
        feature = Feature.objects.get(slug=feature_slug)
        
        if not feature.is_usage_based or not feature.usage_limit:
            return True
        
        period_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        period_end = (period_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        
        usage, _ = Usage.objects.get_or_create(
            user=user,
            feature=feature,
            period_start=period_start,
            defaults={'period_end': period_end}
        )
        
        return usage.is_within_limit()
    except Feature.DoesNotExist:
        return False
    except Exception:
        return False

