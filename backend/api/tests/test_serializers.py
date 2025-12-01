"""
Tests for API serializers.

This module tests all serializer functionality including:
- PropertySerializer (serialization, validation, field methods)
- RegionSerializer (serialization)
"""

from django.test import TestCase
from decimal import Decimal
from api.models import Property, Region
from api.serializers.property_serializers import PropertySerializer, RegionSerializer


class RegionSerializerTest(TestCase):
    """Test cases for RegionSerializer."""

    def setUp(self):
        """Set up test data."""
        self.region = Region.objects.create(
            name="Lisbon",
            code="LIS",
            avg_price_per_sqm=Decimal("3500.00"),
            avg_rent=Decimal("1200.00"),
            avg_yield=Decimal("4.10"),
        )

    def test_region_serializer_serialization(self):
        """Test RegionSerializer serialization."""
        serializer = RegionSerializer(self.region)
        data = serializer.data

        self.assertEqual(data["id"], self.region.id)
        self.assertEqual(data["name"], "Lisbon")
        self.assertEqual(data["code"], "LIS")
        self.assertEqual(float(data["avg_price_per_sqm"]), 3500.00)
        self.assertEqual(float(data["avg_rent"]), 1200.00)
        self.assertEqual(float(data["avg_yield"]), 4.10)

    def test_region_serializer_with_none_values(self):
        """Test RegionSerializer with None values."""
        region = Region.objects.create(  # type: ignore[attr-defined]
            name="Test Region",
            code="TEST",
            avg_price_per_sqm=None,
            avg_rent=None,
            avg_yield=None,
        )

        serializer = RegionSerializer(region)
        data = serializer.data

        self.assertIsNone(data["avg_price_per_sqm"])
        self.assertIsNone(data["avg_rent"])
        self.assertIsNone(data["avg_yield"])


