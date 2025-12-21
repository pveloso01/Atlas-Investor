"""
Custom authentication views to replace Djoser functionality.
"""

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.exceptions import ValidationError
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .serializers import UserSerializer, UserCreateSerializer
from .utils import send_activation_email, send_password_reset_email, send_welcome_email

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer that uses email instead of username."""

    def validate(self, attrs):
        """Validate credentials and return user."""
        # Use email as username field
        attrs["username"] = attrs.get("email", attrs.get("username"))
        data = super().validate(attrs)
        
        # Check if account is locked
        if hasattr(self.user, "is_locked") and self.user.is_locked():
            return Response(
                {"error": "Account is temporarily locked. Please try again later."},
                status=status.HTTP_423_LOCKED,
            )
        
        # Reset failed login attempts on successful login
        if hasattr(self.user, "failed_login_attempts"):
            self.user.failed_login_attempts = 0
            self.user.locked_until = None
            self.user.save(update_fields=["failed_login_attempts", "locked_until"])
        
        return data


class LoginView(TokenObtainPairView):
    """Login view that returns JWT tokens."""
    
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        """Handle login with account lockout logic."""
        email = request.data.get("email")
        password = request.data.get("password")
        
        if not email or not password:
            return Response(
                {"error": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        
        # Check if account is locked
        if hasattr(user, "is_locked") and user.is_locked():
            return Response(
                {"error": "Account is temporarily locked. Please try again later."},
                status=status.HTTP_423_LOCKED,
            )
        
        # Check if account is active
        if not user.is_active:
            return Response(
                {"error": "Account is not active. Please activate your account first."},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        # Check password
        if not user.check_password(password):
            # Increment failed login attempts
            if hasattr(user, "failed_login_attempts"):
                user.failed_login_attempts = (getattr(user, "failed_login_attempts", 0) or 0) + 1
                
                # Lock account after 5 failed attempts
                if user.failed_login_attempts >= 5:
                    user.locked_until = timezone.now() + timezone.timedelta(minutes=15)
                    user.save(update_fields=["failed_login_attempts", "locked_until"])
                    return Response(
                        {"error": "Too many failed login attempts. Account locked for 15 minutes."},
                        status=status.HTTP_423_LOCKED,
                    )
                else:
                    user.save(update_fields=["failed_login_attempts"])
            
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        
        # Reset failed login attempts on successful login
        if hasattr(user, "failed_login_attempts"):
            user.failed_login_attempts = 0
            user.locked_until = None
            user.save(update_fields=["failed_login_attempts", "locked_until"])
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )


class RegisterView(generics.CreateAPIView):
    """User registration view."""
    
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Create a new user and send activation email."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create user but set is_active=False
        user = serializer.save(is_active=False)
        
        # Generate activation token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Send activation email
        try:
            send_activation_email(user, token, uid)
        except Exception as e:
            # Log error but don't fail registration
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send activation email: {e}")
        
        return Response(
            {
                "email": user.email,
                "message": "Registration successful. Please check your email to activate your account.",
            },
            status=status.HTTP_201_CREATED,
        )


class ActivateAccountView(generics.GenericAPIView):
    """Account activation view."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Activate user account with token."""
        uid = request.data.get("uid")
        token = request.data.get("token")
        
        if not uid or not token:
            return Response(
                {"error": "UID and token are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"error": "Invalid activation link."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Check if token is valid
        if not default_token_generator.check_token(user, token):
            return Response(
                {"error": "Invalid or expired activation token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Activate user
        user.is_active = True
        if hasattr(user, "email_verified"):
            user.email_verified = True
        user.save()
        
        # Send welcome email
        try:
            send_welcome_email(user)
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send welcome email: {e}")
        
        return Response(
            {"message": "Account activated successfully."},
            status=status.HTTP_200_OK,
        )


class ResendActivationView(generics.GenericAPIView):
    """Resend activation email view."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Resend activation email."""
        email = request.data.get("email")
        
        if not email:
            return Response(
                {"error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal if email exists
            return Response(
                {"message": "If an account exists with this email, an activation link has been sent."},
                status=status.HTTP_200_OK,
            )
        
        # Only send if account is not active
        if user.is_active:
            return Response(
                {"message": "Account is already activated."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Generate new activation token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Send activation email
        try:
            send_activation_email(user, token, uid)
            return Response(
                {"message": "Activation email sent. Please check your email."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send activation email: {e}")
            return Response(
                {"error": "Failed to send activation email. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RefreshTokenView(generics.GenericAPIView):
    """Token refresh view."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Refresh access token."""
        refresh_token = request.data.get("refresh")
        
        if not refresh_token:
            return Response(
                {"error": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            refresh = RefreshToken(refresh_token)
            access_token = refresh.access_token
            return Response(
                {
                    "access": str(access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK,
            )
        except Exception:
            return Response(
                {"error": "Invalid or expired refresh token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class CurrentUserView(generics.RetrieveUpdateAPIView):
    """Get and update current user profile."""
    
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        """Return current user."""
        return self.request.user


class PasswordResetRequestView(generics.GenericAPIView):
    """Request password reset view."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Send password reset email."""
        email = request.data.get("email")
        
        if not email:
            return Response(
                {"error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal if email exists
            return Response(
                {"message": "If an account exists with this email, a password reset link has been sent."},
                status=status.HTTP_200_OK,
            )
        
        # Generate password reset token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Send password reset email
        try:
            send_password_reset_email(user, token, uid)
            return Response(
                {"message": "Password reset email sent. Please check your email."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send password reset email: {e}")
            return Response(
                {"error": "Failed to send password reset email. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PasswordResetConfirmView(generics.GenericAPIView):
    """Confirm password reset view."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Reset password with token."""
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")
        re_new_password = request.data.get("re_new_password")
        
        if not all([uid, token, new_password, re_new_password]):
            return Response(
                {"error": "UID, token, new_password, and re_new_password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if new_password != re_new_password:
            return Response(
                {"error": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        if len(new_password) < 8:
            return Response(
                {"error": "Password must be at least 8 characters long."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"error": "Invalid password reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Check if token is valid
        if not default_token_generator.check_token(user, token):
            return Response(
                {"error": "Invalid or expired password reset token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        return Response(
            {"message": "Password reset successfully."},
            status=status.HTTP_200_OK,
        )
