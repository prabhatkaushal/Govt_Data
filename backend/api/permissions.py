from rest_framework import permissions

class IsInvestigator(permissions.BasePermission):
    """
    Allows access only to Investigating Officers.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'INVESTIGATING_OFFICER')

class IsLegalOfficer(permissions.BasePermission):
    """
    Allows access only to Legal Officers.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'LEGAL_OFFICER')

class IsReadOnly(permissions.BasePermission):
    """
    Allows read-only access.
    """
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS
