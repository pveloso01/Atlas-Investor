"""
Decorators for feature gating.
"""

from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from .models import Feature, SubscriptionTier


def require_subscription_tier(tier_slug):
    """
    Decorator to require specific subscription tier.
    
    Usage:
        @require_subscription_tier('pro')
        def my_view(request):
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapped_view(request, *args, **kwargs):
            if not request.user or not request.user.is_authenticated:
                return Response(
                    {"error": "Authentication required."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            
            subscription = request.user.get_active_subscription()
            if not subscription:
                try:
                    free_tier = SubscriptionTier.objects.get(slug='free')
                    required_tier = SubscriptionTier.objects.get(slug=tier_slug)
                    if required_tier.display_order > free_tier.display_order:
                        return Response(
                            {"error": f"{required_tier.name} subscription required."},
                            status=status.HTTP_403_FORBIDDEN,
                        )
                except SubscriptionTier.DoesNotExist:
                    return Response(
                        {"error": "Invalid subscription tier."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                try:
                    required_tier = SubscriptionTier.objects.get(slug=tier_slug)
                    user_tier_order = subscription.tier.display_order
                    required_tier_order = required_tier.display_order
                    
                    if user_tier_order < required_tier_order:
                        return Response(
                            {"error": f"{required_tier.name} subscription required."},
                            status=status.HTTP_403_FORBIDDEN,
                        )
                except SubscriptionTier.DoesNotExist:
                    return Response(
                        {"error": "Invalid subscription tier."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            
            return view_func(request, *args, **kwargs)
        return wrapped_view
    return decorator


def require_feature(feature_slug):
    """
    Decorator to require specific feature access.
    
    Usage:
        @require_feature('pdf_reports')
        def my_view(request):
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapped_view(request, *args, **kwargs):
            if not request.user or not request.user.is_authenticated:
                return Response(
                    {"error": "Authentication required."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            
            if not request.user.has_feature_access(feature_slug):
                try:
                    feature = Feature.objects.get(slug=feature_slug)
                    return Response(
                        {"error": f"Feature '{feature.name}' requires {feature.required_tier.name} subscription."},
                        status=status.HTTP_403_FORBIDDEN,
                    )
                except Feature.DoesNotExist:
                    return Response(
                        {"error": "Feature not found."},
                        status=status.HTTP_404_NOT_FOUND,
                    )
            
            return view_func(request, *args, **kwargs)
        return wrapped_view
    return decorator


def track_usage(feature_slug):
    """
    Decorator to track feature usage.
    
    Usage:
        @track_usage('pdf_reports')
        def my_view(request):
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapped_view(request, *args, **kwargs):
            if request.user and request.user.is_authenticated:
                try:
                    from .models import Feature, Usage
                    from django.utils import timezone
                    from datetime import timedelta
                    
                    feature = Feature.objects.get(slug=feature_slug)
                    
                    if feature.is_usage_based:
                        period_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                        period_end = (period_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
                        
                        usage, _ = Usage.objects.get_or_create(
                            user=request.user,
                            feature=feature,
                            period_start=period_start,
                            defaults={'period_end': period_end}
                        )
                        
                        usage.increment()
                except Exception as e:
                    # Log error but don't fail the request
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.error(f"Failed to track usage for {feature_slug}: {e}")
            
            return view_func(request, *args, **kwargs)
        return wrapped_view
    return decorator

