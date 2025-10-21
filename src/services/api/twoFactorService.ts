import { apiClient } from './apiClient';

export interface TwoFactorSecret {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface TwoFactorVerifyRequest {
  secret: string;
  code: string;
}

export interface TwoFactorAuthRequest {
  userId: string;
  code: string;
  isBackupCode?: boolean;
}

class TwoFactorService {
  private baseUrl = '/auth/2fa';

  async generateSecret(): Promise<TwoFactorSecret> {
    const response = await apiClient.post<TwoFactorSecret>(
      `${this.baseUrl}/generate`
    );
    return response.data;
  }

  async verifyAndEnable(request: TwoFactorVerifyRequest): Promise<void> {
    await apiClient.post(`${this.baseUrl}/verify`, request);
  }

  async disable(password: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/disable`, { password });
  }

  async authenticate(
    request: TwoFactorAuthRequest
  ): Promise<{ token: string }> {
    const response = await apiClient.post<{ token: string }>(
      `${this.baseUrl}/authenticate`,
      request
    );
    return response.data;
  }

  async regenerateBackupCodes(): Promise<string[]> {
    const response = await apiClient.post<{ backupCodes: string[] }>(
      `${this.baseUrl}/backup-codes/regenerate`
    );
    return response.data.backupCodes;
  }

  async getStatus(): Promise<{
    enabled: boolean;
    backupCodesRemaining: number;
  }> {
    const response = await apiClient.get<{
      enabled: boolean;
      backupCodesRemaining: number;
    }>(`${this.baseUrl}/status`);
    return response.data;
  }
}

export const twoFactorService = new TwoFactorService();
