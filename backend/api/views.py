from decimal import Decimal, InvalidOperation
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import viewsets, filters, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .utils.cache_decorators import cache_api_response
from .filters import PropertyFilterSet
from .models import (
    AutonomousRegion,
    ContactRequest,
    District,
    Feedback,
    Municipality,
    Parish,
    Portfolio,
    PortfolioProperty,
    Property,
    Region,
    SavedProperty,
    SupportMessage,
)
from .serializers.property_serializers import PropertySerializer, RegionSerializer
from .serializers.geography_serializers import (
    DistrictSerializer,
    DistrictDetailSerializer,
    MunicipalitySerializer,
    MunicipalityDetailSerializer,
    ParishSerializer,
    AutonomousRegionSerializer,
    AutonomousRegionDetailSerializer,
    GeographicLocationSerializer,
    GeographicValidationResponseSerializer,
)
from .serializers.feedback_serializers import (
    FeedbackSerializer,
    SupportMessageSerializer,
)
from .serializers.contact_serializers import (
    ContactRequestSerializer,
    ContactRequestCreateSerializer,
)
from .serializers.portfolio_serializers import (
    PortfolioListSerializer,
    PortfolioDetailSerializer,
    PortfolioCreateUpdateSerializer,
    PortfolioPropertyDetailSerializer,
    AddPropertyToPortfolioSerializer,
)
from .services.property_service import PropertyService
from .permissions import IsAuthenticatedOrReadOnly as CustomIsAuthenticatedOrReadOnly


class StandardResultsSetPagination(PageNumberPagination):
    """Custom pagination class that respects page_size query parameter."""

    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


@api_view(["GET"])
def health_check(request):
    """Health check endpoint for testing."""
    return Response(
        {
            "status": "healthy",
            "message": "Atlas Investor API is running",
            "version": "0.1.0",
        }
    )


