import { usePermissions } from '@/hooks/usePermissions';
import { UserRole } from '@/types';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  /**
   * Allowed roles for this route
   */
  allowedRoles: UserRole[];
  /**
   * Redirect path if user doesn't have required role
   * @default '/unauthorized'
   */
  redirectTo?: string;
  /**
   * Optional permissions required (in addition to role)
   */
  requiredPermissions?: string[];
  /**
   * If true, user must have ALL required permissions
   * If false, user needs ANY required permission
   * @default false
   */
  requireAllPermissions?: boolean;
  /**
   * Custom loading component
   */
  loadingComponent?: React.ReactNode;
  /**
   * Custom unauthorized component
   */
  unauthorizedComponent?: React.ReactNode;
}

/**
 * RoleBasedRoute Component
 *
 * Protects routes based on user roles and optionally permissions
 * Automatically redirects unauthorized users
 *
 * @example
 * <RoleBasedRoute allowedRoles={['SuperAdmin']}>
 *   <SuperAdminDashboard />
 * </RoleBasedRoute>
 *
 * @example
 * // With permissions
 * <RoleBasedRoute
 *   allowedRoles={['TenantAdmin', 'SuperAdmin']}
 *   requiredPermissions={['booking:manage_all']}
 * >
 *   <BookingManagement />
 * </RoleBasedRoute>
 */
export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/unauthorized',
  requiredPermissions,
  requireAllPermissions = false,
  unauthorizedComponent,
}) => {
  const location = useLocation();
  const { isAuthenticated, hasAnyRole, hasAllPermissions, hasAnyPermission } =
    usePermissions();

  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login with return URL
    return (
      <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
    );
  }

  // Check if user has required role
  const hasRequiredRole = hasAnyRole(allowedRoles);

  if (!hasRequiredRole) {
    if (unauthorizedComponent) {
      return <>{unauthorizedComponent}</>;
    }

    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    );
  }

  // Check permissions if specified
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPermissions = requireAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasPermissions) {
      if (unauthorizedComponent) {
        return <>{unauthorizedComponent}</>;
      }

      return (
        <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
      );
    }
  }

  // User is authorized, render the protected content
  return <>{children}</>;
};

/**
 * SuperAdminRoute - Convenience wrapper for SuperAdmin-only routes
 */
export const SuperAdminRoute: React.FC<{
  children: React.ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo }) => {
  return (
    <RoleBasedRoute allowedRoles={['SuperAdmin']} redirectTo={redirectTo}>
      {children}
    </RoleBasedRoute>
  );
};

/**
 * TenantAdminRoute - Convenience wrapper for TenantAdmin routes
 */
export const TenantAdminRoute: React.FC<{
  children: React.ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo }) => {
  return (
    <RoleBasedRoute allowedRoles={['TenantAdmin']} redirectTo={redirectTo}>
      {children}
    </RoleBasedRoute>
  );
};

/**
 * AdminRoute - Convenience wrapper for any admin (SuperAdmin or TenantAdmin)
 */
export const AdminRoute: React.FC<{
  children: React.ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo }) => {
  return (
    <RoleBasedRoute
      allowedRoles={['SuperAdmin', 'TenantAdmin']}
      redirectTo={redirectTo}
    >
      {children}
    </RoleBasedRoute>
  );
};

/**
 * UserRoute - Convenience wrapper for regular User routes
 */
export const UserRoute: React.FC<{
  children: React.ReactNode;
  redirectTo?: string;
}> = ({ children, redirectTo }) => {
  return (
    <RoleBasedRoute allowedRoles={['User']} redirectTo={redirectTo}>
      {children}
    </RoleBasedRoute>
  );
};
