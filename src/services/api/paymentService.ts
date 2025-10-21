import { AxiosResponse } from 'axios';
import { BaseService } from './baseService';

interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet' | 'netbanking';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'payment' | 'refund' | 'wallet_credit';
  createdAt: string;
  description: string;
}

class PaymentService extends BaseService {
  constructor() {
    super('/api/v1/payments');
  }

  /**
   * Create payment intent
   */
  async createPaymentIntent(data: {
    amount: number;
    currency: string;
    bookingId: string;
    paymentMethod?: string;
  }): Promise<AxiosResponse<PaymentIntent>> {
    return this.post<PaymentIntent>('/intent', data);
  }

  /**
   * Confirm payment
   */
  async confirmPayment(
    paymentIntentId: string,
    data?: any
  ): Promise<AxiosResponse<any>> {
    return this.post(`/confirm/${paymentIntentId}`, data);
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string): Promise<AxiosResponse<any>> {
    return this.get(`/${paymentId}`);
  }

  /**
   * Get saved payment methods
   */
  async getPaymentMethods(): Promise<AxiosResponse<PaymentMethod[]>> {
    return this.get<PaymentMethod[]>('/methods');
  }

  /**
   * Add payment method
   */
  async addPaymentMethod(data: any): Promise<AxiosResponse<PaymentMethod>> {
    return this.post<PaymentMethod>('/methods', data);
  }

  /**
   * Remove payment method
   */
  async removePaymentMethod(methodId: string): Promise<AxiosResponse<void>> {
    return this.delete<void>(`/methods/${methodId}`);
  }

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(
    methodId: string
  ): Promise<AxiosResponse<void>> {
    return this.post<void>(`/methods/${methodId}/set-default`);
  }

  /**
   * Request refund
   */
  async requestRefund(data: {
    bookingId: string;
    amount?: number;
    reason: string;
  }): Promise<AxiosResponse<any>> {
    return this.post('/refund', data);
  }

  /**
   * Get refund status
   */
  async getRefundStatus(refundId: string): Promise<AxiosResponse<any>> {
    return this.get(`/refund/${refundId}`);
  }

  /**
   * Get transaction history
   */
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<
    AxiosResponse<{
      transactions: Transaction[];
      total: number;
      page: number;
    }>
  > {
    return this.get<any>('/transactions', { params });
  }

  /**
   * Get invoice
   */
  async getInvoice(bookingId: string): Promise<AxiosResponse<Blob>> {
    return this.get(`/invoice/${bookingId}`, {
      responseType: 'blob',
    });
  }

  /**
   * Download receipt
   */
  async downloadReceipt(transactionId: string): Promise<AxiosResponse<Blob>> {
    return this.get(`/receipt/${transactionId}`, {
      responseType: 'blob',
    });
  }

  /**
   * Verify payment (for webhook/callback)
   */
  async verifyPayment(data: {
    paymentId: string;
    signature?: string;
    orderId?: string;
  }): Promise<AxiosResponse<{ verified: boolean }>> {
    return this.post<{ verified: boolean }>('/verify', data);
  }

  /**
   * Get payment gateway configuration
   */
  async getPaymentConfig(): Promise<
    AxiosResponse<{
      stripe: { publicKey: string; enabled: boolean };
      razorpay: { keyId: string; enabled: boolean };
      supportedCurrencies: string[];
    }>
  > {
    return this.get('/config');
  }
}

export const paymentService = new PaymentService();
