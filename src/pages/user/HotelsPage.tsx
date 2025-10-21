import { Card } from '@/components/common/Card';
import { MainLayout } from '@/components/layout';
import React from 'react';

const HotelsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container-custom py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Hotels
        </h1>
        <Card>
          <p className="text-gray-600 dark:text-gray-400">
            Hotels page - Coming soon
          </p>
        </Card>
      </div>
    </MainLayout>
  );
};

export default HotelsPage;
