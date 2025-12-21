"""
Property service layer for business logic.

This service handles property-related business operations,
keeping them separate from views and serializers.
"""

from typing import Optional, List
from decimal import Decimal
from django.db.models import QuerySet
from ..models import Property, Region


class PropertyService:
    """Service for property-related business logic."""

    @staticmethod
    def calculate_price_per_sqm(price: Decimal, size_sqm: Decimal) -> Optional[Decimal]:
        """Calculate price per square meter."""
        if price is None:
            return None
        if size_sqm and size_sqm > 0:
            return price / size_sqm
        return None

    @staticmethod
    def calculate_yield(price: Decimal, annual_rent: Decimal) -> Optional[Decimal]:
        """Calculate rental yield percentage."""
        if not price or price <= 0:
            return None

        if annual_rent is None:
            return None

        if annual_rent == 0:
            return Decimal("0.00")

        return (annual_rent / price) * 100

    @staticmethod
    def normalize_coordinates(coordinates) -> Optional[List[float]]:
        """
        Normalize coordinates to [longitude, latitude] format.

        Handles both PostGIS PointField and JSONField formats.
        """
        if not coordinates:
            return None

        # Handle PostGIS PointField (has .x and .y attributes)
        if hasattr(coordinates, "x") and hasattr(coordinates, "y"):
            return [float(coordinates.x), float(coordinates.y)]

        # Handle JSONField (already a list [longitude, latitude])
        if isinstance(coordinates, (list, tuple)) and len(coordinates) >= 2:
            return [float(coordinates[0]), float(coordinates[1])]

        return None

    @staticmethod
    def get_properties_by_region(region: Region) -> QuerySet[Property]:
        """Get all properties for a given region."""
        return Property.objects.select_related(
            "region", "district", "municipality", "parish"
        ).filter(
            region=region
        )  # type: ignore[attr-defined]

    @staticmethod
    def get_properties_in_price_range(
        min_price: Optional[Decimal] = None, max_price: Optional[Decimal] = None
    ) -> QuerySet[Property]:
        """Get properties within a price range."""
        queryset = Property.objects.select_related(
            "region", "district", "municipality", "parish"
        ).all()  # type: ignore[attr-defined]

        if min_price is not None:
            queryset = queryset.filter(price__gte=min_price)
        if max_price is not None:
            queryset = queryset.filter(price__lte=max_price)

        return queryset

    @staticmethod
    def compare_to_region_average(property: Property) -> dict:
        """
        Compare property metrics to region averages.

        Returns a dictionary with comparison metrics.
        """
        if not property.region:
            return {}

        region = property.region  # type: ignore[assignment]
        price_per_sqm = PropertyService.calculate_price_per_sqm(
            Decimal(str(property.price)),  # type: ignore[arg-type]
            Decimal(str(property.size_sqm)),  # type: ignore[arg-type]
        )

        region_avg = region.avg_price_per_sqm  # type: ignore[attr-defined]
        result = {
            "property_price_per_sqm": float(price_per_sqm) if price_per_sqm else None,
            "region_avg_price_per_sqm": float(region_avg) if region_avg else None,
        }

        if price_per_sqm and region_avg:
            diff = price_per_sqm - Decimal(str(region_avg))
            diff_percent = (diff / Decimal(str(region_avg))) * 100
            result["price_difference"] = float(diff)
            result["price_difference_percent"] = float(diff_percent)
            result["is_below_average"] = diff < 0

        return result
