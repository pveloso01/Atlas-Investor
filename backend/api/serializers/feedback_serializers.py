"""Serializers for feedback and support functionality."""

from rest_framework import serializers

from ..models import ContactRequest, Feedback, Portfolio, PortfolioProperty, SupportMessage


class FeedbackSerializer(serializers.ModelSerializer):
    """Serializer for user feedback."""

    class Meta:
        model = Feedback
        fields = [
            "id",
            "rating",
            "comment",
            "page_url",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        """Create feedback with request context."""
        request = self.context.get("request")
        if request:
            # Set user if authenticated
            if request.user.is_authenticated:
                validated_data["user"] = request.user
            # Capture request metadata
            validated_data["user_agent"] = request.META.get("HTTP_USER_AGENT", "")[:500]
            validated_data["ip_address"] = self._get_client_ip(request)
        return super().create(validated_data)

    def _get_client_ip(self, request):
        """Get client IP from request."""
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")


class SupportMessageSerializer(serializers.ModelSerializer):
    """Serializer for support messages."""

    class Meta:
        model = SupportMessage
        fields = [
            "id",
            "email",
            "subject",
            "message",
            "page_url",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def create(self, validated_data):
        """Create support message with request context."""
        request = self.context.get("request")
        if request:
            # Set user if authenticated
            if request.user.is_authenticated:
                validated_data["user"] = request.user
                # Use user's email if not provided
                if not validated_data.get("email"):
                    validated_data["email"] = request.user.email
            # Capture request metadata
            validated_data["user_agent"] = request.META.get("HTTP_USER_AGENT", "")[:500]
            validated_data["ip_address"] = self._get_client_ip(request)
        return super().create(validated_data)

    def _get_client_ip(self, request):
        """Get client IP from request."""
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")


class ContactRequestSerializer(serializers.ModelSerializer):
    """Serializer for property contact requests."""

    class Meta:
        model = ContactRequest
        fields = [
            "id",
            "property",
            "name",
            "email",
            "phone",
            "message",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        """Create contact request with user context."""
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["user"] = request.user
        return super().create(validated_data)


class PortfolioSerializer(serializers.ModelSerializer):
    """Serializer for user portfolios."""

    property_count = serializers.SerializerMethodField()

    class Meta:
        model = Portfolio
        fields = [
            "id",
            "name",
            "description",
            "is_default",
            "property_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "property_count", "created_at", "updated_at"]

    def get_property_count(self, obj):
        """Get count of properties in portfolio."""
        return obj.properties.count()

    def create(self, validated_data):
        """Create portfolio for current user."""
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["user"] = request.user
        return super().create(validated_data)


class PortfolioPropertySerializer(serializers.ModelSerializer):
    """Serializer for properties in a portfolio."""

    property_address = serializers.CharField(source="property.address", read_only=True)
    property_price = serializers.DecimalField(
        source="property.price",
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = PortfolioProperty
        fields = [
            "id",
            "portfolio",
            "property",
            "property_address",
            "property_price",
            "notes",
            "target_price",
            "added_at",
        ]
        read_only_fields = ["id", "property_address", "property_price", "added_at"]

