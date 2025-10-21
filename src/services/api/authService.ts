import { ApiResponse, LoginCredentials, RegisterData, User } from '@/types';
import { apiClient } from './apiClient';

class AuthService {
  private baseUrl = '/identity/v1/Auth';

  async login(
    credentials: LoginCredentials & { domain?: string; tenantId?: string }
  ) {
    return apiClient.post<
      ApiResponse<{
        user: User;
        accessToken: string;
        refreshToken: string;
        expiresAt: string;
      }>
    >(`${this.baseUrl}/login`, credentials);
  }

  async register(data: RegisterData & { tenantId: string }) {
    return apiClient.post<ApiResponse<{ user: User; message: string }>>(
      `${this.baseUrl}/register`,
      data
    );
  }

  async logout(userId: string) {
    return apiClient.post<ApiResponse>(`${this.baseUrl}/revoke-token`, {
      userId,
    });
  }

  async refreshToken(refreshToken: string, userId: string) {
    return apiClient.post<
      ApiResponse<{
        accessToken: string;
        refreshToken: string;
        expiresAt: string;
      }>
    >(`${this.baseUrl}/refresh-token`, { refreshToken, userId });
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

  async getCurrentUser(userId: string) {
    return apiClient.get<ApiResponse<{ user: User }>>(
      `${this.baseUrl}/profile/${userId}`
    );
  }

  async updateProfile(
    userId: string,
    data: { firstName: string; lastName: string; phoneNumber: string }
  ) {
    return apiClient.put<
      ApiResponse<{ success: boolean; message: string; user: User }>
    >(`${this.baseUrl}/profile`, { userId, ...data });
  }
}

export const authService = new AuthService();
