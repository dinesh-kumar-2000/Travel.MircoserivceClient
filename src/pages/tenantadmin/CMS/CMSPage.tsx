import React from 'react';
import { Tabs } from '../../../components/common/Tabs';
import { BlogManagement } from './BlogManagement';
import { FAQManagement } from './FAQManagement';
import { PageManagement } from './PageManagement';

export const CMSPage: React.FC = () => {
  const tabs = [
    {
      id: 'blog',
      label: 'Blog Posts',
      content: <BlogManagement />,
    },
    {
      id: 'faq',
      label: 'FAQs',
      content: <FAQManagement />,
    },
    {
      id: 'pages',
      label: 'Pages',
      content: <PageManagement />,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Content Management System</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage blog posts, FAQs, and custom pages
        </p>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
};
