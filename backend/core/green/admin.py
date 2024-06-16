from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Category, CustomUserProfile, Product, SellerProfile, Order, Image, User2

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'whatsapp_number', 'is_active', 'is_staff', 'email_confirmed',  'email_verification_code')
    list_filter = ('is_staff', 'is_active', 'email_confirmed')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal Info'), {'fields': ('first_name', 'last_name', 'whatsapp_number')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'email_confirmed', 'email_verification_code')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'whatsapp_number', 'is_active', 'is_staff', 'email_confirmed')}
        ),
    )
    search_fields = ('email', 'first_name', 'last_name', 'whatsapp_number')
    ordering = ('email',)

class CustomUserProfileAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name', 'whatsapp_number', 'id_proof']

admin.site.register(CustomUserProfile, CustomUserProfileAdmin)  # Register with CustomUserProfileAdmin class
admin.site.register(SellerProfile)
admin.site.register(Order)

admin.site.register(Category)
admin.site.register(Image)
admin.site.register(User2)


class CategoryInline(admin.TabularInline):
    model = Product.categories.through  # Use the intermediate model for ManyToMany relationship
    extra = 1  # Number of extra inline forms to display

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [CategoryInline]