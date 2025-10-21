import { ApiResponse, Notification } from '@/types';
import { apiClient } from './apiClient';

class NotificationService {
  private baseUrl = '/api/notifications';

  async getNotifications() {
    return apiClient.get<ApiResponse<Notification[]>>(this.baseUrl);
  }

  async markAsRead(id: string) {
    return apiClient.put<ApiResponse>(`${this.baseUrl}/${id}/read`);
  }

  async markAllAsRead() {
    return apiClient.put<ApiResponse>(`${this.baseUrl}/read-all`);
  }

  async deleteNotification(id: string) {
    return apiClient.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  async getUnreadCount() {
    return apiClient.get<ApiResponse<{ count: number }>>(
      `${this.baseUrl}/unread-count`
    );
  }
}

export const notificationService = new NotificationService();

