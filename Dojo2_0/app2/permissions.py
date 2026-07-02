from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.has_module_permission('dashboard', 'manage')
        )


class CanManageGroupMembership(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated

        if request.method == 'POST':
            return request.user.has_module_permission('groups', 'create')

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        if request.user.has_module_permission('groups', 'manage'):
            return True

        if not hasattr(request.user, 'lms_profile'):
            return False

        if request.method == 'PATCH' and request.user.has_module_permission('groups', 'update'):
            return obj.team_leaders.filter(pk=request.user.pk).exists()

        return False


class IsAdminOrTeamLeadOrReadOnly(BasePermission):
    """
    - Roles with course manage/create permissions can create and delete assignments.
    - Employees can only list their own assignments.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return True

        if request.user.has_any_module_permission('courses', ('create', 'update', 'approve', 'manage')):
            return True

        return (
            request.user.has_module_permission('courses', 'create')
            or request.user.has_module_permission('courses', 'manage')
        )

    def has_object_permission(self, request, view, obj):
        if request.user.has_module_permission('courses', 'manage'):
            return True

        if request.user.has_any_module_permission('courses', ('create', 'update', 'approve', 'manage')):
            return obj.assigned_by == request.user

        return False
