import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Table } from '../../../components/common/Table';
import { Tabs } from '../../../components/common/Tabs';
import { useNotifications } from '../../../hooks/useNotifications';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  category: string;
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  lastModified: string;
}

export const TemplateBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const [emailTemplates, setEmailTemplates] = useState<Template[]>([]);
  const [smsTemplates, setSmsTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await templateService.getTemplates();

      // Mock data
      setEmailTemplates([
        {
          id: '1',
          name: 'Booking Confirmation',
          type: 'email',
          category: 'Booking',
          subject: 'Your Booking is Confirmed - {{bookingId}}',
          content: `
Hello {{customerName}},

Thank you for booking with us! Your booking has been confirmed.

Booking Details:
- Booking ID: {{bookingId}}
- Destination: {{destination}}
- Date: {{travelDate}}
- Total Amount: {{amount}}

You can view your complete itinerary by logging into your account.

Best regards,
{{companyName}}
          `.trim(),
          variables: [
            'customerName',
            'bookingId',
            'destination',
            'travelDate',
            'amount',
            'companyName',
          ],
          isActive: true,
          lastModified: '2025-01-20',
        },
        {
          id: '2',
          name: 'Payment Receipt',
          type: 'email',
          category: 'Payment',
          subject: 'Payment Receipt - {{receiptId}}',
          content: `
Dear {{customerName}},

We have received your payment of {{amount}} for booking {{bookingId}}.

Receipt ID: {{receiptId}}
Payment Method: {{paymentMethod}}
Transaction Date: {{transactionDate}}

Thank you for your business!

{{companyName}}
          `.trim(),
          variables: [
            'customerName',
            'amount',
            'bookingId',
            'receiptId',
            'paymentMethod',
            'transactionDate',
            'companyName',
          ],
          isActive: true,
          lastModified: '2025-01-18',
        },
        {
          id: '3',
          name: 'Booking Reminder',
          type: 'email',
          category: 'Reminder',
          subject: 'Reminder: Your Trip to {{destination}} is Coming Up!',
          content: `
Hi {{customerName}},

This is a friendly reminder that your trip to {{destination}} is coming up soon!

Departure Date: {{departureDate}}
Booking ID: {{bookingId}}

Please make sure you have all necessary documents ready.

Safe travels!
{{companyName}}
          `.trim(),
          variables: [
            'customerName',
            'destination',
            'departureDate',
            'bookingId',
            'companyName',
          ],
          isActive: true,
          lastModified: '2025-01-15',
        },
      ]);

      setSmsTemplates([
        {
          id: '4',
          name: 'Booking Confirmation SMS',
          type: 'sms',
          category: 'Booking',
          content:
            'Your booking {{bookingId}} is confirmed for {{destination}} on {{date}}. Total: {{amount}}. View details at {{url}}',
          variables: ['bookingId', 'destination', 'date', 'amount', 'url'],
          isActive: true,
          lastModified: '2025-01-20',
        },
        {
          id: '5',
          name: 'OTP Verification',
          type: 'sms',
          category: 'Authentication',
          content:
            'Your verification code is {{otp}}. Valid for 10 minutes. Do not share this code.',
          variables: ['otp'],
          isActive: true,
          lastModified: '2025-01-19',
        },
        {
          id: '6',
          name: 'Payment Reminder',
          type: 'sms',
          category: 'Payment',
          content:
            'Reminder: Payment of {{amount}} is pending for booking {{bookingId}}. Pay now: {{paymentLink}}',
          variables: ['amount', 'bookingId', 'paymentLink'],
          isActive: true,
          lastModified: '2025-01-17',
        },
      ]);
    } catch (error) {
      showError('Failed to fetch templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (
    id: string,
    type: 'email' | 'sms',
    isActive: boolean
  ) => {
    try {
      // TODO: API call to toggle active status
      showSuccess('Template status updated');
      fetchTemplates();
    } catch (error) {
      showError('Failed to update template status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      // TODO: API call to delete template
      showSuccess('Template deleted successfully');
      fetchTemplates();
    } catch (error) {
      showError('Failed to delete template');
    }
  };

  const getColumns = (type: 'email' | 'sms') => [
    {
      header: 'Name',
      accessor: 'name' as keyof Template,
    },
    {
      header: 'Category',
      accessor: 'category' as keyof Template,
    },
    ...(type === 'email'
      ? [
          {
            header: 'Subject',
            accessor: 'subject' as keyof Template,
          },
        ]
      : []),
    {
      header: 'Variables',
      accessor: 'variables' as keyof Template,
      cell: (row: Template) => (
        <div className="flex flex-wrap gap-1">
          {row.variables.slice(0, 3).map((variable, index) => (
            <code
              key={index}
              className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-700"
            >
              {'{{'}
              {variable}
              {'}}'}
            </code>
          ))}
          {row.variables.length > 3 && (
            <span className="text-xs text-gray-500">
              +{row.variables.length - 3} more
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'isActive' as keyof Template,
      cell: (row: Template) => (
        <Badge variant={row.isActive ? 'success' : 'error'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Last Modified',
      accessor: 'lastModified' as keyof Template,
      cell: (row: Template) => new Date(row.lastModified).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessor: 'id' as keyof Template,
      cell: (row: Template) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/tenantadmin/templates/${type}/${row.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleToggleActive(row.id, type, row.isActive)}
          >
            {row.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const tabs = [
    {
      id: 'email',
      label: `Email Templates (${emailTemplates.length})`,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create and manage email templates for automated communications.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/tenantadmin/templates/email/new')}
            >
              + New Email Template
            </Button>
          </div>
          <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <Table
              columns={getColumns('email')}
              data={emailTemplates}
              isLoading={isLoading}
              emptyMessage="No email templates found. Create your first template."
            />
          </div>
        </div>
      ),
    },
    {
      id: 'sms',
      label: `SMS Templates (${smsTemplates.length})`,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create and manage SMS templates for quick notifications.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/tenantadmin/templates/sms/new')}
            >
              + New SMS Template
            </Button>
          </div>
          <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <Table
              columns={getColumns('sms')}
              data={smsTemplates}
              isLoading={isLoading}
              emptyMessage="No SMS templates found. Create your first template."
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Template Builder</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create and manage email and SMS templates for automated communications
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <h3 className="mb-2 font-semibold text-blue-800 dark:text-blue-200">
          Available Variables
        </h3>
        <p className="mb-2 text-sm text-blue-700 dark:text-blue-300">
          Use these variables in your templates by wrapping them in double curly
          braces, e.g., {'{{'} customerName {'}}'}.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            'customerName',
            'bookingId',
            'destination',
            'date',
            'amount',
            'companyName',
            'email',
            'phone',
          ].map((variable) => (
            <code
              key={variable}
              className="rounded bg-white px-2 py-1 text-xs dark:bg-gray-800"
            >
              {'{{'}
              {variable}
              {'}}'}
            </code>
          ))}
        </div>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
};
