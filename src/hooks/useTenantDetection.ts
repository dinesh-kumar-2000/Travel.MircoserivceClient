import { fetchTenantBySubdomain } from '@/store/slices/tenantSlice';
import { AppDispatch } from '@/store/store';
import { Tenant } from '@/types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export const useTenantDetection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [tenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectTenant = async () => {
      try {
        const hostname = window.location.hostname;
        const parts = hostname.split('.');

        // Check if it's a subdomain
        if (parts.length > 2 || (parts.length === 2 && parts[0] !== 'www')) {
          const subdomain = parts[0];

          // Skip admin subdomain
          if (subdomain === 'admin') {
            setIsLoading(false);
            return;
          }

          // Fetch tenant data
          await dispatch(fetchTenantBySubdomain(subdomain)).unwrap();
          // Tenant is now in Redux store, no need to set local state
        }

        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to detect tenant');
        setIsLoading(false);
      }
    };

    detectTenant();
  }, [dispatch]);

  return { tenant, isLoading, error };
};
