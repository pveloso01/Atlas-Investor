from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Custom admin for User model."""
    list_display = [
        'email', 'username', 'first_name', 'last_name', 
        'saved_properties_count', 'is_staff', 'is_active', 'date_joined'
    ]
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'date_joined']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-date_joined']
    readonly_fields = ['date_joined', 'last_login']
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    def saved_properties_count(self, obj):
        """Display count of saved properties."""
        count = obj.saved_properties.count()  # type: ignore[attr-defined]
        if count > 0:
            return format_html(
                '<a href="/admin/api/savedproperty/?user__id__exact={}">{}</a>',
                obj.id,
                count
            )
        return 0
    saved_properties_count.short_description = 'Saved Properties'
    saved_properties_count.admin_order_field = 'saved_properties__count'

