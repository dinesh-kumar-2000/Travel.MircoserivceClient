import { ApiResponse, Booking, PaginatedResponse } from '@/types';
import { apiClient } from './apiClient';

class BookingService {
  private baseUrl = '/api/v1/bookings';

  async getBookings(params?: { page?: number; pageSize?: number }) {
    return apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
      this.baseUrl,
      { params }
    );
  }

  async getBookingById(id: string) {
    return apiClient.get<ApiResponse<Booking>>(`${this.baseUrl}/${id}`);
  }

  async createBooking(data: Partial<Booking>) {
    return apiClient.post<ApiResponse<Booking>>(this.baseUrl, data);
  }

  async updateBooking(id: string, data: Partial<Booking>) {
    return apiClient.put<ApiResponse<Booking>>(`${this.baseUrl}/${id}`, data);
  }

  async cancelBooking(id: string) {
    return apiClient.post<ApiResponse<Booking>>(`${this.baseUrl}/${id}/cancel`);
  }

  async confirmBooking(id: string) {
    return apiClient.post<ApiResponse<Booking>>(
      `${this.baseUrl}/${id}/confirm`
    );
  }

  async getUserBookings(
    userId: string,
    params?: { page?: number; pageSize?: number }
  ) {
    return apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
      `${this.baseUrl}/user/${userId}`,
      { params }
    );
  }

  async getTenantBookings(
    tenantId: string,
    params?: { page?: number; pageSize?: number }
  ) {
    return apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
      `${this.baseUrl}/tenant/${tenantId}`,
      { params }
    );
  }
}

export const bookingService = new BookingService();
