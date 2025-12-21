"""
Stripe service for customer, subscription, and checkout management.
"""

import logging
import os
import stripe
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import Subscription, SubscriptionTier, Payment

logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")


class StripeService:
    """Service class for Stripe operations."""
    
    @staticmethod
    def create_customer(user):
        """
        Create Stripe customer for user.
        
        Args:
            user: User instance
        
        Returns:
            stripe.Customer: Created customer object
        """
        try:
            customer = stripe.Customer.create(
                email=user.email,
                name=f"{user.first_name} {user.last_name}".strip() or user.email,
                metadata={
                    "user_id": user.id,
                    "username": user.username,
                }
            )
            
            # Save customer ID to user
            user.stripe_customer_id = customer.id
            user.save(update_fields=["stripe_customer_id"])
            
            logger.info(f"Created Stripe customer {customer.id} for user {user.email}")
            return customer
        except Exception as e:
            logger.error(f"Failed to create Stripe customer for user {user.email}: {e}")
            raise
    
    @staticmethod
    def create_subscription(customer_id, price_id, trial_days=0):
        """
        Create subscription in Stripe.
        
        Args:
            customer_id: Stripe customer ID
            price_id: Stripe price ID
            trial_days: Number of trial days (default: 0)
        
        Returns:
            stripe.Subscription: Created subscription object
        """
        try:
            subscription_data = {
                "customer": customer_id,
                "items": [{"price": price_id}],
                "payment_behavior": "default_incomplete",
                "payment_settings": {"save_default_payment_method": "on_subscription"},
                "expand": ["latest_invoice.payment_intent"],
            }
            
            if trial_days > 0:
                subscription_data["trial_period_days"] = trial_days
            
            subscription = stripe.Subscription.create(**subscription_data)
            
            logger.info(f"Created Stripe subscription {subscription.id} for customer {customer_id}")
            return subscription
        except Exception as e:
            logger.error(f"Failed to create Stripe subscription: {e}")
            raise
    
    @staticmethod
    def update_subscription(subscription_id, new_price_id):
        """
        Update subscription (upgrade/downgrade).
        
        Args:
            subscription_id: Stripe subscription ID
            new_price_id: New Stripe price ID
        
        Returns:
            stripe.Subscription: Updated subscription object
        """
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            
            # Update subscription with new price
            updated_subscription = stripe.Subscription.modify(
                subscription_id,
                items=[{
                    "id": subscription["items"]["data"][0].id,
                    "price": new_price_id,
                }],
                proration_behavior="always_invoice",
            )
            
            logger.info(f"Updated Stripe subscription {subscription_id} to price {new_price_id}")
            return updated_subscription
        except Exception as e:
            logger.error(f"Failed to update Stripe subscription {subscription_id}: {e}")
            raise
    
    @staticmethod
    def cancel_subscription(subscription_id, at_period_end=True):
        """
        Cancel subscription.
        
        Args:
            subscription_id: Stripe subscription ID
            at_period_end: If True, cancel at period end; if False, cancel immediately
        
        Returns:
            stripe.Subscription: Cancelled subscription object
        """
        try:
            if at_period_end:
                subscription = stripe.Subscription.modify(
                    subscription_id,
                    cancel_at_period_end=True,
                )
            else:
                subscription = stripe.Subscription.delete(subscription_id)
            
            logger.info(f"Cancelled Stripe subscription {subscription_id} (at_period_end={at_period_end})")
            return subscription
        except Exception as e:
            logger.error(f"Failed to cancel Stripe subscription {subscription_id}: {e}")
            raise
    
    @staticmethod
    def resume_subscription(subscription_id):
        """
        Resume cancelled subscription.
        
        Args:
            subscription_id: Stripe subscription ID
        
        Returns:
            stripe.Subscription: Resumed subscription object
        """
        try:
            subscription = stripe.Subscription.modify(
                subscription_id,
                cancel_at_period_end=False,
            )
            
            logger.info(f"Resumed Stripe subscription {subscription_id}")
            return subscription
        except Exception as e:
            logger.error(f"Failed to resume Stripe subscription {subscription_id}: {e}")
            raise
    
    @staticmethod
    def create_checkout_session(customer_id, price_id, success_url, cancel_url):
        """
        Create Stripe checkout session.
        
        Args:
            customer_id: Stripe customer ID
            price_id: Stripe price ID
            success_url: URL to redirect on success
            cancel_url: URL to redirect on cancel
        
        Returns:
            stripe.checkout.Session: Checkout session object
        """
        try:
            session = stripe.checkout.Session.create(
                customer=customer_id,
                payment_method_types=["card"],
                line_items=[{
                    "price": price_id,
                    "quantity": 1,
                }],
                mode="subscription",
                success_url=success_url,
                cancel_url=cancel_url,
                allow_promotion_codes=True,
            )
            
            logger.info(f"Created Stripe checkout session {session.id}")
            return session
        except Exception as e:
            logger.error(f"Failed to create Stripe checkout session: {e}")
            raise
    
    @staticmethod
    def create_portal_session(customer_id, return_url):
        """
        Create Stripe customer portal session.
        
        Args:
            customer_id: Stripe customer ID
            return_url: URL to return to after portal session
        
        Returns:
            stripe.billing_portal.Session: Portal session object
        """
        try:
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=return_url,
            )
            
            logger.info(f"Created Stripe portal session for customer {customer_id}")
            return session
        except Exception as e:
            logger.error(f"Failed to create Stripe portal session: {e}")
            raise
    
    @staticmethod
    def get_subscription(subscription_id):
        """
        Get subscription details from Stripe.
        
        Args:
            subscription_id: Stripe subscription ID
        
        Returns:
            stripe.Subscription: Subscription object
        """
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            return subscription
        except Exception as e:
            logger.error(f"Failed to retrieve Stripe subscription {subscription_id}: {e}")
            raise
    
    @staticmethod
    def sync_subscription_from_stripe(stripe_subscription, user=None):
        """
        Sync Stripe subscription data to database.
        
        Args:
            stripe_subscription: Stripe subscription object
            user: User instance (optional, will be looked up if not provided)
        
        Returns:
            Subscription: Synced subscription object
        """
        try:
            # Get or create subscription
            subscription, created = Subscription.objects.get_or_create(
                stripe_subscription_id=stripe_subscription.id,
                defaults={
                    "user": user or None,
                    "stripe_customer_id": stripe_subscription.customer,
                }
            )
            
            # Update subscription fields
            subscription.status = stripe_subscription.status
            subscription.current_period_start = timezone.datetime.fromtimestamp(
                stripe_subscription.current_period_start,
                tz=timezone.utc
            )
            subscription.current_period_end = timezone.datetime.fromtimestamp(
                stripe_subscription.current_period_end,
                tz=timezone.utc
            )
            subscription.cancel_at_period_end = stripe_subscription.cancel_at_period_end
            
            if stripe_subscription.trial_end:
                subscription.trial_ends_at = timezone.datetime.fromtimestamp(
                    stripe_subscription.trial_end,
                    tz=timezone.utc
                )
            
            # Get tier from price ID
            if stripe_subscription.items.data:
                price_id = stripe_subscription.items.data[0].price.id
                tier = SubscriptionTier.objects.filter(
                    stripe_price_id_monthly=price_id
                ).first() or SubscriptionTier.objects.filter(
                    stripe_price_id_yearly=price_id
                ).first()
                
                if tier:
                    subscription.tier = tier
            
            subscription.save()
            
            # Link to user if not already linked
            if not subscription.user and user:
                subscription.user = user
                subscription.save(update_fields=["user"])
            
            logger.info(f"Synced Stripe subscription {stripe_subscription.id} to database")
            return subscription
        except Exception as e:
            logger.error(f"Failed to sync Stripe subscription to database: {e}")
            raise

