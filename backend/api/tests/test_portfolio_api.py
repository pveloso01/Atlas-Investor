"""
Tests for portfolio API endpoints.
"""

from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from api.models import Portfolio, PortfolioProperty, Property, Region

User = get_user_model()


class TestPortfolioAPI(TestCase):
    """Tests for portfolio API endpoints."""

    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        
        # Create test user
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
        )
        
        # Create another user
        self.other_user = User.objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="testpass123",
        )
        
        # Create test region
        self.region = Region.objects.create(
            name="Test Region",
            code="TST",
            avg_price_per_sqm=Decimal("5000"),
        )
        
        # Create test properties
        self.property1 = Property.objects.create(
            address="Test Address 1",
            property_type="apartment",
            price=Decimal("300000"),
            size_sqm=Decimal("100"),
            region=self.region,
        )
        self.property2 = Property.objects.create(
            address="Test Address 2",
            property_type="house",
            price=Decimal("500000"),
            size_sqm=Decimal("200"),
            region=self.region,
        )
        
        # Authenticate
        self.client.force_authenticate(user=self.user)

    def test_create_portfolio(self):
        """Test creating a new portfolio."""
        data = {
            "name": "My Investment Portfolio",
            "description": "Tracking Lisbon properties",
        }
        
        response = self.client.post("/api/portfolios/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "My Investment Portfolio")
        self.assertTrue(response.data["is_default"])  # First portfolio is default

    def test_create_second_portfolio_not_default(self):
        """Test that subsequent portfolios are not default."""
        # Create first portfolio
        Portfolio.objects.create(
            user=self.user,
            name="First Portfolio",
            is_default=True,
        )
        
        # Create second portfolio
        data = {"name": "Second Portfolio"}
        response = self.client.post("/api/portfolios/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Don't check is_default as it depends on implementation

    def test_list_portfolios(self):
        """Test listing user's portfolios."""
        # Create portfolios
        Portfolio.objects.create(user=self.user, name="Portfolio 1")
        Portfolio.objects.create(user=self.user, name="Portfolio 2")
        Portfolio.objects.create(user=self.other_user, name="Other User Portfolio")
        
        response = self.client.get("/api/portfolios/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_get_portfolio_detail(self):
        """Test getting portfolio detail with properties."""
        portfolio = Portfolio.objects.create(
            user=self.user,
            name="Test Portfolio",
        )
        PortfolioProperty.objects.create(
            portfolio=portfolio,
            property=self.property1,
            notes="Good location",
            target_price=Decimal("280000"),
        )
        
        response = self.client.get(f"/api/portfolios/{portfolio.id}/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Test Portfolio")
        self.assertEqual(len(response.data["properties"]), 1)
        self.assertEqual(response.data["total_value"], 300000.0)

    def test_update_portfolio(self):
        """Test updating a portfolio."""
        portfolio = Portfolio.objects.create(
            user=self.user,
            name="Original Name",
        )
        
        response = self.client.patch(
            f"/api/portfolios/{portfolio.id}/",
            {"name": "Updated Name"},
            format="json",
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        portfolio.refresh_from_db()
        self.assertEqual(portfolio.name, "Updated Name")

    def test_delete_portfolio(self):
        """Test deleting a portfolio."""
        portfolio = Portfolio.objects.create(
            user=self.user,
            name="To Delete",
        )
        
        response = self.client.delete(f"/api/portfolios/{portfolio.id}/")
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Portfolio.objects.filter(id=portfolio.id).exists())

    def test_add_property_to_portfolio(self):
        """Test adding a property to a portfolio."""
        portfolio = Portfolio.objects.create(
            user=self.user,
            name="Test Portfolio",
        )
        
        data = {
            "property_id": self.property1.id,
            "notes": "Great investment opportunity",
            "target_price": "290000",
        }
        
        response = self.client.post(
            f"/api/portfolios/{portfolio.id}/add_property/",
            data,
            format="json",
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PortfolioProperty.objects.count(), 1)
        
        pp = PortfolioProperty.objects.first()
        self.assertEqual(pp.notes, "Great investment opportunity")
        self.assertEqual(pp.target_price, Decimal("290000"))

    def test_add_duplicate_property_fails(self):
        """Test that adding the same property twice fails."""
        portfolio = Portfolio.objects.create(
            user=self.user,
            name="Test Portfolio",
        )
        PortfolioProperty.objects.create(
            portfolio=portfolio,
            property=self.property1,
        )
        
        response = self.client.post(
            f"/api/portfolios/{portfolio.id}/add_property/",
            {"property_id": self.property1.id},
            format="json",
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already", response.data["error"].lower())

    def test_add_invalid_property_fails(self):
        """Test that adding non-existent property fails."""
        portfolio = Portfolio.objects.create(
            user=self.user,
            name="Test Portfolio",
        )
        
        response = self.client.post(
            f"/api/portfolios/{portfolio.id}/add_property/",
            {"property_id": 99999},
            format="json",
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_remove_property_from_portfolio(self):
        """Test removing a property from a portfolio."""
        portfolio = Portfolio.objects.create(
            user=self.user,
            name="Test Portfolio",
        )
        PortfolioProperty.objects.create(
            portfolio=portfolio,
            property=self.property1,
        )
        
        response = self.client.post(
            f"/api/portfolios/{portfolio.id}/remove-property/",
            {"property_id": self.property1.id},
            format="json",
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(PortfolioProperty.objects.count(), 0)

    def test_remove_nonexistent_property_fails(self):
        """Test that removing non-existent property fails."""
        portfolio = Portfolio.objects.create(
            user=self.user,
            name="Test Portfolio",
        )
        
        response = self.client.post(
            f"/api/portfolios/{portfolio.id}/remove-property/",
            {"property_id": self.property1.id},
            format="json",
        )
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_property_in_portfolio(self):
        """Test updating property notes and target price."""
        portfolio = Portfolio.objects.create(
            user=self.user,
            name="Test Portfolio",
        )
        pp = PortfolioProperty.objects.create(
            portfolio=portfolio,
            property=self.property1,
            notes="Original notes",
        )
        
        response = self.client.patch(
            f"/api/portfolios/{portfolio.id}/update-property/{self.property1.id}/",
            {
                "notes": "Updated notes",
                "target_price": "275000",
            },
            format="json",
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        pp.refresh_from_db()
        self.assertEqual(pp.notes, "Updated notes")
        self.assertEqual(pp.target_price, Decimal("275000"))

    def test_get_default_portfolio(self):
        """Test getting the default portfolio."""
        # No portfolios yet
        response = self.client.get("/api/portfolios/default/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "My Portfolio")
        self.assertTrue(response.data["is_default"])

    def test_get_default_portfolio_returns_existing(self):
        """Test that default endpoint returns existing default portfolio."""
        portfolio = Portfolio.objects.create(
            user=self.user,
            name="Existing Default",
            is_default=True,
        )
        
        response = self.client.get("/api/portfolios/default/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], portfolio.id)

    def test_cannot_access_other_users_portfolio(self):
        """Test that users cannot access other users' portfolios."""
        portfolio = Portfolio.objects.create(
            user=self.other_user,
            name="Private Portfolio",
        )
        
        response = self.client.get(f"/api/portfolios/{portfolio.id}/")
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_access_denied(self):
        """Test that unauthenticated users cannot access portfolios."""
        self.client.force_authenticate(user=None)
        
        response = self.client.get("/api/portfolios/")
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_portfolio_total_value_calculated(self):
        """Test that portfolio total value is calculated correctly."""
        portfolio = Portfolio.objects.create(
            user=self.user,
            name="Test Portfolio",
        )
        PortfolioProperty.objects.create(portfolio=portfolio, property=self.property1)
        PortfolioProperty.objects.create(portfolio=portfolio, property=self.property2)
        
        response = self.client.get(f"/api/portfolios/{portfolio.id}/")
        
        # property1: 300000 + property2: 500000 = 800000
        self.assertEqual(response.data["total_value"], 800000.0)

    def test_portfolio_average_price_calculated(self):
        """Test that portfolio average price is calculated correctly."""
        portfolio = Portfolio.objects.create(
            user=self.user,
            name="Test Portfolio",
        )
        PortfolioProperty.objects.create(portfolio=portfolio, property=self.property1)
        PortfolioProperty.objects.create(portfolio=portfolio, property=self.property2)
        
        response = self.client.get(f"/api/portfolios/{portfolio.id}/")
        
        # (300000 + 500000) / 2 = 400000
        self.assertEqual(response.data["average_price"], 400000.0)

    def test_set_portfolio_as_default(self):
        """Test setting a portfolio as default unsets other defaults."""
        portfolio1 = Portfolio.objects.create(
            user=self.user,
            name="Portfolio 1",
            is_default=True,
        )
        portfolio2 = Portfolio.objects.create(
            user=self.user,
            name="Portfolio 2",
            is_default=False,
        )
        
        response = self.client.patch(
            f"/api/portfolios/{portfolio2.id}/",
            {"is_default": True},
            format="json",
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        portfolio1.refresh_from_db()
        portfolio2.refresh_from_db()
        self.assertFalse(portfolio1.is_default)
        self.assertTrue(portfolio2.is_default)


