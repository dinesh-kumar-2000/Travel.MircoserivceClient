import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { googleAnalytics } from '../services/analytics/googleAnalytics';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    googleAnalytics.initialize();
  }, []);

  useEffect(() => {
    googleAnalytics.trackPageView(location.pathname, document.title);
  }, [location]);

  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    googleAnalytics.trackEvent(action, category, label, value);
  };

  const trackSearch = (searchTerm: string, category: string) => {
    googleAnalytics.trackSearch(searchTerm, category);
  };

  const trackBooking = (bookingId: string, value: number, currency?: string) => {
    googleAnalytics.trackBooking(bookingId, value, currency);
  };

  return {
    trackEvent,
    trackSearch,
    trackBooking,
  };
};

