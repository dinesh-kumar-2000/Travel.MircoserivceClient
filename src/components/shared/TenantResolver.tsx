import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTenantBySubdomain } from '@/store/slices/tenantSlice';
import {
  getSubdomainInfo,
  getTenantFromStorage,
  isDevelopment,
} from '@/utils/tenantDetection';
import React, { useEffect, useState } from 'react';

interface TenantResolverProps {
  children: React.ReactNode;
  /**
   * Callback when tenant is successfully resolved
   */
  onTenantResolved?: () => void;
  /**
   * Callback when an error occurs during tenant resolution
   */
  onError?: (error: string) => void;
  /**
   * Custom loading component
   */
  loadingComponent?: React.ReactNode;
  /**
   * Custom error component
   */
  errorComponent?: (error: string) => React.ReactNode;
}

/**
 * TenantResolver Component
 *
 * Handles automatic tenant detection and resolution based on subdomain.
 * Wraps the application to ensure tenant context is loaded before rendering children.
 *
 * Features:
 * - Automatic subdomain detection
 * - Development mode support with localStorage fallback
 * - SuperAdmin subdomain handling (admin.domain.com)
 * - Loading and error states
 * - Tenant data fetching and Redux store updates
 *
 * @example
 * <TenantResolver>
 *   <App />
 * </TenantResolver>
 *
 * @example
 * // With custom loading and error components
 * <TenantResolver
 *   loadingComponent={<CustomLoader />}
 *   errorComponent={(error) => <CustomError message={error} />}
 * >
 *   <App />
 * </TenantResolver>
 */
export const TenantResolver: React.FC<TenantResolverProps> = ({
  children,
  onTenantResolved,
  onError,
  loadingComponent,
  errorComponent,
}) => {
  const dispatch = useAppDispatch();
  const tenantState = useAppSelector((state) => state.tenant);
  const tenantLoading = (tenantState as any).isLoading;

  const [isResolving, setIsResolving] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolveTenant = async () => {
      try {
        setIsResolving(true);
        setError(null);

        // Get subdomain information
        const subdomainInfo = getSubdomainInfo();

        // Skip tenant resolution for SuperAdmin
        if (subdomainInfo.isSuperAdmin) {
          console.log(
            '🔧 SuperAdmin mode detected - skipping tenant resolution'
          );
          setIsResolving(false);
          return;
        }

        // Handle development mode with localStorage fallback
        if (isDevelopment() && subdomainInfo.isLocalhost) {
          const storedTenant = getTenantFromStorage();

          if (storedTenant) {
            console.log(
              '🔧 Development mode: Using tenant from localStorage:',
              storedTenant
            );
            await dispatch(fetchTenantBySubdomain(storedTenant)).unwrap();
          } else {
            console.log(
              '⚠️ Development mode: No tenant in localStorage. Set via localStorage.setItem("dev_tenant_subdomain", "your-tenant")'
            );
          }

          setIsResolving(false);
          return;
        }

        // Production: Resolve tenant from subdomain
        if (subdomainInfo.isTenant && subdomainInfo.subdomain) {
          console.log(
            '🌐 Resolving tenant from subdomain:',
            subdomainInfo.subdomain
          );

          await dispatch(
            fetchTenantBySubdomain(subdomainInfo.subdomain)
          ).unwrap();

          if (onTenantResolved) {
            onTenantResolved();
          }
        } else {
          console.log('ℹ️ No tenant subdomain detected - using base domain');
        }

        setIsResolving(false);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to resolve tenant';
        console.error('❌ Tenant resolution error:', errorMessage);
        setError(errorMessage);
        setIsResolving(false);

        if (onError) {
          onError(errorMessage);
        }
      }
    };

    resolveTenant();
  }, [dispatch, onTenantResolved, onError]);

  // Show loading state
  if (isResolving || tenantLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading tenant information...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    if (errorComponent) {
      return <>{errorComponent(error)}</>;
    }

    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
              <svg
                className="h-6 w-6 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            Tenant Not Found
          </h1>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            {error}
          </p>
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render children when tenant is resolved (or not needed)
  return <>{children}</>;
};

/**
 * TenantResolverDebug Component
 *
 * Debug component to display current tenant resolution information
 * Only visible in development mode
 *
 * @example
 * {import.meta.env.DEV && <TenantResolverDebug />}
 */
export const TenantResolverDebug: React.FC = () => {
  const tenantState = useAppSelector((state) => state.tenant);
  const subdomainInfo = getSubdomainInfo();

  if (!isDevelopment()) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-gray-900 p-4 text-xs text-white shadow-xl">
      <h3 className="mb-2 font-bold text-yellow-400">🔧 Tenant Debug Info</h3>
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">Subdomain:</span>{' '}
          <span className="font-mono">{subdomainInfo.subdomain || 'none'}</span>
        </div>
        <div>
          <span className="text-gray-400">Is SuperAdmin:</span>{' '}
          <span className="font-mono">
            {subdomainInfo.isSuperAdmin ? 'true' : 'false'}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Is Tenant:</span>{' '}
          <span className="font-mono">
            {subdomainInfo.isTenant ? 'true' : 'false'}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Tenant ID:</span>{' '}
          <span className="font-mono">
            {(tenantState as any).currentTenant?.id || 'none'}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Tenant Name:</span>{' '}
          <span className="font-mono">
            {(tenantState as any).currentTenant?.name || 'none'}
          </span>
        </div>
      </div>
    </div>
  );
};
