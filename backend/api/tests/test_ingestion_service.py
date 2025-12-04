"""Tests for PropertyIngestionService."""

import json
import tempfile
from decimal import Decimal
from pathlib import Path

from django.test import TestCase

from api.models import Property, Region
from api.services.ingestion_service import PropertyIngestionService


class PropertyIngestionServiceTests(TestCase):
    """Test cases for PropertyIngestionService."""

    def setUp(self):
        """Set up test fixtures."""
        self.service = PropertyIngestionService()
        self.sample_property = {
            "external_id": "TEST-001",
            "address": "Rua Teste 123, Lisboa",
            "coordinates": [-9.1393, 38.7223],
            "price": 300000,
            "size_sqm": 100,
            "property_type": "apartment",
            "bedrooms": 2,
            "bathrooms": 1.5,
            "year_built": 2010,
            "condition": "good",
            "floor_number": 3,
            "total_floors": 5,
            "has_elevator": True,
            "parking_spaces": 1,
            "has_balcony": True,
            "has_terrace": False,
            "energy_rating": "C",
            "description": "Test property description",
            "images": ["https://example.com/image1.jpg"],
            "region_code": "LIS",
        }

    def test_normalize_property_data(self):
        """Test property data normalization."""
        normalized = self.service.normalize_property_data(self.sample_property)

        self.assertEqual(normalized["external_id"], "TEST-001")
        self.assertEqual(normalized["address"], "Rua Teste 123, Lisboa")
        self.assertEqual(normalized["coordinates"], [-9.1393, 38.7223])
        self.assertEqual(normalized["price"], Decimal("300000"))
        self.assertEqual(normalized["size_sqm"], Decimal("100"))
        self.assertEqual(normalized["property_type"], "apartment")
        self.assertEqual(normalized["bedrooms"], 2)
        self.assertEqual(normalized["bathrooms"], Decimal("1.5"))
        self.assertEqual(normalized["year_built"], 2010)
        self.assertEqual(normalized["condition"], "good")
        self.assertEqual(normalized["floor_number"], 3)
        self.assertEqual(normalized["total_floors"], 5)
        self.assertTrue(normalized["has_elevator"])
        self.assertEqual(normalized["parking_spaces"], 1)
        self.assertTrue(normalized["has_balcony"])
        self.assertFalse(normalized["has_terrace"])
        self.assertEqual(normalized["energy_rating"], "C")
        self.assertEqual(normalized["region_code"], "LIS")

    def test_normalize_property_type_mapping(self):
        """Test property type normalization mapping."""
        test_cases = [
            ("apartment", "apartment"),
            ("flat", "apartment"),
            ("apartamento", "apartment"),
            ("house", "house"),
            ("villa", "house"),
            ("moradia", "house"),
            ("land", "land"),
            ("terreno", "land"),
            ("commercial", "commercial"),
            ("comercial", "commercial"),
            ("unknown", "apartment"),  # Default to apartment
        ]

        for input_type, expected in test_cases:
            data = {**self.sample_property, "property_type": input_type}
            normalized = self.service.normalize_property_data(data)
            self.assertEqual(
                normalized["property_type"],
                expected,
                f"Failed for property_type: {input_type}",
            )

    def test_normalize_condition_mapping(self):
        """Test condition normalization mapping."""
        test_cases = [
            ("new", "new"),
            ("novo", "new"),
            ("excellent", "excellent"),
            ("excelente", "excellent"),
            ("good", "good"),
            ("bom", "good"),
            ("fair", "fair"),
            ("razoável", "fair"),
            ("needs_renovation", "needs_renovation"),
            ("para renovar", "needs_renovation"),
        ]

        for input_condition, expected in test_cases:
            data = {**self.sample_property, "condition": input_condition}
            normalized = self.service.normalize_property_data(data)
            self.assertEqual(
                normalized["condition"],
                expected,
                f"Failed for condition: {input_condition}",
            )

    def test_validate_property_data_success(self):
        """Test successful validation of valid property data."""
        normalized = self.service.normalize_property_data(self.sample_property)
        # Should not raise exception
        self.service.validate_property_data(normalized)

    def test_validate_property_data_missing_address(self):
        """Test validation fails for missing address."""
        data = {**self.sample_property, "address": ""}
        normalized = self.service.normalize_property_data(data)

        with self.assertRaises(ValueError) as context:
            self.service.validate_property_data(normalized)

        self.assertIn("Address is required", str(context.exception))

    def test_validate_property_data_invalid_price(self):
        """Test validation fails for invalid price."""
        data = {**self.sample_property, "price": -100}
        normalized = self.service.normalize_property_data(data)

        with self.assertRaises(ValueError) as context:
            self.service.validate_property_data(normalized)

        self.assertIn("Valid price is required", str(context.exception))

    def test_validate_property_data_invalid_coordinates(self):
        """Test validation fails for invalid coordinates."""
        data = {**self.sample_property, "coordinates": [-200, 38.7223]}
        normalized = self.service.normalize_property_data(data)

        with self.assertRaises(ValueError) as context:
            self.service.validate_property_data(normalized)

        self.assertIn("Invalid longitude", str(context.exception))

    def test_ingest_single_property_create(self):
        """Test ingesting a single new property."""
        results = self.service.ingest_properties([self.sample_property])

        self.assertEqual(results["created"], 1)
        self.assertEqual(results["updated"], 0)
        self.assertEqual(len(results["errors"]), 0)

        # Verify property was created
        property_obj = Property.objects.get(external_id="TEST-001")
        self.assertEqual(property_obj.address, "Rua Teste 123, Lisboa")
        self.assertEqual(property_obj.price, Decimal("300000"))

    def test_ingest_single_property_update(self):
        """Test updating an existing property."""
        # First ingestion
        self.service.ingest_properties([self.sample_property])

        # Update price
        updated_data = {**self.sample_property, "price": 350000}
        results = self.service.ingest_properties([updated_data])

        self.assertEqual(results["created"], 0)
        self.assertEqual(results["updated"], 1)

        # Verify property was updated
        property_obj = Property.objects.get(external_id="TEST-001")
        self.assertEqual(property_obj.price, Decimal("350000"))

    def test_ingest_creates_region(self):
        """Test that ingestion creates regions."""
        results = self.service.ingest_properties([self.sample_property])

        # Verify region was created
        region = Region.objects.get(code="LIS")
        self.assertEqual(region.name, "Lisbon")

        # Verify property is linked to region
        property_obj = Property.objects.get(external_id="TEST-001")
        self.assertEqual(property_obj.region, region)

    def test_ingest_from_json_file(self):
        """Test ingesting from a JSON file."""
        # Create temporary JSON file
        data = {"properties": [self.sample_property]}

        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
            json.dump(data, f)
            temp_path = f.name

        try:
            results = self.service.ingest_from_json_file(temp_path)

            self.assertEqual(results["created"], 1)
            self.assertEqual(results["updated"], 0)
            self.assertEqual(len(results["errors"]), 0)
        finally:
            Path(temp_path).unlink()

    def test_ingest_from_json_file_not_found(self):
        """Test error handling for missing file."""
        with self.assertRaises(FileNotFoundError):
            self.service.ingest_from_json_file("/nonexistent/path.json")

    def test_ingest_multiple_properties(self):
        """Test ingesting multiple properties."""
        properties = [
            self.sample_property,
            {
                **self.sample_property,
                "external_id": "TEST-002",
                "address": "Rua Segunda 456, Porto",
                "region_code": "POR",
            },
        ]

        results = self.service.ingest_properties(properties)

        self.assertEqual(results["created"], 2)
        self.assertEqual(results["updated"], 0)
        self.assertEqual(Property.objects.count(), 2)

    def test_ingest_with_errors(self):
        """Test handling of invalid properties."""
        properties = [
            self.sample_property,
            {
                "external_id": "INVALID",
                "address": "",  # Missing required field
                "price": 100000,
                "size_sqm": 50,
                "property_type": "apartment",
            },
        ]

        results = self.service.ingest_properties(properties)

        self.assertEqual(results["created"], 1)
        self.assertEqual(results["updated"], 0)
        self.assertEqual(len(results["errors"]), 1)


