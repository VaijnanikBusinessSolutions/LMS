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

        action_name = getattr(view, 'action', None)
        module_map = getattr(view, 'rbac_module_map', {})
        module_slug = module_map.get(action_name, getattr(view, 'rbac_module', None))

        if not module_slug:
            return True

        action_map = dict(self.default_action_map)
        action_map.update(getattr(view, 'rbac_action_map', {}))
        action = action_map.get(action_name, 'view')

        if isinstance(module_slug, (list, tuple, set)):
            return any(user.has_module_permission(single_module, action) for single_module in module_slug)

        return user.has_module_permission(module_slug, action)
