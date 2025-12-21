"""
URL configuration for subscription endpoints.
"""

from django.urls import path
from . import views

app_name = "subscriptions"

urlpatterns = [
    path("tiers/", views.SubscriptionTiersView.as_view(), name="tiers"),
    path("create-checkout/", views.CreateCheckoutView.as_view(), name="create-checkout"),
    path("create-portal/", views.CreatePortalView.as_view(), name="create-portal"),
    path("current/", views.CurrentSubscriptionView.as_view(), name="current"),
    path("cancel/", views.CancelSubscriptionView.as_view(), name="cancel"),
    path("resume/", views.ResumeSubscriptionView.as_view(), name="resume"),
    path("history/", views.SubscriptionHistoryView.as_view(), name="history"),
    path("usage/", views.UsageView.as_view(), name="usage"),
    path("webhook/", views.stripe_webhook_view, name="webhook"),
]

