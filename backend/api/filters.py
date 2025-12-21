"""Filter classes for API endpoints."""

import django_filters
from .models import Property


class PropertyFilterSet(django_filters.FilterSet):
    """Comprehensive filter set for Property model."""

    # Price range filters
    price__gte = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    price__lte = django_filters.NumberFilter(field_name="price", lookup_expr="lte")

    # Size range filters
    size_sqm__gte = django_filters.NumberFilter(field_name="size_sqm", lookup_expr="gte")
    size_sqm__lte = django_filters.NumberFilter(field_name="size_sqm", lookup_expr="lte")

    # Bedrooms range filters
    bedrooms__gte = django_filters.NumberFilter(field_name="bedrooms", lookup_expr="gte")
    bedrooms__lte = django_filters.NumberFilter(field_name="bedrooms", lookup_expr="lte")

    # Bathrooms range filters
    bathrooms__gte = django_filters.NumberFilter(field_name="bathrooms", lookup_expr="gte")
    bathrooms__lte = django_filters.NumberFilter(field_name="bathrooms", lookup_expr="lte")

    # Year built range filters
    year_built__gte = django_filters.NumberFilter(field_name="year_built", lookup_expr="gte")
    year_built__lte = django_filters.NumberFilter(field_name="year_built", lookup_expr="lte")

    # Condition filter - supports multiple values
    condition = django_filters.MultipleChoiceFilter(choices=Property.CONDITION_CHOICES)

    # Energy rating filter - supports multiple values
    energy_rating = django_filters.MultipleChoiceFilter(choices=Property.ENERGY_RATING_CHOICES)

    # Feature filters (boolean) - supports multiple (can filter for any combination)
    has_elevator = django_filters.BooleanFilter(field_name="has_elevator")
    has_balcony = django_filters.BooleanFilter(field_name="has_balcony")
    has_terrace = django_filters.BooleanFilter(field_name="has_terrace")

    # Parking spaces filter
    parking_spaces__gte = django_filters.NumberFilter(
        field_name="parking_spaces", lookup_expr="gte"
    )

    # Listing status filter - supports multiple values
    listing_status = django_filters.MultipleChoiceFilter(choices=Property.LISTING_STATUS)

    # Property type filter - supports multiple values
    property_type = django_filters.MultipleChoiceFilter(choices=Property.PROPERTY_TYPES)

    # Region filter - supports multiple values (django-filters handles multiple query params automatically)
    region = django_filters.NumberFilter(field_name="region", lookup_expr="in")

    # Geographic filters - support multiple values by code (string)
    # Frontend sends codes like "dist-01", "mun-aveiro-01", "par-aveiro-01-01"
    district = django_filters.CharFilter(field_name="district__code", lookup_expr="in")
    municipality = django_filters.CharFilter(field_name="municipality__code", lookup_expr="in")
    parish = django_filters.CharFilter(field_name="parish__code", lookup_expr="in")

    class Meta:
        model = Property
        fields = [
            "property_type",
            "region",
            "condition",
            "energy_rating",
            "listing_status",
            "has_elevator",
            "has_balcony",
            "has_terrace",
            "district",
            "municipality",
            "parish",
        ]
