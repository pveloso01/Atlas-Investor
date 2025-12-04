"""
Cache decorators for optimizing API responses.

These decorators use Redis to cache expensive queries and computations.
"""

import hashlib
import json
from functools import wraps
from typing import Any, Callable

from django.core.cache import cache
from django.conf import settings
from rest_framework.request import Request
from rest_framework.response import Response


def cache_api_response(timeout: int = 300, key_prefix: str = "api"):
    """
    Cache API endpoint responses in Redis.
    
    Args:
        timeout: Cache timeout in seconds (default: 5 minutes)
        key_prefix: Prefix for cache keys
        
    Usage:
        @cache_api_response(timeout=600, key_prefix="properties")
        def list(self, request):
            ...
    """
    def decorator(view_func: Callable) -> Callable:
        @wraps(view_func)
        def wrapper(self, request: Request, *args: Any, **kwargs: Any) -> Response:
            # Skip caching for non-GET requests
            if request.method != "GET":
                return view_func(self, request, *args, **kwargs)
            
            # Generate cache key from request path and query params
            cache_key = _generate_cache_key(
                key_prefix,
                request.path,
                request.query_params,
                args,
                kwargs,
            )
            
            # Try to get cached response
            cached_response = cache.get(cache_key)
            if cached_response is not None:
                return Response(cached_response)
            
            # Execute view and cache response
            response = view_func(self, request, *args, **kwargs)
            
            # Only cache successful responses
            if response.status_code == 200 and isinstance(response, Response):
                cache.set(cache_key, response.data, timeout)
            
            return response
        
        return wrapper
    return decorator


def cache_queryset(timeout: int = 300, key_prefix: str = "queryset"):
    """
    Cache queryset results.
    
    Args:
        timeout: Cache timeout in seconds
        key_prefix: Prefix for cache keys
        
    Usage:
        @cache_queryset(timeout=600, key_prefix="properties_list")
        def get_queryset(self):
            return Property.objects.filter(...)
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(self, *args: Any, **kwargs: Any):
            # Generate cache key
            cache_key = _generate_cache_key(
                key_prefix,
                func.__name__,
                getattr(self.request, "query_params", {}),
                args,
                kwargs,
            )
            
            # Try to get cached queryset results
            cached_result = cache.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = func(self, *args, **kwargs)
            
            # Convert queryset to list for caching
            if hasattr(result, "all"):
                result_list = list(result)
                cache.set(cache_key, result_list, timeout)
                return result_list
            else:
                cache.set(cache_key, result, timeout)
                return result
        
        return wrapper
    return decorator


def invalidate_cache_on_save(key_patterns: list[str]):
    """
    Invalidate cache keys matching patterns when model is saved.
    
    Args:
        key_patterns: List of cache key patterns to invalidate
        
    Usage:
        @invalidate_cache_on_save(["properties:*", "api:properties:*"])
        def perform_create(self, serializer):
            serializer.save()
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(self, *args: Any, **kwargs: Any):
            # Execute the original function
            result = func(self, *args, **kwargs)
            
            # Invalidate cache patterns
            for pattern in key_patterns:
                _delete_cache_pattern(pattern)
            
            return result
        
        return wrapper
    return decorator


def _generate_cache_key(prefix: str, path: str, params: dict, args: tuple, kwargs: dict) -> str:
    """
    Generate a unique cache key from request parameters.
    
    Args:
        prefix: Cache key prefix
        path: Request path
        params: Query parameters
        args: Positional arguments
        kwargs: Keyword arguments
        
    Returns:
        Unique cache key string
    """
    # Sort params for consistent hashing
    params_str = json.dumps(dict(sorted(params.items())), sort_keys=True)
    args_str = str(args)
    kwargs_str = json.dumps(dict(sorted(kwargs.items())), sort_keys=True)
    
    # Create hash of all parameters
    key_data = f"{path}:{params_str}:{args_str}:{kwargs_str}"
    key_hash = hashlib.md5(key_data.encode()).hexdigest()
    
    return f"{prefix}:{key_hash}"


def _delete_cache_pattern(pattern: str) -> int:
    """
    Delete all cache keys matching a pattern.
    
    Args:
        pattern: Cache key pattern (e.g., "properties:*")
        
    Returns:
        Number of keys deleted
    """
    try:
        # Use django-redis delete_pattern if available
        if hasattr(cache, "delete_pattern"):
            return cache.delete_pattern(pattern)
        else:
            # Fallback: iterate and delete matching keys
            # Note: This is less efficient and should only be used as fallback
            keys = cache.keys(pattern)
            if keys:
                cache.delete_many(keys)
                return len(keys)
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error deleting cache pattern {pattern}: {e}")
    
    return 0


def get_cache_stats() -> dict[str, Any]:
    """
    Get Redis cache statistics.
    
    Returns:
        Dictionary with cache statistics
    """
    try:
        if hasattr(cache, "client") and hasattr(cache.client, "get_client"):
            client = cache.client.get_client()
            info = client.info()
            return {
                "connected": True,
                "used_memory": info.get("used_memory_human", "N/A"),
                "total_keys": info.get("db0", {}).get("keys", 0) if "db0" in info else 0,
                "hits": info.get("keyspace_hits", 0),
                "misses": info.get("keyspace_misses", 0),
                "hit_rate": (
                    info.get("keyspace_hits", 0) / 
                    max(info.get("keyspace_hits", 0) + info.get("keyspace_misses", 0), 1) * 100
                ),
            }
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error getting cache stats: {e}")
    
    return {"connected": False, "error": "Unable to connect to cache"}

