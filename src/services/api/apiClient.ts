import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { storageService } from '../storage/storageService';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token
        const token = storageService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add tenant context from subdomain
        const tenantId = this.getTenantIdFromSubdomain();
        if (tenantId) {
          config.headers['X-Tenant-Id'] = tenantId;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 (Unauthorized) - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = storageService.getRefreshToken();
            if (refreshToken) {
              const response = await axios.post(
                `${API_BASE_URL}/api/v1/auth/refresh-token`,
                { refreshToken }
              );

              const { token } = response.data;
              storageService.setToken(token);

              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh token failed, logout user
            storageService.removeToken();
            storageService.removeRefreshToken();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getTenantIdFromSubdomain(): string | null {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    // Skip if it's localhost or admin subdomain
    if (hostname === 'localhost' || parts[0] === 'admin') {
      return null;
    }

    // Return subdomain as tenant identifier
    if (parts.length > 2) {
      return parts[0];
    }

    return null;
  }

  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
