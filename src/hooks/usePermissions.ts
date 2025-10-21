import { UserRole } from '@/types';
import { useAppSelector } from './useAppSelector';

interface PermissionConfig {
  roles: UserRole[];
  permissions?: string[];
  requireAll?: boolean; // If true, user must have ALL permissions; if false, user needs ANY permission
}

/**
 * usePermissions Hook
 *
 * Provides role-based and permission-based access control
 *
 * @example
 * const { hasRole, hasPermission, canAccess } = usePermissions();
 *
 * if (hasRole('SuperAdmin')) {
 *   // Show super admin content
 * }
 *
 * if (canAccess({ roles: ['TenantAdmin', 'SuperAdmin'] })) {
 *   // Show admin content
 * }
 */
export const usePermissions = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { currentTenant } = useAppSelector((state) => state.tenant);

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some((role) => user?.role === role);
  };

  /**
   * Check if user has all of the specified roles
   * (Usually not needed, but provided for completeness)
   */
  const hasAllRoles = (roles: UserRole[]): boolean => {
    return roles.every((role) => user?.role === role);
  };

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user?.permissions) return false;
    return user.permissions.includes(permission);
  };

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user?.permissions) return false;
    return permissions.some((perm) => user.permissions?.includes(perm));
  };

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user?.permissions) return false;
    return permissions.every((perm) => user.permissions?.includes(perm));
  };

  /**
   * Check if user can access a resource based on config
   */
  const canAccess = (config: PermissionConfig): boolean => {
    // Check roles
    const hasRequiredRole = hasAnyRole(config.roles);

    if (!hasRequiredRole) return false;

    // If no specific permissions are required, role check is sufficient
    if (!config.permissions || config.permissions.length === 0) {
      return true;
    }

    // Check permissions
    if (config.requireAll) {
      return hasAllPermissions(config.permissions);
    } else {
      return hasAnyPermission(config.permissions);
    }
  };

  /**
   * Check if user is the owner of a resource
   */
  const isOwner = (ownerId: string): boolean => {
    return user?.id === ownerId;
  };

  /**
   * Check if user belongs to the current tenant
   */
  const isTenantMember = (): boolean => {
    if (!user || !currentTenant) return false;
    return user.tenantId === currentTenant.id;
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = (): boolean => {
    return !!user;
  };

  /**
   * Check if user is a SuperAdmin
   */
  const isSuperAdmin = (): boolean => {
    return hasRole('SuperAdmin');
  };

  /**
   * Check if user is a TenantAdmin
   */
  const isTenantAdmin = (): boolean => {
    return hasRole('TenantAdmin');
  };

  /**
   * Check if user is a regular User
   */
  const isRegularUser = (): boolean => {
    return hasRole('User');
  };

  /**
   * Check if user is an admin (SuperAdmin or TenantAdmin)
   */
  const isAdmin = (): boolean => {
    return hasAnyRole(['SuperAdmin', 'TenantAdmin']);
  };

  /**
   * Get user's role
   */
  const getRole = (): UserRole | null => {
    return user?.role || null;
  };

  /**
   * Get user's permissions
   */
  const getPermissions = (): string[] => {
    return user?.permissions || [];
  };

  return {
    // Role checks
    hasRole,
    hasAnyRole,
    hasAllRoles,

    // Permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // Combined access check
    canAccess,

    // Ownership check
    isOwner,
    isTenantMember,

    // Authentication check
    isAuthenticated,

    // Convenience role checks
    isSuperAdmin,
    isTenantAdmin,
    isRegularUser,
    isAdmin,

    // Getters
    getRole,
    getPermissions,
  };
};

/**
 * Permission constants for commonly used permissions
 */
export const Permissions = {
  // Booking permissions
  BOOKING_CREATE: 'booking:create',
  BOOKING_READ: 'booking:read',
  BOOKING_UPDATE: 'booking:update',
  BOOKING_DELETE: 'booking:delete',
  BOOKING_MANAGE_ALL: 'booking:manage_all',

  // User permissions
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE_ALL: 'user:manage_all',

  // Catalog permissions
  CATALOG_CREATE: 'catalog:create',
  CATALOG_READ: 'catalog:read',
  CATALOG_UPDATE: 'catalog:update',
  CATALOG_DELETE: 'catalog:delete',
  CATALOG_MANAGE_ALL: 'catalog:manage_all',

  // Tenant permissions
  TENANT_CREATE: 'tenant:create',
  TENANT_READ: 'tenant:read',
  TENANT_UPDATE: 'tenant:update',
  TENANT_DELETE: 'tenant:delete',
  TENANT_MANAGE_ALL: 'tenant:manage_all',

  // Analytics permissions
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',

  // Settings permissions
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_UPDATE: 'settings:update',

  // Payment permissions
  PAYMENT_PROCESS: 'payment:process',
  PAYMENT_REFUND: 'payment:refund',
  PAYMENT_VIEW_ALL: 'payment:view_all',
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];
