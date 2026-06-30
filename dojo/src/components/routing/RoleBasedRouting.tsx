import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { UserRole } from '../../components/constants/types';
import { hasAnyModuleAccess, resolveDefaultLandingPath } from '../constants/permissions';

interface RoleBasedRouteProps {
  allowedRoles?: UserRole[];
  allowedModules?: string[];
}

const BUILT_IN_ROLES = ['admin', 'team-leader', 'employee'] as const;

const isCustomRole = (role: string) =>
  !BUILT_IN_ROLES.includes(role as (typeof BUILT_IN_ROLES)[number]);

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  allowedRoles = [],
  allowedModules = [],
}) => {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (loading) {
    return <div className="p-4 text-center">Checking permissions...</div>;
  }

  // 1. If not logged in, kick to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const roleName = String(user.role || '');
  const allowsGeneralAccess =
    allowedRoles.includes('admin') &&
    allowedRoles.includes('team-leader') &&
    allowedRoles.includes('employee');
  const hasModuleMatch =
    allowedModules.length > 0 && hasAnyModuleAccess(user, allowedModules);

  if (hasModuleMatch) {
    return <Outlet />;
  }

  // 2. If User's role is NOT in the allowed list for this specific route
  if (!allowedRoles.includes(roleName as UserRole)) {
    if (isCustomRole(roleName) && allowsGeneralAccess) {
      return <Outlet />;
    }

    return <Navigate to={resolveDefaultLandingPath(user)} replace />;
  }

  // 3. Authorized -> Render the protected component
  return <Outlet />;
};

export default RoleBasedRoute;
