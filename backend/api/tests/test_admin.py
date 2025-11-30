"""
Tests for admin configurations.

This module tests all admin methods and configurations.
"""
from django.test import TestCase
from django.contrib.admin.sites import site
from django.contrib.auth import get_user_model
from decimal import Decimal
from api.models import Property, Region, SavedProperty

User = get_user_model()


class AdminTest(TestCase):
    """Test cases for admin configurations."""

    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(  # type: ignore[attr-defined]
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.region = Region.objects.create(  # type: ignore[attr-defined]
            name='Lisbon',
            code='LIS',
            avg_price_per_sqm=Decimal('3500.00'),
            avg_rent=Decimal('1200.00'),
            avg_yield=Decimal('4.10')
        )
        
        self.property = Property.objects.create(  # type: ignore[attr-defined]
            external_id='TEST-001',
            address='Test Address 123',
            price=Decimal('300000.00'),
            size_sqm=Decimal('100.00'),
            property_type='apartment',
            bedrooms=2,
            bathrooms=Decimal('1.5'),
            region=self.region
        )
        
        self.saved_property = SavedProperty.objects.create(  # type: ignore[attr-defined]
            user=self.user,
            property=self.property,
            notes='Test notes'
        )

    def test_region_admin_property_count(self):
        """Test RegionAdmin property_count method."""
        from api.admin import RegionAdmin
        
        admin = RegionAdmin(Region, site)
        count = admin.property_count(self.region)  # type: ignore[attr-defined]
        
        self.assertEqual(count, 1)

    def test_property_admin_price_per_sqm(self):
        """Test PropertyAdmin price_per_sqm method."""
        from api.admin import PropertyAdmin
        
        admin = PropertyAdmin(Property, site)
        result = admin.price_per_sqm(self.property)  # type: ignore[attr-defined]
        
        self.assertIn('€', result)
        self.assertIn('3,000', result)

    def test_property_admin_price_per_sqm_none(self):
        """Test PropertyAdmin price_per_sqm with None value."""
        from api.admin import PropertyAdmin
        
        # Create property with zero size
        prop = Property.objects.create(  # type: ignore[attr-defined]
            external_id='TEST-NONE',
            address='Test None',
            price=Decimal('300000.00'),
            size_sqm=Decimal('0.00'),
            property_type='apartment',
            region=self.region
        )
        
        admin = PropertyAdmin(Property, site)
        result = admin.price_per_sqm(prop)  # type: ignore[attr-defined]
        
        self.assertEqual(result, '-')

    def test_property_admin_saved_count(self):
        """Test PropertyAdmin saved_count method."""
        from api.admin import PropertyAdmin
        
        admin = PropertyAdmin(Property, site)
        count = admin.saved_count(self.property)  # type: ignore[attr-defined]
        
        self.assertEqual(count, 1)

    def test_saved_property_admin_property_price(self):
        """Test SavedPropertyAdmin property_price method."""
        from api.admin import SavedPropertyAdmin
        
        admin = SavedPropertyAdmin(SavedProperty, site)
        result = admin.property_price(self.saved_property)  # type: ignore[attr-defined]
        
        self.assertIn('€', result)
        self.assertIn('300,000', result)

    def test_saved_property_admin_property_region(self):
        """Test SavedPropertyAdmin property_region method."""
        from api.admin import SavedPropertyAdmin
        
        admin = SavedPropertyAdmin(SavedProperty, site)
        result = admin.property_region(self.saved_property)  # type: ignore[attr-defined]
        
        self.assertEqual(result, self.region)

    def test_saved_property_admin_has_notes_with_notes(self):
        """Test SavedPropertyAdmin has_notes method with notes."""
        from api.admin import SavedPropertyAdmin
        
        admin = SavedPropertyAdmin(SavedProperty, site)
        result = admin.has_notes(self.saved_property)  # type: ignore[attr-defined]
        
        self.assertTrue(result)

    def test_saved_property_admin_has_notes_without_notes(self):
        """Test SavedPropertyAdmin has_notes method without notes."""
        from api.admin import SavedPropertyAdmin
        
        # Use existing saved_property and update notes to empty
        self.saved_property.notes = ''
        self.saved_property.save()
        
        admin = SavedPropertyAdmin(SavedProperty, site)
        result = admin.has_notes(self.saved_property)  # type: ignore[attr-defined]
        
        self.assertFalse(result)

    def test_property_admin_price_per_sqm_formatting(self):
        """Test PropertyAdmin price_per_sqm formatting to cover all lines."""
        from api.admin import PropertyAdmin
        
        # Test with valid price_per_sqm
        admin = PropertyAdmin(Property, site)
        result = admin.price_per_sqm(self.property)  # type: ignore[attr-defined]
        self.assertIn('€', result)
        
        # Test with None (zero size) - covers line 79-82
        prop_zero = Property.objects.create(  # type: ignore[attr-defined]
            external_id='TEST-ZERO',
            address='Zero Size',
            price=Decimal('300000.00'),
            size_sqm=Decimal('0.00'),
            property_type='apartment',
            region=self.region
        )
        result = admin.price_per_sqm(prop_zero)  # type: ignore[attr-defined]
        self.assertEqual(result, '-')

    def test_property_admin_saved_count_coverage(self):
        """Test PropertyAdmin saved_count to cover line 88."""
        from api.admin import PropertyAdmin
        
        admin = PropertyAdmin(Property, site)
        count = admin.saved_count(self.property)  # type: ignore[attr-defined]
        self.assertEqual(count, 1)

    def test_saved_property_admin_property_price_coverage(self):
        """Test SavedPropertyAdmin property_price to cover line 118."""
        from api.admin import SavedPropertyAdmin
        
        admin = SavedPropertyAdmin(SavedProperty, site)
        result = admin.property_price(self.saved_property)  # type: ignore[attr-defined]
        self.assertIn('€', result)

    def test_saved_property_admin_property_region_coverage(self):
        """Test SavedPropertyAdmin property_region to cover line 124."""
        from api.admin import SavedPropertyAdmin
        
        admin = SavedPropertyAdmin(SavedProperty, site)
        result = admin.property_region(self.saved_property)  # type: ignore[attr-defined]
        self.assertEqual(result, self.region)

    def test_region_admin_property_count_coverage(self):
        """Test RegionAdmin property_count to cover line 19."""
        from api.admin import RegionAdmin
        
        admin = RegionAdmin(Region, site)
        count = admin.property_count(self.region)  # type: ignore[attr-defined]
        self.assertEqual(count, 1)

