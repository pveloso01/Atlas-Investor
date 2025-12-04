"""
Geocoding Service.

This service handles converting addresses to coordinates using
various geocoding providers.
"""

import hashlib
import logging
import time
from typing import Optional

from django.core.cache import cache

logger = logging.getLogger(__name__)


class GeocodingService:
    """
    Service for geocoding addresses to coordinates.

    Uses Nominatim (OpenStreetMap) as the default provider.
    Results are cached to minimize API calls.
    """

    # Nominatim API endpoint
    NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

    # User agent for Nominatim (required by their terms of service)
    USER_AGENT = "AtlasInvestor/1.0 (https://atlasinvestor.com)"

    # Cache timeout in seconds (24 hours)
    CACHE_TIMEOUT = 86400

    # Rate limiting: minimum seconds between requests
    MIN_REQUEST_INTERVAL = 1.0

    def __init__(self) -> None:
        """Initialize the geocoding service."""
        self._last_request_time = 0.0

    def geocode(self, address: str, country: str = "Portugal") -> Optional[tuple[float, float]]:
        """
        Convert an address to coordinates.

        Args:
            address: The address to geocode
            country: Country to search within (default: Portugal)

        Returns:
            Tuple of (longitude, latitude) or None if not found
        """
        if not address or not address.strip():
            return None

        # Normalize address
        full_address = f"{address.strip()}, {country}"
        cache_key = self._get_cache_key(full_address)

        # Check cache first
        cached = cache.get(cache_key)
        if cached is not None:
            logger.debug(f"Cache hit for address: {address}")
            return cached if cached != "NOT_FOUND" else None

        # Rate limiting
        self._rate_limit()

        # Make API request
        try:
            coords = self._nominatim_geocode(full_address)

            # Cache the result (including NOT_FOUND to avoid repeated lookups)
            cache.set(cache_key, coords if coords else "NOT_FOUND", self.CACHE_TIMEOUT)

            return coords

        except Exception as e:
            logger.error(f"Geocoding error for address '{address}': {str(e)}")
            return None

    def reverse_geocode(self, longitude: float, latitude: float) -> Optional[dict[str, str]]:
        """
        Convert coordinates to an address.

        Args:
            longitude: Longitude coordinate
            latitude: Latitude coordinate

        Returns:
            Dictionary with address components or None if not found
        """
        cache_key = f"reverse_geocode:{longitude:.6f}:{latitude:.6f}"

        # Check cache first
        cached = cache.get(cache_key)
        if cached is not None:
            return cached if cached != "NOT_FOUND" else None

        # Rate limiting
        self._rate_limit()

        # Make API request
        try:
            address = self._nominatim_reverse(longitude, latitude)

            # Cache the result
            cache.set(cache_key, address if address else "NOT_FOUND", self.CACHE_TIMEOUT)

            return address

        except Exception as e:
            logger.error(f"Reverse geocoding error for ({longitude}, {latitude}): {str(e)}")
            return None

    def batch_geocode(
        self, addresses: list[str], country: str = "Portugal"
    ) -> list[Optional[tuple[float, float]]]:
        """
        Geocode multiple addresses.

        Args:
            addresses: List of addresses to geocode
            country: Country to search within

        Returns:
            List of coordinate tuples (or None for failed lookups)
        """
        results = []
        for address in addresses:
            coords = self.geocode(address, country)
            results.append(coords)
        return results

    def _nominatim_geocode(self, full_address: str) -> Optional[tuple[float, float]]:
        """
        Geocode using Nominatim API.

        Args:
            full_address: Full address including country

        Returns:
            Tuple of (longitude, latitude) or None
        """
        import requests

        params = {
            "q": full_address,
            "format": "json",
            "limit": 1,
            "addressdetails": 1,
        }

        headers = {"User-Agent": self.USER_AGENT}

        response = requests.get(self.NOMINATIM_URL, params=params, headers=headers, timeout=10)
        response.raise_for_status()

        results = response.json()
        if results:
            result = results[0]
            lat = float(result["lat"])
            lon = float(result["lon"])
            logger.debug(f"Geocoded '{full_address}' to ({lon}, {lat})")
            return (lon, lat)

        logger.debug(f"No geocoding results for: {full_address}")
        return None

    def _nominatim_reverse(self, longitude: float, latitude: float) -> Optional[dict[str, str]]:
        """
        Reverse geocode using Nominatim API.

        Args:
            longitude: Longitude coordinate
            latitude: Latitude coordinate

        Returns:
            Dictionary with address components or None
        """
        import requests

        reverse_url = "https://nominatim.openstreetmap.org/reverse"

        params = {
            "lat": latitude,
            "lon": longitude,
            "format": "json",
            "addressdetails": 1,
        }

        headers = {"User-Agent": self.USER_AGENT}

        response = requests.get(reverse_url, params=params, headers=headers, timeout=10)
        response.raise_for_status()

        result = response.json()
        if result and "address" in result:
            address = result["address"]
            return {
                "street": address.get("road", ""),
                "house_number": address.get("house_number", ""),
                "neighborhood": address.get("neighbourhood", address.get("suburb", "")),
                "city": address.get("city", address.get("town", "")),
                "region": address.get("state", ""),
                "postal_code": address.get("postcode", ""),
                "country": address.get("country", ""),
            }

        return None

    def _rate_limit(self) -> None:
        """
        Apply rate limiting to respect Nominatim's usage policy.

        Ensures at least MIN_REQUEST_INTERVAL seconds between requests.
        """
        current_time = time.time()
        elapsed = current_time - self._last_request_time

        if elapsed < self.MIN_REQUEST_INTERVAL:
            sleep_time = self.MIN_REQUEST_INTERVAL - elapsed
            time.sleep(sleep_time)

        self._last_request_time = time.time()

    def _get_cache_key(self, address: str) -> str:
        """
        Generate a cache key for an address.

        Args:
            address: Address string

        Returns:
            Cache key string
        """
        # Use MD5 hash to keep keys a reasonable length
        address_hash = hashlib.md5(address.lower().encode()).hexdigest()
        return f"geocode:{address_hash}"


# Module-level instance for convenience
_service_instance: Optional[GeocodingService] = None


def get_geocoding_service() -> GeocodingService:
    """
    Get the singleton geocoding service instance.

    Returns:
        GeocodingService instance
    """
    global _service_instance
    if _service_instance is None:
        _service_instance = GeocodingService()
    return _service_instance
