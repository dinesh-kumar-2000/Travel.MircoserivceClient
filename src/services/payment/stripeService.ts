import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

interface PaymentIntentParams {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

interface StripePaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

class StripeService {
  private stripe: Stripe | null = null;

  async initialize() {
    this.stripe = await getStripe();
    return this.stripe;
  }

  async createPaymentIntent(params: PaymentIntentParams) {
    try {
      const response = await fetch('/api/payments/stripe/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      throw error;
    }
  }

  async confirmPayment(_clientSecret: string, elements: StripeElements) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error, paymentIntent } = await this.stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      throw new Error(error.message);
    }

    return paymentIntent;
  }

  async createPaymentMethod(cardElement: any) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error, paymentMethod } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      throw new Error(error.message);
    }

    return paymentMethod;
  }

  async retrievePaymentIntent(clientSecret: string) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const { paymentIntent } =
      await this.stripe.retrievePaymentIntent(clientSecret);
    return paymentIntent;
  }

  async getSavedPaymentMethods(): Promise<StripePaymentMethod[]> {
    try {
      const response = await fetch('/api/payments/stripe/payment-methods', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      return data.paymentMethods || [];
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      return [];
    }
  }

  async detachPaymentMethod(paymentMethodId: string) {
    try {
      await fetch(`/api/payments/stripe/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } catch (error) {
      console.error('Failed to detach payment method:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();
