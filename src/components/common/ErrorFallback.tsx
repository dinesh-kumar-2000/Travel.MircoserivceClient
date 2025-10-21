import React from 'react';
import { Button } from './Button';
import { Card } from './Card';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-lg">
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Oops! Something went wrong
          </h1>

          <p className="mb-6 text-gray-600">
            We're sorry, but something unexpected happened. Please try again.
          </p>

          {/* Error Details (only in development) */}
          {import.meta.env.DEV && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-left">
              <p className="mb-2 font-medium text-red-900">Error Details:</p>
              <pre className="overflow-x-auto text-xs text-red-800">
                {error.message}
              </pre>
              {error.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-red-700">
                    Stack Trace
                  </summary>
                  <pre className="mt-2 overflow-x-auto text-xs text-red-700">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={resetError} className="flex-1">
              Try Again
            </Button>
            <Button
              variant="secondary"
              onClick={() => (window.location.href = '/')}
              className="flex-1"
            >
              Go Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ErrorFallback;

