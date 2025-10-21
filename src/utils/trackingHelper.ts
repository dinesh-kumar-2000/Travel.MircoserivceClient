import { googleAnalytics } from '../services/analytics/googleAnalytics';

export const trackButtonClick = (buttonName: string, location: string) => {
  googleAnalytics.trackEvent('click', 'Button', `${buttonName} - ${location}`);
};

export const trackFormSubmit = (formName: string) => {
  googleAnalytics.trackEvent('submit', 'Form', formName);
};

export const trackError = (errorMessage: string, location: string) => {
  googleAnalytics.trackEvent('error', 'Error', `${location}: ${errorMessage}`);
};

export const trackNavigation = (from: string, to: string) => {
  googleAnalytics.trackEvent('navigate', 'Navigation', `${from} -> ${to}`);
};

export const trackFilter = (filterType: string, filterValue: string) => {
  googleAnalytics.trackEvent(
    'filter',
    'Filter',
    `${filterType}: ${filterValue}`
  );
};

export const trackSocialLogin = (provider: string) => {
  googleAnalytics.trackEvent('social_login', 'Authentication', provider);
};

export const trackAddToWishlist = (itemType: string, itemId: string) => {
  googleAnalytics.trackEvent(
    'add_to_wishlist',
    'Wishlist',
    `${itemType}: ${itemId}`
  );
};

export const trackRemoveFromWishlist = (itemType: string, itemId: string) => {
  googleAnalytics.trackEvent(
    'remove_from_wishlist',
    'Wishlist',
    `${itemType}: ${itemId}`
  );
};
