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

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  allowedRoles = [],
  allowedModules = [],
}) => {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Keep already-authorized pages mounted during background auth refreshes.
  // Opening a file picker causes a window focus event, which can otherwise
  // unmount the course editor and reset it back to the course list.
  if (loading && (!isAuthenticated || !user)) {
    return <div className="p-4 text-center">Checking permissions...</div>;
  }

  // 1. If not logged in, kick to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const roleName = String(user.role || user.userType || '');
  const hasModuleMatch =
    allowedModules.length > 0 && hasAnyModuleAccess(user, allowedModules);

  if (hasModuleMatch) {
    return <Outlet />;
  }

  if (allowedModules.length > 0 && allowedRoles.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Access unavailable</h2>
          <p className="mt-2 text-sm text-slate-600">
            Your account does not currently have permission to open this page.
          </p>
        </div>
      </div>
    );
  }

  // 2. If User's role is NOT in the allowed list for this specific route
  if (!allowedRoles.includes(roleName as UserRole)) {
    return <Navigate to={resolveDefaultLandingPath(user)} replace />;
  }

  // 3. Authorized -> Render the protected component
  return <Outlet />;
};

export default RoleBasedRoute;
