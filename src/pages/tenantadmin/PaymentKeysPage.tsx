import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Tabs } from '@/components/common/Tabs';
import toast from 'react-hot-toast';

interface PaymentKey {
  id: string;
  provider: 'stripe' | 'razorpay';
  environment: 'test' | 'live';
  publicKey: string;
  secretKey: string;
  webhookSecret?: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
}

const PaymentKeysPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState<PaymentKey | null>(null);
  const [showSecretKey, setShowSecretKey] = useState<string | null>(null);

  // Mock data
  const [paymentKeys, setPaymentKeys] = useState<PaymentKey[]>([
    {
      id: '1',
      provider: 'stripe',
      environment: 'test',
      publicKey: 'pk_test_51Abc...xyz',
      secretKey: 'sk_test_51Abc...xyz',
      webhookSecret: 'whsec_abc...xyz',
      isActive: true,
      createdAt: '2025-01-15T10:00:00Z',
      lastUsed: '2025-10-20T14:30:00Z',
    },
    {
      id: '2',
      provider: 'razorpay',
      environment: 'test',
      publicKey: 'rzp_test_abc123',
      secretKey: 'rzp_secret_xyz789',
      isActive: true,
      createdAt: '2025-01-20T09:00:00Z',
      lastUsed: '2025-10-19T11:20:00Z',
    },
  ]);

  const [formData, setFormData] = useState({
    provider: 'stripe' as 'stripe' | 'razorpay',
    environment: 'test' as 'test' | 'live',
    publicKey: '',
    secretKey: '',
    webhookSecret: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedKey) {
      // Update existing key
      setPaymentKeys((prev) =>
        prev.map((key) =>
          key.id === selectedKey.id
            ? { ...key, ...formData, lastUsed: new Date().toISOString() }
            : key
        )
      );
      toast.success('Payment key updated successfully!');
    } else {
      // Add new key
      const newKey: PaymentKey = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setPaymentKeys((prev) => [...prev, newKey]);
      toast.success('Payment key added successfully!');
    }

    setShowModal(false);
    setSelectedKey(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      provider: 'stripe',
      environment: 'test',
      publicKey: '',
      secretKey: '',
      webhookSecret: '',
    });
  };

  const handleEdit = (key: PaymentKey) => {
    setSelectedKey(key);
    setFormData({
      provider: key.provider,
      environment: key.environment,
      publicKey: key.publicKey,
      secretKey: key.secretKey,
      webhookSecret: key.webhookSecret || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment key?')) {
      setPaymentKeys((prev) => prev.filter((key) => key.id !== id));
      toast.success('Payment key deleted successfully!');
    }
  };

  const toggleActive = (id: string) => {
    setPaymentKeys((prev) =>
      prev.map((key) =>
        key.id === id ? { ...key, isActive: !key.isActive } : key
      )
    );
    toast.success('Payment key status updated!');
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.slice(0, 8)}...${key.slice(-4)}`;
  };

  const stripeKeys = paymentKeys.filter((k) => k.provider === 'stripe');
  const razorpayKeys = paymentKeys.filter((k) => k.provider === 'razorpay');

  const renderKeyCard = (key: PaymentKey) => (
    <Card key={key.id} className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center space-x-2">
            <Badge
              variant={key.environment === 'live' ? 'success' : 'warning'}
              className="uppercase"
            >
              {key.environment}
            </Badge>
            <Badge
              variant={key.isActive ? 'success' : 'secondary'}
              dot
            >
              {key.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Public Key:
              </span>
              <p className="font-mono text-gray-600 dark:text-gray-400">
                {key.publicKey}
              </p>
            </div>

            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Secret Key:
              </span>
              <div className="flex items-center space-x-2">
                <p className="font-mono text-gray-600 dark:text-gray-400">
                  {showSecretKey === key.id ? key.secretKey : maskKey(key.secretKey)}
                </p>
                <button
                  onClick={() =>
                    setShowSecretKey(showSecretKey === key.id ? null : key.id)
                  }
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showSecretKey === key.id ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {key.webhookSecret && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Webhook Secret:
                </span>
                <p className="font-mono text-gray-600 dark:text-gray-400">
                  {maskKey(key.webhookSecret)}
                </p>
              </div>
            )}

            <div className="pt-2 text-xs text-gray-500">
              <p>Created: {new Date(key.createdAt).toLocaleDateString()}</p>
              {key.lastUsed && (
                <p>Last Used: {new Date(key.lastUsed).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>

        <div className="ml-4 flex flex-col space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleActive(key.id)}
          >
            {key.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleEdit(key)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(key.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );

  const tabs = [
    {
      id: 'stripe',
      label: 'Stripe',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
        </svg>
      ),
      badge: stripeKeys.length,
      content: (
        <div className="space-y-4">
          {stripeKeys.length > 0 ? (
            stripeKeys.map(renderKeyCard)
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No Stripe keys configured yet
              </p>
            </Card>
          )}
        </div>
      ),
    },
    {
      id: 'razorpay',
      label: 'Razorpay',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L22.436 0zM14.26 10.098L3.389 17.166 1.564 24l9.008-5.869-1.174-4.276z" />
        </svg>
      ),
      badge: razorpayKeys.length,
      content: (
        <div className="space-y-4">
          {razorpayKeys.length > 0 ? (
            razorpayKeys.map(renderKeyCard)
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No Razorpay keys configured yet
              </p>
            </Card>
          )}
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
              Payment Gateway Keys
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your payment gateway API keys and configurations
            </p>
          </div>

          <Button
            onClick={() => {
              setSelectedKey(null);
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
            Add Payment Key
          </Button>
        </div>

        {/* Security Notice */}
        <Card className="border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex">
            <svg
              className="h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Security Notice
              </h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                Never share your secret keys publicly. Always use test keys for
                development and live keys only in production environments.
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Keys Tabs */}
        <Tabs tabs={tabs} variant="underline" />

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedKey(null);
            resetForm();
          }}
          title={selectedKey ? 'Edit Payment Key' : 'Add Payment Key'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Provider
              </label>
              <select
                value={formData.provider}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    provider: e.target.value as 'stripe' | 'razorpay',
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                required
              >
                <option value="stripe">Stripe</option>
                <option value="razorpay">Razorpay</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Environment
              </label>
              <select
                value={formData.environment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    environment: e.target.value as 'test' | 'live',
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                required
              >
                <option value="test">Test</option>
                <option value="live">Live</option>
              </select>
            </div>

            <Input
              label="Public Key"
              value={formData.publicKey}
              onChange={(e) =>
                setFormData({ ...formData, publicKey: e.target.value })
              }
              placeholder={
                formData.provider === 'stripe'
                  ? 'pk_test_...'
                  : 'rzp_test_...'
              }
              required
            />

            <Input
              label="Secret Key"
              type="password"
              value={formData.secretKey}
              onChange={(e) =>
                setFormData({ ...formData, secretKey: e.target.value })
              }
              placeholder={
                formData.provider === 'stripe'
                  ? 'sk_test_...'
                  : 'Secret key'
              }
              required
            />

            <Input
              label="Webhook Secret (Optional)"
              type="password"
              value={formData.webhookSecret}
              onChange={(e) =>
                setFormData({ ...formData, webhookSecret: e.target.value })
              }
              placeholder="whsec_..."
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setSelectedKey(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedKey ? 'Update' : 'Add'} Key
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default PaymentKeysPage;

