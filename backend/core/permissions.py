from rest_framework import permissions


class IsAdminOrManager(permissions.BasePermission):
    """
    Custom permission to only allow admins and managers to perform certain actions.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Allow read operations for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Allow write operations only for admins and managers
        return request.user.role in ['admin', 'manager']


class IsAdminOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to perform actions.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role == 'admin'


class IsOwnerOrAdminOrManager(permissions.BasePermission):
    """
    Custom permission to allow users to edit their own data, or admins/managers to edit any data.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Read permissions for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for admin, manager, or the owner
        if request.user.role in ['admin', 'manager']:
            return True
        
        # Check if user is the owner (for user-related objects)
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False
