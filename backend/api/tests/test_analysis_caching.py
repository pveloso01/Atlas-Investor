"""
Tests for investment analysis service caching functionality.
"""

from decimal import Decimal
from unittest.mock import patch, MagicMock

from django.test import TestCase, override_settings
from django.core.cache import cache

from api.models import Region, Property
from api.services.analysis_service import (
    InvestmentAnalysisService,
    AnalysisParams,
    ANALYSIS_CACHE_TTL,
)


class TestAnalysisCaching(TestCase):
    """Tests for analysis service caching."""

    def setUp(self):
        """Set up test data."""
        self.region = Region.objects.create(
            name="Test Region",
            code="TST",
            avg_price_per_sqm=Decimal("5000"),
            avg_rent=Decimal("1200"),
            avg_yield=Decimal("5.0"),
        )
        self.property = Property.objects.create(
            address="Test Address 123",
            property_type="apartment",
            price=Decimal("300000"),
            size_sqm=Decimal("100"),
            bedrooms=2,
            bathrooms=1,
            region=self.region,
        )
        self.service = InvestmentAnalysisService()
        # Clear cache before each test
        cache.clear()

    def tearDown(self):
        """Clean up after tests."""
        cache.clear()

    def test_analysis_uses_cache_by_default(self):
        """Test that analysis results are cached."""
        # First call should calculate
        result1 = self.service.analyze_property(self.property)
        
        # Second call should return cached result
        result2 = self.service.analyze_property(self.property)
        
        # Results should be identical
        self.assertEqual(result1.gross_yield, result2.gross_yield)
        self.assertEqual(result1.net_yield, result2.net_yield)

    def test_cache_key_includes_property_id(self):
        """Test that cache key includes property ID."""
        params = AnalysisParams()
        cache_key = self.service._get_cache_key(self.property.id, params)
        
        self.assertIn(str(self.property.id), cache_key)
        self.assertTrue(cache_key.startswith("analysis:"))

    def test_cache_key_varies_with_params(self):
        """Test that different params produce different cache keys."""
        params1 = AnalysisParams(monthly_rent=Decimal("1000"))
        params2 = AnalysisParams(monthly_rent=Decimal("1500"))
        
        key1 = self.service._get_cache_key(self.property.id, params1)
        key2 = self.service._get_cache_key(self.property.id, params2)
        
        self.assertNotEqual(key1, key2)

    @patch('api.services.analysis_service.cache')
    def test_bypass_cache_when_disabled(self, mock_cache):
        """Test that cache can be bypassed."""
        mock_cache.get.return_value = None
        
        # Call without cache
        result = self.service.analyze_property(self.property, use_cache=False)
        
        # Result should exist
        self.assertIsNotNone(result)
        
        # Cache.set should not have been called
        mock_cache.set.assert_not_called()

    @patch('api.services.analysis_service.cache')
    def test_cache_stores_result_object(self, mock_cache):
        """Test that full AnalysisResult is cached."""
        mock_cache.get.return_value = None
        
        # Analyze
        result = self.service.analyze_property(self.property)
        
        # Verify cache.set was called with the result
        mock_cache.set.assert_called_once()
        call_args = mock_cache.set.call_args
        cached_key = call_args[0][0]
        cached_result = call_args[0][1]
        
        self.assertIn(str(self.property.id), cached_key)
        self.assertEqual(cached_result.gross_yield, result.gross_yield)
        self.assertEqual(cached_result.net_yield, result.net_yield)

    def test_cache_ttl_from_settings(self):
        """Test that cache TTL is loaded from settings."""
        # ANALYSIS_CACHE_TTL should be 300 (5 minutes) from settings
        self.assertEqual(ANALYSIS_CACHE_TTL, 300)

    @patch('api.services.analysis_service.cache')
    def test_graceful_cache_failure_on_get(self, mock_cache):
        """Test that analysis works when cache get fails."""
        mock_cache.get.side_effect = Exception("Redis connection error")
        mock_cache.set = MagicMock()
        
        # Should not raise exception
        result = self.service.analyze_property(self.property)
        
        self.assertIsNotNone(result)
        self.assertIsInstance(result.gross_yield, Decimal)

    @patch('api.services.analysis_service.cache')
    def test_graceful_cache_failure_on_set(self, mock_cache):
        """Test that analysis works when cache set fails."""
        mock_cache.get.return_value = None
        mock_cache.set.side_effect = Exception("Redis connection error")
        
        # Should not raise exception
        result = self.service.analyze_property(self.property)
        
        self.assertIsNotNone(result)

    def test_different_properties_different_cache_keys(self):
        """Test that different properties have different cache keys."""
        property2 = Property.objects.create(
            address="Another Address",
            property_type="house",
            price=Decimal("500000"),
            size_sqm=Decimal("150"),
            region=self.region,
        )
        
        params = AnalysisParams()
        
        key1 = self.service._get_cache_key(self.property.id, params)
        key2 = self.service._get_cache_key(property2.id, params)
        
        self.assertNotEqual(key1, key2)

    def test_cache_key_consistency(self):
        """Test that same inputs produce same cache key."""
        params = AnalysisParams(
            monthly_rent=Decimal("1200"),
            mortgage_rate=Decimal("0.04"),
        )
        
        key1 = self.service._get_cache_key(self.property.id, params)
        key2 = self.service._get_cache_key(self.property.id, params)
        
        self.assertEqual(key1, key2)


