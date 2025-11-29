# Django Best Practices

This document outlines the Django best practices and patterns we follow in this project.

## App Organization

### Separation of Concerns
- **`users` app**: Handles all user-related functionality
  - Custom User model
  - User serializers
  - User admin configuration
  - Authentication logic (via Djoser)

- **`api` app**: Handles business domain logic
  - Property models
  - Region models
  - Property/Region serializers
  - Property/Region views/endpoints

### App Structure Pattern
Each Django app should have a single, well-defined responsibility:
```
app_name/
├── models.py          # Domain models
├── serializers.py     # API serializers (if needed)
├── views.py           # ViewSets/API views
├── urls.py            # URL routing
├── admin.py           # Admin configuration
├── tests.py           # Unit tests
└── migrations/        # Database migrations
```

## Model Best Practices

### Custom User Model
- ✅ Always create a custom User model at project start
- ✅ Use `AbstractUser` for simple extensions
- ✅ Set `AUTH_USER_MODEL` in settings before first migration
- ✅ Use `settings.AUTH_USER_MODEL` for ForeignKeys, not direct User import

### Foreign Keys
```python
# ✅ Good - uses settings
user = models.ForeignKey(settings.AUTH_USER_MODEL, ...)

# ❌ Bad - direct import
from django.contrib.auth.models import User
user = models.ForeignKey(User, ...)
```

### Model Organization
- Keep models focused on a single domain
- Use related_name for reverse relationships
- Add Meta classes for ordering, verbose names
- Use `__str__` methods for readable representations
- Add `@property` methods for calculated fields (e.g., `price_per_sqm`)
- Add helper methods for data transformation (e.g., `get_coordinates_list()`)

### Model Methods
```python
# ✅ Good - Business logic in model methods
class Property(models.Model):
    @property
    def price_per_sqm(self) -> Optional[Decimal]:
        """Calculate price per square meter."""
        if self.size_sqm and self.size_sqm > 0:
            return self.price / self.size_sqm
        return None

    def get_coordinates_list(self) -> Optional[list]:
        """Get coordinates as [longitude, latitude] list."""
        # Handle both PostGIS and JSONField formats
        pass
```

## Serializer Best Practices

### Location
- Serializers belong in the same app as their models
- Use `get_user_model()` instead of direct User import
- Keep serializers close to models they serialize

### Structure
```python
# ✅ Good - serializer in same app as model
users/serializers.py
users/models.py

# ❌ Bad - serializer in different app
api/serializers.py (for User model)
users/models.py
```

## Settings Best Practices

### App Ordering
1. Django contrib apps
2. Third-party apps
3. Local apps (in dependency order)

### Configuration
- Use environment variables for sensitive data
- Keep development/production settings separate
- Use `AUTH_USER_MODEL` for custom user model

## URL Patterns

### Organization
- Each app has its own `urls.py`
- Include app URLs in main `urls.py`
- Use namespaces for clarity

```python
# core/urls.py
urlpatterns = [
    path('api/auth/', include('djoser.urls')),  # Third-party
    path('api/', include('api.urls')),          # Local apps
]
```

## Admin Configuration

### Registration
- Register models in their respective app's `admin.py`
- Use custom admin classes for better UX
- Keep admin configuration close to models

## Testing

### Organization
- Tests in each app's `tests.py` or `tests/` directory
- Test models, views, serializers separately
- Use Django's TestCase for database tests

## Migration Best Practices

### Timing
- Create migrations immediately after model changes
- Never edit existing migrations (create new ones)
- Test migrations on clean database

### Custom User Model
- Must be created before first migration
- Cannot be changed after first migration
- Always use `AUTH_USER_MODEL` in ForeignKeys

## Code Organization Principles

1. **Single Responsibility**: Each app has one clear purpose
2. **DRY (Don't Repeat Yourself)**: Reuse code, avoid duplication
3. **Explicit is Better than Implicit**: Clear naming, obvious structure
4. **Separation of Concerns**: Models, views, serializers in appropriate places
5. **Dependency Direction**: Lower-level apps don't depend on higher-level apps

## Service Layer Pattern

### Purpose
Business logic should be separated from views and serializers into service classes.
This keeps views thin and makes business logic reusable and testable.

### Structure
```
api/
├── services/          # Business logic layer
│   ├── __init__.py
│   └── property_service.py
├── utils/             # Utility functions
│   ├── __init__.py
│   └── coordinates.py
├── permissions.py     # Custom permission classes
└── tests/             # Test suite
    ├── __init__.py
    ├── test_models.py
    └── test_services.py
```

### Service Layer Guidelines
- Services contain business logic that doesn't belong in models or views
- Services are stateless (use `@staticmethod` or class methods)
- Services can be called from views, serializers, or other services
- Keep services focused on a single domain (e.g., `PropertyService`)

### Example
```python
# ✅ Good - Business logic in service
from api.services.property_service import PropertyService

comparison = PropertyService.compare_to_region_average(property)

# ❌ Bad - Business logic in view
def compare_to_region(property):
    # Complex calculation logic here...
    pass
```

## Current App Structure

```
backend/
├── core/              # Project settings and configuration
├── users/             # User management and authentication
│   ├── models.py      # Custom User model
│   ├── serializers.py # User serializers
│   ├── views.py       # User views (if needed)
│   └── admin.py       # User admin
└── api/               # Business domain (Properties, Regions)
    ├── models.py      # Property, Region models
    ├── serializers/   # Property, Region serializers
    ├── services/      # Business logic layer
    ├── utils/         # Utility functions
    ├── permissions.py # Custom permissions
    ├── views.py       # API endpoints
    ├── admin.py       # Admin configuration
    └── tests/         # Test suite
```

## References

- [Django Best Practices](https://docs.djangoproject.com/en/stable/misc/design-philosophies/)
- [Two Scoops of Django](https://www.feldroy.com/books/two-scoops-of-django-3-x)
- [Django Coding Style](https://docs.djangoproject.com/en/stable/internals/contributing/writing-code/coding-style/)


