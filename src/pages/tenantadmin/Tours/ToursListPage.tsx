import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Input } from '../../../components/common/Input';
import Table, { Column } from '../../../components/common/Table';
import { catalogService } from '../../../services/api/catalogService';
import { TourPackage } from '../../../types';

const ToursListPage: React.FC = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTours();
  }, [currentPage]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call when available
      const response = await catalogService.searchTours({});
      setTours(response.data?.items || []);
      setTotalPages(1);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = tours.filter((tour) => {
    if (!searchQuery) return true;
    return (
      tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.destination?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const columns: Column<TourPackage>[] = [
    {
      key: 'title',
      label: 'Tour Name',
      sortable: true,
    },
    {
      key: 'destination',
      label: 'Destination',
      sortable: true,
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (tour) => `${tour.duration} days`,
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (tour) => `$${tour.price?.toFixed(2) || '0.00'}`,
    },
    {
      key: 'maxGroupSize',
      label: 'Max Group',
      render: (tour) => tour.maxGroupSize || 'N/A',
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (tour) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            tour.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {tour.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (tour) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate(`/tenantadmin/tours/${tour.id}`)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tour Packages</h1>
          <p className="mt-1 text-gray-600">Manage your tour packages</p>
        </div>
        <Button onClick={() => navigate('/tenantadmin/tours/new')}>
          Add Tour Package
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Total Tours</p>
            <p className="text-2xl font-bold text-gray-900">{tours.length}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Active Tours</p>
            <p className="text-2xl font-bold text-green-600">
              {tours.filter((t) => t.isActive).length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Avg. Duration</p>
            <p className="text-2xl font-bold text-blue-600">
              {tours.length > 0
                ? Math.round(
                    tours.reduce((sum, t) => sum + (t.duration || 0), 0) /
                      tours.length
                  )
                : 0}{' '}
              days
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Avg. Price</p>
            <p className="text-2xl font-bold text-purple-600">
              $
              {tours.length > 0
                ? (
                    tours.reduce((sum, t) => sum + (t.price || 0), 0) /
                    tours.length
                  ).toFixed(2)
                : '0.00'}
            </p>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by tour name or destination..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
              />
            </div>
            <Button variant="secondary" onClick={fetchTours}>
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <Table
          data={filteredTours}
          columns={columns}
          loading={loading}
          rowKey="id"
          emptyMessage="No tours found"
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
          }}
        />
      </Card>
    </div>
  );
};

export default ToursListPage;
