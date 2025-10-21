import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  limits: {
    maxUsers: number;
    maxBookings: number;
    storageGB: number;
    customBranding: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    apiAccess: boolean;
  };
  isActive: boolean;
  isPopular: boolean;
}

const PlansPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: '1',
      name: 'Starter',
      description: 'Perfect for small travel agencies getting started',
      price: 99,
      billingCycle: 'monthly',
      features: [
        'Up to 10 users',
        'Up to 100 bookings/month',
        '10GB storage',
        'Basic analytics',
        'Email support',
      ],
      limits: {
        maxUsers: 10,
        maxBookings: 100,
        storageGB: 10,
        customBranding: false,
        advancedAnalytics: false,
        prioritySupport: false,
        apiAccess: false,
      },
      isActive: true,
      isPopular: false,
    },
    {
      id: '2',
      name: 'Professional',
      description: 'For growing travel businesses',
      price: 299,
      billingCycle: 'monthly',
      features: [
        'Up to 50 users',
        'Unlimited bookings',
        '100GB storage',
        'Custom branding',
        'Advanced analytics',
        'Priority support',
        'API access',
      ],
      limits: {
        maxUsers: 50,
        maxBookings: -1,
        storageGB: 100,
        customBranding: true,
        advancedAnalytics: true,
        prioritySupport: true,
        apiAccess: true,
      },
      isActive: true,
      isPopular: true,
    },
    {
      id: '3',
      name: 'Enterprise',
      description: 'For large-scale travel operations',
      price: 999,
      billingCycle: 'monthly',
      features: [
        'Unlimited users',
        'Unlimited bookings',
        '1TB storage',
        'Custom branding',
        'Advanced analytics',
        'Dedicated support',
        'Full API access',
        'White-label solution',
        'Custom integrations',
      ],
      limits: {
        maxUsers: -1,
        maxBookings: -1,
        storageGB: 1000,
        customBranding: true,
        advancedAnalytics: true,
        prioritySupport: true,
        apiAccess: true,
      },
      isActive: true,
      isPopular: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState<Partial<SubscriptionPlan>>({});
  const [loading, setLoading] = useState(false);

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      billingCycle: 'monthly',
      features: [],
      limits: {
        maxUsers: 0,
        maxBookings: 0,
        storageGB: 0,
        customBranding: false,
        advancedAnalytics: false,
        prioritySupport: false,
        apiAccess: false,
      },
      isActive: true,
      isPopular: false,
    });
    setShowModal(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData(plan);
    setShowModal(true);
  };

  const handleSavePlan = async () => {
    try {
      setLoading(true);
      // API call would go here
      if (editingPlan) {
        setPlans(
          plans.map((p) =>
            p.id === editingPlan.id
              ? ({ ...p, ...formData } as SubscriptionPlan)
              : p
          )
        );
      } else {
        const newPlan: SubscriptionPlan = {
          ...formData,
          id: Date.now().toString(),
        } as SubscriptionPlan;
        setPlans([...plans, newPlan]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        setLoading(true);
        // API call would go here
        setPlans(plans.filter((p) => p.id !== planId));
      } catch (error) {
        console.error('Failed to delete plan:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleActive = async (planId: string) => {
    try {
      setPlans(
        plans.map((p) =>
          p.id === planId ? { ...p, isActive: !p.isActive } : p
        )
      );
    } catch (error) {
      console.error('Failed to toggle plan status:', error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Subscription Plans
          </h1>
          <p className="mt-1 text-gray-600">
            Manage pricing and features for tenant subscriptions
          </p>
        </div>
        <Button onClick={handleCreatePlan}>Create New Plan</Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <div className="p-6">
              {/* Plan Header */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  {plan.isPopular && (
                    <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      Most Popular
                    </span>
                  )}
                </div>
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    plan.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="ml-2 text-gray-600">
                    /{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="mb-2 text-sm font-semibold text-gray-900">
                  Features:
                </h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="mr-2 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limits */}
              <div className="mb-6 rounded bg-gray-50 p-3">
                <h4 className="mb-2 text-sm font-semibold text-gray-900">
                  Limits:
                </h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>
                    Max Users:{' '}
                    {plan.limits.maxUsers === -1
                      ? 'Unlimited'
                      : plan.limits.maxUsers}
                  </p>
                  <p>
                    Max Bookings:{' '}
                    {plan.limits.maxBookings === -1
                      ? 'Unlimited'
                      : plan.limits.maxBookings}
                  </p>
                  <p>Storage: {plan.limits.storageGB}GB</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => handleEditPlan(plan)}
                >
                  Edit
                </Button>
                <Button
                  variant={plan.isActive ? 'secondary' : 'primary'}
                  className="flex-1"
                  onClick={() => handleToggleActive(plan.id)}
                >
                  {plan.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPlan ? 'Edit Plan' : 'Create New Plan'}
      >
        <div className="space-y-4 p-6">
          <Input
            label="Plan Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Professional"
          />
          <Input
            label="Description"
            value={formData.description || ''}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Brief description of the plan"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              value={formData.price || 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Billing Cycle
              </label>
              <select
                value={formData.billingCycle || 'monthly'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({
                    ...formData,
                    billingCycle: e.target.value as 'monthly' | 'yearly',
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPopular || false}
                onChange={(e) =>
                  setFormData({ ...formData, isPopular: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Mark as Popular</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive !== false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan} isLoading={loading}>
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PlansPage;
