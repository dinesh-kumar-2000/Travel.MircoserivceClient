import { RootState } from '@/store/store';
import { Tenant } from '@/types';
import React, { createContext, ReactNode, useContext } from 'react';
import { useSelector } from 'react-redux';

/**
 * TenantContext - Provides tenant information throughout the app
 *
 * Note: This context wraps the Redux store state for easier access
 * The actual tenant state is managed by Redux (tenantSlice)
 */

interface TenantContextValue {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  isSuperAdmin: boolean;
  isTenantAdmin: boolean;
  isUser: boolean;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

/**
 * TenantProvider - Provides tenant context to the application
 *
 * @example
 * <TenantProvider>
 *   <App />
 * </TenantProvider>
 */
export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const { currentTenant, isLoading, error } = useSelector(
    (state: RootState) => state.tenant
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // Determine user role context
  const isSuperAdmin = user?.role === 'SuperAdmin';
  const isTenantAdmin = user?.role === 'TenantAdmin';
  const isUser = user?.role === 'User';

  const value: TenantContextValue = {
    tenant: currentTenant,
    isLoading,
    error,
    isSuperAdmin,
    isTenantAdmin,
    isUser,
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
};

/**
 * useTenant - Hook to access tenant context
 *
 * @returns Tenant context value
 * @throws Error if used outside TenantProvider
 *
 * @example
 * const { tenant, isLoading, isSuperAdmin } = useTenant();
 *
 * if (tenant) {
 *   console.log('Current tenant:', tenant.name);
 * }
 */
export const useTenant = (): TenantContextValue => {
  const context = useContext(TenantContext);

  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }

  return context;
};

/**
 * withTenant - Higher-order component to inject tenant props
 *
 * @param Component - Component to wrap
 * @returns Wrapped component with tenant props
 *
 * @example
 * const MyComponent = withTenant(({ tenant }) => {
 *   return <div>{tenant?.name}</div>;
 * });
 */
export const withTenant = <P extends object>(
  Component: React.ComponentType<P & { tenant: Tenant | null }>
) => {
  return (props: P) => {
    const { tenant } = useTenant();
    return <Component {...props} tenant={tenant} />;
  };
};
