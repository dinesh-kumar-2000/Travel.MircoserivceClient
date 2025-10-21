import React, { useEffect, useState } from 'react';
import { Card } from '../../common/Card';
import { LoadingSpinner } from '../../common/LoadingSpinner';

interface PaymentRecord {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  gateway: 'stripe' | 'razorpay';
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
  paymentMethod?: string;
  last4?: string;
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockPayments: PaymentRecord[] = [
        {
          id: '1',
          bookingId: 'BK001',
          amount: 299.99,
          currency: 'USD',
          gateway: 'stripe',
          status: 'succeeded',
          createdAt: new Date().toISOString(),
          paymentMethod: 'Visa',
          last4: '4242',
        },
        {
          id: '2',
          bookingId: 'BK002',
          amount: 15000,
          currency: 'INR',
          gateway: 'razorpay',
          status: 'succeeded',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      setPayments(mockPayments);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Payment History</h2>
        {payments.length > 0 ? (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">
                      {payment.currency === 'USD' ? '$' : '₹'}
                      {payment.amount.toFixed(2)}
                    </span>
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(payment.status)}`}
                    >
                      {payment.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Booking #{payment.bookingId} • {payment.gateway}
                    {payment.last4 && ` •••• ${payment.last4}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(payment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-gray-500">No payment history</p>
        )}
      </div>
    </Card>
  );
};

export default PaymentHistory;
