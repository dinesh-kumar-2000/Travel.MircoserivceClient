import { Button } from '@/components/common/Button';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-primary-600">404</h1>
        <h2 className="mb-4 text-3xl font-semibold text-gray-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg">Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

