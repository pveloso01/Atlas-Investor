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
from .models import (
    ContactRequest,
    Feedback,
    Portfolio,
    PortfolioProperty,
    Property,
    Region,
    SavedProperty,
    SupportMessage,
)
from .serializers.property_serializers import PropertySerializer, RegionSerializer
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

    queryset = Property.objects.select_related("region").all()  # type: ignore[attr-defined]
    serializer_class = PropertySerializer
    permission_classes = [CustomIsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["property_type", "region"]
    search_fields = ["address"]
    ordering_fields = ["price", "size_sqm", "created_at"]
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
        """Allow anyone to create support messages, but restrict other actions."""
        if self.action == "create":
            return [AllowAny()]
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
        base_queryset = ContactRequest.objects.select_related("property", "property__region")  # type: ignore[attr-defined]
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
        return Portfolio.objects.filter(  # type: ignore[attr-defined]
            user=self.request.user
        ).prefetch_related("properties__property__region")

    def perform_create(self, serializer):
        """Create portfolio and handle default portfolio creation."""
        # Check portfolio size limit for Basic tier
        if self.request.user.is_authenticated:
            try:
                from subscriptions.utils import check_feature_access
                subscription = self.request.user.get_active_subscription()
                
                if subscription and subscription.tier.slug == 'basic':
                    user_portfolio_count = Portfolio.objects.filter(user=self.request.user).count()  # type: ignore[attr-defined]
                    if user_portfolio_count >= 5:
                        from rest_framework.exceptions import PermissionDenied
                        raise PermissionDenied(
                            "Portfolio limit reached. Basic tier allows up to 5 portfolios. Upgrade to Pro for unlimited portfolios."
                        )
            except Exception:
                # If feature doesn't exist yet, allow access
                pass
        
        portfolio = serializer.save()
        
        # If this is the user's first portfolio, make it default
        user_portfolio_count = Portfolio.objects.filter(user=self.request.user).count()  # type: ignore[attr-defined]
        if user_portfolio_count == 1:
            portfolio.is_default = True
            portfolio.save()

    @action(detail=False, methods=["get"])
    def default(self, request):
        """Get user's default portfolio, creating one if none exists."""
        portfolio = Portfolio.objects.filter(  # type: ignore[attr-defined]
            user=request.user, is_default=True
        ).first()
        
        if not portfolio:
            # Create default portfolio if none exists
            portfolio = Portfolio.objects.create(  # type: ignore[attr-defined]
                user=request.user,
                name="My Portfolio",
                is_default=True,
            )
        
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
                    property_count = PortfolioProperty.objects.filter(portfolio=portfolio).count()  # type: ignore[attr-defined]
                    if property_count >= 5:
                        return Response(
                            {
                                "error": "Portfolio property limit reached. Basic tier allows up to 5 properties per portfolio. Upgrade to Pro for unlimited properties.",
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

        property_obj = Property.objects.get(pk=property_id)  # type: ignore[attr-defined]

        portfolio_property, created = PortfolioProperty.objects.get_or_create(  # type: ignore[attr-defined]
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
            portfolio_property = PortfolioProperty.objects.get(  # type: ignore[attr-defined]
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
            portfolio_property = PortfolioProperty.objects.get(  # type: ignore[attr-defined]
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
            "property", "property__region"
        ).filter(user=self.request.user)

    def get_serializer_class(self):
        """Use property serializer for detail views."""
        from .serializers.property_serializers import SavedPropertySerializer

        return SavedPropertySerializer

    def perform_create(self, serializer):
        """Set user on create."""
        serializer.save(user=self.request.user)
