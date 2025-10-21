import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Input } from '../../../components/common/Input';
import Table, { Column } from '../../../components/common/Table';
import { catalogService } from '../../../services/api/catalogService';
import { Hotel } from '../../../types';

const HotelsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHotels();
  }, [currentPage]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call when available
      const response = await catalogService.searchHotels({});
      setHotels(response.data?.items || []);
      setTotalPages(1);
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter((hotel) => {
    if (!searchQuery) return true;
    return (
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hotel as any).location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const columns: Column<Hotel>[] = [
    {
      key: 'name',
      label: 'Hotel Name',
      sortable: true,
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (hotel) => (
        <div className="flex items-center">
          <span className="mr-1 text-yellow-500">★</span>
          <span>{hotel.rating || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'pricePerNight',
      label: 'Price/Night',
      sortable: true,
      render: (hotel) =>
        `$${(hotel as any).pricePerNight?.toFixed(2) || '0.00'}`,
    },
    {
      key: 'availableRooms',
      label: 'Available Rooms',
      render: (hotel) => (hotel as any).availableRooms || 0,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (hotel) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            hotel.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {hotel.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (hotel) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/tenantadmin/hotels/${hotel.id}`)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hotel Management</h1>
          <p className="mt-1 text-gray-600">Manage your hotel inventory</p>
        </div>
        <Button onClick={() => navigate('/tenantadmin/hotels/new')}>
          Add Hotel
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Total Hotels</p>
            <p className="text-2xl font-bold text-gray-900">{hotels.length}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {hotels.filter((h) => h.isActive).length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Total Rooms</p>
            <p className="text-2xl font-bold text-blue-600">
              {hotels.reduce(
                (sum, h) => sum + ((h as any).availableRooms || 0),
                0
              )}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Avg. Price/Night</p>
            <p className="text-2xl font-bold text-purple-600">
              $
              {hotels.length > 0
                ? (
                    hotels.reduce(
                      (sum, h) => sum + ((h as any).pricePerNight || 0),
                      0
                    ) / hotels.length
                  ).toFixed(2)
                : '0.00'}
            </p>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by hotel name or location..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
              />
            </div>
            <Button variant="secondary" onClick={fetchHotels}>
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table
          data={filteredHotels}
          columns={columns}
          loading={loading}
          rowKey="id"
          emptyMessage="No hotels found"
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

export default HotelsListPage;
