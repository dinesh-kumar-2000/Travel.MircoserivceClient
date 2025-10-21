import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { usePayment } from '../../../hooks/usePayment';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';

interface PaymentFormProps {
  amount: number;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  onSuccess: () => void;
  onError?: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  bookingId,
  customerName,
  customerEmail,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { processing, error, processStripePayment, processRazorpayPayment } =
    usePayment();
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>(
    'stripe'
  );

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      await processStripePayment(
        {
          amount,
          bookingId,
          customerName,
          customerEmail,
        },
        elements
      );
      onSuccess();
    } catch (err: any) {
      onError?.(err.message);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      await processRazorpayPayment({
        amount,
        bookingId,
        customerName,
        customerEmail,
        currency: 'INR',
      });
      onSuccess();
    } catch (err: any) {
      onError?.(err.message);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>

        {/* Payment Method Selection */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setPaymentMethod('stripe')}
            className={`flex-1 rounded-lg border-2 p-4 ${
              paymentMethod === 'stripe'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
              alt="Stripe"
              className="mx-auto h-8"
            />
          </button>
          <button
            onClick={() => setPaymentMethod('razorpay')}
            className={`flex-1 rounded-lg border-2 p-4 ${
              paymentMethod === 'razorpay'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <img
              src="https://razorpay.com/assets/razorpay-glyph.svg"
              alt="Razorpay"
              className="mx-auto h-8"
            />
          </button>
        </div>

        {/* Stripe Payment Form */}
        {paymentMethod === 'stripe' && (
          <form onSubmit={handleStripeSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Card Information
              </label>
              <div className="rounded-lg border border-gray-300 p-3">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              isLoading={processing}
              disabled={!stripe || processing}
              className="w-full"
            >
              Pay ${amount.toFixed(2)}
            </Button>
          </form>
        )}

        {/* Razorpay Payment Button */}
        {paymentMethod === 'razorpay' && (
          <div>
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              onClick={handleRazorpayPayment}
              isLoading={processing}
              disabled={processing}
              className="w-full"
            >
              Pay ₹{amount.toFixed(2)}
            </Button>

            <p className="mt-4 text-center text-xs text-gray-500">
              You will be redirected to Razorpay's secure payment page
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secure payment processing</span>
        </div>
      </div>
    </Card>
  );
};

export default PaymentForm;
