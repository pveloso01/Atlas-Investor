"""
URL configuration for user authentication endpoints.
"""

from django.urls import path
from . import views

app_name = "users"

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("activate/", views.ActivateAccountView.as_view(), name="activate"),
    path("login/", views.LoginView.as_view(), name="login"),
    path("refresh/", views.RefreshTokenView.as_view(), name="refresh"),
    path("me/", views.CurrentUserView.as_view(), name="current-user"),
    path("password-reset/", views.PasswordResetRequestView.as_view(), name="password-reset"),
    path("password-reset/confirm/", views.PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("resend-activation/", views.ResendActivationView.as_view(), name="resend-activation"),
]

