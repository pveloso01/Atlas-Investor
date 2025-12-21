"""
Serializers for subscription models.
"""

from rest_framework import serializers
from .models import SubscriptionTier, Subscription, Feature, Payment, Usage


class SubscriptionTierSerializer(serializers.ModelSerializer):
    """Serializer for subscription tier."""
    
    features_list = serializers.SerializerMethodField()
    
    class Meta:
        model = SubscriptionTier
        fields = [
            'id',
            'name',
            'slug',
            'price_monthly',
            'price_yearly',
            'stripe_price_id_monthly',
            'stripe_price_id_yearly',
            'features',
            'features_list',
            'is_active',
            'display_order',
        ]
        read_only_fields = ['id']
    
    def get_features_list(self, obj):
        """Get features as a list."""
        return obj.get_features_list()


class FeatureSerializer(serializers.ModelSerializer):
    """Serializer for feature."""
    
    required_tier_name = serializers.CharField(source='required_tier.name', read_only=True)
    
    class Meta:
        model = Feature
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'required_tier',
            'required_tier_name',
            'is_usage_based',
            'usage_limit',
        ]
        read_only_fields = ['id']


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for subscription."""
    
    tier = SubscriptionTierSerializer(read_only=True)
    tier_id = serializers.PrimaryKeyRelatedField(
        queryset=SubscriptionTier.objects.all(),
        source='tier',
        write_only=True,
        required=False
    )
    is_active = serializers.SerializerMethodField()
    is_trialing = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()
    
    class Meta:
        model = Subscription
        fields = [
            'id',
            'user',
            'tier',
            'tier_id',
            'status',
            'current_period_start',
            'current_period_end',
            'stripe_subscription_id',
            'stripe_customer_id',
            'cancel_at_period_end',
            'trial_ends_at',
            'is_active',
            'is_trialing',
            'days_remaining',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'user',
            'stripe_subscription_id',
            'stripe_customer_id',
            'created_at',
            'updated_at',
        ]
    
    def get_is_active(self, obj):
        """Get active status."""
        return obj.is_active()
    
    def get_is_trialing(self, obj):
        """Get trialing status."""
        return obj.is_trialing()
    
    def get_days_remaining(self, obj):
        """Get days remaining."""
        return obj.days_remaining()


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for payment."""
    
    is_successful = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = [
            'id',
            'user',
            'subscription',
            'amount',
            'currency',
            'status',
            'stripe_payment_intent_id',
            'stripe_invoice_id',
            'is_successful',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_is_successful(self, obj):
        """Get success status."""
        return obj.is_successful()


class UsageSerializer(serializers.ModelSerializer):
    """Serializer for usage tracking."""
    
    feature_name = serializers.CharField(source='feature.name', read_only=True)
    feature_slug = serializers.CharField(source='feature.slug', read_only=True)
    is_within_limit = serializers.SerializerMethodField()
    
    class Meta:
        model = Usage
        fields = [
            'id',
            'user',
            'feature',
            'feature_name',
            'feature_slug',
            'count',
            'period_start',
            'period_end',
            'metadata',
            'is_within_limit',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_is_within_limit(self, obj):
        """Get within limit status."""
        return obj.is_within_limit()

