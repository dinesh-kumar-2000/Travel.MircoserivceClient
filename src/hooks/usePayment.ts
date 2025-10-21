import { useState } from 'react';
import { razorpayService } from '../services/payment/razorpayService';
import { stripeService } from '../services/payment/stripeService';

type PaymentGateway = 'stripe' | 'razorpay';

interface PaymentParams {
  amount: number;
  currency?: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
}

export const usePayment = () => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const processStripePayment = async (params: PaymentParams, elements: any) => {
    try {
      setProcessing(true);
      setError(null);

      await stripeService.initialize();
      const clientSecret = await stripeService.createPaymentIntent({
        amount: params.amount,
        currency: params.currency || 'USD',
        metadata: {
          bookingId: params.bookingId,
        },
      });

      const result = await stripeService.confirmPayment(clientSecret, elements);

      if (result?.status === 'succeeded') {
        setSuccess(true);
        return result;
      } else {
        throw new Error('Payment failed');
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  const processRazorpayPayment = async (params: PaymentParams) => {
    try {
      setProcessing(true);
      setError(null);

      const orderId = await razorpayService.createOrder({
        amount: params.amount,
        currency: params.currency || 'INR',
        notes: {
          bookingId: params.bookingId,
        },
      });

      return new Promise((resolve, reject) => {
        razorpayService.openCheckout(
          {
            amount: params.amount,
            currency: params.currency || 'INR',
            orderId,
            name: 'TravelSphere',
            description: `Booking #${params.bookingId}`,
            prefill: {
              name: params.customerName,
              email: params.customerEmail,
            },
          },
          async (response) => {
            try {
              const verified = await razorpayService.verifyPayment({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });

              if (verified) {
                setSuccess(true);
                setProcessing(false);
                resolve(response);
              } else {
                throw new Error('Payment verification failed');
              }
            } catch (err: any) {
              setError(err.message);
              setProcessing(false);
              reject(err);
            }
          },
          (err) => {
            setError(err.message || 'Payment failed');
            setProcessing(false);
            reject(err);
          }
        );
      });
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      setProcessing(false);
      throw err;
    }
  };

  const processPayment = async (
    gateway: PaymentGateway,
    params: PaymentParams,
    elements?: any
  ) => {
    if (gateway === 'stripe') {
      return processStripePayment(params, elements);
    } else {
      return processRazorpayPayment(params);
    }
  };

  const resetPayment = () => {
    setError(null);
    setSuccess(false);
    setProcessing(false);
  };

  return {
    processing,
    error,
    success,
    processPayment,
    processStripePayment,
    processRazorpayPayment,
    resetPayment,
  };
};