class TestCacheInvalidation(TestCase):
    """Tests for cache invalidation."""

    def setUp(self):
        """Set up test data."""
        self.region = Region.objects.create(
            name="Test Region",
            code="TST2",
            avg_price_per_sqm=Decimal("5000"),
        )
        self.property = Property.objects.create(
            address="Test Address",
            property_type="apartment",
            price=Decimal("250000"),
            size_sqm=Decimal("80"),
            region=self.region,
        )
        self.service = InvestmentAnalysisService()
        cache.clear()

    def tearDown(self):
        """Clean up after tests."""
        cache.clear()

    @patch('api.services.analysis_service.cache')
    def test_invalidate_cache_calls_delete_pattern(self, mock_cache):
        """Test that invalidate_cache calls delete_pattern."""
        mock_cache.delete_pattern = MagicMock()
        
        self.service.invalidate_cache(self.property.id)
        
        mock_cache.delete_pattern.assert_called_once()
        call_args = mock_cache.delete_pattern.call_args[0][0]
        self.assertIn(str(self.property.id), call_args)

    @patch('api.services.analysis_service.cache')
    def test_invalidate_cache_handles_failure(self, mock_cache):
        """Test that invalidate_cache handles failures gracefully."""
        mock_cache.delete_pattern.side_effect = Exception("Redis error")
        
        # Should return False, not raise
        result = self.service.invalidate_cache(self.property.id)
        
        self.assertFalse(result)


class TestCacheStats(TestCase):
    """Tests for cache statistics."""

    def setUp(self):
        """Set up service."""
        self.service = InvestmentAnalysisService()

    @patch('api.services.analysis_service.cache')
    def test_get_cache_stats_returns_info(self, mock_cache):
        """Test that get_cache_stats returns Redis info."""
        mock_client = MagicMock()
        mock_client.info.return_value = {
            "used_memory_human": "1M",
            "connected_clients": 5,
            "keyspace_hits": 100,
            "keyspace_misses": 20,
        }
        mock_cache.client.get_client.return_value = mock_client
        
        stats = self.service.get_cache_stats()
        
        self.assertTrue(stats["connected"])
        self.assertEqual(stats["used_memory"], "1M")
        self.assertEqual(stats["connected_clients"], 5)

    @patch('api.services.analysis_service.cache')
    def test_get_cache_stats_handles_failure(self, mock_cache):
        """Test that get_cache_stats handles failures gracefully."""
        mock_cache.client.get_client.side_effect = Exception("Connection failed")
        
        stats = self.service.get_cache_stats()
        
        self.assertFalse(stats["connected"])
        self.assertIn("error", stats)

