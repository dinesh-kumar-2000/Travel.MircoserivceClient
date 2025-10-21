import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Input } from '../../../components/common/Input';
import Table, { Column } from '../../../components/common/Table';
import { User } from '../../../types';

const ClientsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchClients();
  }, [currentPage]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call when available
      setClients([]);
      setTotalPages(1);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client) => {
    if (!searchQuery) return true;
    return (
      client.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const columns: Column<User>[] = [
    {
      key: 'fullName',
      label: 'Name',
      sortable: true,
      render: (client) => `${client.firstName || ''} ${client.lastName || ''}`,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'phoneNumber',
      label: 'Phone',
      render: (client) => client.phoneNumber || 'N/A',
    },
    {
      key: 'totalBookings',
      label: 'Bookings',
      sortable: true,
      render: (client) => (client as any).totalBookings || 0,
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      sortable: true,
      render: (client) =>
        `$${(client as any).totalSpent?.toFixed(2) || '0.00'}`,
    },
    {
      key: 'createdAt',
      label: 'Member Since',
      sortable: true,
      render: (client) => new Date(client.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (client) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate(`/tenantadmin/clients/${client.id}`)}
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
            Client Management
          </h1>
          <p className="mt-1 text-gray-600">View and manage all clients</p>
        </div>
        <Button onClick={() => navigate('/tenantadmin/clients/new')}>
          Add Client
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Total Clients</p>
            <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Active Clients</p>
            <p className="text-2xl font-bold text-green-600">
              {clients.filter((c) => c.isActive).length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">New This Month</p>
            <p className="text-2xl font-bold text-blue-600">
              {
                clients.filter((c) => {
                  const date = new Date(c.createdAt);
                  const now = new Date();
                  return (
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              $
              {clients
                .reduce((sum, c) => sum + ((c as any).totalSpent || 0), 0)
                .toFixed(2)}
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
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
              />
            </div>
            <Button variant="secondary" onClick={fetchClients}>
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table
          data={filteredClients}
          columns={columns}
          loading={loading}
          rowKey="id"
          emptyMessage="No clients found"
          onRowClick={(client) => navigate(`/tenantadmin/clients/${client.id}`)}
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

export default ClientsListPage;
