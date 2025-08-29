from django.contrib import admin
from .models import Company, Department, Employee


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'number_of_departments', 'number_of_employees']
    search_fields = ['company_name']
    ordering = ['company_name']
    readonly_fields = ['number_of_departments', 'number_of_employees']
    
    fieldsets = (
        ('Company Information', {
            'fields': ('company_name',)
        }),
        ('Statistics', {
            'fields': ('number_of_departments', 'number_of_employees'),
            'classes': ('collapse',),
        }),
    )


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['department_name', 'company', 'number_of_employees']
    list_filter = ['company']
    search_fields = ['department_name', 'company__company_name']
    ordering = ['company__company_name', 'department_name']
    readonly_fields = ['number_of_employees']
    
    fieldsets = (
        ('Department Information', {
            'fields': ('company', 'department_name')
        }),
        ('Statistics', {
            'fields': ('number_of_employees',),
            'classes': ('collapse',),
        }),
    )


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = [
        'employee_name', 'email_address', 'company', 'department', 
        'employee_status', 'designation', 'hired_on', 'days_employed'
    ]
    list_filter = [
        'company', 'department', 'employee_status', 'hired_on'
    ]
    search_fields = [
        'employee_name', 'email_address', 'mobile_number', 
        'designation', 'company__company_name', 'department__department_name'
    ]
    ordering = ['company__company_name', 'department__department_name', 'employee_name']
    readonly_fields = ['days_employed']
    date_hierarchy = 'hired_on'
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('employee_name', 'email_address', 'mobile_number', 'address')
        }),
        ('Employment Details', {
            'fields': ('company', 'department', 'designation', 'employee_status', 'hired_on')
        }),
        ('Statistics', {
            'fields': ('days_employed',),
            'classes': ('collapse',),
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queries by selecting related objects"""
        queryset = super().get_queryset(request)
        return queryset.select_related('company', 'department')
    
    def save_model(self, request, obj, form, change):
        """Custom save logic"""
        # Clear hired_on if status is not 'hired'
        if obj.employee_status != 'hired':
            obj.hired_on = None
        super().save_model(request, obj, form, change)


# Additional admin customizations
admin.site.site_header = "Employee Management System"
admin.site.site_title = "EMS Admin"
admin.site.index_title = "Welcome to Employee Management System"
