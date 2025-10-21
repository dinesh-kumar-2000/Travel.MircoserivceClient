/**
 * Tenant Detection Utilities
 *
 * Utility functions for detecting and managing tenant information
 * based on subdomain analysis
 */

export interface SubdomainInfo {
  subdomain: string | null;
  isSuperAdmin: boolean;
  isTenant: boolean;
  isLocalhost: boolean;
  fullDomain: string;
}

/**
 * Extract subdomain from the current hostname
 *
 * @param hostname - The hostname to parse (defaults to window.location.hostname)
 * @returns Subdomain information object
 *
 * @example
 * // For 'dreamtravel.travelsphere.com'
 * getSubdomainInfo() // { subdomain: 'dreamtravel', isSuperAdmin: false, isTenant: true, ... }
 *
 * // For 'admin.travelsphere.com'
 * getSubdomainInfo() // { subdomain: 'admin', isSuperAdmin: true, isTenant: false, ... }
 *
 * // For 'travelsphere.com' or 'www.travelsphere.com'
 * getSubdomainInfo() // { subdomain: null, isSuperAdmin: false, isTenant: false, ... }
 */
export const getSubdomainInfo = (
  hostname: string = window.location.hostname
): SubdomainInfo => {
  const isLocalhost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.includes('localhost:');

  // For local development, check for subdomain prefix
  if (isLocalhost) {
    const parts = hostname.split('.');
    const subdomain = parts.length > 1 ? parts[0] : null;

    return {
      subdomain,
      isSuperAdmin: subdomain === 'admin',
      isTenant:
        subdomain !== null && subdomain !== 'admin' && subdomain !== 'www',
      isLocalhost: true,
      fullDomain: hostname,
    };
  }

  // Split the hostname into parts
  const parts = hostname.split('.');

  // No subdomain if less than 3 parts (e.g., travelsphere.com)
  // Or if the first part is 'www'
  if (parts.length < 3 || (parts.length === 3 && parts[0] === 'www')) {
    return {
      subdomain: null,
      isSuperAdmin: false,
      isTenant: false,
      isLocalhost: false,
      fullDomain: hostname,
    };
  }

  // Extract subdomain (first part)
  const subdomain = parts[0];

  return {
    subdomain,
    isSuperAdmin: subdomain === 'admin',
    isTenant: subdomain !== 'admin' && subdomain !== 'www',
    isLocalhost: false,
    fullDomain: hostname,
  };
};

/**
 * Get the base domain (without subdomain)
 *
 * @param hostname - The hostname to parse (defaults to window.location.hostname)
 * @returns Base domain string
 *
 * @example
 * getBaseDomain('dreamtravel.travelsphere.com') // 'travelsphere.com'
 * getBaseDomain('admin.travelsphere.com') // 'travelsphere.com'
 * getBaseDomain('travelsphere.com') // 'travelsphere.com'
 */
export const getBaseDomain = (
  hostname: string = window.location.hostname
): string => {
  const isLocalhost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.includes('localhost:');

  if (isLocalhost) {
    return 'localhost';
  }

  const parts = hostname.split('.');

  // If it's already a base domain (2 parts)
  if (parts.length <= 2) {
    return hostname;
  }

  // Return the last two parts (domain + TLD)
  return parts.slice(-2).join('.');
};

/**
 * Build a URL with a specific subdomain
 *
 * @param subdomain - The subdomain to use (null for base domain)
 * @param path - Optional path to append
 * @param protocol - Protocol to use (defaults to current)
 * @returns Full URL string
 *
 * @example
 * buildSubdomainUrl('dreamtravel', '/hotels') // 'https://dreamtravel.travelsphere.com/hotels'
 * buildSubdomainUrl('admin') // 'https://admin.travelsphere.com'
 * buildSubdomainUrl(null, '/login') // 'https://travelsphere.com/login'
 */
export const buildSubdomainUrl = (
  subdomain: string | null,
  path: string = '',
  protocol: string = window.location.protocol
): string => {
  const baseDomain = getBaseDomain();
  const fullDomain = subdomain ? `${subdomain}.${baseDomain}` : baseDomain;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${protocol}//${fullDomain}${cleanPath}`;
};

/**
 * Check if the current environment is in development mode
 *
 * @returns boolean indicating if in development mode
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * Get tenant identifier from localStorage (for development)
 *
 * @returns Tenant identifier or null
 */
export const getTenantFromStorage = (): string | null => {
  try {
    return localStorage.getItem('dev_tenant_subdomain');
  } catch {
    return null;
  }
};

/**
 * Set tenant identifier in localStorage (for development)
 *
 * @param subdomain - The tenant subdomain to store
 */
export const setTenantInStorage = (subdomain: string | null): void => {
  try {
    if (subdomain) {
      localStorage.setItem('dev_tenant_subdomain', subdomain);
    } else {
      localStorage.removeItem('dev_tenant_subdomain');
    }
  } catch (error) {
    console.error('Failed to set tenant in storage:', error);
  }
};

/**
 * Validate if a subdomain is valid
 *
 * @param subdomain - The subdomain to validate
 * @returns boolean indicating if valid
 *
 * Rules:
 * - Only lowercase alphanumeric characters and hyphens
 * - Cannot start or end with a hyphen
 * - Between 3-63 characters
 */
export const isValidSubdomain = (subdomain: string): boolean => {
  const subdomainRegex = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;
  return subdomainRegex.test(subdomain);
};

/**
 * Get redirect URL for specific tenant
 * Used when switching between tenants or redirecting to tenant-specific pages
 *
 * @param tenantSubdomain - The tenant subdomain
 * @param path - Optional path to redirect to
 * @returns Full redirect URL
 */
export const getTenantRedirectUrl = (
  tenantSubdomain: string,
  path: string = '/'
): string => {
  return buildSubdomainUrl(tenantSubdomain, path);
};

/**
 * Get SuperAdmin URL
 *
 * @param path - Optional path to append
 * @returns Full SuperAdmin URL
 */
export const getSuperAdminUrl = (path: string = '/'): string => {
  return buildSubdomainUrl('admin', path);
};
