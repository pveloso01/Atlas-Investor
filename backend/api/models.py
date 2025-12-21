from django.db import models
from django.conf import settings
from decimal import Decimal
from typing import Optional

# Try to use PostGIS, fallback to regular models if not available
# Note: This import will fail if GDAL is not installed, but we catch it
try:
    from django.contrib.gis.db import models as gis_models
    from django.contrib.gis.geos import Point

    HAS_POSTGIS = True
except (ImportError, Exception):
    # If PostGIS/GDAL is not available, use regular models
    HAS_POSTGIS = False
    gis_models = models
    Point = None


class Region(models.Model):
    """Regional market statistics and averages."""

    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)
    avg_price_per_sqm = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    avg_rent = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    avg_yield = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return str(self.name)


class Property(models.Model):
    """Property listing with geospatial data."""

    PROPERTY_TYPES = [
        ("apartment", "Apartment"),
        ("house", "House"),
        ("land", "Land"),
        ("commercial", "Commercial"),
        ("mixed", "Mixed Use"),
    ]

    LISTING_STATUS = [
        ("active", "Active"),
        ("sold", "Sold"),
        ("pending", "Pending"),
        ("withdrawn", "Withdrawn"),
    ]

    CONDITION_CHOICES = [
        ("new", "New Construction"),
        ("excellent", "Excellent"),
        ("good", "Good"),
        ("fair", "Fair"),
        ("needs_renovation", "Needs Renovation"),
        ("demolition", "Demolition Required"),
    ]

    ENERGY_RATING_CHOICES = [
        ("A+", "A+"),
        ("A", "A"),
        ("B", "B"),
        ("B-", "B-"),
        ("C", "C"),
        ("D", "D"),
        ("E", "E"),
        ("F", "F"),
        ("G", "G"),
    ]

    # Basic Information
    external_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    address = models.CharField(max_length=255)
    # Always use JSONField in database for compatibility
    # PostGIS PointField conversion handled in serializer/application code
    coordinates = models.JSONField(
        null=True, blank=True, help_text="Coordinates as [longitude, latitude]"
    )
    description = models.TextField(blank=True, help_text="Property description")

    # Pricing & Size
    price = models.DecimalField(max_digits=12, decimal_places=2)
    size_sqm = models.DecimalField(max_digits=10, decimal_places=2)

    # Property Details
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPES)
    bedrooms = models.IntegerField(null=True, blank=True)
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    year_built = models.IntegerField(null=True, blank=True, help_text="Year the property was built")
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, null=True, blank=True)

    # Apartment-specific fields
    floor_number = models.IntegerField(
        null=True, blank=True, help_text="Floor number (for apartments)"
    )
    total_floors = models.IntegerField(null=True, blank=True, help_text="Total floors in building")
    has_elevator = models.BooleanField(null=True, blank=True, help_text="Building has elevator")

    # Features
    parking_spaces = models.IntegerField(
        default=0, help_text="Number of parking spaces"
    )  # type: ignore[assignment]
    has_balcony = models.BooleanField(
        default=False, help_text="Property has balcony"
    )  # type: ignore[assignment]
    has_terrace = models.BooleanField(
        default=False, help_text="Property has terrace"
    )  # type: ignore[assignment]

    # Energy & Environment
    energy_rating = models.CharField(
        max_length=2, choices=ENERGY_RATING_CHOICES, null=True, blank=True
    )

    # Listing Information
    listing_status = models.CharField(max_length=20, choices=LISTING_STATUS, default="active")
    source_url = models.URLField(max_length=500, blank=True, help_text="URL to original listing")
    last_synced_at = models.DateTimeField(
        null=True, blank=True, help_text="Last time data was synced from source"
    )

    # Relationships
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Geographic relationships (optional - for future address parsing)
    # Using string references since these models are defined later in the file
    district = models.ForeignKey(
        'District',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="District where property is located",
        related_name="properties",
    )
    municipality = models.ForeignKey(
        'Municipality',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Municipality where property is located",
        related_name="properties",
    )
    parish = models.ForeignKey(
        'Parish',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Parish where property is located",
        related_name="properties",
    )

    # Images (stored as JSON array of URLs)
    images = models.JSONField(default=list, blank=True, help_text="Array of image URLs")

    # Additional Data
    raw_data = models.JSONField(default=dict, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Properties"
        indexes = [
            models.Index(fields=["property_type", "listing_status"]),
            models.Index(fields=["price", "size_sqm"]),
            models.Index(fields=["region", "property_type"]),
            models.Index(fields=["listing_status", "created_at"]),
            models.Index(fields=["bedrooms", "bathrooms"]),
            models.Index(fields=["district"]),
            models.Index(fields=["municipality"]),
            models.Index(fields=["parish"]),
            # Composite indexes for common filter combinations
            models.Index(fields=["district", "municipality", "parish"]),
            models.Index(fields=["property_type", "condition", "energy_rating"]),
            models.Index(fields=["external_id"]),  # For ingestion lookups
        ]

    def __str__(self) -> str:
        return f"{self.address} - €{self.price}"

    @property
    def price_per_sqm(self) -> Optional[Decimal]:
        """Calculate price per square meter."""
        if self.size_sqm and self.size_sqm > 0:
            # Convert to Decimal for calculation
            # (Django DecimalField returns Decimal at runtime)
            price = Decimal(str(self.price))  # type: ignore[arg-type]
            size = Decimal(str(self.size_sqm))  # type: ignore[arg-type]
            return price / size
        return None

    def get_coordinates_list(self) -> Optional[list]:
        """
        Get coordinates as [longitude, latitude] list.

        Handles both PostGIS PointField and JSONField formats.
        """
        if not self.coordinates:
            return None

        # Handle PostGIS PointField (has .x and .y attributes)
        if hasattr(self.coordinates, "x") and hasattr(self.coordinates, "y"):
            return [
                float(self.coordinates.x),
                float(self.coordinates.y),
            ]  # type: ignore[attr-defined]

        # Handle JSONField (already a list [longitude, latitude])
        if isinstance(self.coordinates, (list, tuple)) and len(self.coordinates) >= 2:
            return [float(self.coordinates[0]), float(self.coordinates[1])]

        return None


class SavedProperty(models.Model):
    """User's saved properties with notes."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_properties",
    )
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="saved_by")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ["user", "property"]
        indexes = [
            models.Index(fields=["user", "created_at"]),
        ]

    def __str__(self) -> str:
        # Django ForeignKey access is dynamic - type checker needs help
        return f"{self.user.email} - {self.property.address}"  # type: ignore[attr-defined]


class Feedback(models.Model):
    """User feedback submissions."""

    RATING_CHOICES = [
        (1, "Poor"),
        (2, "Fair"),
        (3, "Good"),
        (4, "Great"),
        (5, "Excellent"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="feedbacks",
    )
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True)
    page_url = models.URLField(max_length=500, blank=True, help_text="Page where feedback was submitted")
    user_agent = models.CharField(max_length=500, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Feedback"

    def __str__(self) -> str:
        user_str = self.user.email if self.user else "Anonymous"  # type: ignore[union-attr]
        return f"Feedback from {user_str} - Rating: {self.rating}"


class SupportMessage(models.Model):
    """Support message submissions."""

    STATUS_CHOICES = [
        ("new", "New"),
        ("in_progress", "In Progress"),
        ("resolved", "Resolved"),
        ("closed", "Closed"),
    ]

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("urgent", "Urgent"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="support_messages",
    )
    email = models.EmailField(help_text="Contact email for response")
    subject = models.CharField(max_length=200, blank=True, default="General Inquiry")
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="medium")
    page_url = models.URLField(max_length=500, blank=True, help_text="Page where message was submitted")
    user_agent = models.CharField(max_length=500, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Support Messages"

    def __str__(self) -> str:
        return f"Support: {self.subject} - {self.status}"


class ContactRequest(models.Model):
    """Property contact/inquiry requests."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="contact_requests",
    )
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="contact_requests",
    )
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    message = models.TextField()
    contacted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Contact Requests"
        indexes = [
            models.Index(fields=["property", "contacted"]),
            models.Index(fields=["user", "created_at"]),
        ]

    def __str__(self) -> str:
        return f"Contact for {self.property.address} from {self.name}"


