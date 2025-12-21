"""
Subscription management views.
"""

import logging
import stripe
import os
from django.conf import settings
from django.utils import timezone
from django.http import JsonResponse
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Subscription, SubscriptionTier, Payment, Usage, Feature
from .serializers import (
    SubscriptionSerializer,
    SubscriptionTierSerializer,
    PaymentSerializer,
    UsageSerializer,
)
from .stripe_service import StripeService
from .webhooks import WEBHOOK_HANDLERS

logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")


class CreateCheckoutView(APIView):
    """Create Stripe checkout session."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Create checkout session for subscription."""
        tier_slug = request.data.get("tier_slug")
        billing_period = request.data.get("billing_period", "monthly")  # monthly or yearly
        
        if not tier_slug:
            return Response(
                {"error": "tier_slug is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            tier = SubscriptionTier.objects.get(slug=tier_slug, is_active=True)
        except SubscriptionTier.DoesNotExist:
            return Response(
                {"error": "Invalid subscription tier."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Get price ID based on billing period
        price_id = (
            tier.stripe_price_id_monthly if billing_period == "monthly"
            else tier.stripe_price_id_yearly
        )
        
        if not price_id:
            return Response(
                {"error": "Price ID not configured for this tier."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Get or create Stripe customer
        user = request.user
        if not user.stripe_customer_id:
            StripeService.create_customer(user)
        
        # Create checkout session
        frontend_url = settings.FRONTEND_URL
        success_url = f"{frontend_url}/subscription/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{frontend_url}/pricing"
        
        try:
            session = StripeService.create_checkout_session(
                customer_id=user.stripe_customer_id,
                price_id=price_id,
                success_url=success_url,
                cancel_url=cancel_url,
            )
            
            return Response(
                {"checkout_url": session.url},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.error(f"Failed to create checkout session: {e}")
            return Response(
                {"error": "Failed to create checkout session."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CreatePortalView(APIView):
    """Create Stripe customer portal session."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Create portal session for subscription management."""
        user = request.user
        
        if not user.stripe_customer_id:
            return Response(
                {"error": "No Stripe customer found."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        frontend_url = settings.FRONTEND_URL
        return_url = f"{frontend_url}/subscription"
        
        try:
            session = StripeService.create_portal_session(
                customer_id=user.stripe_customer_id,
                return_url=return_url,
            )
            
            return Response(
                {"portal_url": session.url},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.error(f"Failed to create portal session: {e}")
            return Response(
                {"error": "Failed to create portal session."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CurrentSubscriptionView(APIView):
    """Get user's current subscription."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get current subscription."""
        user = request.user
        subscription = user.get_active_subscription()
        
        if subscription:
            serializer = SubscriptionSerializer(subscription)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "No active subscription."},
                status=status.HTTP_200_OK,
            )


class CancelSubscriptionView(APIView):
    """Cancel subscription."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Cancel subscription at period end."""
        user = request.user
        subscription = user.get_active_subscription()
        
        if not subscription:
            return Response(
                {"error": "No active subscription found."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if not subscription.stripe_subscription_id:
            return Response(
                {"error": "Subscription not linked to Stripe."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            StripeService.cancel_subscription(
                subscription_id=subscription.stripe_subscription_id,
                at_period_end=True,
            )
            
            subscription.cancel_at_period_end = True
            subscription.save(update_fields=["cancel_at_period_end"])
            
            return Response(
                {"message": "Subscription will be cancelled at period end."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.error(f"Failed to cancel subscription: {e}")
            return Response(
                {"error": "Failed to cancel subscription."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ResumeSubscriptionView(APIView):
    """Resume cancelled subscription."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Resume cancelled subscription."""
        user = request.user
        subscription = user.get_active_subscription()
        
        if not subscription:
            return Response(
                {"error": "No active subscription found."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if not subscription.stripe_subscription_id:
            return Response(
                {"error": "Subscription not linked to Stripe."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            StripeService.resume_subscription(
                subscription_id=subscription.stripe_subscription_id,
            )
            
            subscription.resume()
            
            return Response(
                {"message": "Subscription resumed successfully."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.error(f"Failed to resume subscription: {e}")
            return Response(
                {"error": "Failed to resume subscription."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SubscriptionHistoryView(APIView):
    """Get payment history."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get payment history for user."""
        user = request.user
        payments = Payment.objects.filter(user=user).order_by("-created_at")[:50]
        
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UsageView(APIView):
    """Get feature usage."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get usage for all features or specific feature."""
        user = request.user
        feature_slug = request.query_params.get("feature")
        
        if feature_slug:
            try:
                feature = Feature.objects.get(slug=feature_slug)
                usage_records = Usage.objects.filter(user=user, feature=feature).order_by("-period_start")[:10]
            except Feature.DoesNotExist:
                return Response(
                    {"error": "Feature not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            usage_records = Usage.objects.filter(user=user).order_by("-period_start")[:50]
        
        serializer = UsageSerializer(usage_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SubscriptionTiersView(APIView):
    """Get all subscription tiers."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        """Get all active subscription tiers."""
        tiers = SubscriptionTier.objects.filter(is_active=True).order_by("display_order")
        serializer = SubscriptionTierSerializer(tiers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def stripe_webhook_view(request):
    """Handle Stripe webhook events."""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    
    if not webhook_secret:
        logger.warning("STRIPE_WEBHOOK_SECRET not configured")
        return Response(
            {"error": "Webhook secret not configured."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        logger.error(f"Invalid payload: {e}")
        return Response(
            {"error": "Invalid payload."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid signature: {e}")
        return Response(
            {"error": "Invalid signature."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    # Handle event
    event_type = event['type']
    handler = WEBHOOK_HANDLERS.get(event_type)
    
    if handler:
        try:
            handler(event)
            logger.info(f"Successfully handled webhook event: {event_type}")
        except Exception as e:
            logger.error(f"Error handling webhook event {event_type}: {e}")
            return Response(
                {"error": "Error processing webhook."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    else:
        logger.warning(f"Unhandled webhook event type: {event_type}")
    
    return Response({"received": True}, status=status.HTTP_200_OK)

