import {
  clearCurrentTenant,
  setCurrentTenant,
} from '@/store/slices/tenantSlice';
import { Tenant } from '@/types';
import {
  clearTenantData,
  getTenantData,
  getTenantId,
  storeTenantData,
} from '@/utils/helpers';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

/**
 * Custom hook for managing tenant data
 * Provides access to current tenant from Redux store and localStorage
 *
 * @example
 * ```tsx
 * const { tenant, tenantId, saveTenant, clearTenant } = useTenant();
 *
 * // Access tenant data
 * console.log(tenant?.name);
 *
 * // Save tenant data
 * saveTenant(tenantData);
 *
 * // Clear tenant data
 * clearTenant();
 * ```
 */
export const useTenant = () => {
  const dispatch = useAppDispatch();
  const { currentTenant, isLoading, error } = useAppSelector(
    (state) => state.tenant
  );

  /**
   * Get tenant ID from localStorage
   */
  const tenantId = getTenantId();

  /**
   * Get tenant data from localStorage
   */
  const localTenantData = getTenantData<Tenant>();

  /**
   * Save tenant to both Redux store and localStorage
   */
  const saveTenant = (tenant: Tenant) => {
    // Save to Redux
    dispatch(setCurrentTenant(tenant));

    // Save to localStorage
    storeTenantData(tenant.id, tenant);
  };

  /**
   * Clear tenant from both Redux store and localStorage
   */
  const removeTenant = () => {
    // Clear from Redux
    dispatch(clearCurrentTenant());

    // Clear from localStorage
    clearTenantData();
  };

  /**
   * Get tenant from Redux or fallback to localStorage
   */
  const tenant = currentTenant || localTenantData;

  return {
    tenant,
    tenantId,
    isLoading,
    error,
    saveTenant,
    removeTenant,
  };
};
