import { Middleware } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

/**
 * API Error Handling Middleware
 *
 * Intercepts rejected async thunk actions and displays error toasts
 * Handles different types of API errors and provides user-friendly messages
 */
export const apiErrorMiddleware: Middleware = () => (next) => (action: any) => {
  // Check if it's a rejected action from an async thunk
  if (action.type?.endsWith('/rejected')) {
    const error = action.payload || action.error;

    // Extract error message
    let errorMessage = 'An unexpected error occurred';

    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (error?.error) {
      errorMessage = error.error;
    }

    // Handle specific error types
    if (errorMessage.toLowerCase().includes('network')) {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (
      errorMessage.toLowerCase().includes('unauthorized') ||
      errorMessage.includes('401')
    ) {
      errorMessage = 'Session expired. Please log in again.';
    } else if (
      errorMessage.toLowerCase().includes('forbidden') ||
      errorMessage.includes('403')
    ) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (
      errorMessage.toLowerCase().includes('not found') ||
      errorMessage.includes('404')
    ) {
      errorMessage = 'The requested resource was not found.';
    } else if (
      errorMessage.includes('500') ||
      errorMessage.toLowerCase().includes('server error')
    ) {
      errorMessage = 'Server error. Please try again later.';
    }

    // Show error toast (except for specific actions that handle their own errors)
    const skipToastActions = [
      'auth/login/rejected',
      'auth/register/rejected',
      // Add other actions that handle their own errors
    ];

    if (!skipToastActions.includes(action.type)) {
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-right',
      });
    }

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        action: action.type,
        error,
        message: errorMessage,
      });
    }
  }

  return next(action);
};
