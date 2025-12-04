"""
Tests for contact request API.
"""

from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from api.models import ContactRequest, Property, Region

User = get_user_model()


class TestContactRequestAPI(TestCase):
    """Tests for contact request API endpoints."""

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
            address="Test Address 123",
            property_type="apartment",
            price=Decimal("300000"),
            size_sqm=Decimal("100"),
            region=self.region,
        )

    def test_create_contact_request_unauthenticated(self):
        """Test that unauthenticated users can create contact requests."""
        data = {
            "property": self.property.id,
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+351 123 456 789",
            "message": "I am interested in this property.",
        }
        
        response = self.client.post("/api/contact/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactRequest.objects.count(), 1)
        
        contact = ContactRequest.objects.first()
        self.assertEqual(contact.name, "John Doe")
        self.assertEqual(contact.email, "john@example.com")
        self.assertIsNone(contact.user)  # Not authenticated

    def test_create_contact_request_authenticated(self):
        """Test that authenticated users' requests are linked to their account."""
        self.client.force_authenticate(user=self.user)
        
        data = {
            "property": self.property.id,
            "name": "John Doe",
            "email": "john@example.com",
            "message": "I am interested in this property.",
        }
        
        response = self.client.post("/api/contact/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        contact = ContactRequest.objects.first()
        self.assertEqual(contact.user, self.user)

    def test_create_contact_request_without_message_fails(self):
        """Test that contact requests require a message."""
        data = {
            "property": self.property.id,
            "name": "John Doe",
            "email": "john@example.com",
            "message": "",  # Empty message
        }
        
        response = self.client.post("/api/contact/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("message", response.data)

    def test_create_contact_request_without_name_fails(self):
        """Test that contact requests require a name."""
        data = {
            "property": self.property.id,
            "email": "john@example.com",
            "message": "I am interested.",
        }
        
        response = self.client.post("/api/contact/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

    def test_create_contact_request_without_email_fails(self):
        """Test that contact requests require an email."""
        data = {
            "property": self.property.id,
            "name": "John Doe",
            "message": "I am interested.",
        }
        
        response = self.client.post("/api/contact/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_create_contact_request_invalid_email_fails(self):
        """Test that contact requests require a valid email."""
        data = {
            "property": self.property.id,
            "name": "John Doe",
            "email": "not-an-email",
            "message": "I am interested.",
        }
        
        response = self.client.post("/api/contact/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_create_contact_request_phone_optional(self):
        """Test that phone number is optional."""
        data = {
            "property": self.property.id,
            "name": "John Doe",
            "email": "john@example.com",
            "message": "I am interested.",
            # No phone field
        }
        
        response = self.client.post("/api/contact/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_contact_requests_unauthenticated_denied(self):
        """Test that unauthenticated users cannot list contact requests."""
        # Create a contact request
        ContactRequest.objects.create(
            property=self.property,
            name="John Doe",
            email="john@example.com",
            message="Test",
        )
        
        response = self.client.get("/api/contact/")
        
        # Unauthenticated users should be denied
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_contact_requests_authenticated_sees_own(self):
        """Test that authenticated users see their own contact requests."""
        self.client.force_authenticate(user=self.user)
        
        # Create contact request linked to user
        ContactRequest.objects.create(
            property=self.property,
            user=self.user,
            name="John Doe",
            email="john@example.com",
            message="Test",
        )
        
        # Create contact request by another user
        other_user = User.objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="testpass123",
        )
        ContactRequest.objects.create(
            property=self.property,
            user=other_user,
            name="Jane Doe",
            email="jane@example.com",
            message="Test",
        )
        
        response = self.client.get("/api/contact/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["name"], "John Doe")

    def test_staff_sees_all_contact_requests(self):
        """Test that staff users see all contact requests."""
        staff_user = User.objects.create_user(
            username="staffuser",
            email="staff@example.com",
            password="testpass123",
            is_staff=True,
        )
        self.client.force_authenticate(user=staff_user)
        
        # Create multiple contact requests
        ContactRequest.objects.create(
            property=self.property,
            name="John Doe",
            email="john@example.com",
            message="Test 1",
        )
        ContactRequest.objects.create(
            property=self.property,
            user=self.user,
            name="Jane Doe",
            email="jane@example.com",
            message="Test 2",
        )
        
        response = self.client.get("/api/contact/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_create_contact_request_invalid_property(self):
        """Test that contact requests for non-existent properties fail."""
        data = {
            "property": 99999,  # Non-existent
            "name": "John Doe",
            "email": "john@example.com",
            "message": "I am interested.",
        }
        
        response = self.client.post("/api/contact/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_contact_request_not_contacted_by_default(self):
        """Test that new contact requests are not marked as contacted."""
        data = {
            "property": self.property.id,
            "name": "John Doe",
            "email": "john@example.com",
            "message": "I am interested.",
        }
        
        response = self.client.post("/api/contact/", data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        contact = ContactRequest.objects.first()
        self.assertFalse(contact.contacted)