class PropertyIngestionServiceEdgeCasesTests(TestCase):
    """Edge case tests for PropertyIngestionService."""

    def setUp(self):
        """Set up test fixtures."""
        self.service = PropertyIngestionService()

    def test_normalize_empty_data(self):
        """Test normalization of minimal data."""
        data = {
            "address": "Test Address",
            "price": 100000,
            "size_sqm": 50,
            "property_type": "apartment",
        }

        normalized = self.service.normalize_property_data(data)

        self.assertEqual(normalized["address"], "Test Address")
        self.assertEqual(normalized["price"], Decimal("100000"))
        self.assertIsNone(normalized["external_id"])
        self.assertIsNone(normalized["coordinates"])
        self.assertIsNone(normalized["bedrooms"])
        self.assertFalse(normalized["has_balcony"])
        self.assertEqual(normalized["images"], [])

    def test_normalize_string_images(self):
        """Test normalization when images is a string instead of list."""
        data = {
            "address": "Test Address",
            "price": 100000,
            "size_sqm": 50,
            "property_type": "apartment",
            "images": "https://example.com/single-image.jpg",
        }

        normalized = self.service.normalize_property_data(data)

        self.assertEqual(normalized["images"], ["https://example.com/single-image.jpg"])

    def test_normalize_invalid_numeric_values(self):
        """Test handling of invalid numeric values."""
        data = {
            "address": "Test Address",
            "price": 100000,
            "size_sqm": 50,
            "property_type": "apartment",
            "bedrooms": "invalid",
            "year_built": "not a year",
        }

        normalized = self.service.normalize_property_data(data)

        self.assertIsNone(normalized["bedrooms"])
        self.assertIsNone(normalized["year_built"])
