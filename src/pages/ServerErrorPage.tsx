import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';

const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="max-w-2xl text-center">
        {/* 500 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center">
            <svg
              className="h-48 w-48 text-purple-500 dark:text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="mb-4 text-8xl font-bold text-purple-600 dark:text-purple-400">
          500
        </h1>

        {/* Error Title */}
        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          Internal Server Error
        </h2>

        {/* Error Message */}
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Oops! Something went wrong on our end. We're working to fix the issue.
          Please try again in a few moments.
        </p>

        {/* Technical Details (optional) */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            What happened?
          </h3>
          <div className="space-y-2 text-left text-gray-600 dark:text-gray-400">
            <p className="flex items-start">
              <svg
                className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-purple-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Our server encountered an unexpected condition that prevented it
                from fulfilling your request.
              </span>
            </p>
            <p className="mt-4 flex items-start">
              <svg
                className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-purple-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Our technical team has been automatically notified and is working
                on a fix.
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            onClick={handleRefresh}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Page
          </Button>

          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Go Back
          </Button>

          <Button
            onClick={() => navigate('/')}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go to Homepage
          </Button>
        </div>

        {/* Support Information */}
        <div className="mt-8 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <h4 className="mb-2 text-sm font-semibold text-purple-900 dark:text-purple-200">
            Need Immediate Help?
          </h4>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            If this error persists, please contact our support team at{' '}
            <a
              href="mailto:support@travelsphere.com"
              className="font-medium underline hover:no-underline"
            >
              support@travelsphere.com
            </a>{' '}
            or call us at{' '}
            <a
              href="tel:+1234567890"
              className="font-medium underline hover:no-underline"
            >
              +1 (234) 567-890
            </a>
            .
          </p>
        </div>

        {/* Error ID (for support reference) */}
        <div className="mt-6 text-xs text-gray-400 dark:text-gray-500">
          <p>
            Error ID: {Math.random().toString(36).substring(2, 15)}-
            {Date.now()}
          </p>
          <p className="mt-1">
            Please reference this ID when contacting support
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;

