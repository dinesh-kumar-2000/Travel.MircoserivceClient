import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { useNotifications } from '../../hooks/useNotifications';

interface LoyaltyProgram {
  currentPoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  nextTier: string;
  pointsToNextTier: number;
  lifetimePoints: number;
  pointsExpiring: number;
  expiryDate: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  points: number;
  type: 'earned' | 'redeemed';
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  image: string;
  available: boolean;
}

export const LoyaltyPage: React.FC = () => {
  const { showSuccess, showError } = useNotifications();
  
  const [loyalty, setLoyalty] = useState<LoyaltyProgram>({
    currentPoints: 2450,
    tier: 'silver',
    nextTier: 'Gold',
    pointsToNextTier: 1550,
    lifetimePoints: 8750,
    pointsExpiring: 500,
    expiryDate: '2025-03-31',
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2025-01-20',
      description: 'Booking to Paris - Hotel Reservation',
      points: 250,
      type: 'earned',
    },
    {
      id: '2',
      date: '2025-01-15',
      description: 'Redeemed $50 Travel Credit',
      points: -500,
      type: 'redeemed',
    },
    {
      id: '3',
      date: '2025-01-10',
      description: 'Flight Booking to London',
      points: 400,
      type: 'earned',
    },
    {
      id: '4',
      date: '2025-01-05',
      description: 'Tour Package Purchase',
      points: 300,
      type: 'earned',
    },
  ]);

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      title: '$25 Travel Credit',
      description: 'Use towards your next booking',
      pointsCost: 500,
      category: 'Travel Credit',
      image: '/rewards/credit-25.jpg',
      available: true,
    },
    {
      id: '2',
      title: '$50 Travel Credit',
      description: 'Use towards your next booking',
      pointsCost: 1000,
      category: 'Travel Credit',
      image: '/rewards/credit-50.jpg',
      available: true,
    },
    {
      id: '3',
      title: 'Free Airport Lounge Access',
      description: 'One-time lounge access at select airports',
      pointsCost: 750,
      category: 'Experience',
      image: '/rewards/lounge.jpg',
      available: true,
    },
    {
      id: '4',
      title: 'Priority Check-in',
      description: 'Skip the lines at your next booking',
      pointsCost: 300,
      category: 'Service',
      image: '/rewards/priority.jpg',
      available: true,
    },
    {
      id: '5',
      title: 'Free Hotel Upgrade',
      description: 'Upgrade to next room category',
      pointsCost: 1500,
      category: 'Hotel',
      image: '/rewards/upgrade.jpg',
      available: true,
    },
    {
      id: '6',
      title: '$100 Travel Credit',
      description: 'Use towards your next booking',
      pointsCost: 2000,
      category: 'Travel Credit',
      image: '/rewards/credit-100.jpg',
      available: true,
    },
  ]);

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      bronze: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      silver: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      gold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      platinum: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    return colors[tier] || colors.bronze;
  };

  const handleRedeemReward = async (reward: Reward) => {
    if (loyalty.currentPoints < reward.pointsCost) {
      showError('Insufficient points to redeem this reward');
      return;
    }

    try {
      // TODO: API call to redeem reward
      setLoyalty({
        ...loyalty,
        currentPoints: loyalty.currentPoints - reward.pointsCost,
      });
      showSuccess(`Successfully redeemed: ${reward.title}`);
    } catch (error) {
      showError('Failed to redeem reward');
    }
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          {/* Points Balance Card */}
          <Card>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {loyalty.currentPoints.toLocaleString()}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Available Points
              </p>
              <div className="flex justify-center mb-4">
                <span
                  className={`px-4 py-2 rounded-full font-semibold text-lg ${getTierColor(loyalty.tier)}`}
                >
                  {loyalty.tier.toUpperCase()} TIER
                </span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{
                    width: `${((4000 - loyalty.pointsToNextTier) / 4000) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {loyalty.pointsToNextTier.toLocaleString()} points to{' '}
                {loyalty.nextTier} tier
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Lifetime Points */}
            <Card>
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Lifetime Points
              </h3>
              <p className="text-2xl font-bold">
                {loyalty.lifetimePoints.toLocaleString()}
              </p>
            </Card>

            {/* Points Expiring */}
            <Card>
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Points Expiring Soon
              </h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {loyalty.pointsExpiring}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                By {new Date(loyalty.expiryDate).toLocaleDateString()}
              </p>
            </Card>

            {/* Current Tier Benefits */}
            <Card>
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Current Benefits
              </h3>
              <ul className="text-sm space-y-1">
                <li>• 5% booking discount</li>
                <li>• Priority support</li>
                <li>• Exclusive deals</li>
              </ul>
            </Card>
          </div>

          {/* How to Earn Points */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">How to Earn Points</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Make Bookings</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Earn 1 point for every $1 spent
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
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
                <div>
                  <h4 className="font-semibold mb-1">Refer Friends</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get 500 points for each referral
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded">
                  <svg
                    className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Leave Reviews</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Earn 50 points per review
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Complete Profile</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    One-time bonus of 200 points
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'rewards',
      label: 'Redeem Rewards',
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Available Rewards</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You have {loyalty.currentPoints.toLocaleString()} points to redeem
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id}>
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-4xl">🎁</span>
                </div>
                <h4 className="font-semibold mb-2">{reward.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {reward.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {reward.pointsCost} pts
                  </span>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleRedeemReward(reward)}
                    disabled={loyalty.currentPoints < reward.pointsCost}
                  >
                    Redeem
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'history',
      label: 'Points History',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          {transactions.map((transaction) => (
            <Card key={transaction.id}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div
                  className={`text-lg font-bold ${
                    transaction.type === 'earned'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {transaction.type === 'earned' ? '+' : ''}
                  {transaction.points}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Loyalty Rewards Program</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Earn points on every booking and redeem for exclusive rewards
        </p>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
};

