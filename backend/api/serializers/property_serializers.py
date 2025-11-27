from rest_framework import serializers
from ..models import Property, Region


class RegionSerializer(serializers.ModelSerializer):
    """Region serializer."""
    class Meta:
        model = Region
        fields = ['id', 'name', 'code', 'avg_price_per_sqm', 'avg_rent', 'avg_yield']


class PropertySerializer(serializers.ModelSerializer):
    """Property serializer with region details."""
    region = RegionSerializer(read_only=True)
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(),
        source='region',
        write_only=True,
        required=False
    )
    coordinates = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'external_id', 'address', 'coordinates', 'price', 'size_sqm',
            'property_type', 'bedrooms', 'bathrooms', 'region', 'region_id',
            'raw_data', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_coordinates(self, obj):
        """Return coordinates as [longitude, latitude]."""
        if obj.coordinates:
            return [obj.coordinates.x, obj.coordinates.y]
        return None

