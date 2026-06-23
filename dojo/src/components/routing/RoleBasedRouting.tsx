import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { UserRole } from '../../components/constants/types';

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (loading) {
    return <div className="p-4 text-center">Checking permissions...</div>;
  }

  // 1. If not logged in, kick to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. If User's role is NOT in the allowed list for this specific route
  if (!allowedRoles.includes(user.role as UserRole)) {
    // Redirect them to their designated dashboard based on their actual role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'team-leader':
        return <Navigate to="/team-lead/dashboard" replace />;
      case 'employee':
        return <Navigate to="/employee/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // 3. Authorized -> Render the protected component
  return <Outlet />;
};

export default RoleBasedRoute;