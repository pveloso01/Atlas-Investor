"""
Property Ingestion Service.

This service handles ingestion of property data from various sources,
including data normalization, validation, and storage.
"""

import json
import logging
from decimal import Decimal
from pathlib import Path
from typing import Any, Optional

from django.db import transaction

from ..models import Property, Region

logger = logging.getLogger(__name__)


class PropertyIngestionService:
    """Service for ingesting property data from various sources."""

    # Mapping of external property types to internal types
    PROPERTY_TYPE_MAP = {
        "apartment": "apartment",
        "flat": "apartment",
        "apartamento": "apartment",
        "house": "house",
        "villa": "house",
        "moradia": "house",
        "land": "land",
        "terreno": "land",
        "commercial": "commercial",
        "comercial": "commercial",
        "mixed": "mixed",
        "misto": "mixed",
    }

    # Mapping of external condition types to internal types
    CONDITION_MAP = {
        "new": "new",
        "novo": "new",
        "excellent": "excellent",
        "excelente": "excellent",
        "good": "good",
        "bom": "good",
        "fair": "fair",
        "razoável": "fair",
        "needs_renovation": "needs_renovation",
        "para renovar": "needs_renovation",
        "demolition": "demolition",
    }

    # Mapping of energy ratings
    ENERGY_RATING_MAP = {
        "A+": "A+",
        "A": "A",
        "B": "B",
        "B-": "B-",
        "C": "C",
        "D": "D",
        "E": "E",
        "F": "F",
        "G": "G",
    }

    def __init__(self) -> None:
        """Initialize the ingestion service."""
        self._region_cache: dict[str, Region] = {}

    def ingest_from_json_file(self, file_path: str | Path) -> dict[str, Any]:
        """
        Ingest properties from a JSON file.

        Args:
            file_path: Path to the JSON file containing property data

        Returns:
            Dictionary with ingestion results:
            - created: Number of new properties created
            - updated: Number of existing properties updated
            - errors: List of error messages
        """
        file_path = Path(file_path)
        if not file_path.exists():
            raise FileNotFoundError(f"JSON file not found: {file_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        properties = data.get("properties", [])
        return self.ingest_properties(properties)

    def ingest_properties(self, properties: list[dict[str, Any]]) -> dict[str, Any]:
        """
        Ingest a list of property dictionaries.

        Args:
            properties: List of property data dictionaries

        Returns:
            Dictionary with ingestion results
        """
        results = {"created": 0, "updated": 0, "errors": []}

        for index, prop_data in enumerate(properties):
            try:
                created = self._ingest_single_property(prop_data)
                if created:
                    results["created"] += 1
                else:
                    results["updated"] += 1
            except Exception as e:
                error_msg = f"Error ingesting property at index {index}: {str(e)}"
                logger.error(error_msg)
                results["errors"].append(error_msg)

        logger.info(
            f"Ingestion complete: {results['created']} created, "
            f"{results['updated']} updated, {len(results['errors'])} errors"
        )
        return results

    @transaction.atomic
    def _ingest_single_property(self, prop_data: dict[str, Any]) -> bool:
        """
        Ingest a single property.

        Args:
            prop_data: Property data dictionary

        Returns:
            True if property was created, False if updated
        """
        # Normalize the data
        normalized = self.normalize_property_data(prop_data)

        # Validate the data
        self.validate_property_data(normalized)

        # Get or create region
        region = self._get_or_create_region(normalized.get("region_code"))

        # Check if property already exists
        external_id = normalized.get("external_id")
        existing = None
        if external_id:
            existing = Property.objects.filter(external_id=external_id).first()

        # Prepare property fields
        property_fields = {
            "address": normalized["address"],
            "coordinates": normalized.get("coordinates"),
            "price": normalized["price"],
            "size_sqm": normalized["size_sqm"],
            "property_type": normalized["property_type"],
            "bedrooms": normalized.get("bedrooms"),
            "bathrooms": normalized.get("bathrooms"),
            "year_built": normalized.get("year_built"),
            "condition": normalized.get("condition"),
            "floor_number": normalized.get("floor_number"),
            "total_floors": normalized.get("total_floors"),
            "has_elevator": normalized.get("has_elevator"),
            "parking_spaces": normalized.get("parking_spaces", 0),
            "has_balcony": normalized.get("has_balcony", False),
            "has_terrace": normalized.get("has_terrace", False),
            "energy_rating": normalized.get("energy_rating"),
            "description": normalized.get("description", ""),
            "images": normalized.get("images", []),
            "source_url": normalized.get("source_url", ""),
            "region": region,
            "raw_data": normalized.get("raw_data", {}),
        }

        if existing:
            # Update existing property
            for key, value in property_fields.items():
                setattr(existing, key, value)
            existing.save()
            logger.debug(f"Updated property: {external_id}")
            return False
        else:
            # Create new property
            Property.objects.create(
                external_id=external_id,
                **property_fields,
            )
            logger.debug(f"Created property: {external_id}")
            return True

    def normalize_property_data(self, data: dict[str, Any]) -> dict[str, Any]:
        """
        Normalize property data to standard format.

        Args:
            data: Raw property data dictionary

        Returns:
            Normalized property data dictionary
        """
        normalized: dict[str, Any] = {}

        # Basic fields
        normalized["external_id"] = str(data.get("external_id", "")).strip() or None
        normalized["address"] = str(data.get("address", "")).strip()

        # Coordinates
        coords = data.get("coordinates")
        if coords and isinstance(coords, (list, tuple)) and len(coords) >= 2:
            normalized["coordinates"] = [float(coords[0]), float(coords[1])]
        else:
            normalized["coordinates"] = None

        # Price - convert to Decimal
        price = data.get("price")
        if price is not None:
            normalized["price"] = Decimal(str(price))
        else:
            normalized["price"] = None

        # Size - convert to Decimal
        size = data.get("size_sqm")
        if size is not None:
            normalized["size_sqm"] = Decimal(str(size))
        else:
            normalized["size_sqm"] = None

        # Property type - normalize
        prop_type = str(data.get("property_type", "")).lower().strip()
        normalized["property_type"] = self.PROPERTY_TYPE_MAP.get(prop_type, "apartment")

        # Integer fields
        for field in ["bedrooms", "year_built", "floor_number", "total_floors", "parking_spaces"]:
            value = data.get(field)
            if value is not None:
                try:
                    normalized[field] = int(value)
                except (ValueError, TypeError):
                    normalized[field] = None
            else:
                normalized[field] = None

        # Bathrooms - can be decimal (e.g., 1.5)
        bathrooms = data.get("bathrooms")
        if bathrooms is not None:
            try:
                normalized["bathrooms"] = Decimal(str(bathrooms))
            except (ValueError, TypeError):
                normalized["bathrooms"] = None
        else:
            normalized["bathrooms"] = None

        # Condition - normalize
        condition = str(data.get("condition", "")).lower().strip()
        normalized["condition"] = self.CONDITION_MAP.get(condition)

        # Boolean fields
        for field in ["has_elevator", "has_balcony", "has_terrace"]:
            value = data.get(field)
            if value is not None:
                normalized[field] = bool(value)
            else:
                normalized[field] = False

        # Energy rating - normalize
        energy = str(data.get("energy_rating", "")).upper().strip()
        normalized["energy_rating"] = self.ENERGY_RATING_MAP.get(energy)

        # Text fields
        normalized["description"] = str(data.get("description", "")).strip()
        normalized["source_url"] = str(data.get("source_url", "")).strip()

        # Images - ensure list
        images = data.get("images", [])
        if isinstance(images, str):
            images = [images]
        normalized["images"] = [str(img).strip() for img in images if img]

        # Region code
        normalized["region_code"] = str(data.get("region_code", "")).strip() or None

        # Keep raw data for reference
        normalized["raw_data"] = {
            "original_data": data,
            "description": data.get("description", ""),
        }

        return normalized

    def validate_property_data(self, data: dict[str, Any]) -> None:
        """
        Validate normalized property data.

        Args:
            data: Normalized property data dictionary

        Raises:
            ValueError: If validation fails
        """
        errors = []

        # Required fields
        if not data.get("address"):
            errors.append("Address is required")

        if data.get("price") is None or data["price"] <= 0:
            errors.append("Valid price is required")

        if data.get("size_sqm") is None or data["size_sqm"] <= 0:
            errors.append("Valid size_sqm is required")

        if not data.get("property_type"):
            errors.append("Property type is required")

        # Validate coordinates if provided
        coords = data.get("coordinates")
        if coords:
            if len(coords) != 2:
                errors.append("Coordinates must have exactly 2 values [longitude, latitude]")
            else:
                lng, lat = coords
                if not (-180 <= lng <= 180):
                    errors.append(f"Invalid longitude: {lng}")
                if not (-90 <= lat <= 90):
                    errors.append(f"Invalid latitude: {lat}")

        # Validate numeric ranges
        if data.get("bedrooms") is not None and data["bedrooms"] < 0:
            errors.append("Bedrooms cannot be negative")

        if data.get("bathrooms") is not None and data["bathrooms"] < 0:
            errors.append("Bathrooms cannot be negative")

        if data.get("year_built") is not None:
            if data["year_built"] < 1000 or data["year_built"] > 2100:
                errors.append(f"Invalid year_built: {data['year_built']}")

        if errors:
            raise ValueError("; ".join(errors))

    def _get_or_create_region(self, region_code: Optional[str]) -> Optional[Region]:
        """
        Get or create a region by code.

        Args:
            region_code: Region code (e.g., 'LIS', 'POR', 'CAS')

        Returns:
            Region instance or None
        """
        if not region_code:
            return None

        # Check cache first
        if region_code in self._region_cache:
            return self._region_cache[region_code]

        # Region name mapping
        region_names = {
            "LIS": "Lisbon",
            "POR": "Porto",
            "CAS": "Cascais",
        }

        region, _ = Region.objects.get_or_create(
            code=region_code,
            defaults={"name": region_names.get(region_code, region_code)},
        )
        self._region_cache[region_code] = region
        return region
