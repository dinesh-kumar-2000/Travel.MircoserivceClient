import { ApiResponse, PaginatedResponse, Tenant } from '@/types';
import { apiClient } from './apiClient';

class TenantService {
  private baseUrl = '/api/tenants';

  async getAllTenants(params?: { page?: number; pageSize?: number }) {
    return apiClient.get<ApiResponse<PaginatedResponse<Tenant>>>(
      this.baseUrl,
      { params }
    );
  }

  async getTenantById(id: string) {
    return apiClient.get<ApiResponse<Tenant>>(`${this.baseUrl}/${id}`);
  }

  async getTenantBySubdomain(subdomain: string) {
    return apiClient.get<ApiResponse<Tenant>>(
      `${this.baseUrl}/subdomain/${subdomain}`
    );
  }

  async createTenant(data: Partial<Tenant>) {
    return apiClient.post<ApiResponse<Tenant>>(this.baseUrl, data);
  }

  async updateTenant(id: string, data: Partial<Tenant>) {
    return apiClient.put<ApiResponse<Tenant>>(`${this.baseUrl}/${id}`, data);
  }

  async deleteTenant(id: string) {
    return apiClient.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  async updateTenantTheme(id: string, theme: Partial<Tenant['theme']>) {
    return apiClient.put<ApiResponse<Tenant>>(
      `${this.baseUrl}/${id}/theme`,
      theme
    );
  }

  async updateTenantSettings(
    id: string,
    settings: Partial<Tenant['settings']>
  ) {
    return apiClient.put<ApiResponse<Tenant>>(
      `${this.baseUrl}/${id}/settings`,
      settings
    );
  }

  async uploadLogo(id: string, file: File) {
    const formData = new FormData();
    formData.append('logo', file);
    return apiClient.post<ApiResponse<{ logoUrl: string }>>(
      `${this.baseUrl}/${id}/logo`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }
}

export const tenantService = new TenantService();

