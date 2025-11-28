from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Property, Region
from .serializers.property_serializers import PropertySerializer, RegionSerializer


@api_view(['GET'])
def health_check(request):
    """Health check endpoint for testing."""
    return Response({
        'status': 'healthy',
        'message': 'Atlas Investor API is running',
        'version': '0.1.0'
    })


class PropertyViewSet(viewsets.ModelViewSet):
    """ViewSet for Property model."""
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['property_type', 'region']
    search_fields = ['address']
    ordering_fields = ['price', 'size_sqm', 'created_at']
    ordering = ['-created_at']


class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Region model (read-only)."""
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    search_fields = ['name', 'code']
    ordering = ['name']
