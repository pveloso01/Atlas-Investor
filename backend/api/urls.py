from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"properties", views.PropertyViewSet, basename="property")
router.register(r"regions", views.RegionViewSet, basename="region")
router.register(r"feedback", views.FeedbackViewSet, basename="feedback")
router.register(r"support", views.SupportMessageViewSet, basename="support")
router.register(r"contact", views.ContactRequestViewSet, basename="contact")
router.register(r"portfolios", views.PortfolioViewSet, basename="portfolio")
router.register(r"saved-properties", views.SavedPropertyViewSet, basename="saved-property")

urlpatterns = [
    path("health/", views.health_check, name="health-check"),
    path("", include(router.urls)),
]
