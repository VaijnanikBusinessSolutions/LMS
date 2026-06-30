from rest_framework.permissions import BasePermission

class RBACPermission(BasePermission):
    """
    Enforces module-level RBAC for DRF views.

    Views can declare:
    - `rbac_module = "users"`
    - `rbac_action_map = {"list": "view", "create": "create"}`
    """

    default_action_map = {
        'list': 'view',
        'retrieve': 'view',
        'me': 'view',
        'create': 'create',
        'update': 'update',
        'partial_update': 'update',
        'destroy': 'delete',
    }

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        module_slug = getattr(view, 'rbac_module', None)
        if not module_slug:
            return True

        action_map = dict(self.default_action_map)
        action_map.update(getattr(view, 'rbac_action_map', {}))
        action = action_map.get(getattr(view, 'action', None), 'view')
        return user.has_module_permission(module_slug, action)
