"""
Email service for sending emails with production backend support and Celery queue.
"""

import logging
from django.conf import settings
from django.core.mail import send_mail, get_connection
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)


class EmailService:
    """Email service wrapper for sending emails with different backends."""
    
    @staticmethod
    def get_connection():
        """Get email connection based on settings."""
        return get_connection(
            backend=settings.EMAIL_BACKEND,
            host=settings.EMAIL_HOST if hasattr(settings, 'EMAIL_HOST') else None,
            port=getattr(settings, 'EMAIL_PORT', None),
            username=getattr(settings, 'EMAIL_HOST_USER', None),
            password=getattr(settings, 'EMAIL_HOST_PASSWORD', None),
            use_tls=getattr(settings, 'EMAIL_USE_TLS', False),
            use_ssl=getattr(settings, 'EMAIL_USE_SSL', False),
            fail_silently=False,
        )
    
    @staticmethod
    def send_email(
        subject,
        message,
        recipient_list,
        from_email=None,
        html_message=None,
        fail_silently=False,
    ):
        """
        Send email using configured backend.
        
        Args:
            subject: Email subject
            message: Plain text message
            recipient_list: List of recipient email addresses
            from_email: Sender email (defaults to DEFAULT_FROM_EMAIL)
            html_message: HTML version of message
            fail_silently: If True, don't raise exceptions
        
        Returns:
            int: Number of emails sent
        """
        if from_email is None:
            from_email = settings.DEFAULT_FROM_EMAIL
        
        try:
            connection = EmailService.get_connection()
            result = send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=recipient_list,
                html_message=html_message,
                connection=connection,
                fail_silently=fail_silently,
            )
            logger.info(f"Email sent successfully to {recipient_list}")
            return result
        except Exception as e:
            logger.error(f"Failed to send email to {recipient_list}: {e}")
            if not fail_silently:
                raise
            return 0
    
    @staticmethod
    def send_template_email(
        template_name,
        context,
        subject,
        recipient_list,
        from_email=None,
    ):
        """
        Send email using template.
        
        Args:
            template_name: Template path (e.g., 'users/emails/activation.html')
            context: Template context dictionary
            subject: Email subject
            recipient_list: List of recipient email addresses
            from_email: Sender email (defaults to DEFAULT_FROM_EMAIL)
        
        Returns:
            int: Number of emails sent
        """
        try:
            html_message = render_to_string(template_name, context)
            # Generate plain text version from HTML (simple strip)
            plain_message = html_message.replace('<br>', '\n').replace('<br/>', '\n')
            # Remove HTML tags (simple approach)
            import re
            plain_message = re.sub(r'<[^>]+>', '', plain_message)
            plain_message = plain_message.strip()
            
            return EmailService.send_email(
                subject=subject,
                message=plain_message,
                recipient_list=recipient_list,
                from_email=from_email,
                html_message=html_message,
            )
        except Exception as e:
            logger.error(f"Failed to send template email {template_name} to {recipient_list}: {e}")
            raise


# Celery task for async email sending (optional)
try:
    from celery import shared_task
    
    @shared_task(bind=True, max_retries=3)
    def send_email_async(
        self,
        subject,
        message,
        recipient_list,
        from_email=None,
        html_message=None,
    ):
        """
        Celery task for sending emails asynchronously.
        
        This task will retry up to 3 times if it fails.
        """
        try:
            return EmailService.send_email(
                subject=subject,
                message=message,
                recipient_list=recipient_list,
                from_email=from_email,
                html_message=html_message,
            )
        except Exception as exc:
            logger.error(f"Email task failed: {exc}")
            # Retry with exponential backoff
            raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
    
    @shared_task(bind=True, max_retries=3)
    def send_template_email_async(
        self,
        template_name,
        context,
        subject,
        recipient_list,
        from_email=None,
    ):
        """
        Celery task for sending template emails asynchronously.
        
        This task will retry up to 3 times if it fails.
        """
        try:
            return EmailService.send_template_email(
                template_name=template_name,
                context=context,
                subject=subject,
                recipient_list=recipient_list,
                from_email=from_email,
            )
        except Exception as exc:
            logger.error(f"Template email task failed: {exc}")
            # Retry with exponential backoff
            raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
    
except ImportError:
    # Celery not available, define no-op functions
    def send_email_async(*args, **kwargs):
        """No-op if Celery is not installed."""
        logger.warning("Celery not available, sending email synchronously")
        return EmailService.send_email(*args, **kwargs)
    
    def send_template_email_async(*args, **kwargs):
        """No-op if Celery is not installed."""
        logger.warning("Celery not available, sending email synchronously")
        return EmailService.send_template_email(*args, **kwargs)

