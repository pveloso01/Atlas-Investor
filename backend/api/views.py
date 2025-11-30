from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import viewsets, filters, status
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Property, Region
from .serializers.property_serializers import PropertySerializer, RegionSerializer
from .services.property_service import PropertyService
from .permissions import IsAuthenticatedOrReadOnly as CustomIsAuthenticatedOrReadOnly


class StandardResultsSetPagination(PageNumberPagination):
    """Custom pagination class that respects page_size query parameter."""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


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
    queryset = Property.objects.all()  # type: ignore[attr-defined]
    serializer_class = PropertySerializer
    permission_classes = [CustomIsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['property_type', 'region']
    search_fields = ['address']
    ordering_fields = ['price', 'size_sqm', 'created_at']
    ordering = ['-created_at']

    @action(detail=True, methods=['get'])
    def compare_to_region(self, request, pk=None):
        """
        Compare property metrics to region averages.
        
        Returns comparison data including price per sqm differences.
        """
        property_obj = self.get_object()
        comparison = PropertyService.compare_to_region_average(property_obj)
        return Response(comparison, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def price_range(self, request):
        """
        Get properties within a price range.
        
        Query parameters:
        - min_price: Minimum price
        - max_price: Maximum price
        """
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        
        try:
            from decimal import Decimal, InvalidOperation
            min_price = Decimal(str(min_price)) if min_price and str(min_price).strip() else None
            max_price = Decimal(str(max_price)) if max_price and str(max_price).strip() else None
        except (ValueError, TypeError, InvalidOperation):
            return Response(
                {'error': 'Invalid price parameters'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        queryset = PropertyService.get_properties_in_price_range(min_price, max_price)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Region model (read-only)."""
    queryset = Region.objects.all()  # type: ignore[attr-defined]
    serializer_class = RegionSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering = ['name']
