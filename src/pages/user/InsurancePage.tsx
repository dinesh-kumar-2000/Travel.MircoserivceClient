import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useNotifications } from '../../hooks/useNotifications';

interface InsurancePlan {
  id: string;
  name: string;
  provider: string;
  price: number;
  coverage: number;
  benefits: string[];
  popular?: boolean;
}

interface AddonService {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: 'meal' | 'transport' | 'activity' | 'other';
}

export const InsurancePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useNotifications();

  const bookingId = searchParams.get('bookingId');
  const bookingType = searchParams.get('type') || 'hotel';

  const [selectedInsurance, setSelectedInsurance] = useState<string | null>(
    null
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const insurancePlans: InsurancePlan[] = [
    {
      id: 'basic',
      name: 'Basic Protection',
      provider: 'TravelSafe Insurance',
      price: 25,
      coverage: 50000,
      benefits: [
        'Trip cancellation coverage',
        'Medical emergency coverage',
        'Lost baggage coverage up to $1,000',
        '24/7 emergency assistance',
      ],
    },
    {
      id: 'standard',
      name: 'Standard Protection',
      provider: 'TravelSafe Insurance',
      price: 50,
      coverage: 100000,
      benefits: [
        'All Basic benefits',
        'Trip interruption coverage',
        'Lost baggage coverage up to $2,500',
        'Flight delay coverage',
        'Rental car protection',
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium Protection',
      provider: 'TravelSafe Insurance',
      price: 100,
      coverage: 250000,
      benefits: [
        'All Standard benefits',
        'Cancel for any reason coverage',
        'Lost baggage coverage up to $5,000',
        'Adventure sports coverage',
        'Pre-existing condition coverage',
        'Concierge services',
      ],
    },
  ];

  const addons: AddonService[] = [
    {
      id: 'airport-transfer',
      name: 'Airport Transfer',
      description: 'Private car service to/from airport',
      price: 45,
      icon: '🚗',
      category: 'transport',
    },
    {
      id: 'breakfast',
      name: 'Breakfast Package',
      description: 'Daily breakfast for your entire stay',
      price: 20,
      icon: '🍳',
      category: 'meal',
    },
    {
      id: 'spa-treatment',
      name: 'Spa Treatment',
      description: '60-minute relaxation massage',
      price: 80,
      icon: '💆',
      category: 'activity',
    },
    {
      id: 'city-tour',
      name: 'City Tour',
      description: 'Guided city tour with local expert',
      price: 60,
      icon: '🗺️',
      category: 'activity',
    },
    {
      id: 'wifi',
      name: 'Premium WiFi',
      description: 'High-speed internet for your stay',
      price: 15,
      icon: '📶',
      category: 'other',
    },
    {
      id: 'late-checkout',
      name: 'Late Checkout',
      description: 'Extend checkout time until 6 PM',
      price: 30,
      icon: '🕐',
      category: 'other',
    },
  ];

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const calculateTotal = () => {
    const insurancePrice = selectedInsurance
      ? insurancePlans.find((p) => p.id === selectedInsurance)?.price || 0
      : 0;
    const addonsPrice = selectedAddons.reduce((total, addonId) => {
      const addon = addons.find((a) => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);
    return insurancePrice + addonsPrice;
  };

  const handleProceed = () => {
    if (!selectedInsurance && selectedAddons.length === 0) {
      navigate(`/user/checkout?bookingId=${bookingId}`);
      return;
    }

    // TODO: Save insurance and addons selection
    showSuccess('Insurance and add-ons added to your booking');
    navigate(`/user/checkout?bookingId=${bookingId}`);
  };

  const handleSkip = () => {
    navigate(`/user/checkout?bookingId=${bookingId}`);
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Protect Your Trip</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add travel insurance and enhance your experience with optional
          services
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Travel Insurance */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">
              Travel Insurance Plans
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {insurancePlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative cursor-pointer transition-all ${
                    selectedInsurance === plan.id
                      ? 'ring-2 ring-blue-500'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedInsurance(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute right-0 top-0 -mr-2 -mt-2">
                      <Badge variant="success">Most Popular</Badge>
                    </div>
                  )}
                  <div className="mb-4 text-center">
                    <h3 className="mb-1 text-lg font-semibold">{plan.name}</h3>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                      {plan.provider}
                    </p>
                    <div className="mb-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
                      ${plan.price}
                    </div>
                    <p className="text-sm text-gray-500">per person</p>
                  </div>
                  <div className="mb-4">
                    <p className="mb-2 text-sm font-semibold">
                      Coverage: ${plan.coverage.toLocaleString()}
                    </p>
                    <ul className="space-y-1 text-sm">
                      {plan.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400">
                            ✓
                          </span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    variant={
                      selectedInsurance === plan.id ? 'primary' : 'secondary'
                    }
                    className="w-full"
                    size="sm"
                  >
                    {selectedInsurance === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>
                </Card>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setSelectedInsurance(null)}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                No thanks, I don't need insurance
              </button>
            </div>
          </div>

          {/* Add-on Services */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">
              Enhance Your Experience
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {addons.map((addon) => (
                <Card
                  key={addon.id}
                  className={`cursor-pointer transition-all ${
                    selectedAddons.includes(addon.id)
                      ? 'ring-2 ring-blue-500'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleToggleAddon(addon.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{addon.icon}</div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{addon.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {addon.description}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedAddons.includes(addon.id)}
                          onChange={() => handleToggleAddon(addon.id)}
                          className="ml-2"
                        />
                      </div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        +${addon.price}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card>
              <h3 className="mb-4 text-lg font-semibold">Summary</h3>

              <div className="mb-4 space-y-3">
                {selectedInsurance && (
                  <div className="flex justify-between">
                    <span>
                      {
                        insurancePlans.find((p) => p.id === selectedInsurance)
                          ?.name
                      }
                    </span>
                    <span className="font-semibold">
                      $
                      {
                        insurancePlans.find((p) => p.id === selectedInsurance)
                          ?.price
                      }
                    </span>
                  </div>
                )}

                {selectedAddons.map((addonId) => {
                  const addon = addons.find((a) => a.id === addonId);
                  return (
                    <div key={addonId} className="flex justify-between">
                      <span>{addon?.name}</span>
                      <span className="font-semibold">${addon?.price}</span>
                    </div>
                  );
                })}

                {!selectedInsurance && selectedAddons.length === 0 && (
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    No insurance or add-ons selected
                  </p>
                )}
              </div>

              <div className="mb-4 border-t border-gray-200 pt-3 dark:border-gray-700">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Additional:</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    ${calculateTotal()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleProceed}
                >
                  Continue to Checkout
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleSkip}
                >
                  Skip & Continue
                </Button>
              </div>

              <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  💡 <strong>Tip:</strong> Travel insurance protects you from
                  unexpected events like trip cancellations, medical
                  emergencies, and lost baggage.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
