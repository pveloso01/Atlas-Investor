"""
Coordinate utility functions.
"""
from typing import Optional, List

# Try to import PostGIS Point, fallback if not available
try:
    from django.contrib.gis.geos import Point
    HAS_POSTGIS = True
except (ImportError, Exception):
    HAS_POSTGIS = False
    Point = None  # type: ignore[assignment, misc]


def normalize_coordinates(coordinates) -> Optional[List[float]]:
    """
    Normalize coordinates to [longitude, latitude] format.
    
    Handles both PostGIS PointField and JSONField formats.
    This is a utility function that can be used across the application.
    """
    if not coordinates:
        return None
    
    # Handle PostGIS PointField (has .x and .y attributes)
    if hasattr(coordinates, 'x') and hasattr(coordinates, 'y'):
        return [float(coordinates.x), float(coordinates.y)]
    
    # Handle JSONField (already a list [longitude, latitude])
    if isinstance(coordinates, (list, tuple)) and len(coordinates) >= 2:
        return [float(coordinates[0]), float(coordinates[1])]
    
    return None


def create_point_from_coordinates(
    coordinates: Optional[List[float]],
    srid: int = 4326
) -> Optional[Point]:  # type: ignore[valid-type]
    """
    Create a PostGIS Point from [longitude, latitude] coordinates.
    
    Returns None if PostGIS is not available or coordinates is None.
    """
    if not HAS_POSTGIS or Point is None:
        return None
    
    if coordinates is None:
        return None
    
    if len(coordinates) >= 2:
        return Point(coordinates[0], coordinates[1], srid=srid)  # type: ignore[misc]
    
    return None

