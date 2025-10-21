import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Table } from '../../../components/common/Table';
import { useNotifications } from '../../../hooks/useNotifications';

interface Page {
  id: string;
  title: string;
  slug: string;
  type: 'terms' | 'privacy' | 'about' | 'contact' | 'custom';
  status: 'draft' | 'published';
  updatedAt: string;
}

export const PageManagement: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    id: string | null;
  }>({
    show: false,
    id: null,
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await cmsService.getPages();
      // setPages(response.data);

      // Mock data
      setPages([
        {
          id: '1',
          title: 'Terms & Conditions',
          slug: 'terms-and-conditions',
          type: 'terms',
          status: 'published',
          updatedAt: '2025-01-20',
        },
        {
          id: '2',
          title: 'Privacy Policy',
          slug: 'privacy-policy',
          type: 'privacy',
          status: 'published',
          updatedAt: '2025-01-20',
        },
        {
          id: '3',
          title: 'About Us',
          slug: 'about-us',
          type: 'about',
          status: 'published',
          updatedAt: '2025-01-18',
        },
        {
          id: '4',
          title: 'Contact Us',
          slug: 'contact-us',
          type: 'contact',
          status: 'published',
          updatedAt: '2025-01-15',
        },
      ]);
    } catch (error) {
      showError('Failed to fetch pages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    try {
      // await cmsService.deletePage(deleteModal.id);
      showSuccess('Page deleted successfully');
      setDeleteModal({ show: false, id: null });
      fetchPages();
    } catch (error) {
      showError('Failed to delete page');
    }
  };

  const getStatusBadge = (status: Page['status']) => {
    const variants: Record<Page['status'], 'success' | 'warning'> = {
      published: 'success',
      draft: 'warning',
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const getTypeLabel = (type: Page['type']) => {
    const labels: Record<Page['type'], string> = {
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
      about: 'About Us',
      contact: 'Contact Us',
      custom: 'Custom Page',
    };
    return labels[type];
  };

  const columns = [
    {
      header: 'Title',
      accessor: 'title' as keyof Page,
    },
    {
      header: 'Slug',
      accessor: 'slug' as keyof Page,
      cell: (row: Page) => <code className="text-sm">/{row.slug}</code>,
    },
    {
      header: 'Type',
      accessor: 'type' as keyof Page,
      cell: (row: Page) => getTypeLabel(row.type),
    },
    {
      header: 'Status',
      accessor: 'status' as keyof Page,
      cell: (row: Page) => getStatusBadge(row.status),
    },
    {
      header: 'Last Updated',
      accessor: 'updatedAt' as keyof Page,
      cell: (row: Page) => new Date(row.updatedAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessor: 'id' as keyof Page,
      cell: (row: Page) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/tenantadmin/cms/pages/${row.id}`)}
          >
            Edit
          </Button>
          {row.type === 'custom' && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setDeleteModal({ show: true, id: row.id })}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>
            Manage static pages like Terms & Conditions, Privacy Policy, and
            custom pages.
          </p>
          <p className="mt-1">
            System pages (Terms, Privacy, About, Contact) cannot be deleted.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/tenantadmin/cms/pages/new')}
        >
          + New Page
        </Button>
      </div>

      <div className="rounded-lg bg-white shadow dark:bg-gray-800">
        <Table
          columns={columns}
          data={pages}
          isLoading={isLoading}
          emptyMessage="No pages found."
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        title="Delete Page"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this page? This action cannot be
            undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setDeleteModal({ show: false, id: null })}
            >
              Cancel
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
