"""
Authentication utilities for token generation and email sending.
"""

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

User = get_user_model()


def generate_activation_token(user):
    """Generate activation token for user."""
    return default_token_generator.make_token(user)


def send_activation_email(user, token, uid):
    """
    Send activation email to user.
    
    Args:
        user: User instance
        token: Activation token
        uid: Base64 encoded user ID
    """
    activation_url = f"{settings.FRONTEND_URL}/activate/{uid}/{token}"
    
    # Render email template
    context = {
        "user": user,
        "activation_url": activation_url,
        "site_name": "Atlas Investor",
    }
    
    try:
        html_message = render_to_string("emails/activation.html", context)
        plain_message = f"Please activate your account by clicking this link: {activation_url}"
    except Exception:
        # Fallback if template doesn't exist yet
        html_message = None
        plain_message = f"Please activate your account by clicking this link: {activation_url}"
    
    send_mail(
        subject="Activate your Atlas Investor account",
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_password_reset_email(user, token, uid):
    """
    Send password reset email to user.
    
    Args:
        user: User instance
        token: Password reset token
        uid: Base64 encoded user ID
    """
    reset_url = f"{settings.FRONTEND_URL}/password-reset/confirm/{uid}/{token}"
    
    # Render email template
    context = {
        "user": user,
        "reset_url": reset_url,
        "site_name": "Atlas Investor",
    }
    
    try:
        html_message = render_to_string("emails/password_reset.html", context)
        plain_message = f"Please reset your password by clicking this link: {reset_url}"
    except Exception:
        # Fallback if template doesn't exist yet
        html_message = None
        plain_message = f"Please reset your password by clicking this link: {reset_url}"
    
    send_mail(
        subject="Reset your Atlas Investor password",
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_welcome_email(user):
    """
    Send welcome email to user after activation.
    
    Args:
        user: User instance
    """
    context = {
        "user": user,
        "site_name": "Atlas Investor",
    }
    
    try:
        html_message = render_to_string("emails/welcome.html", context)
        plain_message = "Welcome to Atlas Investor! Your account has been activated."
    except Exception:
        # Fallback if template doesn't exist yet
        html_message = None
        plain_message = "Welcome to Atlas Investor! Your account has been activated."
    
    send_mail(
        subject="Welcome to Atlas Investor",
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def verify_token(user, token, token_type="activation"):
    """
    Verify token for user.
    
    Args:
        user: User instance
        token: Token to verify
        token_type: Type of token ('activation' or 'password_reset')
    
    Returns:
        bool: True if token is valid, False otherwise
    """
    return default_token_generator.check_token(user, token)

