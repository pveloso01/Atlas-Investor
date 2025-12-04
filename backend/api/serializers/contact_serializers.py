"""
Serializers for contact requests.
"""

from rest_framework import serializers

from ..models import ContactRequest, Property


class ContactRequestSerializer(serializers.ModelSerializer):
    """Serializer for creating and viewing contact requests."""

    property_address = serializers.CharField(source="property.address", read_only=True)

    class Meta:
        model = ContactRequest
        fields = [
            "id",
            "property",
            "property_address",
            "name",
            "email",
            "phone",
            "message",
            "contacted",
            "created_at",
        ]
        read_only_fields = ["id", "contacted", "created_at", "property_address"]

    def validate_property(self, value):
        """Ensure the property exists."""
        if not Property.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Property not found.")
        return value


class ContactRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating contact requests."""

    class Meta:
        model = ContactRequest
        fields = [
            "property",
            "name",
            "email",
            "phone",
            "message",
        ]

    def validate_message(self, value):
        """Ensure message is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Message cannot be empty.")
        return value.strip()

    def create(self, validated_data):
        """Create contact request, optionally associating with logged-in user."""
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["user"] = request.user
        return super().create(validated_data)

