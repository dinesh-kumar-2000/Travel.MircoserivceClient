declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

class GoogleAnalyticsService {
  private trackingId: string;
  private isInitialized = false;

  constructor() {
    this.trackingId = import.meta.env.VITE_GA_TRACKING_ID || '';
  }

  initialize() {
    if (this.isInitialized || !this.trackingId) return;

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    document.head.appendChild(script1);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', this.trackingId);

    this.isInitialized = true;
  }

  trackPageView(path: string, title?: string) {
    if (!this.isInitialized) return;

    window.gtag('config', this.trackingId, {
      page_path: path,
      page_title: title,
    });
  }

  trackEvent(
    action: string,
    category: string,
    label?: string,
    value?: number
  ) {
    if (!this.isInitialized) return;

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  trackSearch(searchTerm: string, category: string) {
    this.trackEvent('search', 'Search', `${category}: ${searchTerm}`);
  }

  trackBooking(bookingId: string, value: number, currency: string = 'USD') {
    if (!this.isInitialized) return;

    window.gtag('event', 'purchase', {
      transaction_id: bookingId,
      value: value,
      currency: currency,
      items: [{
        id: bookingId,
        name: 'Booking',
        quantity: 1,
        price: value,
      }],
    });
  }

  trackConversion(conversionId: string, value: number) {
    this.trackEvent('conversion', 'Booking', conversionId, value);
  }

  setUserId(userId: string) {
    if (!this.isInitialized) return;

    window.gtag('config', this.trackingId, {
      user_id: userId,
    });
  }

  setUserProperties(properties: Record<string, any>) {
    if (!this.isInitialized) return;

    window.gtag('set', 'user_properties', properties);
  }
}

export const googleAnalytics = new GoogleAnalyticsService();

