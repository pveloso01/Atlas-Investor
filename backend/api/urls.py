from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'properties', views.PropertyViewSet, basename='property')
router.register(r'regions', views.RegionViewSet, basename='region')

urlpatterns = [
    path('health/', views.health_check, name='health-check'),
    path('', include(router.urls)),
]

