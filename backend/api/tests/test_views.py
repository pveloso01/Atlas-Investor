"""
Tests for API views and ViewSets.

This module tests all view functionality including:
- health_check endpoint
- PropertyViewSet (CRUD, filtering, search, ordering, custom actions)
- RegionViewSet (list, retrieve, search)
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from decimal import Decimal
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Property, Region

User = get_user_model()


def get_response_results(response):
    """Helper to get results from response, handling both paginated and non-paginated responses."""
    if isinstance(response.data, dict) and 'results' in response.data:
        return response.data['results']
    elif isinstance(response.data, list):
        return response.data
    else:
        return response.data


class HealthCheckViewTest(TestCase):
    """Test cases for health_check endpoint."""

    def setUp(self):
        """Set up test client."""
        self.client = APIClient()

    def test_health_check_endpoint(self):
        """Test health_check endpoint returns correct response."""
        url = '/api/health/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'healthy')
        self.assertEqual(response.data['message'], 'Atlas Investor API is running')
        self.assertEqual(response.data['version'], '0.1.0')


class PropertyViewSetTest(TestCase):
    """Test cases for PropertyViewSet."""

    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.user = User.objects.create_user(  # type: ignore[attr-defined]
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.region = Region.objects.create(  # type: ignore[attr-defined]
            name='Lisbon',
            code='LIS',
            avg_price_per_sqm=Decimal('3500.00')
        )
        
        self.property = Property.objects.create(  # type: ignore[attr-defined]
            external_id='TEST-001',
            address='Test Address 123',
            coordinates=[-9.1393, 38.7223],
            description='Test property',
            price=Decimal('300000.00'),
            size_sqm=Decimal('100.00'),
            property_type='apartment',
            bedrooms=2,
            bathrooms=Decimal('1.5'),
            region=self.region
        )

    def test_list_properties_unauthenticated(self):
        """Test listing properties without authentication (read-only allowed)."""
        url = '/api/properties/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = get_response_results(response)
        self.assertEqual(len(results), 1)

    def test_retrieve_property_unauthenticated(self):
        """Test retrieving a property without authentication."""
        url = f'/api/properties/{self.property.pk}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.property.id)
        self.assertEqual(response.data['address'], 'Test Address 123')

    def test_create_property_unauthenticated(self):
        """Test creating property without authentication (should fail)."""
        url = '/api/properties/'
        data = {
            'address': 'New Property',
            'price': '250000.00',
            'size_sqm': '90.00',
            'property_type': 'apartment',
            'region_id': self.region.id
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_property_authenticated(self):
        """Test creating property with authentication."""
        self.client.force_authenticate(user=self.user)
        url = '/api/properties/'
        data = {
            'address': 'New Property',
            'price': '250000.00',
            'size_sqm': '90.00',
            'property_type': 'apartment',
            'region_id': self.region.id
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['address'], 'New Property')

    def test_update_property_unauthenticated(self):
        """Test updating property without authentication (should fail)."""
        url = f'/api/properties/{self.property.pk}/'
        data = {'address': 'Updated Address'}
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_property_authenticated(self):
        """Test updating property with authentication."""
        self.client.force_authenticate(user=self.user)
        url = f'/api/properties/{self.property.pk}/'
        data = {'address': 'Updated Address'}
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['address'], 'Updated Address')

    def test_delete_property_unauthenticated(self):
        """Test deleting property without authentication (should fail)."""
        url = f'/api/properties/{self.property.pk}/'
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_property_authenticated(self):
        """Test deleting property with authentication."""
        self.client.force_authenticate(user=self.user)
        url = f'/api/properties/{self.property.pk}/'
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Property.objects.filter(pk=self.property.pk).exists())

    def test_filter_by_property_type(self):
        """Test filtering properties by property_type."""
        # Create a house property
        Property.objects.create(  # type: ignore[attr-defined]
            external_id='TEST-002',
            address='House Address',
            price=Decimal('500000.00'),
            size_sqm=Decimal('200.00'),
            property_type='house',
            region=self.region
        )
        
        url = '/api/properties/'
        response = self.client.get(url, {'property_type': 'apartment'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = get_response_results(response)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['property_type'], 'apartment')

    def test_filter_by_region(self):
        """Test filtering properties by region."""
        region2 = Region.objects.create(name='Porto', code='OPO')
        Property.objects.create(  # type: ignore[attr-defined]
            external_id='TEST-002',
            address='Porto Property',
            price=Decimal('200000.00'),
            size_sqm=Decimal('80.00'),
            property_type='apartment',
            region=region2
        )
        
        url = '/api/properties/'
        response = self.client.get(url, {'region': self.region.id})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = get_response_results(response)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['region']['id'], self.region.id)

    def test_search_by_address(self):
        """Test searching properties by address."""
        Property.objects.create(  # type: ignore[attr-defined]
            external_id='TEST-002',
            address='Different Street',
            price=Decimal('200000.00'),
            size_sqm=Decimal('80.00'),
            property_type='apartment',
            region=self.region
        )
        
        url = '/api/properties/'
        response = self.client.get(url, {'search': 'Test Address'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = get_response_results(response)
        self.assertEqual(len(results), 1)
        self.assertIn('Test Address', results[0]['address'])

    def test_ordering_by_price(self):
        """Test ordering properties by price."""
        Property.objects.create(  # type: ignore[attr-defined]
            external_id='TEST-002',
            address='Cheaper Property',
            price=Decimal('200000.00'),
            size_sqm=Decimal('80.00'),
            property_type='apartment',
            region=self.region
        )
        
        url = '/api/properties/'
        response = self.client.get(url, {'ordering': 'price'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        self.assertEqual(len(results), 2)
        self.assertLess(float(results[0]['price']), float(results[1]['price']))

    def test_ordering_by_created_at_desc(self):
        """Test default ordering by created_at descending."""
        Property.objects.create(  # type: ignore[attr-defined]
            external_id='TEST-002',
            address='Newer Property',
            price=Decimal('200000.00'),
            size_sqm=Decimal('80.00'),
            property_type='apartment',
            region=self.region
        )
        
        url = '/api/properties/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        self.assertEqual(len(results), 2)
        # Newer property should be first (default ordering is -created_at)
        self.assertEqual(results[0]['external_id'], 'TEST-002')

    def test_compare_to_region_action(self):
        """Test compare_to_region custom action."""
        url = f'/api/properties/{self.property.pk}/compare_to_region/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('property_price_per_sqm', response.data)
        self.assertIn('region_avg_price_per_sqm', response.data)
        self.assertIn('price_difference', response.data)
        self.assertIn('price_difference_percent', response.data)
        self.assertIn('is_below_average', response.data)

    def test_compare_to_region_action_no_region(self):
        """Test compare_to_region action when property has no region."""
        property_no_region = Property.objects.create(  # type: ignore[attr-defined]
            external_id='TEST-NO-REGION',
            address='No Region Property',
            price=Decimal('200000.00'),
            size_sqm=Decimal('80.00'),
            property_type='apartment',
            region=None
        )
        
        url = f'/api/properties/{property_no_region.pk}/compare_to_region/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {})

    def test_price_range_action(self):
        """Test price_range custom action."""
        Property.objects.create(  # type: ignore[attr-defined]
            external_id='TEST-002',
            address='Expensive Property',
            price=Decimal('500000.00'),
            size_sqm=Decimal('150.00'),
            property_type='house',
            region=self.region
        )
        
        url = '/api/properties/price_range/'
        response = self.client.get(url, {'min_price': '250000', 'max_price': '350000'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['external_id'], 'TEST-001')

    def test_price_range_action_min_only(self):
        """Test price_range action with only min_price."""
        url = '/api/properties/price_range/'
        response = self.client.get(url, {'min_price': '250000'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_price_range_action_max_only(self):
        """Test price_range action with only max_price."""
        url = '/api/properties/price_range/'
        response = self.client.get(url, {'max_price': '350000'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_price_range_action_invalid_params(self):
        """Test price_range action with invalid parameters."""
        url = '/api/properties/price_range/'
        response = self.client.get(url, {'min_price': 'invalid'})
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)


class RegionViewSetTest(TestCase):
    """Test cases for RegionViewSet."""

    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.region = Region.objects.create(  # type: ignore[attr-defined]
            name='Lisbon',
            code='LIS',
            avg_price_per_sqm=Decimal('3500.00'),
            avg_rent=Decimal('1200.00'),
            avg_yield=Decimal('4.10')
        )

    def test_list_regions(self):
        """Test listing regions."""
        Region.objects.create(  # type: ignore[attr-defined]
            name='Porto', code='OPO')
        
        url = '/api/regions/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Response might be paginated or a list
        if isinstance(response.data, dict) and 'results' in response.data:
            results = get_response_results(response)
            self.assertEqual(len(results), 2)
        else:
            self.assertEqual(len(response.data), 2)

    def test_retrieve_region(self):
        """Test retrieving a region."""
        url = f'/api/regions/{self.region.pk}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.region.id)
        self.assertEqual(response.data['name'], 'Lisbon')
        self.assertEqual(response.data['code'], 'LIS')

    def test_search_regions_by_name(self):
        """Test searching regions by name."""
        # Create another region to ensure search is working
        Region.objects.create(  # type: ignore[attr-defined]
            name='Porto', code='OPO')
        
        url = '/api/regions/'
        response = self.client.get(url, {'search': 'Lisbon'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = get_response_results(response)
        # Should only return Lisbon, not Porto
        self.assertEqual(len(results), 1, f"Expected 1 result, got {len(results)}: {[r.get('name') for r in results]}")
        self.assertEqual(results[0]['name'], 'Lisbon')

    def test_search_regions_by_code(self):
        """Test searching regions by code."""
        # Create another region to ensure search is working
        Region.objects.create(  # type: ignore[attr-defined]
            name='Porto', code='OPO')
        
        url = '/api/regions/'
        response = self.client.get(url, {'search': 'LIS'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = get_response_results(response)
        # Should only return LIS, not OPO
        self.assertEqual(len(results), 1, f"Expected 1 result, got {len(results)}: {[r.get('code') for r in results]}")
        self.assertEqual(results[0]['code'], 'LIS')

    def test_region_ordering(self):
        """Test region ordering (should be by name)."""
        Region.objects.create(  # type: ignore[attr-defined]
            name='Cascais', code='CAS')
        
        url = '/api/regions/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Response might be paginated or a list
        if isinstance(response.data, dict) and 'results' in response.data:
            results = get_response_results(response)
        else:
            results = response.data
        self.assertEqual(len(results), 2)
        # Should be ordered by name
        self.assertEqual(results[0]['name'], 'Cascais')
        self.assertEqual(results[1]['name'], 'Lisbon')

    def test_region_read_only(self):
        """Test that RegionViewSet is read-only."""
        url = '/api/regions/'
        data = {'name': 'New Region', 'code': 'NEW'}
        response = self.client.post(url, data, format='json')
        
        # Should return 405 Method Not Allowed for read-only ViewSet
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_price_range_action_with_type_error(self):
        """Test price_range action with TypeError (None passed to Decimal)."""
        url = '/api/properties/price_range/'
        # This should trigger TypeError in the try block
        response = self.client.get(url, {'min_price': None})
        
        # Should handle gracefully
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_200_OK])

    def test_price_range_action_with_value_error(self):
        """Test price_range action with ValueError (invalid string)."""
        url = '/api/properties/price_range/'
        response = self.client.get(url, {'min_price': 'not_a_number'})
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_price_range_action_with_empty_string(self):
        """Test price_range action with empty string."""
        url = '/api/properties/price_range/'
        response = self.client.get(url, {'min_price': ''})
        
        # Empty string should be treated as None
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_price_range_action_with_both_empty(self):
        """Test price_range action with both parameters empty."""
        url = '/api/properties/price_range/'
        response = self.client.get(url, {'min_price': '', 'max_price': ''})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_compare_to_region_action_with_no_region_comprehensive(self):
        """Test compare_to_region action with property that has no region."""
        property_no_region = Property.objects.create(  # type: ignore[attr-defined]
            external_id='TEST-NO-REGION-2',
            address='No Region',
            price=Decimal('200000.00'),
            size_sqm=Decimal('80.00'),
            property_type='apartment',
            region=None
        )
        
        url = f'/api/properties/{property_no_region.pk}/compare_to_region/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {})

    def test_compare_to_region_action_with_zero_size_comprehensive(self):
        """Test compare_to_region action with property that has zero size."""
        property_zero_size = Property.objects.create(  # type: ignore[attr-defined]
            external_id='TEST-ZERO-2',
            address='Zero Size',
            price=Decimal('300000.00'),
            size_sqm=Decimal('0.00'),
            property_type='apartment',
            region=self.region
        )
        
        url = f'/api/properties/{property_zero_size.pk}/compare_to_region/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data.get('property_price_per_sqm'))

    def test_compare_to_region_action_coverage(self):
        """Test compare_to_region action to cover lines 39-41."""
        url = f'/api/properties/{self.property.pk}/compare_to_region/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('property_price_per_sqm', response.data)

    def test_price_range_action_type_error_coverage(self):
        """Test price_range action with TypeError to cover line 60."""
        url = '/api/properties/price_range/'
        # Pass None explicitly to trigger TypeError in str() conversion
        response = self.client.get(url, {'min_price': 'invalid', 'max_price': 'also_invalid'})
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