class PropertyViewSet(viewsets.ModelViewSet):
    """ViewSet for Property model."""

    queryset = Property.objects.select_related(
        "region", "district", "municipality", "parish"
    ).all()  # type: ignore[attr-defined]
    serializer_class = PropertySerializer
    permission_classes = [CustomIsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = PropertyFilterSet
    search_fields = ["address"]
    ordering_fields = ["price", "size_sqm", "created_at", "bedrooms", "bathrooms", "year_built"]
    ordering = ["-created_at"]
    
    def list(self, request, *args, **kwargs):
        """List properties with usage tracking for authenticated users."""
        # Track property search usage for authenticated users
        if request.user.is_authenticated:
            try:
                from subscriptions.utils import increment_usage, is_within_limit
                if not is_within_limit(request.user, 'property_search'):
                    return Response(
                        {
                            "error": "Property search limit reached. Please upgrade your subscription.",
                            "upgrade_required": True,
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
                increment_usage(request.user, 'property_search')
            except Exception:
                # If feature doesn't exist yet, allow access
                pass
        
        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=["get"])
    def compare_to_region(self, request, pk=None):
        """
        Compare property metrics to region averages.

        Returns comparison data including price per sqm differences.
        """
        property_obj = self.get_object()
        comparison = PropertyService.compare_to_region_average(property_obj)
        return Response(comparison, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def report(self, request, pk=None):
        """
        Generate a PDF report for the property.

        Returns a PDF file download.
        """
        from django.http import HttpResponse

        from .services.pdf_service import get_pdf_service

        # Check feature access and usage limits
        if request.user.is_authenticated:
            try:
                from subscriptions.utils import check_feature_access, is_within_limit, increment_usage
                
                if not check_feature_access(request.user, 'pdf_reports'):
                    return Response(
                        {
                            "error": "PDF report generation requires a paid subscription.",
                            "upgrade_required": True,
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
                
                if not is_within_limit(request.user, 'pdf_reports'):
                    return Response(
                        {
                            "error": "PDF report generation limit reached. Please upgrade your subscription.",
                            "upgrade_required": True,
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
                
                # Track usage
                increment_usage(request.user, 'pdf_reports')
            except Exception:
                # If feature doesn't exist yet, allow access
                pass

        property_obj = self.get_object()
        pdf_service = get_pdf_service()

        # Generate the PDF
        pdf_bytes = pdf_service.generate_property_report(property_obj)

        if pdf_bytes is None:
            return Response(
                {"error": "Failed to generate PDF report"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Create response with PDF
        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        filename = f"property_report_{property_obj.id}.pdf"
        response["Content-Disposition"] = f'attachment; filename="{filename}"'

        return response

    @action(detail=True, methods=["post"])
    def analyze(self, request, pk=None):
        """
        Analyze investment potential of the property.

        Accepts optional parameters for customizing the analysis.
        Returns comprehensive investment metrics.
        """
        from .services.analysis_service import AnalysisParams, get_analysis_service

        property_obj = self.get_object()
        analysis_service = get_analysis_service()

        # Parse analysis parameters from request
        params = None
        if request.data:
            params = AnalysisParams.from_dict(request.data)

        # Perform analysis
        result = analysis_service.analyze_property(property_obj, params)

        return Response(result.to_dict(), status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def price_range(self, request):
        """
        Get properties within a price range.

        Query parameters:
        - min_price: Minimum price
        - max_price: Maximum price
        """
        min_price = request.query_params.get("min_price")
        max_price = request.query_params.get("max_price")

        try:
            min_price = Decimal(str(min_price)) if min_price and str(min_price).strip() else None
            max_price = Decimal(str(max_price)) if max_price and str(max_price).strip() else None
        except (ValueError, TypeError, InvalidOperation):
            return Response(
                {"error": "Invalid price parameters"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        queryset = PropertyService.get_properties_in_price_range(min_price, max_price)

        # Apply pagination to the queryset
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # Fallback if pagination is not configured (should not happen)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@method_decorator(cache_page(60 * 60), name="list")  # Cache for 1 hour
@method_decorator(cache_page(60 * 60), name="retrieve")  # Cache for 1 hour
class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Region model (read-only) with caching."""

    queryset = Region.objects.all()  # type: ignore[attr-defined]
    serializer_class = RegionSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["name", "code"]
    ordering = ["name"]


class FeedbackViewSet(viewsets.ModelViewSet):
    """ViewSet for user feedback."""

    queryset = Feedback.objects.all()  # type: ignore[attr-defined]
    serializer_class = FeedbackSerializer
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        """Allow anyone to create feedback, but restrict other actions."""
        if self.action == "create":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """Limit feedback to current user (staff can see all)."""
        user = self.request.user
        if user.is_staff:
            return Feedback.objects.all()  # type: ignore[attr-defined]
        if user.is_authenticated:
            return Feedback.objects.filter(user=user)  # type: ignore[attr-defined]
        return Feedback.objects.none()  # type: ignore[attr-defined]


class SupportMessageViewSet(viewsets.ModelViewSet):
    """ViewSet for support messages."""

    queryset = SupportMessage.objects.all()  # type: ignore[attr-defined]
    serializer_class = SupportMessageSerializer
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        """Require authentication for all actions including creating support messages."""
        return [IsAuthenticated()]

    def get_queryset(self):
        """Limit support messages to current user (staff can see all)."""
        user = self.request.user
        if user.is_staff:
            return SupportMessage.objects.all()  # type: ignore[attr-defined]
        if user.is_authenticated:
            return SupportMessage.objects.filter(user=user)  # type: ignore[attr-defined]
        return SupportMessage.objects.none()  # type: ignore[attr-defined]


class ContactRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for property contact requests."""

    queryset = ContactRequest.objects.all()  # type: ignore[attr-defined]
    serializer_class = ContactRequestSerializer
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        """Allow anyone to create contact requests, but restrict other actions."""
        if self.action == "create":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        """Use different serializers for create vs other actions."""
        if self.action == "create":
            return ContactRequestCreateSerializer
        return ContactRequestSerializer

    def get_queryset(self):
        """Limit contact requests to current user (staff can see all)."""
        user = self.request.user
        base_queryset = ContactRequest.objects.select_related(  # type: ignore[attr-defined]
            "property",
            "property__region",
            "property__district",
            "property__municipality",
            "property__parish",
            "user"
        )
        if user.is_staff:
            return base_queryset
        if user.is_authenticated:
            return base_queryset.filter(user=user)
        return ContactRequest.objects.none()  # type: ignore[attr-defined]

    def perform_create(self, serializer):
        """Create contact request and send notification email."""
        import logging

        logger = logging.getLogger(__name__)

        contact_request = serializer.save()

        # Log the contact request (in production, send actual email)
        logger.info(
            f"New contact request for property {contact_request.property_id} "
            f"from {contact_request.name} ({contact_request.email})"
        )

        # Send email notification (console in dev)
        try:
            from django.core.mail import send_mail
            from django.conf import settings

            property_obj = contact_request.property
            send_mail(
                subject=f"New Inquiry for Property: {property_obj.address}",
                message=f"""
New property inquiry received:

Property: {property_obj.address}
Price: €{property_obj.price:,.0f}

Contact Details:
Name: {contact_request.name}
Email: {contact_request.email}
Phone: {contact_request.phone or 'Not provided'}

Message:
{contact_request.message}
                """.strip(),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=["inquiries@atlasinvestor.com"],
                fail_silently=True,
            )
        except Exception as e:
            logger.warning(f"Failed to send contact notification email: {e}")


class PortfolioViewSet(viewsets.ModelViewSet):
    """ViewSet for user portfolios with full CRUD and property management."""

    queryset = Portfolio.objects.all()  # type: ignore[attr-defined]
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_serializer_class(self):
        """Use different serializers based on action."""
        if self.action == "list":
            return PortfolioListSerializer
        if self.action in ["create", "update", "partial_update"]:
            return PortfolioCreateUpdateSerializer
        if self.action == "add_property":
            return AddPropertyToPortfolioSerializer
        return PortfolioDetailSerializer

    def get_queryset(self):
        """Limit portfolios to current user with optimized queries."""
        from django.db.models import Count, Sum
        
        return Portfolio.objects.select_related("user").filter(  # type: ignore[attr-defined]
            user=self.request.user
        ).prefetch_related(
            "properties__property__region",
            "properties__property__district",
            "properties__property__municipality",
            "properties__property__parish"
        ).annotate(
            property_count_annotation=Count("properties"),
            total_value_annotation=Sum("properties__property__price")
        )

    def perform_create(self, serializer):
        """Create portfolio and handle default portfolio creation."""
        # Check portfolio size limit for Basic tier
        if self.request.user.is_authenticated:
            try:
                from subscriptions.utils import check_feature_access
                subscription = self.request.user.get_active_subscription()
                
                if subscription and subscription.tier.slug == 'basic':
                    # Use single count query instead of two separate queries
                    user_portfolio_count = Portfolio.objects.filter(user=self.request.user).count()  # type: ignore[attr-defined]
                    if user_portfolio_count >= 3:
                        from rest_framework.exceptions import PermissionDenied
                        raise PermissionDenied(
                            "Portfolio limit reached. Basic tier allows up to 3 portfolios. Upgrade to Pro for unlimited portfolios."
                        )
            except Exception:
                # If feature doesn't exist yet, allow access
                pass
        
        portfolio = serializer.save()
        
        # If this is the user's first portfolio, make it default
        # Reuse the count from above if available, otherwise query once
        # Since we just created one, the count is now user_portfolio_count + 1
        # But to be safe, we'll check if any other portfolios exist
        other_portfolios_exist = Portfolio.objects.filter(  # type: ignore[attr-defined]
            user=self.request.user
        ).exclude(id=portfolio.id).exists()
        
        if not other_portfolios_exist:
            portfolio.is_default = True
            portfolio.save()

    @action(detail=False, methods=["get"])
    def default(self, request):
        """Get user's default portfolio, creating one if none exists."""
        portfolio = Portfolio.objects.select_related("user").prefetch_related(  # type: ignore[attr-defined]
            "properties__property__region",
            "properties__property__district",
            "properties__property__municipality",
            "properties__property__parish"
        ).filter(
            user=request.user, is_default=True
        ).first()
        
        if not portfolio:
            # Create default portfolio if none exists
            portfolio = Portfolio.objects.create(  # type: ignore[attr-defined]
                user=request.user,
                name="My Portfolio",
                is_default=True,
            )
            # Reload with prefetch_related for serializer
            portfolio = Portfolio.objects.select_related("user").prefetch_related(  # type: ignore[attr-defined]
                "properties__property__region",
                "properties__property__district",
                "properties__property__municipality",
                "properties__property__parish"
            ).get(id=portfolio.id)
        
        serializer = PortfolioDetailSerializer(portfolio)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def add_property(self, request, pk=None):
        """Add a property to the portfolio."""
        portfolio = self.get_object()
        
        # Check portfolio property limit for Basic tier
        if request.user.is_authenticated:
            try:
                subscription = request.user.get_active_subscription()
                
                if subscription and subscription.tier.slug == 'basic':
                    # Use exists() check first, then count only if needed, or use annotation
                    # Since portfolio is already loaded, we can check if properties are prefetched
                    if hasattr(portfolio, 'properties'):
                        property_count = portfolio.properties.count()  # type: ignore[attr-defined]
                    else:
                        property_count = PortfolioProperty.objects.filter(portfolio=portfolio).count()  # type: ignore[attr-defined]
                    if property_count >= 10:
                        return Response(
                            {
                                "error": "Portfolio property limit reached. Basic tier allows up to 10 properties per portfolio. Upgrade to Pro for unlimited properties.",
                                "upgrade_required": True,
                            },
                            status=status.HTTP_403_FORBIDDEN,
                        )
            except Exception:
                # If feature doesn't exist yet, allow access
                pass
        
        serializer = AddPropertyToPortfolioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        property_id = serializer.validated_data["property_id"]
        notes = serializer.validated_data.get("notes", "")
        target_price = serializer.validated_data.get("target_price")

        # Use select_related to avoid N+1 queries
        property_obj = Property.objects.select_related(  # type: ignore[attr-defined]
            "region", "district", "municipality", "parish"
        ).get(pk=property_id)

        portfolio_property, created = PortfolioProperty.objects.select_related(  # type: ignore[attr-defined]
            "property", "property__region", "property__district", "property__municipality", "property__parish"
        ).get_or_create(
            portfolio=portfolio,
            property=property_obj,
            defaults={"notes": notes, "target_price": target_price},
        )

        if not created:
            return Response(
                {"error": "Property already in portfolio"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        response_serializer = PortfolioPropertyDetailSerializer(portfolio_property)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="remove-property")
    def remove_property(self, request, pk=None):
        """Remove a property from the portfolio."""
        portfolio = self.get_object()
        property_id = request.data.get("property_id")

        if not property_id:
            return Response(
                {"error": "property_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            portfolio_property = PortfolioProperty.objects.select_related(  # type: ignore[attr-defined]
                "property", "property__region", "property__district", "property__municipality", "property__parish"
            ).get(
                portfolio=portfolio,
                property_id=property_id,
            )
            portfolio_property.delete()
            return Response(
                {"message": "Property removed from portfolio"},
                status=status.HTTP_200_OK,
            )
        except PortfolioProperty.DoesNotExist:
            return Response(
                {"error": "Property not in portfolio"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=True, methods=["patch"], url_path="update-property/(?P<property_id>[^/.]+)")
    def update_property(self, request, pk=None, property_id=None):
        """Update notes or target price for a property in the portfolio."""
        portfolio = self.get_object()

        try:
            portfolio_property = PortfolioProperty.objects.select_related(  # type: ignore[attr-defined]
                "property", "property__region", "property__district", "property__municipality", "property__parish"
            ).get(
                portfolio=portfolio,
                property_id=property_id,
            )
        except PortfolioProperty.DoesNotExist:
            return Response(
                {"error": "Property not in portfolio"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Update fields if provided
        if "notes" in request.data:
            portfolio_property.notes = request.data["notes"]
        if "target_price" in request.data:
            portfolio_property.target_price = request.data["target_price"]
        
        portfolio_property.save()
        
        serializer = PortfolioPropertyDetailSerializer(portfolio_property)
        return Response(serializer.data)


class SavedPropertyViewSet(viewsets.ModelViewSet):
    """ViewSet for saved properties."""

    queryset = SavedProperty.objects.all()  # type: ignore[attr-defined]
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        """Limit saved properties to current user with optimized queries."""
        return SavedProperty.objects.select_related(  # type: ignore[attr-defined]
            "property",
            "property__region",
            "property__district",
            "property__municipality",
            "property__parish",
            "user"
        ).filter(user=self.request.user)

    def get_serializer_class(self):
        """Use property serializer for detail views."""
        from .serializers.property_serializers import SavedPropertySerializer

        return SavedPropertySerializer

    def perform_create(self, serializer):
        """Set user on create."""
        serializer.save(user=self.request.user)


# Geographic ViewSets
@method_decorator(cache_page(60 * 60 * 24), name="list")  # Cache for 24 hours (static data)
@method_decorator(cache_page(60 * 60 * 24), name="retrieve")  # Cache for 24 hours
class DistrictViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for District model (read-only) with caching."""

    queryset = District.objects.prefetch_related("municipalities").all()  # type: ignore[attr-defined]
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "code"]
    ordering = ["code"]

    def get_serializer_class(self):
        """Use detail serializer for retrieve action."""
        if self.action == "retrieve":
            return DistrictDetailSerializer
        return DistrictSerializer


@method_decorator(cache_page(60 * 60 * 24), name="list")  # Cache for 24 hours
@method_decorator(cache_page(60 * 60 * 24), name="retrieve")  # Cache for 24 hours
class MunicipalityViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Municipality model (read-only) with caching."""

    queryset = Municipality.objects.select_related("district", "autonomous_region").prefetch_related("parishes").all()  # type: ignore[attr-defined]
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["district", "autonomous_region"]
    search_fields = ["name", "code"]
    ordering = ["name"]

    def get_serializer_class(self):
        """Use detail serializer for retrieve action."""
        if self.action == "retrieve":
            return MunicipalityDetailSerializer
        return MunicipalitySerializer


@method_decorator(cache_page(60 * 60 * 24), name="list")  # Cache for 24 hours
@method_decorator(cache_page(60 * 60 * 24), name="retrieve")  # Cache for 24 hours
class ParishViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Parish model (read-only) with caching."""

    queryset = Parish.objects.select_related("municipality", "municipality__district", "municipality__autonomous_region").all()  # type: ignore[attr-defined]
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["municipality"]
    search_fields = ["name", "code"]
    ordering = ["name"]


@method_decorator(cache_page(60 * 60 * 24), name="list")  # Cache for 24 hours
@method_decorator(cache_page(60 * 60 * 24), name="retrieve")  # Cache for 24 hours
class AutonomousRegionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for AutonomousRegion model (read-only) with caching."""

    queryset = AutonomousRegion.objects.prefetch_related("municipalities").all()  # type: ignore[attr-defined]
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "code"]
    ordering = ["code"]

    def get_serializer_class(self):
        """Use detail serializer for retrieve action."""
        if self.action == "retrieve":
            return AutonomousRegionDetailSerializer
        return AutonomousRegionSerializer


@api_view(["POST"])
def validate_geographic_ids(request):
    """
    Validate geographic location IDs (districts, municipalities, parishes, autonomous regions).
    
    Accepts a list of IDs and returns validation status for each.
    
    Request body:
    {
        "ids": ["dist-01", "mun-aveiro-01", "par-aveiro-01-01", "ar-01"]
    }
    
    Response:
    {
        "valid_ids": ["dist-01", "mun-aveiro-01"],
        "invalid_ids": ["invalid-id"],
        "details": [
            {
                "id": "dist-01",
                "code": "dist-01",
                "name": "Aveiro",
                "type": "district",
                "full_path": "Aveiro",
                "valid": true
            },
            ...
        ]
    }
    """
    ids = request.data.get("ids", [])
    
    if not isinstance(ids, list):
        return Response(
            {"error": "ids must be a list"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    # Filter out non-string IDs
    string_ids = [str(location_id) for location_id in ids if isinstance(location_id, str)]
    non_string_ids = [str(location_id) for location_id in ids if not isinstance(location_id, str)]
    
    # Bulk queries - fetch all matching records in 4 queries instead of N queries
    districts = {d.code: d for d in District.objects.filter(code__in=string_ids)}  # type: ignore[attr-defined]
    municipalities = {m.code: m for m in Municipality.objects.filter(code__in=string_ids)}  # type: ignore[attr-defined]
    parishes = {p.code: p for p in Parish.objects.filter(code__in=string_ids)}  # type: ignore[attr-defined]
    regions = {r.code: r for r in AutonomousRegion.objects.filter(code__in=string_ids)}  # type: ignore[attr-defined]
    
    # Build lookup map for O(1) access
    location_map = {}
    location_map.update({code: ("district", loc) for code, loc in districts.items()})
    location_map.update({code: ("municipality", loc) for code, loc in municipalities.items()})
    location_map.update({code: ("parish", loc) for code, loc in parishes.items()})
    location_map.update({code: ("autonomous_region", loc) for code, loc in regions.items()})
    
    valid_ids = []
    invalid_ids = []
    details = []
    
    # Process non-string IDs first
    for location_id in non_string_ids:
        invalid_ids.append(location_id)
        details.append({
            "id": location_id,
            "code": "",
            "name": "",
            "type": "unknown",
            "full_path": "",
            "valid": False,
            "error": "ID must be a string",
        })
    
    # Process string IDs using lookup map
    for location_id in string_ids:
        if location_id in location_map:
            loc_type, location = location_map[location_id]
            valid_ids.append(location_id)
            details.append({
                "id": location_id,
                "code": location.code,
                "name": location.name,
                "type": loc_type,
                "full_path": location.full_path,
                "valid": True,
            })
        else:
            invalid_ids.append(location_id)
            details.append({
                "id": location_id,
                "code": "",
                "name": "",
                "type": "unknown",
                "full_path": "",
                "valid": False,
                "error": "Location not found",
            })
    
    response_data = {
        "valid_ids": valid_ids,
        "invalid_ids": invalid_ids,
        "details": details,
    }
    
    serializer = GeographicValidationResponseSerializer(data=response_data)
    serializer.is_valid()  # This will always be valid as we constructed it
    
    return Response(serializer.validated_data, status=status.HTTP_200_OK)
