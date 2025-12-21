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
router.register(r"geography/districts", views.DistrictViewSet, basename="district")
router.register(r"geography/municipalities", views.MunicipalityViewSet, basename="municipality")
router.register(r"geography/parishes", views.ParishViewSet, basename="parish")
router.register(
    r"geography/autonomous-regions", views.AutonomousRegionViewSet, basename="autonomous-region"
)

urlpatterns = [
    path("health/", views.health_check, name="health-check"),
    path("geography/validate/", views.validate_geographic_ids, name="validate-geography"),
    path("", include(router.urls)),
]
