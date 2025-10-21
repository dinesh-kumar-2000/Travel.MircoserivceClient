import { Middleware } from '@reduxjs/toolkit';

/**
 * Logger Middleware (Development Only)
 *
 * Logs Redux actions and state changes for debugging purposes
 * Only active in development mode
 */
export const loggerMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    // Only run in development
    if (!import.meta.env.DEV) {
      return next(action);
    }

    // Get state before action
    const prevState = store.getState();

    // Log action
    console.group(
      `%c Action: ${action.type}`,
      'color: #4CAF50; font-weight: bold'
    );
    console.log(
      '%c Prev State:',
      'color: #9E9E9E; font-weight: bold',
      prevState
    );
    console.log('%c Action:', 'color: #03A9F4; font-weight: bold', action);

    // Execute action
    const result = next(action);

    // Get state after action
    const nextState = store.getState();
    console.log(
      '%c Next State:',
      'color: #4CAF50; font-weight: bold',
      nextState
    );

    console.groupEnd();

    return result;
  };

/**
 * Performance Logger Middleware (Development Only)
 *
 * Logs action execution time for performance monitoring
 */
export const performanceLoggerMiddleware: Middleware =
  () => (next) => (action: any) => {
    // Only run in development
    if (!import.meta.env.DEV) {
      return next(action);
    }

    const start = performance.now();
    const result = next(action);
    const end = performance.now();
    const duration = end - start;

    // Log slow actions (> 100ms)
    if (duration > 100) {
      console.warn(
        `%c Slow Action: ${action.type} took ${duration.toFixed(2)}ms`,
        'color: #FF9800; font-weight: bold'
      );
    }

    return result;
  };
