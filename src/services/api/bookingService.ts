import { apiClient } from './apiClient';

export interface CreateBookingRequest {
  packageId: string;
  travelDate: string;
  numberOfTravelers: number;
  idempotencyKey: string;
}

export interface BookingDto {
  id: string;
  tenantId: string;
  customerId: string;
  bookingReference: string;
  packageId: string;
  bookingDate: string;
  travelDate: string;
  numberOfTravelers: number;
  totalAmount: number;
  currency: string;
  status: string;
  paymentId?: string;
  createdAt: string;
}

export interface PagedBookingsResponse {
  bookings: BookingDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ConfirmBookingRequest {
  paymentId: string;
}

export interface CancelBookingRequest {
  reason?: string;
}

export const bookingService = {
  create: async (booking: CreateBookingRequest) => {
    return apiClient.post<{
      bookingId: string;
      bookingReference: string;
      status: string;
      totalAmount: number;
      message: string;
    }>('/booking/v1/Bookings', booking);
  },

  getById: async (id: string) => {
    return apiClient.get<BookingDto>(`/booking/v1/Bookings/${id}`);
  },

  getMyBookings: async (page: number = 1, pageSize: number = 10) => {
    return apiClient.get<PagedBookingsResponse>(
      `/booking/v1/Bookings/my-bookings?page=${page}&pageSize=${pageSize}`
    );
  },

  getAll: async (status?: string, page: number = 1, pageSize: number = 10) => {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append('status', status);
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());

    return apiClient.get<PagedBookingsResponse>(
      `/booking/v1/Bookings?${queryParams.toString()}`
    );
  },

  confirm: async (id: string, request: ConfirmBookingRequest) => {
    return apiClient.post(`/booking/v1/Bookings/${id}/confirm`, request);
  },

  cancel: async (id: string, request?: CancelBookingRequest) => {
    return apiClient.post(`/booking/v1/Bookings/${id}/cancel`, request || {});
  },
};
