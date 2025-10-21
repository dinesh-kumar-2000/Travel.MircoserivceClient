import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import Table from '@/components/common/Table';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Manager' | 'Agent' | 'Support';
  department: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
  joinedDate: string;
  lastActive?: string;
  permissions: string[];
}

const StaffManagementPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 8900',
      role: 'Manager',
      department: 'Operations',
      status: 'active',
      joinedDate: '2024-01-15',
      lastActive: '2025-10-21T10:30:00Z',
      permissions: ['bookings:manage', 'hotels:manage', 'staff:view'],
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 234 567 8901',
      role: 'Agent',
      department: 'Sales',
      status: 'active',
      joinedDate: '2024-03-20',
      lastActive: '2025-10-21T09:15:00Z',
      permissions: ['bookings:create', 'bookings:view'],
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1 234 567 8902',
      role: 'Support',
      department: 'Customer Service',
      status: 'active',
      joinedDate: '2024-06-10',
      lastActive: '2025-10-20T16:45:00Z',
      permissions: ['bookings:view', 'clients:view'],
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      phone: '+1 234 567 8903',
      role: 'Agent',
      department: 'Sales',
      status: 'on-leave',
      joinedDate: '2024-02-01',
      lastActive: '2025-10-15T14:20:00Z',
      permissions: ['bookings:create', 'bookings:view', 'tours:view'],
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Agent' as StaffMember['role'],
    department: '',
    status: 'active' as StaffMember['status'],
    permissions: [] as string[],
  });

  const availablePermissions = [
    'bookings:create',
    'bookings:view',
    'bookings:manage',
    'bookings:delete',
    'hotels:create',
    'hotels:view',
    'hotels:manage',
    'flights:manage',
    'tours:manage',
    'clients:view',
    'clients:manage',
    'staff:view',
    'staff:manage',
    'reports:view',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStaff) {
      // Update existing staff
      setStaff((prev) =>
        prev.map((member) =>
          member.id === selectedStaff.id ? { ...member, ...formData } : member
        )
      );
      toast.success('Staff member updated successfully!');
    } else {
      // Add new staff
      const newStaff: StaffMember = {
        id: Date.now().toString(),
        ...formData,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setStaff((prev) => [...prev, newStaff]);
      toast.success('Staff member added successfully!');
    }

    setShowModal(false);
    setSelectedStaff(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Agent',
      department: '',
      status: 'active',
      permissions: [],
    });
  };

  const handleEdit = (member: StaffMember) => {
    setSelectedStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      department: member.department,
      status: member.status,
      permissions: member.permissions,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      setStaff((prev) => prev.filter((member) => member.id !== id));
      toast.success('Staff member removed successfully!');
    }
  };

  const togglePermission = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  // Filter staff
  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);

    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus =
      filterStatus === 'all' || member.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: StaffMember['status']) => {
    const variants = {
      active: 'success' as const,
      inactive: 'secondary' as const,
      'on-leave': 'warning' as const,
    };
    return (
      <Badge variant={variants[status]} dot>
        {status === 'on-leave'
          ? 'On Leave'
          : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      Manager: 'primary' as const,
      Agent: 'info' as const,
      Support: 'secondary' as const,
    };
    return (
      <Badge variant={variants[role as keyof typeof variants]}>{role}</Badge>
    );
  };

  const columns = [
    {
      key: 'name',
      label: 'Staff Member',
      render: (row: StaffMember) => (
        <div className="flex items-center space-x-3">
          <Avatar name={row.name} src={row.avatar} size="sm" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {row.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (row: StaffMember) => getRoleBadge(row.role),
    },
    {
      key: 'department',
      label: 'Department',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: StaffMember) => getStatusBadge(row.status),
    },
    {
      key: 'phone',
      label: 'Phone',
    },
    {
      key: 'joinedDate',
      label: 'Joined Date',
      render: (row: StaffMember) =>
        new Date(row.joinedDate).toLocaleDateString(),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (row: StaffMember) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(row.id)}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Staff Management
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your team members and their permissions
            </p>
          </div>

          <Button
            onClick={() => {
              setSelectedStaff(null);
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Staff Member
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900">
                <svg
                  className="h-8 w-8 text-primary-600 dark:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Staff
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {staff.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {staff.filter((s) => s.status === 'active').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                <svg
                  className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  On Leave
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {staff.filter((s) => s.status === 'on-leave').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                <svg
                  className="h-8 w-8 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Managers
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {staff.filter((s) => s.role === 'Manager').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="all">All Roles</option>
              <option value="Manager">Manager</option>
              <option value="Agent">Agent</option>
              <option value="Support">Support</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </Card>

        {/* Staff Table */}
        <Card>
          <Table columns={columns} data={filteredStaff} rowKey="id" />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedStaff(null);
            resetForm();
          }}
          title={selectedStaff ? 'Edit Staff Member' : 'Add Staff Member'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="John Doe"
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john.doe@example.com"
              required
            />

            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+1 234 567 8900"
              required
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as StaffMember['role'],
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                required
              >
                <option value="Manager">Manager</option>
                <option value="Agent">Agent</option>
                <option value="Support">Support</option>
              </select>
            </div>

            <Input
              label="Department"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              placeholder="Sales"
              required
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as StaffMember['status'],
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Permissions
              </label>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                {availablePermissions.map((permission) => (
                  <label
                    key={permission}
                    className="flex cursor-pointer items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission)}
                      onChange={() => togglePermission(permission)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {permission}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setSelectedStaff(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedStaff ? 'Update' : 'Add'} Staff Member
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default StaffManagementPage;
