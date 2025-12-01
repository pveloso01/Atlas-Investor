from rest_framework import serializers
from ..models import Property, Region


class RegionSerializer(serializers.ModelSerializer):
    """Region serializer."""

    class Meta:
        model = Region
        fields = ["id", "name", "code", "avg_price_per_sqm", "avg_rent", "avg_yield"]


class PropertySerializer(serializers.ModelSerializer):
    """Property serializer with region details."""

    region = RegionSerializer(read_only=True)
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(),  # type: ignore[attr-defined]
        source="region",
        write_only=True,
        required=False,
    )
    coordinates = serializers.SerializerMethodField()
    price_per_sqm = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            # Basic Information
            "id",
            "external_id",
            "address",
            "coordinates",
            "description",
            # Pricing & Size
            "price",
            "size_sqm",
            "price_per_sqm",
            # Property Details
            "property_type",
            "bedrooms",
            "bathrooms",
            "year_built",
            "condition",
            # Apartment-specific
            "floor_number",
            "total_floors",
            "has_elevator",
            # Features
            "parking_spaces",
            "has_balcony",
            "has_terrace",
            # Energy & Environment
            "energy_rating",
            # Listing Information
            "listing_status",
            "source_url",
            "last_synced_at",
            # Relationships
            "region",
            "region_id",
            # Media
            "images",
            # Additional Data
            "raw_data",
            # Timestamps
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_coordinates(self, obj):
        """Return coordinates as [longitude, latitude]."""
        # Use model method for consistency
        return obj.get_coordinates_list()

    def get_price_per_sqm(self, obj):
        """Return calculated price per square meter."""
        price_per_sqm = obj.price_per_sqm
        if price_per_sqm:
            return str(price_per_sqm)
        return None
