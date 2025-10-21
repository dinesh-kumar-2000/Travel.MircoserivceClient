import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Modal } from '../../../components/common/Modal';
import { Table } from '../../../components/common/Table';
import { useNotifications } from '../../../hooks/useNotifications';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt: string;
  views: number;
}

export const BlogManagement: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    id: string | null;
  }>({
    show: false,
    id: null,
  });

  useEffect(() => {
    fetchPosts();
  }, [searchTerm]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await cmsService.getBlogPosts({ search: searchTerm });
      // setPosts(response.data);

      // Mock data
      setPosts([
        {
          id: '1',
          title: 'Top 10 Travel Destinations for 2025',
          slug: 'top-10-travel-destinations-2025',
          author: 'John Doe',
          category: 'Travel Tips',
          status: 'published',
          publishedAt: '2025-01-15',
          views: 1234,
        },
        {
          id: '2',
          title: 'How to Pack Light for Long Trips',
          slug: 'how-to-pack-light',
          author: 'Jane Smith',
          category: 'Travel Tips',
          status: 'draft',
          publishedAt: '',
          views: 0,
        },
      ]);
    } catch (error) {
      showError('Failed to fetch blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    try {
      // TODO: Replace with actual API call
      // await cmsService.deleteBlogPost(deleteModal.id);
      showSuccess('Blog post deleted successfully');
      setDeleteModal({ show: false, id: null });
      fetchPosts();
    } catch (error) {
      showError('Failed to delete blog post');
    }
  };

  const getStatusBadge = (status: BlogPost['status']) => {
    const variants: Record<BlogPost['status'], 'success' | 'warning' | 'info'> =
      {
        published: 'success',
        draft: 'warning',
        archived: 'info',
      };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const columns = [
    {
      header: 'Title',
      accessor: 'title' as keyof BlogPost,
    },
    {
      header: 'Author',
      accessor: 'author' as keyof BlogPost,
    },
    {
      header: 'Category',
      accessor: 'category' as keyof BlogPost,
    },
    {
      header: 'Status',
      accessor: 'status' as keyof BlogPost,
      cell: (row: BlogPost) => getStatusBadge(row.status),
    },
    {
      header: 'Views',
      accessor: 'views' as keyof BlogPost,
    },
    {
      header: 'Published Date',
      accessor: 'publishedAt' as keyof BlogPost,
      cell: (row: BlogPost) =>
        row.publishedAt ? new Date(row.publishedAt).toLocaleDateString() : '-',
    },
    {
      header: 'Actions',
      accessor: 'id' as keyof BlogPost,
      cell: (row: BlogPost) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/tenantadmin/cms/blog/${row.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteModal({ show: true, id: row.id })}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="max-w-md flex-1">
          <Input
            type="search"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/tenantadmin/cms/blog/new')}
        >
          + New Blog Post
        </Button>
      </div>

      <div className="rounded-lg bg-white shadow dark:bg-gray-800">
        <Table
          columns={columns}
          data={posts}
          isLoading={isLoading}
          emptyMessage="No blog posts found. Create your first post to get started."
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        title="Delete Blog Post"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this blog post? This action cannot
            be undone.
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
