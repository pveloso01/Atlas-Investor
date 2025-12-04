"""
Tests for API permission classes.

This module tests all permission functionality including:
- IsOwnerOrReadOnly permission
- IsAuthenticatedOrReadOnly permission
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from api.permissions import IsOwnerOrReadOnly, IsAuthenticatedOrReadOnly

User = get_user_model()


class IsAuthenticatedOrReadOnlyTest(TestCase):
    """Test cases for IsAuthenticatedOrReadOnly permission."""

    def setUp(self):
        """Set up test data."""
        self.factory = APIRequestFactory()
        self.permission = IsAuthenticatedOrReadOnly()
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

    def test_read_permission_unauthenticated(self):
        """Test that unauthenticated users can read."""
        request = self.factory.get("/api/properties/")
        request.user = None

        view = None  # View is not used in this permission
        has_permission = self.permission.has_permission(request, view)

        self.assertTrue(has_permission)

    def test_read_permission_authenticated(self):
        """Test that authenticated users can read."""
        request = self.factory.get("/api/properties/")
        request.user = self.user

        view = None
        has_permission = self.permission.has_permission(request, view)

        self.assertTrue(has_permission)

    def test_write_permission_unauthenticated(self):
        """Test that unauthenticated users cannot write."""
        request = self.factory.post("/api/properties/")
        request.user = None

        view = None
        has_permission = self.permission.has_permission(request, view)

        self.assertFalse(has_permission)

    def test_write_permission_authenticated(self):
        """Test that authenticated users can write."""
        request = self.factory.post("/api/properties/")
        request.user = self.user

        view = None
        has_permission = self.permission.has_permission(request, view)

        self.assertTrue(has_permission)

    def test_safe_methods_allowed(self):
        """Test that all safe HTTP methods are allowed for unauthenticated users."""
        safe_methods = ["GET", "HEAD", "OPTIONS"]

        for method in safe_methods:
            request = getattr(self.factory, method.lower())("/api/properties/")
            request.user = None

            view = None
            has_permission = self.permission.has_permission(request, view)

            self.assertTrue(has_permission, f"Method {method} should be allowed")

    def test_unsafe_methods_require_authentication(self):
        """Test that unsafe HTTP methods require authentication."""
        unsafe_methods = ["POST", "PUT", "PATCH", "DELETE"]

        for method in unsafe_methods:
            request = getattr(self.factory, method.lower())("/api/properties/")
            request.user = None

            view = None
            has_permission = self.permission.has_permission(request, view)

            self.assertFalse(has_permission, f"Method {method} should require authentication")

    def test_user_not_authenticated(self):
        """Test permission with user that is not authenticated."""
        from django.contrib.auth.models import AnonymousUser

        request = self.factory.post("/api/properties/")
        request.user = AnonymousUser()

        view = None
        has_permission = self.permission.has_permission(request, view)

        self.assertFalse(has_permission)

    def test_user_is_none(self):
        """Test permission when user is None."""
        request = self.factory.post("/api/properties/")
        request.user = None

        view = None
        has_permission = self.permission.has_permission(request, view)

        self.assertFalse(has_permission)


class IsOwnerOrReadOnlyTest(TestCase):
    """Test cases for IsOwnerOrReadOnly permission."""

    def setUp(self):
        """Set up test data."""
        self.factory = APIRequestFactory()
        self.permission = IsOwnerOrReadOnly()
        self.owner = User.objects.create_user(
            username="owner", email="owner@example.com", password="testpass123"
        )
        self.other_user = User.objects.create_user(
            username="other", email="other@example.com", password="testpass123"
        )

        # Create a mock object with user attribute
        class MockObject:
            def __init__(self, user):
                self.user = user

        self.owner_object = MockObject(self.owner)
        self.other_object = MockObject(self.other_user)

    def test_read_permission_owner(self):
        """Test that owner can read their object."""
        request = self.factory.get("/api/object/")
        request.user = self.owner

        has_permission = self.permission.has_object_permission(request, None, self.owner_object)

        self.assertTrue(has_permission)

    def test_read_permission_non_owner(self):
        """Test that non-owner can read any object."""
        request = self.factory.get("/api/object/")
        request.user = self.other_user

        has_permission = self.permission.has_object_permission(request, None, self.owner_object)

        self.assertTrue(has_permission)

    def test_read_permission_unauthenticated(self):
        """Test that unauthenticated users can read."""
        request = self.factory.get("/api/object/")
        request.user = None

        has_permission = self.permission.has_object_permission(request, None, self.owner_object)

        self.assertTrue(has_permission)

    def test_write_permission_owner(self):
        """Test that owner can write their object."""
        request = self.factory.patch("/api/object/")
        request.user = self.owner

        has_permission = self.permission.has_object_permission(request, None, self.owner_object)

        self.assertTrue(has_permission)

    def test_write_permission_non_owner(self):
        """Test that non-owner cannot write other's object."""
        request = self.factory.patch("/api/object/")
        request.user = self.other_user

        has_permission = self.permission.has_object_permission(request, None, self.owner_object)

        self.assertFalse(has_permission)

    def test_write_permission_unauthenticated(self):
        """Test that unauthenticated users cannot write."""
        request = self.factory.patch("/api/object/")
        request.user = None

        has_permission = self.permission.has_object_permission(request, None, self.owner_object)

        self.assertFalse(has_permission)

    def test_safe_methods_allowed(self):
        """Test that all safe HTTP methods are allowed for any user."""
        safe_methods = ["GET", "HEAD", "OPTIONS"]

        for method in safe_methods:
            request = getattr(self.factory, method.lower())("/api/object/")
            request.user = self.other_user

            has_permission = self.permission.has_object_permission(request, None, self.owner_object)

            self.assertTrue(has_permission, f"Method {method} should be allowed")

    def test_unsafe_methods_require_ownership(self):
        """Test that unsafe HTTP methods require ownership."""
        unsafe_methods = ["POST", "PUT", "PATCH", "DELETE"]

        for method in unsafe_methods:
            request = getattr(self.factory, method.lower())("/api/object/")
            request.user = self.other_user

            has_permission = self.permission.has_object_permission(request, None, self.owner_object)

            self.assertFalse(has_permission, f"Method {method} should require ownership")
