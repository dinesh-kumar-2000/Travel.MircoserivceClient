import { User } from '@/types';
import { AxiosResponse } from 'axios';
import { BaseService } from './baseService';

class UserService extends BaseService<User> {
  constructor() {
    super('/users');
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<AxiosResponse<User>> {
    return this.get<User>('/me');
  }

  /**
   * Update current user profile
   */
  async updateCurrentUser(data: Partial<User>): Promise<AxiosResponse<User>> {
    return this.put<User>('/me', data);
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(
    file: File
  ): Promise<AxiosResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.post<{ avatarUrl: string }>('/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Change password
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<AxiosResponse<void>> {
    return this.post<void>('/me/change-password', data);
  }

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<AxiosResponse<any>> {
    return this.get<any>('/me/preferences');
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: any): Promise<AxiosResponse<any>> {
    return this.put<any>('/me/preferences', preferences);
  }

  /**
   * Get user bookings
   */
  async getUserBookings(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<AxiosResponse<any>> {
    return this.get('/me/bookings', { params });
  }

  /**
   * Get user wishlist
   */
  async getWishlist(): Promise<AxiosResponse<any[]>> {
    return this.get<any[]>('/me/wishlist');
  }

  /**
   * Add to wishlist
   */
  async addToWishlist(
    itemId: string,
    itemType: 'hotel' | 'flight' | 'tour'
  ): Promise<AxiosResponse<void>> {
    return this.post<void>('/me/wishlist', { itemId, itemType });
  }

  /**
   * Remove from wishlist
   */
  async removeFromWishlist(itemId: string): Promise<AxiosResponse<void>> {
    return this.delete<void>(`/me/wishlist/${itemId}`);
  }

  /**
   * Get user wallet
   */
  async getWallet(): Promise<AxiosResponse<any>> {
    return this.get('/me/wallet');
  }

  /**
   * Get wallet transactions
   */
  async getWalletTransactions(params?: {
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<any>> {
    return this.get('/me/wallet/transactions', { params });
  }

  /**
   * Add funds to wallet
   */
  async addFunds(amount: number): Promise<AxiosResponse<any>> {
    return this.post('/me/wallet/add-funds', { amount });
  }

  /**
   * Delete user account
   */
  async deleteAccount(password: string): Promise<AxiosResponse<void>> {
    return this.post<void>('/me/delete', { password });
  }
}

export const userService = new UserService();
