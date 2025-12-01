"""
Tests for API services.

This module tests all service functionality including:
- PropertyService (all methods, edge cases, error handling)
"""

from django.test import TestCase
from decimal import Decimal
from api.models import Property, Region
from api.services.property_service import PropertyService


class PropertyServiceTest(TestCase):
    """Test cases for PropertyService."""

    def setUp(self):
        """Set up test data."""
        self.region = Region.objects.create(  # type: ignore[attr-defined]
            name="Lisbon",
            code="LIS",
            avg_price_per_sqm=Decimal("3500.00"),
            avg_rent=Decimal("1200.00"),
            avg_yield=Decimal("4.10"),
        )

        self.property = Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST-001",
            address="Test Address 123",
            coordinates=[-9.1393, 38.7223],
            price=Decimal("300000.00"),
            size_sqm=Decimal("100.00"),
            property_type="apartment",
            bedrooms=2,
            bathrooms=Decimal("1.5"),
            region=self.region,
        )

    def test_calculate_price_per_sqm(self):
        """Test calculate_price_per_sqm method."""
        result = PropertyService.calculate_price_per_sqm(
            Decimal("300000.00"), Decimal("100.00")
        )
        self.assertEqual(result, Decimal("3000.00"))

    def test_calculate_price_per_sqm_zero_size(self):
        """Test calculate_price_per_sqm with zero size."""
        result = PropertyService.calculate_price_per_sqm(
            Decimal("300000.00"), Decimal("0.00")
        )
        self.assertIsNone(result)

    def test_calculate_price_per_sqm_negative_size(self):
        """Test calculate_price_per_sqm with negative size."""
        result = PropertyService.calculate_price_per_sqm(
            Decimal("300000.00"), Decimal("-10.00")
        )
        self.assertIsNone(result)

    def test_calculate_price_per_sqm_none_size(self):
        """Test calculate_price_per_sqm with None size."""
        result = PropertyService.calculate_price_per_sqm(
            Decimal("300000.00"), None  # type: ignore[arg-type]
        )
        self.assertIsNone(result)

    def test_calculate_price_per_sqm_zero_price(self):
        """Test calculate_price_per_sqm with zero price."""
        result = PropertyService.calculate_price_per_sqm(
            Decimal("0.00"), Decimal("100.00")
        )
        self.assertEqual(result, Decimal("0.00"))

    def test_calculate_yield(self):
        """Test calculate_yield method."""
        annual_rent = Decimal("12000.00")  # €1000/month * 12
        result = PropertyService.calculate_yield(Decimal("300000.00"), annual_rent)
        self.assertEqual(result, Decimal("4.00"))

    def test_calculate_yield_zero_price(self):
        """Test calculate_yield with zero price."""
        result = PropertyService.calculate_yield(Decimal("0.00"), Decimal("12000.00"))
        self.assertIsNone(result)

    def test_calculate_yield_negative_price(self):
        """Test calculate_yield with negative price."""
        result = PropertyService.calculate_yield(
            Decimal("-100000.00"), Decimal("12000.00")
        )
        self.assertIsNone(result)

    def test_calculate_yield_none_rent(self):
        """Test calculate_yield with None annual_rent."""
        result = PropertyService.calculate_yield(
            Decimal("300000.00"), None  # type: ignore[arg-type]
        )
        self.assertIsNone(result)

    def test_calculate_yield_zero_rent(self):
        """Test calculate_yield with zero annual_rent."""
        result = PropertyService.calculate_yield(Decimal("300000.00"), Decimal("0.00"))
        self.assertEqual(result, Decimal("0.00"))

    def test_normalize_coordinates_list(self):
        """Test normalize_coordinates with list input."""
        coords = [9.1393, 38.7223]
        result = PropertyService.normalize_coordinates(coords)
        self.assertEqual(result, [9.1393, 38.7223])

    def test_normalize_coordinates_tuple(self):
        """Test normalize_coordinates with tuple input."""
        coords = (9.1393, 38.7223)
        result = PropertyService.normalize_coordinates(coords)
        self.assertEqual(result, [9.1393, 38.7223])

    def test_normalize_coordinates_none(self):
        """Test normalize_coordinates with None input."""
        result = PropertyService.normalize_coordinates(None)
        self.assertIsNone(result)

    def test_normalize_coordinates_empty_list(self):
        """Test normalize_coordinates with empty list."""
        result = PropertyService.normalize_coordinates([])
        self.assertIsNone(result)

    def test_normalize_coordinates_short_list(self):
        """Test normalize_coordinates with list shorter than 2 elements."""
        result = PropertyService.normalize_coordinates([1])
        self.assertIsNone(result)

    def test_normalize_coordinates_invalid_input(self):
        """Test normalize_coordinates with invalid input."""
        result = PropertyService.normalize_coordinates("invalid")
        self.assertIsNone(result)

    def test_get_properties_by_region(self):
        """Test get_properties_by_region method."""
        properties = PropertyService.get_properties_by_region(self.region)
        self.assertEqual(properties.count(), 1)
        self.assertEqual(properties.first(), self.property)

    def test_get_properties_by_region_empty(self):
        """Test get_properties_by_region with region that has no properties."""
        region2 = Region.objects.create(  # type: ignore[attr-defined]
            name="Porto", code="OPO"
        )
        properties = PropertyService.get_properties_by_region(region2)
        self.assertEqual(properties.count(), 0)

    def test_get_properties_in_price_range(self):
        """Test get_properties_in_price_range method."""
        # Create another property outside range
        Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST-002",
            address="Test Address 456",
            price=Decimal("500000.00"),
            size_sqm=Decimal("150.00"),
            property_type="house",
            region=self.region,
        )

        # Test min_price filter
        properties = PropertyService.get_properties_in_price_range(
            min_price=Decimal("250000.00")
        )
        self.assertEqual(properties.count(), 2)

        # Test max_price filter
        properties = PropertyService.get_properties_in_price_range(
            max_price=Decimal("350000.00")
        )
        self.assertEqual(properties.count(), 1)

        # Test range filter
        properties = PropertyService.get_properties_in_price_range(
            min_price=Decimal("250000.00"), max_price=Decimal("350000.00")
        )
        self.assertEqual(properties.count(), 1)

    def test_get_properties_in_price_range_no_filters(self):
        """Test get_properties_in_price_range with no filters."""
        Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST-002",
            address="Test Address 456",
            price=Decimal("500000.00"),
            size_sqm=Decimal("150.00"),
            property_type="house",
            region=self.region,
        )

        properties = PropertyService.get_properties_in_price_range()
        self.assertEqual(properties.count(), 2)

    def test_get_properties_in_price_range_exact_bounds(self):
        """Test get_properties_in_price_range with exact price bounds."""
        properties = PropertyService.get_properties_in_price_range(
            min_price=Decimal("300000.00"), max_price=Decimal("300000.00")
        )
        self.assertEqual(properties.count(), 1)
        self.assertEqual(properties.first(), self.property)

    def test_compare_to_region_average(self):
        """Test compare_to_region_average method."""
        result = PropertyService.compare_to_region_average(self.property)

        self.assertIn("property_price_per_sqm", result)
        self.assertIn("region_avg_price_per_sqm", result)
        self.assertIn("price_difference", result)
        self.assertIn("price_difference_percent", result)
        self.assertIn("is_below_average", result)

        # Property price per sqm (3000) is below region average (3500)
        self.assertTrue(result["is_below_average"])
        self.assertLess(result["price_difference"], 0)

    def test_compare_to_region_average_no_region(self):
        """Test compare_to_region_average with property that has no region."""
        property_no_region = Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST-NO-REGION",
            address="No Region Property",
            price=Decimal("200000.00"),
            size_sqm=Decimal("80.00"),
            property_type="apartment",
            region=None,
        )

        result = PropertyService.compare_to_region_average(property_no_region)
        self.assertEqual(result, {})

    def test_compare_to_region_average_above_average(self):
        """Test compare_to_region_average with property above region average."""
        expensive_property = Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST-EXPENSIVE",
            address="Expensive Property",
            price=Decimal("500000.00"),
            size_sqm=Decimal("100.00"),  # 5000 per sqm
            property_type="apartment",
            region=self.region,  # Region avg is 3500
        )

        result = PropertyService.compare_to_region_average(expensive_property)

        self.assertFalse(result["is_below_average"])
        self.assertGreater(result["price_difference"], 0)

    def test_compare_to_region_average_equal(self):
        """Test compare_to_region_average with property equal to region average."""
        equal_property = Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST-EQUAL",
            address="Equal Property",
            price=Decimal("350000.00"),
            size_sqm=Decimal("100.00"),  # 3500 per sqm
            property_type="apartment",
            region=self.region,  # Region avg is 3500
        )

        result = PropertyService.compare_to_region_average(equal_property)

        self.assertEqual(result["price_difference"], 0.0)
        self.assertEqual(result["price_difference_percent"], 0.0)
        self.assertFalse(result["is_below_average"])

    def test_compare_to_region_average_no_region_avg(self):
        """Test compare_to_region_average when region has no avg_price_per_sqm."""
        region_no_avg = Region.objects.create(  # type: ignore[attr-defined]
            name="No Avg Region", code="NOAVG", avg_price_per_sqm=None
        )

        property_obj = Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST-NO-AVG",
            address="No Avg Property",
            price=Decimal("300000.00"),
            size_sqm=Decimal("100.00"),
            property_type="apartment",
            region=region_no_avg,
        )

        result = PropertyService.compare_to_region_average(property_obj)

        self.assertIn("property_price_per_sqm", result)
        self.assertIsNone(result["region_avg_price_per_sqm"])
        self.assertNotIn("price_difference", result)

    def test_compare_to_region_average_zero_size(self):
        """Test compare_to_region_average with property that has zero size."""
        property_zero_size = Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST-ZERO-SIZE",
            address="Zero Size Property",
            price=Decimal("300000.00"),
            size_sqm=Decimal("0.00"),
            property_type="apartment",
            region=self.region,
        )

        result = PropertyService.compare_to_region_average(property_zero_size)

        self.assertIsNone(result["property_price_per_sqm"])
        self.assertIn("region_avg_price_per_sqm", result)
        self.assertNotIn("price_difference", result)

    def test_calculate_price_per_sqm_with_none_price(self):
        """Test calculate_price_per_sqm with None price."""
        result = PropertyService.calculate_price_per_sqm(None, Decimal("100.00"))  # type: ignore[arg-type]  # noqa: E501
        # Should return None when price is None (size_sqm check happens first)
        self.assertIsNone(result)

    def test_calculate_price_per_sqm_with_zero_price(self):
        """Test calculate_price_per_sqm with zero price."""
        result = PropertyService.calculate_price_per_sqm(
            Decimal("0.00"), Decimal("100.00")
        )
        self.assertEqual(result, Decimal("0.00"))

    def test_calculate_price_per_sqm_with_negative_price(self):
        """Test calculate_price_per_sqm with negative price."""
        result = PropertyService.calculate_price_per_sqm(
            Decimal("-100000.00"), Decimal("100.00")
        )
        self.assertEqual(
            result, Decimal("-1000.00")
        )  # Division still works with negative

    def test_calculate_yield_with_none_price(self):
        """Test calculate_yield with None price."""
        result = PropertyService.calculate_yield(None, Decimal("12000.00"))  # type: ignore[arg-type]  # noqa: E501
        self.assertIsNone(result)

    def test_calculate_yield_with_zero_price(self):
        """Test calculate_yield with zero price."""
        result = PropertyService.calculate_yield(Decimal("0.00"), Decimal("12000.00"))
        self.assertIsNone(result)

    def test_calculate_yield_with_negative_price(self):
        """Test calculate_yield with negative price."""
        result = PropertyService.calculate_yield(
            Decimal("-100000.00"), Decimal("12000.00")
        )
        self.assertIsNone(result)

    def test_calculate_yield_with_none_annual_rent(self):
        """Test calculate_yield with None annual_rent."""
        result = PropertyService.calculate_yield(Decimal("300000.00"), None)  # type: ignore[arg-type]  # noqa: E501
        self.assertIsNone(result)

    def test_calculate_yield_with_zero_annual_rent(self):
        """Test calculate_yield with zero annual_rent."""
        result = PropertyService.calculate_yield(Decimal("300000.00"), Decimal("0.00"))
        self.assertEqual(result, Decimal("0.00"))

    def test_normalize_coordinates_with_tuple(self):
        """Test normalize_coordinates with tuple."""
        coords = (-9.1393, 38.7223)
        result = PropertyService.normalize_coordinates(coords)
        self.assertEqual(result, [-9.1393, 38.7223])

    def test_normalize_coordinates_with_short_tuple(self):
        """Test normalize_coordinates with tuple shorter than 2 elements."""
        coords = (1,)
        result = PropertyService.normalize_coordinates(coords)
        self.assertIsNone(result)

    def test_normalize_coordinates_with_invalid_type(self):
        """Test normalize_coordinates with invalid type."""
        result = PropertyService.normalize_coordinates("invalid")
        self.assertIsNone(result)

    def test_normalize_coordinates_with_dict(self):
        """Test normalize_coordinates with dict."""
        result = PropertyService.normalize_coordinates({"lat": 38.7223, "lon": -9.1393})
        self.assertIsNone(result)

    def test_normalize_coordinates_with_empty_string(self):
        """Test normalize_coordinates with empty string."""
        result = PropertyService.normalize_coordinates("")
        self.assertIsNone(result)

    def test_normalize_coordinates_with_zero(self):
        """Test normalize_coordinates with zero."""
        result = PropertyService.normalize_coordinates(0)
        self.assertIsNone(result)

    def test_normalize_coordinates_with_false(self):
        """Test normalize_coordinates with False."""
        result = PropertyService.normalize_coordinates(False)
        self.assertIsNone(result)

    def test_compare_to_region_average_with_none_price_per_sqm(self):
        """Test compare_to_region_average when price_per_sqm is None."""
        property_obj = Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST-NO-PRICE",
            address="No Price Property",
            price=Decimal("300000.00"),
            size_sqm=Decimal("0.00"),  # Zero size makes price_per_sqm None
            property_type="apartment",
            region=self.region,
        )

        result = PropertyService.compare_to_region_average(property_obj)

        self.assertIsNone(result["property_price_per_sqm"])
        self.assertIsNotNone(result["region_avg_price_per_sqm"])
        self.assertNotIn("price_difference", result)

    def test_calculate_price_per_sqm_with_truthy_size(self):
        """Test calculate_price_per_sqm when size_sqm is truthy and > 0."""
        # This covers line 19-20: if size_sqm and size_sqm > 0
        result = PropertyService.calculate_price_per_sqm(
            Decimal("300000.00"), Decimal("100.00")
        )
        self.assertEqual(result, Decimal("3000.00"))

    def test_calculate_yield_with_all_conditions_true(self):
        """Test calculate_yield when price > 0 and annual_rent is truthy."""
        # This covers line 26-27: if price and price > 0 and annual_rent
        result = PropertyService.calculate_yield(
            Decimal("300000.00"), Decimal("12000.00")
        )
        self.assertEqual(result, Decimal("4.00"))

    def test_normalize_coordinates_with_list_branch(self):
        """Test normalize_coordinates with list (covers isinstance branch)."""
        # This covers lines 45-46
        coords = [-9.1393, 38.7223]
        result = PropertyService.normalize_coordinates(coords)
        self.assertEqual(result, [-9.1393, 38.7223])

    def test_normalize_coordinates_with_tuple_branch(self):
        """Test normalize_coordinates with tuple (covers isinstance branch)."""
        # This covers lines 45-46 with tuple
        coords = (-9.1393, 38.7223)
        result = PropertyService.normalize_coordinates(coords)
        self.assertEqual(result, [-9.1393, 38.7223])

    def test_get_properties_by_region_coverage(self):
        """Test get_properties_by_region to ensure line 53 is covered."""
        # This covers line 53
        properties = PropertyService.get_properties_by_region(self.region)
        self.assertEqual(properties.count(), 1)

    def test_get_properties_in_price_range_min_price_filter(self):
        """Test get_properties_in_price_range with min_price filter."""
        # This covers line 64
        Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST-MIN",
            address="Test Min",
            price=Decimal("200000.00"),
            size_sqm=Decimal("80.00"),
            property_type="apartment",
            region=self.region,
        )

        properties = PropertyService.get_properties_in_price_range(
            min_price=Decimal("250000.00")
        )
        self.assertEqual(properties.count(), 1)

    def test_get_properties_in_price_range_max_price_filter(self):
        """Test get_properties_in_price_range with max_price filter."""
        # This covers line 66
        Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST-MAX",
            address="Test Max",
            price=Decimal("500000.00"),
            size_sqm=Decimal("150.00"),
            property_type="house",
            region=self.region,
        )

        properties = PropertyService.get_properties_in_price_range(
            max_price=Decimal("350000.00")
        )
        self.assertEqual(properties.count(), 1)

    def test_compare_to_region_average_no_region_branch(self):
        """Test compare_to_region_average when property has no region."""
        # This covers lines 77-78
        property_no_region = Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST-NO-REGION-2",
            address="No Region",
            price=Decimal("200000.00"),
            size_sqm=Decimal("80.00"),
            property_type="apartment",
            region=None,
        )

        result = PropertyService.compare_to_region_average(property_no_region)
        self.assertEqual(result, {})

    def test_compare_to_region_average_with_both_values(self):
        """Test compare_to_region_average when both price_per_sqm and region_avg exist."""  # noqa: E501
        # This covers lines 92-97
        result = PropertyService.compare_to_region_average(self.property)

        self.assertIn("price_difference", result)
        self.assertIn("price_difference_percent", result)
        self.assertIn("is_below_average", result)
        self.assertTrue(result["is_below_average"])  # 3000 < 3500

    def test_compare_to_region_average_above_average_branch(self):
        """Test compare_to_region_average when property is above average."""
        # This covers line 97: diff < 0 (false case)
        expensive_property = Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST-ABOVE",
            address="Above Average",
            price=Decimal("500000.00"),
            size_sqm=Decimal("100.00"),  # 5000 per sqm
            property_type="apartment",
            region=self.region,  # Region avg is 3500
        )

        result = PropertyService.compare_to_region_average(expensive_property)
        self.assertFalse(result["is_below_average"])  # 5000 > 3500

    def test_compare_to_region_average_with_none_region_avg_duplicate(self):
        """Test compare_to_region_average when region avg is None."""
        region_no_avg = Region.objects.create(  # type: ignore[attr-defined]
            name="No Avg", code="NOAVG", avg_price_per_sqm=None
        )

        property_obj = Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST",
            address="Test",
            price=Decimal("300000.00"),
            size_sqm=Decimal("100.00"),
            property_type="apartment",
            region=region_no_avg,
        )

        result = PropertyService.compare_to_region_average(property_obj)

        self.assertIsNotNone(result["property_price_per_sqm"])
        self.assertIsNone(result["region_avg_price_per_sqm"])
        self.assertNotIn("price_difference", result)

    def test_compare_to_region_average_with_both_none(self):
        """Test compare_to_region_average when both price_per_sqm and region_avg are None."""  # noqa: E501
        region_no_avg = Region.objects.create(  # type: ignore[attr-defined]
            name="No Avg", code="NOAVG", avg_price_per_sqm=None
        )

        property_obj = Property.objects.create(  # type: ignore[attr-defined]
            external_id="TEST",
            address="Test",
            price=Decimal("300000.00"),
            size_sqm=Decimal("0.00"),  # Zero size
            property_type="apartment",
            region=region_no_avg,
        )

        result = PropertyService.compare_to_region_average(property_obj)

        self.assertIsNone(result["property_price_per_sqm"])
        self.assertIsNone(result["region_avg_price_per_sqm"])
        self.assertNotIn("price_difference", result)
