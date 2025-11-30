"""
Tests for management commands.

This module tests all management command functionality including:
- seed_data command
"""

from django.test import TestCase
from django.core.management import call_command
from io import StringIO
from decimal import Decimal
from api.models import Property, Region


class SeedDataCommandTest(TestCase):
    """Test cases for seed_data management command."""

    def test_seed_data_creates_regions(self):
        """Test that seed_data command creates regions."""
        out = StringIO()
        call_command("seed_data", stdout=out)

        # Should create 3 regions (Lisbon, Porto, Cascais)
        self.assertEqual(Region.objects.count(), 3)  # type: ignore[attr-defined]

        # Verify region names
        region_names = list(Region.objects.values_list("name", flat=True))  # type: ignore[attr-defined]  # noqa: E501
        self.assertIn("Lisbon", region_names)
        self.assertIn("Porto", region_names)
        self.assertIn("Cascais", region_names)

    def test_seed_data_creates_properties(self):
        """Test that seed_data command creates properties."""
        out = StringIO()
        call_command("seed_data", stdout=out)

        # Should create 20 properties
        self.assertEqual(Property.objects.count(), 20)  # type: ignore[attr-defined]

    def test_seed_data_clear_flag(self):
        """Test that --clear flag removes existing data."""
        # Create some existing data
        Region.objects.create(  # type: ignore[attr-defined]
            name="Existing", code="EXIST"
        )
        Property.objects.create(  # type: ignore[attr-defined]
            external_id="EXIST-001",
            address="Existing Property",
            price=Decimal("100000.00"),
            size_sqm=Decimal("50.00"),
            property_type="apartment",
        )

        out = StringIO()
        call_command("seed_data", "--clear", stdout=out)

        # Should have only the seed data, not the existing data
        self.assertEqual(Region.objects.count(), 3)  # type: ignore[attr-defined]
        self.assertEqual(Property.objects.count(), 20)  # type: ignore[attr-defined]
        self.assertFalse(Region.objects.filter(code="EXIST").exists())  # type: ignore[attr-defined]  # noqa: E501
        self.assertFalse(Property.objects.filter(external_id="EXIST-001").exists())  # type: ignore[attr-defined]  # noqa: E501

    def test_seed_data_idempotent(self):
        """Test that running seed_data multiple times is idempotent."""
        out = StringIO()

        # Run command twice
        call_command("seed_data", stdout=out)
        call_command("seed_data", stdout=out)

        # Should still have the same count (no duplicates)
        self.assertEqual(Region.objects.count(), 3)  # type: ignore[attr-defined]
        self.assertEqual(Property.objects.count(), 20)  # type: ignore[attr-defined]

    def test_seed_data_property_fields(self):
        """Test that seed_data creates properties with all fields."""
        out = StringIO()
        call_command("seed_data", stdout=out)

        # Get a property and verify it has expected fields
        property_obj = Property.objects.first()  # type: ignore[attr-defined]

        self.assertIsNotNone(property_obj.external_id)
        self.assertIsNotNone(property_obj.address)
        self.assertIsNotNone(property_obj.price)
        self.assertIsNotNone(property_obj.size_sqm)
        self.assertIsNotNone(property_obj.property_type)
        self.assertIsNotNone(property_obj.region)
        self.assertIsNotNone(property_obj.description)
        self.assertIsNotNone(property_obj.listing_status)
        self.assertIsNotNone(property_obj.source_url)
        self.assertIsNotNone(property_obj.images)

    def test_seed_data_region_statistics(self):
        """Test that seed_data creates regions with statistics."""
        out = StringIO()
        call_command("seed_data", stdout=out)

        lisbon = Region.objects.get(code="LIS")  # type: ignore[attr-defined]
        self.assertIsNotNone(lisbon.avg_price_per_sqm)
        self.assertIsNotNone(lisbon.avg_rent)
        self.assertIsNotNone(lisbon.avg_yield)

    def test_seed_data_property_coordinates(self):
        """Test that seed_data creates properties with coordinates."""
        out = StringIO()
        call_command("seed_data", stdout=out)

        # All properties should have coordinates
        properties_without_coords = Property.objects.filter(coordinates__isnull=True)  # type: ignore[attr-defined]  # noqa: E501
        self.assertEqual(properties_without_coords.count(), 0)

    def test_seed_data_output(self):
        """Test that seed_data produces expected output."""
        out = StringIO()
        call_command("seed_data", stdout=out)

        output = out.getvalue()

        # Should contain success messages
        self.assertIn("Creating regions", output)
        self.assertIn("Creating sample properties", output)
        self.assertIn("Seed data created successfully", output)

    def test_seed_data_property_distribution(self):
        """Test that seed_data creates properties across all regions."""
        out = StringIO()
        call_command("seed_data", stdout=out)

        # Verify properties are distributed across regions
        lisbon_count = Property.objects.filter(region__code="LIS").count()  # type: ignore[attr-defined]  # noqa: E501
        porto_count = Property.objects.filter(region__code="OPO").count()  # type: ignore[attr-defined]  # noqa: E501
        cascais_count = Property.objects.filter(region__code="CAS").count()  # type: ignore[attr-defined]  # noqa: E501

        self.assertGreater(lisbon_count, 0)
        self.assertGreater(porto_count, 0)
        self.assertGreater(cascais_count, 0)
        self.assertEqual(lisbon_count + porto_count + cascais_count, 20)
