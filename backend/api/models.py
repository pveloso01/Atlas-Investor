from django.db import models
from django.contrib.auth.models import User

# Try to use PostGIS, fallback to regular models if not available
try:
    from django.contrib.gis.db import models as gis_models
    HAS_POSTGIS = True
except ImportError:
    HAS_POSTGIS = False
    gis_models = models


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
        ordering = ['name']

    def __str__(self):
        return self.name


class Property(models.Model):
    """Property listing with geospatial data."""
    PROPERTY_TYPES = [
        ('apartment', 'Apartment'),
        ('house', 'House'),
        ('land', 'Land'),
        ('commercial', 'Commercial'),
        ('mixed', 'Mixed Use'),
    ]

    external_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    address = models.CharField(max_length=255)
    coordinates = gis_models.PointField(srid=4326, null=True, blank=True) if HAS_POSTGIS else models.JSONField(null=True, blank=True, help_text="Coordinates as [longitude, latitude]")
    price = models.DecimalField(max_digits=12, decimal_places=2)
    size_sqm = models.DecimalField(max_digits=10, decimal_places=2)
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPES)
    bedrooms = models.IntegerField(null=True, blank=True)
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    raw_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Properties'

    def __str__(self):
        return f"{self.address} - €{self.price}"


class SavedProperty(models.Model):
    """User's saved properties with notes."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_properties')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='saved_by')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'property']

    def __str__(self):
        return f"{self.user.username} - {self.property.address}"
