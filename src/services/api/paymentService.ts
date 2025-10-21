import { apiClient } from './apiClient';

export interface CreatePaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  provider: 'stripe' | 'razorpay';
  customerEmail: string;
  returnUrl?: string;
}

export interface CreatePaymentResponse {
  paymentId: string;
  clientSecret?: string;
  checkoutUrl?: string;
  status: string;
  message: string;
}

export interface PaymentDto {
  id: string;
  tenantId: string;
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  provider?: string;
  transactionId?: string;
  providerReference?: string;
  customerId: string;
  customerEmail?: string;
  completedAt?: string;
  createdAt: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId?: string;
  providerReference?: string;
}

export interface RefundPaymentRequest {
  amount?: number;
  reason: string;
}

export const paymentService = {
  create: async (payment: CreatePaymentRequest) => {
    return apiClient.post<CreatePaymentResponse>(
      '/payment/v1/Payments',
      payment
    );
  },

  getById: async (id: string) => {
    return apiClient.get<PaymentDto>(`/payment/v1/Payments/${id}`);
  },

  getByBooking: async (bookingId: string) => {
    return apiClient.get<PaymentDto[]>(
      `/payment/v1/Payments/booking/${bookingId}`
    );
  },

  confirm: async (id: string, request: ConfirmPaymentRequest) => {
    return apiClient.post(`/payment/v1/Payments/${id}/confirm`, request);
  },

  refund: async (id: string, request: RefundPaymentRequest) => {
    return apiClient.post(`/payment/v1/Payments/${id}/refund`, request);
  },
};
