import { Card } from '@/components/common/Card';
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="container-custom">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          SuperAdmin Dashboard
        </h1>
        <Card>
          <p className="text-gray-600 dark:text-gray-400">
            SuperAdmin dashboard - Coming soon
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

