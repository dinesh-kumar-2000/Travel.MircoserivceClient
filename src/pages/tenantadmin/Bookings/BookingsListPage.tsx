import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Input } from '../../../components/common/Input';
import Table, { Column } from '../../../components/common/Table';
import { Booking } from '../../../types';

const BookingsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call when available
      setBookings([]);
      setTotalPages(1);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (!searchQuery) return true;
    return (
      (booking as any).bookingNumber
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (booking as any).customerName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  const columns: Column<Booking>[] = [
    {
      key: 'bookingNumber',
      label: 'Booking #',
      sortable: true,
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      render: (booking) => (
        <span className="capitalize">{(booking as any).type || 'booking'}</span>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      sortable: true,
      render: (booking) => `$${(booking.totalAmount || 0).toFixed(2)}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (booking) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            booking.status === 'Confirmed'
              ? 'bg-green-100 text-green-800'
              : booking.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800'
                : booking.status === 'Cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
          }`}
        >
          {booking.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (booking) => new Date(booking.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (booking) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate(`/tenantadmin/bookings/${booking.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bookings Management
          </h1>
          <p className="mt-1 text-gray-600">View and manage all bookings</p>
        </div>
        <Button onClick={() => navigate('/tenantadmin/bookings/new')}>
          Create Booking
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">
              {bookings.length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === 'Confirmed').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {bookings.filter((b) => b.status === 'Pending').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-600">
              ${bookings.reduce((sum, b) => sum + b.totalAmount, 0).toFixed(2)}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              placeholder="Search by booking # or customer name..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            <Button variant="secondary" onClick={fetchBookings}>
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table
          data={filteredBookings}
          columns={columns}
          loading={loading}
          rowKey="id"
          emptyMessage="No bookings found"
          onRowClick={(booking) =>
            navigate(`/tenantadmin/bookings/${booking.id}`)
          }
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

export default BookingsListPage;
