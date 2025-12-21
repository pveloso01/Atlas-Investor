"""Serializers for geographic models (District, Municipality, Parish, AutonomousRegion)."""

from rest_framework import serializers
from ..models import District, Municipality, Parish, AutonomousRegion


class DistrictSerializer(serializers.ModelSerializer):
    """District serializer with basic information."""

    class Meta:
        model = District
        fields = ["id", "code", "name", "full_path", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class AutonomousRegionSerializer(serializers.ModelSerializer):
    """Autonomous region serializer with basic information."""

    class Meta:
        model = AutonomousRegion
        fields = ["id", "code", "name", "full_path", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class MunicipalitySerializer(serializers.ModelSerializer):
    """Municipality serializer with district/region information."""

    district = DistrictSerializer(read_only=True)
    district_id = serializers.PrimaryKeyRelatedField(
        queryset=District.objects.all(),
        source="district",
        write_only=True,
        required=False,
        allow_null=True,
    )
    autonomous_region = AutonomousRegionSerializer(read_only=True)
    autonomous_region_id = serializers.PrimaryKeyRelatedField(
        queryset=AutonomousRegion.objects.all(),
        source="autonomous_region",
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Municipality
        fields = [
            "id",
            "code",
            "name",
            "full_path",
            "district",
            "district_id",
            "autonomous_region",
            "autonomous_region_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ParishSerializer(serializers.ModelSerializer):
    """Parish serializer with municipality and district/region information."""

    municipality = MunicipalitySerializer(read_only=True)
    municipality_id = serializers.PrimaryKeyRelatedField(
        queryset=Municipality.objects.all(),
        source="municipality",
        write_only=True,
    )

    class Meta:
        model = Parish
        fields = [
            "id",
            "code",
            "name",
            "full_path",
            "municipality",
            "municipality_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class AutonomousRegionDetailSerializer(serializers.ModelSerializer):
    """Autonomous region serializer with municipalities."""

    municipalities = MunicipalitySerializer(many=True, read_only=True)

    class Meta:
        model = AutonomousRegion
        fields = [
            "id",
            "code",
            "name",
            "full_path",
            "municipalities",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class DistrictDetailSerializer(serializers.ModelSerializer):
    """District serializer with municipalities."""

    municipalities = MunicipalitySerializer(many=True, read_only=True)

    class Meta:
        model = District
        fields = [
            "id",
            "code",
            "name",
            "full_path",
            "municipalities",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class MunicipalityDetailSerializer(serializers.ModelSerializer):
    """Municipality serializer with parishes."""

    district = DistrictSerializer(read_only=True)
    autonomous_region = AutonomousRegionSerializer(read_only=True)
    parishes = ParishSerializer(many=True, read_only=True)

    class Meta:
        model = Municipality
        fields = [
            "id",
            "code",
            "name",
            "full_path",
            "district",
            "autonomous_region",
            "parishes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class GeographicLocationSerializer(serializers.Serializer):
    """Unified serializer for geographic location validation responses."""

    id = serializers.CharField()
    code = serializers.CharField()
    name = serializers.CharField()
    type = serializers.CharField()  # 'district', 'municipality', 'parish', 'autonomous_region'
    full_path = serializers.CharField()
    valid = serializers.BooleanField()
    error = serializers.CharField(required=False, allow_null=True)


class GeographicValidationResponseSerializer(serializers.Serializer):
    """Serializer for geographic ID validation response."""

    valid_ids = serializers.ListField(child=serializers.CharField())
    invalid_ids = serializers.ListField(child=serializers.CharField())
    details = GeographicLocationSerializer(many=True)
