import { Card } from '@/components/common/Card';
import { DashboardLayout } from '@/components/layout';
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container-custom">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          TenantAdmin Dashboard
        </h1>
        <Card>
          <p className="text-gray-600 dark:text-gray-400">
            TenantAdmin dashboard - Coming soon
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