class Portfolio(models.Model):
    """User's investment portfolio."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="portfolios",
    )
    name = models.CharField(max_length=200, default="My Portfolio")
    description = models.TextField(blank=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "is_default"]),
            models.Index(fields=["user", "created_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.name} - {self.user.email}"  # type: ignore[union-attr]


class PortfolioProperty(models.Model):
    """Properties in a portfolio."""

    portfolio = models.ForeignKey(
        Portfolio,
        on_delete=models.CASCADE,
        related_name="properties",
    )
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="in_portfolios",
    )
    notes = models.TextField(blank=True)
    target_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-added_at"]
        unique_together = ["portfolio", "property"]
        indexes = [
            models.Index(fields=["portfolio", "added_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.property.address} in {self.portfolio.name}"


# Geographic Models for Portugal's Administrative Hierarchy
class District(models.Model):
    """Mainland Portugal district (distrito)."""

    code = models.CharField(max_length=10, unique=True, help_text="District code (e.g., '01' for Aveiro)")
    name = models.CharField(max_length=100, unique=True)
    full_path = models.CharField(max_length=200, help_text="Full path for display (e.g., 'Aveiro')")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["code"]
        indexes = [
            models.Index(fields=["code"]),
            models.Index(fields=["name"]),
        ]

    def __str__(self) -> str:
        return str(self.name)


class AutonomousRegion(models.Model):
    """Autonomous region (Azores or Madeira)."""

    code = models.CharField(max_length=10, unique=True, help_text="Region code (e.g., 'AR01' for Açores)")
    name = models.CharField(max_length=100, unique=True)
    full_path = models.CharField(max_length=200, help_text="Full path for display (e.g., 'Açores')")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["code"]
        indexes = [
            models.Index(fields=["code"]),
            models.Index(fields=["name"]),
        ]

    def __str__(self) -> str:
        return str(self.name)


class Municipality(models.Model):
    """Municipality (concelho) - belongs to a district or autonomous region."""

    code = models.CharField(max_length=50, unique=True, help_text="Municipality code (e.g., 'mun-aveiro-01')")
    name = models.CharField(max_length=200)
    district = models.ForeignKey(
        District,
        on_delete=models.CASCADE,
        related_name="municipalities",
        null=True,
        blank=True,
        help_text="District if mainland Portugal",
    )
    autonomous_region = models.ForeignKey(
        AutonomousRegion,
        on_delete=models.CASCADE,
        related_name="municipalities",
        null=True,
        blank=True,
        help_text="Autonomous region if Azores or Madeira",
    )
    full_path = models.CharField(max_length=400, help_text="Full path (e.g., 'Aveiro > Águeda')")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Municipalities"
        indexes = [
            models.Index(fields=["code"]),
            models.Index(fields=["name"]),
            models.Index(fields=["district"]),
            models.Index(fields=["autonomous_region"]),
        ]

    def __str__(self) -> str:
        return str(self.name)

    def clean(self):
        """Ensure municipality belongs to either district or autonomous region, not both."""
        from django.core.exceptions import ValidationError

        if not self.district and not self.autonomous_region:
            raise ValidationError("Municipality must belong to either a district or an autonomous region.")
        if self.district and self.autonomous_region:
            raise ValidationError("Municipality cannot belong to both a district and an autonomous region.")


class Parish(models.Model):
    """Civil parish (freguesia) - belongs to a municipality."""

    code = models.CharField(max_length=50, unique=True, help_text="Parish code (e.g., 'par-aveiro-01-01')")
    name = models.CharField(max_length=200)
    municipality = models.ForeignKey(
        Municipality,
        on_delete=models.CASCADE,
        related_name="parishes",
        help_text="Municipality this parish belongs to",
    )
    full_path = models.CharField(max_length=500, help_text="Full path (e.g., 'Aveiro > Águeda > Aguada de Cima')")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Parishes"
        indexes = [
            models.Index(fields=["code"]),
            models.Index(fields=["name"]),
            models.Index(fields=["municipality"]),
        ]

    def __str__(self) -> str:
        return str(self.name)
