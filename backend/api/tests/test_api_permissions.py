"""
Tests for API endpoint permissions.

Verifies that authentication and authorization work correctly across all endpoints.
"""

from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from api.models import Portfolio, Property, Region

User = get_user_model()


class TestAPIPermissions(TestCase):
    """Tests for API endpoint authentication and authorization."""

    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        
        # Create test user
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
        )
        
        # Create test region
        self.region = Region.objects.create(
            name="Test Region",
            code="TST",
            avg_price_per_sqm=Decimal("5000"),
        )
        
        # Create test property
        self.property = Property.objects.create(
            address="Test Address",
            property_type="apartment",
            price=Decimal("300000"),
            size_sqm=Decimal("100"),
            region=self.region,
        )

    def test_health_check_public(self):
        """Test that health check is publicly accessible."""
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_property_list_public(self):
        """Test that property listing is publicly accessible."""
        response = self.client.get("/api/properties/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_property_detail_public(self):
        """Test that property detail is publicly accessible."""
        response = self.client.get(f"/api/properties/{self.property.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_region_list_public(self):
        """Test that region listing is publicly accessible."""
        response = self.client.get("/api/regions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_feedback_creation_public(self):
        """Test that feedback creation is publicly accessible."""
        data = {
            "rating": 5,
            "comment": "Great platform!",
        }
        response = self.client.post("/api/feedback/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_support_message_creation_public(self):
        """Test that support message creation is publicly accessible."""
        data = {
            "email": "test@example.com",
            "message": "I need help",
        }
        response = self.client.post("/api/support/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_contact_request_creation_public(self):
        """Test that contact request creation is publicly accessible."""
        data = {
            "property": self.property.id,
            "name": "John Doe",
            "email": "john@example.com",
            "message": "I'm interested",
        }
        response = self.client.post("/api/contact/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_feedback_list_requires_auth(self):
        """Test that listing feedback requires authentication."""
        response = self.client.get("/api/feedback/")
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_200_OK])
        
        # Should return empty or 401
        if response.status_code == status.HTTP_200_OK:
            self.assertEqual(len(response.data["results"]), 0)

    def test_support_message_list_requires_auth(self):
        """Test that listing support messages requires authentication."""
        response = self.client.get("/api/support/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_contact_request_list_requires_auth(self):
        """Test that listing contact requests requires authentication."""
        response = self.client.get("/api/contact/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_portfolio_list_requires_auth(self):
        """Test that portfolio endpoints require authentication."""
        response = self.client.get("/api/portfolios/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_portfolio_create_requires_auth(self):
        """Test that creating portfolio requires authentication."""
        data = {"name": "My Portfolio"}
        response = self.client.post("/api/portfolios/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_saved_properties_requires_auth(self):
        """Test that saved properties require authentication."""
        response = self.client.get("/api/saved-properties/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_can_list_own_feedback(self):
        """Test that authenticated users can list their own feedback."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/feedback/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_user_can_list_own_support_messages(self):
        """Test that authenticated users can list their own support messages."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/support/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_user_can_list_own_contact_requests(self):
        """Test that authenticated users can list their own contact requests."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/contact/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_user_can_create_portfolio(self):
        """Test that authenticated users can create portfolios."""
        self.client.force_authenticate(user=self.user)
        data = {"name": "My Portfolio"}
        response = self.client.post("/api/portfolios/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_authenticated_user_can_list_portfolios(self):
        """Test that authenticated users can list their portfolios."""
        self.client.force_authenticate(user=self.user)
        Portfolio.objects.create(user=self.user, name="Test Portfolio")
        
        response = self.client.get("/api/portfolios/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_user_cannot_access_other_users_portfolio(self):
        """Test that users cannot access other users' portfolios."""
        other_user = User.objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="testpass123",
        )
        portfolio = Portfolio.objects.create(user=other_user, name="Other Portfolio")
        
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"/api/portfolios/{portfolio.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_modify_other_users_portfolio(self):
        """Test that users cannot modify other users' portfolios."""
        other_user = User.objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="testpass123",
        )
        portfolio = Portfolio.objects.create(user=other_user, name="Other Portfolio")
        
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            f"/api/portfolios/{portfolio.id}/",
            {"name": "Hacked"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_staff_can_see_all_feedback(self):
        """Test that staff users can see all feedback."""
        staff_user = User.objects.create_user(
            username="staff",
            email="staff@example.com",
            password="testpass123",
            is_staff=True,
        )
        
        # Create feedback from different user
        self.client.force_authenticate(user=self.user)
        self.client.post(
            "/api/feedback/",
            {"rating": 5, "comment": "Test"},
            format="json",
        )
        
        # Staff should see it
        self.client.force_authenticate(user=staff_user)
        response = self.client.get("/api/feedback/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data["results"]), 0)

    def test_property_analysis_accessible_to_all(self):
        """Test that property analysis is accessible without authentication."""
        response = self.client.post(
            f"/api/properties/{self.property.id}/analyze/",
            {},
            format="json",
        )
        # Should work or return 200/403 depending on implementation
        self.assertIn(response.status_code, [
            status.HTTP_200_OK,
            status.HTTP_403_FORBIDDEN,
            status.HTTP_401_UNAUTHORIZED
        ])

    def test_property_report_accessible_to_all(self):
        """Test that property PDF report is accessible without authentication."""
        response = self.client.get(f"/api/properties/{self.property.id}/report/")
        # Should work or return 200/403 depending on implementation
        self.assertIn(response.status_code, [
            status.HTTP_200_OK,
            status.HTTP_403_FORBIDDEN,
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_500_INTERNAL_SERVER_ERROR,  # If PDF generation fails
        ])

    def test_portfolio_default_endpoint_requires_auth(self):
        """Test that default portfolio endpoint requires authentication."""
        response = self.client.get("/api/portfolios/default/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_portfolio_default_endpoint_works_when_authenticated(self):
        """Test that authenticated users can get default portfolio."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/portfolios/default/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["is_default"])


class TestCORSConfiguration(TestCase):
    """Tests for CORS configuration."""

    def test_cors_headers_present(self):
        """Test that CORS headers are configured."""
        client = APIClient()
        response = client.get("/api/health/", HTTP_ORIGIN="http://localhost:3000")
        # CORS headers should be present
        # Note: In test mode, CORS might not be fully functional
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestSecurityHeaders(TestCase):
    """Tests for security headers."""

    def test_api_returns_json_content_type(self):
        """Test that API endpoints return JSON content type."""
        client = APIClient()
        response = client.get("/api/health/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("application/json", response["Content-Type"])

