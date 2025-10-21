import React, { useEffect, useState } from 'react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { analyticsService } from '../../services/api/analyticsService';

interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  totalTenants: number;
  totalUsers: number;
  revenueGrowth: number;
  bookingsGrowth: number;
  tenantsGrowth: number;
  usersGrowth: number;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  bookingsByType: Array<{ type: string; count: number }>;
  topTenants: Array<{ name: string; revenue: number; bookings: number }>;
}

const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>(
    'month'
  );

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration - replace with actual API calls
      const mockData: AnalyticsData = {
        totalRevenue: 125000,
        totalBookings: 342,
        totalTenants: 15,
        totalUsers: 1250,
        revenueGrowth: 12.5,
        bookingsGrowth: 8.3,
        tenantsGrowth: 15.2,
        usersGrowth: 20.1,
        revenueByMonth: [
          { month: 'Jan', revenue: 10000 },
          { month: 'Feb', revenue: 12000 },
          { month: 'Mar', revenue: 15000 },
          { month: 'Apr', revenue: 14000 },
          { month: 'May', revenue: 18000 },
          { month: 'Jun', revenue: 20000 },
        ],
        bookingsByType: [
          { type: 'Hotels', count: 150 },
          { type: 'Flights', count: 120 },
          { type: 'Tours', count: 72 },
        ],
        topTenants: [
          { name: 'Dream Travel', revenue: 45000, bookings: 120 },
          { name: 'Adventure Tours', revenue: 38000, bookings: 95 },
          { name: 'Luxury Getaways', revenue: 32000, bookings: 80 },
        ],
      };
      setAnalytics(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const now = new Date();
      const startDate = new Date(now);
      const endDate = now.toISOString().split('T')[0];

      if (timeRange === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (timeRange === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      await analyticsService.exportReport({
        format: format === 'excel' ? 'excel' : 'pdf',
        reportType: 'comprehensive',
        startDate: startDate.toISOString().split('T')[0],
        endDate,
      });
    } catch (error) {
      console.error(`Failed to export ${format}:`, error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-center text-gray-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Global Analytics</h1>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) =>
              setTimeRange(e.target.value as 'week' | 'month' | 'year')
            }
            className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
          <Button variant="secondary" onClick={() => handleExport('excel')}>
            Export Excel
          </Button>
          <Button variant="secondary" onClick={() => handleExport('pdf')}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-6">
            <p className="mb-1 text-sm text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">
              ${analytics.totalRevenue.toLocaleString()}
            </p>
            <p
              className={`mt-2 text-sm ${analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {analytics.revenueGrowth >= 0 ? '↑' : '↓'}{' '}
              {Math.abs(analytics.revenueGrowth)}% from last period
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <p className="mb-1 text-sm text-gray-600">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900">
              {analytics.totalBookings.toLocaleString()}
            </p>
            <p
              className={`mt-2 text-sm ${analytics.bookingsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {analytics.bookingsGrowth >= 0 ? '↑' : '↓'}{' '}
              {Math.abs(analytics.bookingsGrowth)}% from last period
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <p className="mb-1 text-sm text-gray-600">Total Tenants</p>
            <p className="text-3xl font-bold text-gray-900">
              {analytics.totalTenants.toLocaleString()}
            </p>
            <p
              className={`mt-2 text-sm ${analytics.tenantsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {analytics.tenantsGrowth >= 0 ? '↑' : '↓'}{' '}
              {Math.abs(analytics.tenantsGrowth)}% from last period
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <p className="mb-1 text-sm text-gray-600">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">
              {analytics.totalUsers.toLocaleString()}
            </p>
            <p
              className={`mt-2 text-sm ${analytics.usersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {analytics.usersGrowth >= 0 ? '↑' : '↓'}{' '}
              {Math.abs(analytics.usersGrowth)}% from last period
            </p>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue by Month */}
        <Card>
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Revenue Trend</h2>
            <div className="h-64">
              {/* Simple bar chart visualization */}
              <div className="flex h-full items-end justify-between gap-2">
                {analytics.revenueByMonth.map((item, index) => {
                  const maxRevenue = Math.max(
                    ...analytics.revenueByMonth.map((m) => m.revenue)
                  );
                  const height = (item.revenue / maxRevenue) * 100;
                  return (
                    <div
                      key={index}
                      className="flex flex-1 flex-col items-center"
                    >
                      <div
                        className="w-full rounded-t bg-blue-500 transition-colors hover:bg-blue-600"
                        style={{ height: `${height}%` }}
                        title={`${item.month}: $${item.revenue.toLocaleString()}`}
                      />
                      <p className="mt-2 origin-top-left rotate-45 text-xs text-gray-600">
                        {item.month}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Bookings by Type */}
        <Card>
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Bookings by Type</h2>
            <div className="space-y-4">
              {analytics.bookingsByType.map((item, index) => {
                const total = analytics.bookingsByType.reduce(
                  (sum, b) => sum + b.count,
                  0
                );
                const percentage = (item.count / total) * 100;
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];
                return (
                  <div key={index}>
                    <div className="mb-1 flex justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {item.type}
                      </span>
                      <span className="text-sm text-gray-600">
                        {item.count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={`${colors[index % colors.length]} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Top Tenants */}
      <Card>
        <div className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Top Performing Tenants</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Tenant Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Avg. Booking Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {analytics.topTenants.map((tenant, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {tenant.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      ${tenant.revenue.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {tenant.bookings}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      ${(tenant.revenue / tenant.bookings).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
