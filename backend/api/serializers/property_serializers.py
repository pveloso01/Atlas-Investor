from rest_framework import serializers
from ..models import Property, Region, SavedProperty, District, Municipality, Parish


class RegionSerializer(serializers.ModelSerializer):
    """Region serializer."""

    class Meta:
        model = Region
        fields = ["id", "name", "code", "avg_price_per_sqm", "avg_rent", "avg_yield"]


class PropertySerializer(serializers.ModelSerializer):
    """Property serializer with region and geographic details."""

    region = RegionSerializer(read_only=True)
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(),  # type: ignore[attr-defined]
        source="region",
        write_only=True,
        required=False,
    )
    district = serializers.SerializerMethodField()
    district_id = serializers.PrimaryKeyRelatedField(
        queryset=District.objects.all(),  # type: ignore[attr-defined]
        source="district",
        write_only=True,
        required=False,
        allow_null=True,
    )
    municipality = serializers.SerializerMethodField()
    municipality_id = serializers.PrimaryKeyRelatedField(
        queryset=Municipality.objects.all(),  # type: ignore[attr-defined]
        source="municipality",
        write_only=True,
        required=False,
        allow_null=True,
    )
    parish = serializers.SerializerMethodField()
    parish_id = serializers.PrimaryKeyRelatedField(
        queryset=Parish.objects.all(),  # type: ignore[attr-defined]
        source="parish",
        write_only=True,
        required=False,
        allow_null=True,
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
            # Geographic relationships
            "district",
            "district_id",
            "municipality",
            "municipality_id",
            "parish",
            "parish_id",
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

    def get_district(self, obj):
        """Return district details if available."""
        if obj.district:
            from .geography_serializers import DistrictSerializer

            return DistrictSerializer(obj.district).data
        return None

    def get_municipality(self, obj):
        """Return municipality details if available."""
        if obj.municipality:
            from .geography_serializers import MunicipalitySerializer

            return MunicipalitySerializer(obj.municipality).data
        return None

    def get_parish(self, obj):
        """Return parish details if available."""
        if obj.parish:
            from .geography_serializers import ParishSerializer

            return ParishSerializer(obj.parish).data
        return None


class SavedPropertySerializer(serializers.ModelSerializer):
    """Serializer for saved properties."""

    property_details = PropertySerializer(source="property", read_only=True)

    class Meta:
        model = SavedProperty
        fields = [
            "id",
            "property",
            "property_details",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