class PropertySerializerTest(TestCase):
    """Test cases for PropertySerializer."""

    def setUp(self):
        """Set up test data."""
        self.region = Region.objects.create(
            name="Lisbon", code="LIS", avg_price_per_sqm=Decimal("3500.00")
        )

        self.property = Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST-001",
            address="Test Address 123",
            coordinates=[-9.1393, 38.7223],
            description="Test property description",
            price=Decimal("300000.00"),
            size_sqm=Decimal("100.00"),
            property_type="apartment",
            bedrooms=2,
            bathrooms=Decimal("1.5"),
            year_built=2010,
            condition="good",
            floor_number=3,
            total_floors=5,
            has_elevator=True,
            parking_spaces=1,
            has_balcony=True,
            has_terrace=False,
            energy_rating="C",
            listing_status="active",
            source_url="https://example.com/test",
            images=["https://example.com/img1.jpg"],
            region=self.region,
        )

    def test_property_serializer_serialization(self):
        """Test PropertySerializer serialization."""
        serializer = PropertySerializer(self.property)
        data = serializer.data

        # Basic fields
        self.assertEqual(data["id"], self.property.id)
        self.assertEqual(data["external_id"], "TEST-001")
        self.assertEqual(data["address"], "Test Address 123")
        self.assertEqual(data["description"], "Test property description")
        self.assertEqual(float(data["price"]), 300000.00)
        self.assertEqual(float(data["size_sqm"]), 100.00)
        self.assertEqual(data["property_type"], "apartment")
        self.assertEqual(data["bedrooms"], 2)
        self.assertEqual(float(data["bathrooms"]), 1.5)

        # New fields
        self.assertEqual(data["year_built"], 2010)
        self.assertEqual(data["condition"], "good")
        self.assertEqual(data["floor_number"], 3)
        self.assertEqual(data["total_floors"], 5)
        self.assertTrue(data["has_elevator"])
        self.assertEqual(data["parking_spaces"], 1)
        self.assertTrue(data["has_balcony"])
        self.assertFalse(data["has_terrace"])
        self.assertEqual(data["energy_rating"], "C")
        self.assertEqual(data["listing_status"], "active")
        self.assertEqual(data["source_url"], "https://example.com/test")
        self.assertEqual(len(data["images"]), 1)

        # Calculated fields
        self.assertEqual(data["coordinates"], [-9.1393, 38.7223])
        self.assertEqual(float(data["price_per_sqm"]), 3000.00)

        # Relationships
        self.assertIn("region", data)
        self.assertEqual(data["region"]["id"], self.region.id)
        self.assertEqual(data["region"]["name"], "Lisbon")

    def test_property_serializer_get_coordinates(self):
        """Test PropertySerializer get_coordinates method."""
        serializer = PropertySerializer(self.property)
        data = serializer.data

        self.assertEqual(data["coordinates"], [-9.1393, 38.7223])

    def test_property_serializer_get_coordinates_none(self):
        """Test PropertySerializer get_coordinates with None."""
        self.property.coordinates = None
        self.property.save()

        serializer = PropertySerializer(self.property)
        data = serializer.data

        self.assertIsNone(data["coordinates"])

    def test_property_serializer_get_price_per_sqm(self):
        """Test PropertySerializer get_price_per_sqm method."""
        serializer = PropertySerializer(self.property)
        data = serializer.data

        self.assertEqual(float(data["price_per_sqm"]), 3000.00)

    def test_property_serializer_get_price_per_sqm_none(self):
        """Test PropertySerializer get_price_per_sqm with None."""
        self.property.size_sqm = Decimal("0.00")
        self.property.save()

        serializer = PropertySerializer(self.property)
        data = serializer.data

        self.assertIsNone(data["price_per_sqm"])

    def test_property_serializer_read_only_fields(self):
        """Test PropertySerializer read-only fields."""
        serializer = PropertySerializer(self.property)
        data = serializer.data

        # These should be present but read-only
        self.assertIn("id", data)
        self.assertIn("created_at", data)
        self.assertIn("updated_at", data)
        self.assertIn("price_per_sqm", data)

    def test_property_serializer_create_with_region_id(self):
        """Test PropertySerializer creation with region_id."""
        data = {
            "external_id": "TEST-002",
            "address": "New Address",
            "price": "250000.00",
            "size_sqm": "90.00",
            "property_type": "apartment",
            "region_id": self.region.id,
        }

        serializer = PropertySerializer(data=data)
        self.assertTrue(serializer.is_valid())

        property_obj = serializer.save()
        self.assertEqual(property_obj.region, self.region)
        self.assertEqual(property_obj.address, "New Address")

    def test_property_serializer_update(self):
        """Test PropertySerializer update."""
        data = {
            "address": "Updated Address",
            "price": "350000.00",
            "region_id": self.region.id,
        }

        serializer = PropertySerializer(self.property, data=data, partial=True)
        self.assertTrue(serializer.is_valid())

        updated_property = serializer.save()
        self.assertEqual(updated_property.address, "Updated Address")
        self.assertEqual(updated_property.price, Decimal("350000.00"))

    def test_property_serializer_all_fields_included(self):
        """Test that all Property fields are included in serializer."""
        serializer = PropertySerializer(self.property)
        data = serializer.data

        expected_fields = [
            "id",
            "external_id",
            "address",
            "coordinates",
            "description",
            "price",
            "size_sqm",
            "price_per_sqm",
            "property_type",
            "bedrooms",
            "bathrooms",
            "year_built",
            "condition",
            "floor_number",
            "total_floors",
            "has_elevator",
            "parking_spaces",
            "has_balcony",
            "has_terrace",
            "energy_rating",
            "listing_status",
            "source_url",
            "last_synced_at",
            "region",
            "region_id",
            "images",
            "raw_data",
            "created_at",
            "updated_at",
        ]
        # region_id is write_only, so it won't appear in serialized output
        write_only_fields = ["region_id"]

        for field in expected_fields:
            if field not in write_only_fields:
                self.assertIn(
                    field, data, f"Field '{field}' missing from serializer data"
                )

    def test_property_serializer_with_optional_fields(self):
        """Test PropertySerializer with optional fields set to None."""
        property_obj = Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST-OPTIONAL",
            address="Optional Fields Test",
            price=Decimal("100000.00"),
            size_sqm=Decimal("50.00"),
            property_type="house",
            region=self.region,
            year_built=None,
            condition=None,
            floor_number=None,
            total_floors=None,
            has_elevator=None,
            energy_rating=None,
        )

        serializer = PropertySerializer(property_obj)
        data = serializer.data

        self.assertIsNone(data["year_built"])
        self.assertIsNone(data["condition"])
        self.assertIsNone(data["floor_number"])
        self.assertIsNone(data["total_floors"])
        self.assertIsNone(data["has_elevator"])
        self.assertIsNone(data["energy_rating"])

    def test_get_price_per_sqm_with_none_comprehensive(self):
        """Test get_price_per_sqm method with None value."""
        self.property.size_sqm = Decimal("0.00")
        self.property.save()

        serializer = PropertySerializer(self.property)
        data = serializer.data

        self.assertIsNone(data["price_per_sqm"])

    def test_get_price_per_sqm_with_value_comprehensive(self):
        """Test get_price_per_sqm method with valid value."""
        serializer = PropertySerializer(self.property)
        data = serializer.data

        self.assertIsNotNone(data["price_per_sqm"])
        self.assertEqual(float(data["price_per_sqm"]), 3000.00)

    def test_get_coordinates_with_none_comprehensive(self):
        """Test get_coordinates with None."""
        self.property.coordinates = None
        self.property.save()

        serializer = PropertySerializer(self.property)
        data = serializer.data

        self.assertIsNone(data["coordinates"])
