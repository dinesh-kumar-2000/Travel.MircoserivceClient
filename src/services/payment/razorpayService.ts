declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  amount: number;
  currency?: string;
  orderId: string;
  name: string;
  description?: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

class RazorpayService {
  private isScriptLoaded = false;

  async loadScript(): Promise<boolean> {
    if (this.isScriptLoaded) return true;

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.isScriptLoaded = true;
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async createOrder(params: {
    amount: number;
    currency?: string;
    notes?: Record<string, string>;
  }) {
    try {
      const response = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error('Failed to create Razorpay order:', error);
      throw error;
    }
  }

  async openCheckout(
    options: RazorpayOptions,
    onSuccess: (response: RazorpayResponse) => void,
    onError: (error: any) => void
  ) {
    const isLoaded = await this.loadScript();
    if (!isLoaded) {
      onError(new Error('Failed to load Razorpay SDK'));
      return;
    }

    const razorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
      amount: options.amount * 100, // Convert to paise
      currency: options.currency || 'INR',
      order_id: options.orderId,
      name: options.name,
      description: options.description,
      image: options.image,
      handler: (response: RazorpayResponse) => {
        onSuccess(response);
      },
      prefill: options.prefill,
      theme: options.theme || { color: '#3B82F6' },
      modal: {
        ondismiss: () => {
          onError(new Error('Payment cancelled by user'));
        },
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  }

  async verifyPayment(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }) {
    try {
      const response = await fetch('/api/payments/razorpay/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      return data.verified;
    } catch (error) {
      console.error('Failed to verify payment:', error);
      throw error;
    }
  }

  async getPaymentDetails(paymentId: string) {
    try {
      const response = await fetch(
        `/api/payments/razorpay/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
      throw error;
    }
  }
}

export const razorpayService = new RazorpayService();
