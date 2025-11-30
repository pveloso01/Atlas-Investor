from django.contrib import admin
from django.db.models import Count
from .models import Property, Region, SavedProperty


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    """Admin configuration for Region model."""
    list_display = [
        'name', 'code', 'property_count', 'avg_price_per_sqm', 
        'avg_rent', 'avg_yield', 'updated_at'
    ]
    list_filter = ['created_at', 'updated_at']
    search_fields = ['name', 'code']
    ordering = ['name']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        """Annotate queryset with property count for sorting."""
        queryset = super().get_queryset(request)
        return queryset.annotate(property_count_annotation=Count('property_set'))
    
    def property_count(self, obj):
        """Display count of properties in this region."""
        # Use annotation if available, otherwise fall back to count()
        if hasattr(obj, 'property_count_annotation'):
            return obj.property_count_annotation
        return obj.property_set.count()  # type: ignore[attr-defined]
    property_count.short_description = 'Properties'  # type: ignore[attr-defined]
    property_count.admin_order_field = 'property_count_annotation'  # type: ignore[attr-defined]


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    """Admin configuration for Property model."""
    list_display = [
        'address', 'property_type', 'price', 'size_sqm', 'price_per_sqm',
        'bedrooms', 'bathrooms', 'year_built', 'condition', 'energy_rating',
        'listing_status', 'region', 'saved_count', 'created_at'
    ]
    list_filter = [
        'property_type', 'region', 'listing_status', 'condition', 
        'energy_rating', 'has_elevator', 'has_balcony', 'has_terrace',
        'created_at', 'updated_at'
    ]
    search_fields = ['address', 'external_id', 'description']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    raw_id_fields = ['region']  # Use raw_id for better performance with many regions
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('external_id', 'address', 'description', 'coordinates', 'property_type', 'region')
        }),
        ('Pricing & Size', {
            'fields': ('price', 'size_sqm')
        }),
        ('Property Details', {
            'fields': ('bedrooms', 'bathrooms', 'year_built', 'condition')
        }),
        ('Apartment Details', {
            'fields': ('floor_number', 'total_floors', 'has_elevator'),
            'classes': ('collapse',)
        }),
        ('Features', {
            'fields': ('parking_spaces', 'has_balcony', 'has_terrace', 'energy_rating'),
            'classes': ('collapse',)
        }),
        ('Listing Information', {
            'fields': ('listing_status', 'source_url', 'last_synced_at')
        }),
        ('Media', {
            'fields': ('images',),
            'classes': ('collapse',)
        }),
        ('Additional Data', {
            'fields': ('raw_data',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        """Annotate queryset with saved count for sorting."""
        queryset = super().get_queryset(request)
        return queryset.annotate(saved_count_annotation=Count('saved_by'))
    
    def price_per_sqm(self, obj):
        """Display calculated price per square meter."""
        price_per_sqm = obj.price_per_sqm
        if price_per_sqm:
            return f"€{price_per_sqm:,.2f}"
        return "-"
    price_per_sqm.short_description = 'Price/m²'  # type: ignore[attr-defined]
    price_per_sqm.admin_order_field = 'price'  # type: ignore[attr-defined]
    
    def saved_count(self, obj):
        """Display count of users who saved this property."""
        # Use annotation if available, otherwise fall back to count()
        if hasattr(obj, 'saved_count_annotation'):
            return obj.saved_count_annotation
        return obj.saved_by.count()  # type: ignore[attr-defined]
    saved_count.short_description = 'Saved By'  # type: ignore[attr-defined]
    saved_count.admin_order_field = 'saved_count_annotation'  # type: ignore[attr-defined]


@admin.register(SavedProperty)
class SavedPropertyAdmin(admin.ModelAdmin):
    """Admin configuration for SavedProperty model."""
    list_display = ['user', 'property', 'property_price', 'property_region', 'has_notes', 'created_at']
    list_filter = ['created_at', 'property__region', 'property__property_type']
    search_fields = ['user__email', 'user__username', 'property__address', 'property__external_id', 'notes']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
    raw_id_fields = ['user', 'property']  # Use raw_id for better performance
    
    fieldsets = (
        ('Relationship', {
            'fields': ('user', 'property')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def property_price(self, obj):
        """Display property price."""
        return f"€{obj.property.price:,.0f}"  # type: ignore[attr-defined]
    property_price.short_description = 'Price'  # type: ignore[attr-defined]
    property_price.admin_order_field = 'property__price'  # type: ignore[attr-defined]
    
    def property_region(self, obj):
        """Display property region."""
        return obj.property.region  # type: ignore[attr-defined]
    property_region.short_description = 'Region'  # type: ignore[attr-defined]
    property_region.admin_order_field = 'property__region'  # type: ignore[attr-defined]
    
    def has_notes(self, obj):
        """Display whether notes exist."""
        return bool(obj.notes)
    has_notes.short_description = 'Has Notes'  # type: ignore[attr-defined]
    has_notes.boolean = True  # type: ignore[attr-defined]

