"""
Serializers for portfolio management functionality.
"""

from decimal import Decimal

from rest_framework import serializers

from ..models import Portfolio, PortfolioProperty, Property


class PortfolioPropertyDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for properties in a portfolio."""

    property_id = serializers.IntegerField(source="property.id", read_only=True)
    property_address = serializers.CharField(source="property.address", read_only=True)
    property_price = serializers.DecimalField(
        source="property.price",
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )
    property_type = serializers.CharField(source="property.property_type", read_only=True)
    size_sqm = serializers.DecimalField(
        source="property.size_sqm",
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )
    bedrooms = serializers.IntegerField(source="property.bedrooms", read_only=True)
    region_name = serializers.CharField(
        source="property.region.name", read_only=True, allow_null=True
    )
    price_difference = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioProperty
        fields = [
            "id",
            "property_id",
            "property_address",
            "property_price",
            "property_type",
            "size_sqm",
            "bedrooms",
            "region_name",
            "notes",
            "target_price",
            "price_difference",
            "added_at",
        ]
        read_only_fields = ["id", "property_id", "added_at"]

    def get_price_difference(self, obj) -> dict | None:
        """Calculate difference between current price and target price."""
        if obj.target_price and obj.property.price:
            current = Decimal(str(obj.property.price))
            target = Decimal(str(obj.target_price))
            difference = current - target
            percentage = (difference / target * 100) if target > 0 else Decimal("0")
            return {
                "amount": float(difference),
                "percentage": float(percentage.quantize(Decimal("0.01"))),
                "is_below_target": current < target,
            }
        return None


class PortfolioDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for portfolios with properties."""

    properties = PortfolioPropertyDetailSerializer(many=True, read_only=True)
    property_count = serializers.SerializerMethodField()
    total_value = serializers.SerializerMethodField()
    average_price = serializers.SerializerMethodField()

    class Meta:
        model = Portfolio
        fields = [
            "id",
            "name",
            "description",
            "is_default",
            "property_count",
            "total_value",
            "average_price",
            "properties",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "property_count",
            "total_value",
            "average_price",
            "created_at",
            "updated_at",
        ]

    def get_property_count(self, obj) -> int:
        """Get count of properties in portfolio."""
        # Use annotation if available, otherwise fall back to count()
        if hasattr(obj, "property_count_annotation"):
            return obj.property_count_annotation
        return obj.properties.count()

    def get_total_value(self, obj) -> float:
        """Get total value of all properties in portfolio."""
        total = sum(
            Decimal(str(pp.property.price))
            for pp in obj.properties.select_related("property").all()
            if pp.property.price
        )
        return float(total)

    def get_average_price(self, obj) -> float | None:
        """Get average price of properties in portfolio."""
        properties = obj.properties.select_related("property").all()
        if not properties:
            return None
        prices = [Decimal(str(pp.property.price)) for pp in properties if pp.property.price]
        if not prices:
            return None
        return float(sum(prices) / len(prices))


class PortfolioListSerializer(serializers.ModelSerializer):
    """List serializer for portfolios (without nested properties)."""

    property_count = serializers.SerializerMethodField()
    total_value = serializers.SerializerMethodField()

    class Meta:
        model = Portfolio
        fields = [
            "id",
            "name",
            "description",
            "is_default",
            "property_count",
            "total_value",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "property_count", "total_value", "created_at", "updated_at"]

    def get_property_count(self, obj) -> int:
        """Get count of properties in portfolio."""
        # Use annotation if available, otherwise fall back to count()
        if hasattr(obj, "property_count_annotation"):
            return obj.property_count_annotation
        return obj.properties.count()

    def get_total_value(self, obj) -> float:
        """Get total value of all properties in portfolio."""
        total = sum(
            Decimal(str(pp.property.price))
            for pp in obj.properties.select_related("property").all()
            if pp.property.price
        )
        return float(total)


class PortfolioCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating portfolios."""

    class Meta:
        model = Portfolio
        fields = ["name", "description", "is_default"]

    def create(self, validated_data):
        """Create portfolio for current user."""
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["user"] = request.user

            # If this is marked as default, unset other defaults
            if validated_data.get("is_default"):
                Portfolio.objects.filter(user=request.user, is_default=True).update(
                    is_default=False
                )
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Update portfolio and handle default flag."""
        request = self.context.get("request")

        # If setting as default, unset other defaults
        if validated_data.get("is_default") and request:
            Portfolio.objects.filter(user=request.user, is_default=True).exclude(
                pk=instance.pk
            ).update(is_default=False)

        return super().update(instance, validated_data)


class AddPropertyToPortfolioSerializer(serializers.Serializer):
    """Serializer for adding a property to a portfolio."""

    property_id = serializers.IntegerField()
    notes = serializers.CharField(required=False, allow_blank=True, default="")
    target_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,
        allow_null=True,
    )

    def validate_property_id(self, value):
        """Validate that the property exists."""
        try:
            Property.objects.get(pk=value)
        except Property.DoesNotExist:
            raise serializers.ValidationError("Property not found.")
        return value


class RemovePropertyFromPortfolioSerializer(serializers.Serializer):
    """Serializer for removing a property from a portfolio."""

    property_id = serializers.IntegerField()

    def validate_property_id(self, value):
        """Validate that the property exists."""
        try:
            Property.objects.get(pk=value)
        except Property.DoesNotExist:
            raise serializers.ValidationError("Property not found.")
        return value
