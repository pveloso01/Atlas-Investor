"""
Stripe webhook handlers for subscription and payment events.
"""

import logging
import stripe
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .models import Subscription, Payment, SubscriptionTier
from .stripe_service import StripeService

logger = logging.getLogger(__name__)
User = get_user_model()


def handle_subscription_created(event):
    """Handle subscription.created webhook event."""
    try:
        stripe_subscription = event.data.object
        customer_id = stripe_subscription.customer
        
        # Find user by customer ID
        user = User.objects.filter(stripe_customer_id=customer_id).first()
        if not user:
            logger.warning(f"User not found for Stripe customer {customer_id}")
            return
        
        # Sync subscription to database
        subscription = StripeService.sync_subscription_from_stripe(stripe_subscription, user)
        
        logger.info(f"Handled subscription.created for user {user.email}")
    except Exception as e:
        logger.error(f"Error handling subscription.created: {e}")
        raise


def handle_subscription_updated(event):
    """Handle subscription.updated webhook event."""
    try:
        stripe_subscription = event.data.object
        subscription = StripeService.sync_subscription_from_stripe(stripe_subscription)
        
        logger.info(f"Handled subscription.updated for subscription {stripe_subscription.id}")
    except Exception as e:
        logger.error(f"Error handling subscription.updated: {e}")
        raise


def handle_subscription_deleted(event):
    """Handle customer.subscription.deleted webhook event."""
    try:
        stripe_subscription = event.data.object
        subscription = Subscription.objects.filter(
            stripe_subscription_id=stripe_subscription.id
        ).first()
        
        if subscription:
            subscription.status = 'cancelled'
            subscription.save(update_fields=['status'])
            logger.info(f"Handled subscription.deleted for subscription {stripe_subscription.id}")
    except Exception as e:
        logger.error(f"Error handling subscription.deleted: {e}")
        raise


def handle_payment_succeeded(event):
    """Handle payment_intent.succeeded webhook event."""
    try:
        payment_intent = event.data.object
        customer_id = payment_intent.customer
        
        user = User.objects.filter(stripe_customer_id=customer_id).first()
        if not user:
            logger.warning(f"User not found for Stripe customer {customer_id}")
            return
        
        # Create or update payment record
        payment, created = Payment.objects.get_or_create(
            stripe_payment_intent_id=payment_intent.id,
            defaults={
                'user': user,
                'amount': payment_intent.amount / 100,  # Convert from cents
                'currency': payment_intent.currency.upper(),
                'status': 'succeeded',
            }
        )
        
        if not created:
            payment.status = 'succeeded'
            payment.save(update_fields=['status'])
        
        logger.info(f"Handled payment.succeeded for user {user.email}")
    except Exception as e:
        logger.error(f"Error handling payment.succeeded: {e}")
        raise


def handle_payment_failed(event):
    """Handle payment_intent.payment_failed webhook event."""
    try:
        payment_intent = event.data.object
        customer_id = payment_intent.customer
        
        user = User.objects.filter(stripe_customer_id=customer_id).first()
        if not user:
            logger.warning(f"User not found for Stripe customer {customer_id}")
            return
        
        # Create or update payment record
        payment, created = Payment.objects.get_or_create(
            stripe_payment_intent_id=payment_intent.id,
            defaults={
                'user': user,
                'amount': payment_intent.amount / 100,
                'currency': payment_intent.currency.upper(),
                'status': 'failed',
            }
        )
        
        if not created:
            payment.status = 'failed'
            payment.save(update_fields=['status'])
        
        logger.warning(f"Handled payment.failed for user {user.email}")
    except Exception as e:
        logger.error(f"Error handling payment.failed: {e}")
        raise


def handle_invoice_payment_succeeded(event):
    """Handle invoice.payment_succeeded webhook event."""
    try:
        invoice = event.data.object
        customer_id = invoice.customer
        subscription_id = invoice.subscription
        
        user = User.objects.filter(stripe_customer_id=customer_id).first()
        if not user:
            logger.warning(f"User not found for Stripe customer {customer_id}")
            return
        
        # Create payment record
        Payment.objects.get_or_create(
            stripe_invoice_id=invoice.id,
            defaults={
                'user': user,
                'subscription': Subscription.objects.filter(
                    stripe_subscription_id=subscription_id
                ).first() if subscription_id else None,
                'amount': invoice.amount_paid / 100,
                'currency': invoice.currency.upper(),
                'status': 'succeeded',
            }
        )
        
        logger.info(f"Handled invoice.payment_succeeded for user {user.email}")
    except Exception as e:
        logger.error(f"Error handling invoice.payment_succeeded: {e}")
        raise


def handle_invoice_payment_failed(event):
    """Handle invoice.payment_failed webhook event."""
    try:
        invoice = event.data.object
        customer_id = invoice.customer
        subscription_id = invoice.subscription
        
        user = User.objects.filter(stripe_customer_id=customer_id).first()
        if not user:
            logger.warning(f"User not found for Stripe customer {customer_id}")
            return
        
        # Update subscription status
        subscription = Subscription.objects.filter(
            stripe_subscription_id=subscription_id
        ).first()
        
        if subscription:
            subscription.status = 'past_due'
            subscription.save(update_fields=['status'])
        
        logger.warning(f"Handled invoice.payment_failed for user {user.email}")
    except Exception as e:
        logger.error(f"Error handling invoice.payment_failed: {e}")
        raise


def handle_customer_subscription_updated(event):
    """Handle customer.subscription.updated webhook event."""
    try:
        stripe_subscription = event.data.object
        subscription = StripeService.sync_subscription_from_stripe(stripe_subscription)
        
        logger.info(f"Handled customer.subscription.updated for subscription {stripe_subscription.id}")
    except Exception as e:
        logger.error(f"Error handling customer.subscription.updated: {e}")
        raise


# Webhook event handler mapping
WEBHOOK_HANDLERS = {
    'customer.subscription.created': handle_subscription_created,
    'customer.subscription.updated': handle_customer_subscription_updated,
    'customer.subscription.deleted': handle_subscription_deleted,
    'payment_intent.succeeded': handle_payment_succeeded,
    'payment_intent.payment_failed': handle_payment_failed,
    'invoice.payment_succeeded': handle_invoice_payment_succeeded,
    'invoice.payment_failed': handle_invoice_payment_failed,
}

