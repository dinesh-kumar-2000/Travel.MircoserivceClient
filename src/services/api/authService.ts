import { ApiResponse, LoginCredentials, RegisterData, User } from '@/types';
import { apiClient } from './apiClient';

class AuthService {
  private baseUrl = '/api/v1/auth';

  async login(credentials: LoginCredentials) {
    return apiClient.post<
      ApiResponse<{ user: User; token: string; refreshToken: string }>
    >(`${this.baseUrl}/login`, credentials);
  }

  async register(data: RegisterData) {
    return apiClient.post<
      ApiResponse<{ user: User; token: string; refreshToken: string }>
    >(`${this.baseUrl}/register`, data);
  }

  async logout() {
    return apiClient.post<ApiResponse>(`${this.baseUrl}/logout`);
  }

  async refreshToken() {
    return apiClient.post<ApiResponse<{ token: string; refreshToken: string }>>(
      `${this.baseUrl}/refresh-token`
    );
  }

  async forgotPassword(email: string) {
    return apiClient.post<ApiResponse>(`${this.baseUrl}/forgot-password`, {
      email,
    });
  }

  async resetPassword(token: string, password: string) {
    return apiClient.post<ApiResponse>(`${this.baseUrl}/reset-password`, {
      token,
      password,
    });
  }

  async verifyEmail(token: string) {
    return apiClient.post<ApiResponse>(`${this.baseUrl}/verify-email`, {
      token,
    });
  }

  async resendVerificationEmail(email: string) {
    return apiClient.post<ApiResponse>(`${this.baseUrl}/resend-verification`, {
      email,
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return apiClient.post<ApiResponse>(`${this.baseUrl}/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  async getCurrentUser() {
    return apiClient.get<ApiResponse<User>>(`${this.baseUrl}/me`);
  }

  async updateProfile(data: Partial<User>) {
    return apiClient.put<ApiResponse<User>>(`${this.baseUrl}/profile`, data);
  }
}

export const authService = new AuthService();
