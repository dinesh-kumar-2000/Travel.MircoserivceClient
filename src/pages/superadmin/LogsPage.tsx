import React, { useEffect, useState } from 'react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  category: string;
  tenantId?: string;
  tenantName?: string;
  userId?: string;
  userName?: string;
  action: string;
  message: string;
  details?: any;
  ipAddress?: string;
}

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [filterLevel, filterCategory]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          level: 'info',
          category: 'authentication',
          tenantId: 'tenant1',
          tenantName: 'Dream Travel',
          userId: 'user1',
          userName: 'John Doe',
          action: 'USER_LOGIN',
          message: 'User logged in successfully',
          ipAddress: '192.168.1.1',
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          level: 'warning',
          category: 'payment',
          tenantId: 'tenant2',
          tenantName: 'Adventure Tours',
          action: 'PAYMENT_FAILED',
          message: 'Payment processing failed - insufficient funds',
          ipAddress: '192.168.1.2',
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          level: 'error',
          category: 'booking',
          tenantId: 'tenant1',
          tenantName: 'Dream Travel',
          action: 'BOOKING_ERROR',
          message: 'Failed to create booking - database error',
          details: { errorCode: 'DB_CONNECTION_FAILED', retryCount: 3 },
          ipAddress: '192.168.1.3',
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          level: 'critical',
          category: 'system',
          action: 'SYSTEM_ERROR',
          message: 'Database connection pool exhausted',
          details: { poolSize: 100, activeConnections: 100 },
          ipAddress: 'internal',
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          level: 'info',
          category: 'tenant',
          tenantId: 'tenant3',
          tenantName: 'Luxury Getaways',
          action: 'TENANT_CREATED',
          message: 'New tenant registered successfully',
          ipAddress: '192.168.1.4',
        },
      ];

      setLogs(mockLogs);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'critical':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesCategory =
      filterCategory === 'all' || log.category === filterCategory;
    const matchesSearch =
      !searchQuery ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.tenantName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLevel && matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          System Logs & Audit Trail
        </h1>
        <p className="mt-1 text-gray-600">
          Monitor system activity and track changes
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Level
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="authentication">Authentication</option>
                <option value="authorization">Authorization</option>
                <option value="booking">Booking</option>
                <option value="payment">Payment</option>
                <option value="tenant">Tenant</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchLogs} className="w-full">
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Info</p>
            <p className="text-2xl font-bold text-blue-600">
              {logs.filter((l) => l.level === 'info').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Warnings</p>
            <p className="text-2xl font-bold text-yellow-600">
              {logs.filter((l) => l.level === 'warning').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Errors</p>
            <p className="text-2xl font-bold text-red-600">
              {logs.filter((l) => l.level === 'error').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-gray-600">Critical</p>
            <p className="text-2xl font-bold text-purple-600">
              {logs.filter((l) => l.level === 'critical').length}
            </p>
          </div>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${getLevelColor(log.level)}`}
                      >
                        {log.level.toUpperCase()}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {log.category}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {log.tenantName || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {log.action}
                    </td>
                    <td className="max-w-md truncate px-6 py-4 text-sm text-gray-900">
                      {log.message}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No logs found matching the filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="mx-4 max-h-[80vh] w-full max-w-2xl overflow-y-auto">
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <h2 className="text-xl font-semibold">Log Details</h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Timestamp</p>
                  <p className="text-gray-900">
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Level</p>
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs font-medium ${getLevelColor(selectedLog.level)}`}
                  >
                    {selectedLog.level.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Category</p>
                  <p className="text-gray-900">{selectedLog.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Action</p>
                  <p className="text-gray-900">{selectedLog.action}</p>
                </div>
                {selectedLog.tenantName && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tenant</p>
                    <p className="text-gray-900">{selectedLog.tenantName}</p>
                  </div>
                )}
                {selectedLog.userName && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">User</p>
                    <p className="text-gray-900">{selectedLog.userName}</p>
                  </div>
                )}
                {selectedLog.ipAddress && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      IP Address
                    </p>
                    <p className="text-gray-900">{selectedLog.ipAddress}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-600">Message</p>
                  <p className="text-gray-900">{selectedLog.message}</p>
                </div>
                {selectedLog.details && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Details</p>
                    <pre className="mt-1 overflow-x-auto rounded bg-gray-50 p-3 text-xs">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedLog(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LogsPage;
