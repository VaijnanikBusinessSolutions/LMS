from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)


class CanManageGroupMembership(BasePermission):
    def has_permission(self, request, view):
        # GET, HEAD, OPTIONS → allow any authenticated user
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated

        # POST (create) → only admin
        if request.method == 'POST':
            return request.user.is_staff

        # For PUT, PATCH, DELETE → let object-level permission decide
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Read access → always allowed
        if request.method in SAFE_METHODS:
            return True

        # Admin → full access (PUT, PATCH, DELETE)
        if request.user.is_staff:
            return True

        # Check for LMS Profile before checking UserType
        if not hasattr(request.user, 'lms_profile'):
            return False

        # Team Leader → ONLY allowed to PATCH (not PUT, not DELETE)
        if request.method == 'PATCH' and request.user.lms_profile.userType == 'team-leader':
            # Check if this user is actually a leader of this specific group
            return obj.team_leaders.filter(pk=request.user.pk).exists()

        # Everything else (PUT, DELETE) → blocked for team leaders
        return False


class IsAdminOrTeamLeadOrReadOnly(BasePermission):
    """
    - Admins/Team Leaders: Can create, list, delete assignments.
    - Employees: Can only list (view) their own assignments.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
            
        # Safe methods (GET) are allowed for everyone authenticated
        if request.method in SAFE_METHODS:
            return True
            
        # Check for LMS Profile
        is_team_lead = False
        if hasattr(request.user, 'lms_profile'):
             is_team_lead = (request.user.lms_profile.userType == 'team-leader')

        # Write methods (POST, DELETE) only for Admin or Team Leader
        return request.user.is_staff or is_team_lead

    def has_object_permission(self, request, view, obj):
        # Admin can delete anything
        if request.user.is_staff:
            return True
            
        # Check for LMS Profile
        is_team_lead = False
        if hasattr(request.user, 'lms_profile'):
             is_team_lead = (request.user.lms_profile.userType == 'team-leader')

        # Team Leader can delete assignments they created
        if is_team_lead:
            # Optional: Allow deleting only if they created it
            return obj.assigned_by == request.user
            
        # Employees cannot modify assignments
        return False 