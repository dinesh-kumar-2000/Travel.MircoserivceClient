import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { tenantService } from '../../services/api/tenantService';
import { Tenant } from '../../types';

interface TenantStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
}

const TenantDetailsPage: React.FC = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [stats, setStats] = useState<TenantStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTenantDetails();
  }, [tenantId]);

  const fetchTenantDetails = async () => {
    if (!tenantId) return;

    try {
      setLoading(true);
      const tenantData = await tenantService.getTenantById(tenantId);

      // Mock stats and bookings - replace with actual API calls when available
      const statsData: TenantStats = {
        totalUsers: 150,
        totalBookings: 342,
        totalRevenue: 45231,
        activeUsers: 87,
      };

      const bookingsData: any[] = [];

      setTenant(tenantData.data.data || null);
      setStats(statsData);
      setRecentBookings(bookingsData);
    } catch (error) {
      console.error('Failed to fetch tenant details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateTenant = async () => {
    if (!tenantId || !tenant) return;

    try {
      setActionLoading(true);
      await tenantService.updateTenant(tenantId, { ...tenant, isActive: true });
      await fetchTenantDetails();
    } catch (error) {
      console.error('Failed to activate tenant:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivateTenant = async () => {
    if (!tenantId || !tenant) return;

    try {
      setActionLoading(true);
      await tenantService.updateTenant(tenantId, {
        ...tenant,
        isActive: false,
      });
      setShowDeactivateModal(false);
      await fetchTenantDetails();
    } catch (error) {
      console.error('Failed to deactivate tenant:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditTenant = () => {
    navigate(`/superadmin/tenants/${tenantId}/edit`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Tenant not found</h2>
          <Button
            onClick={() => navigate('/superadmin/tenants')}
            className="mt-4"
          >
            Back to Tenants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{tenant.name}</h1>
          <p className="mt-1 text-gray-600">
            {tenant.subdomain}.travelsphere.com
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/superadmin/tenants')}
          >
            Back
          </Button>
          <Button variant="secondary" onClick={handleEditTenant}>
            Edit Details
          </Button>
          {tenant.isActive ? (
            <Button
              variant="danger"
              onClick={() => setShowDeactivateModal(true)}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleActivateTenant}
              isLoading={actionLoading}
            >
              Activate
            </Button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            tenant.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {tenant.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-6">
            <p className="mb-1 text-sm text-gray-600">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.totalUsers || 0}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="mb-1 text-sm text-gray-600">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.totalBookings || 0}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="mb-1 text-sm text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">
              ${stats?.totalRevenue?.toLocaleString() || 0}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="mb-1 text-sm text-gray-600">Active Users</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.activeUsers || 0}
            </p>
          </div>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tenant Information */}
        <Card>
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Tenant Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Contact Email</p>
                <p className="text-gray-900">{tenant.contactEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact Phone</p>
                <p className="text-gray-900">{tenant.contactPhone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subdomain</p>
                <p className="text-gray-900">{tenant.subdomain}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created Date</p>
                <p className="text-gray-900">
                  {new Date(tenant.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Subscription & Branding */}
        <Card>
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Subscription & Branding
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Subscription Plan</p>
                <p className="text-gray-900">
                  {(tenant as any).subscriptionPlan || 'Basic'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Primary Color</p>
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded border"
                    style={{
                      backgroundColor:
                        (tenant as any).branding?.primaryColor || '#3B82F6',
                    }}
                  />
                  <p className="text-gray-900">
                    {(tenant as any).branding?.primaryColor || '#3B82F6'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Logo URL</p>
                <p className="truncate text-gray-900">
                  {(tenant as any).branding?.logoUrl || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <div className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Bookings</h2>
          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentBookings.map((booking: any) => (
                    <tr key={booking.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {booking.bookingNumber || booking.id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {booking.customerName || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {booking.type || 'booking'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        ${booking.totalAmount || 0}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            booking.status === 'Confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No recent bookings</p>
          )}
        </div>
      </Card>

      {/* Deactivate Modal */}
      <Modal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        title="Deactivate Tenant"
      >
        <div className="p-6">
          <p className="mb-6 text-gray-700">
            Are you sure you want to deactivate {tenant.name}? This will prevent
            all users from accessing the tenant's services.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeactivateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeactivateTenant}
              isLoading={actionLoading}
            >
              Deactivate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TenantDetailsPage;
