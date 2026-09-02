from rest_framework import permissions

class IsInvestigator(permissions.BasePermission):
    """
    Allows access only to Investigating Officers or Super Admins.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['INVESTIGATING_OFFICER', 'SUPER_ADMIN'])

class IsLegalOfficer(permissions.BasePermission):
    """
    Allows access only to Legal Officers or Super Admins.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['LEGAL_OFFICER', 'SUPER_ADMIN'])

class IsReadOnly(permissions.BasePermission):
    """
    Allows read-only access.
    """
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS
