import { Card } from '@/components/common/Card';
import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="container-custom">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <Card>
          <p className="text-gray-600 dark:text-gray-400">
            Profile page - Coming soon
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;

