import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Tabs } from '@/components/common/Tabs';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Promo {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minAmount: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  expiryDate: string;
  terms: string[];
  isActive: boolean;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  position: 'hero' | 'sidebar' | 'footer';
  isActive: boolean;
  startDate: string;
  endDate: string;
}

const MarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('promos');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'promo' | 'coupon' | 'banner'>(
    'promo'
  );

  // Mock data
  const [promos, setPromos] = useState<Promo[]>([
    {
      id: '1',
      code: 'WELCOME20',
      description: 'Welcome offer for new users',
      discountType: 'percentage',
      discountValue: 20,
      minAmount: 100,
      maxDiscount: 50,
      validFrom: '2025-01-01',
      validTo: '2025-12-31',
      usageLimit: 1000,
      usedCount: 245,
      isActive: true,
    },
    {
      id: '2',
      code: 'SUMMER50',
      description: 'Summer special discount',
      discountType: 'fixed',
      discountValue: 50,
      minAmount: 200,
      validFrom: '2025-06-01',
      validTo: '2025-08-31',
      usageLimit: 500,
      usedCount: 123,
      isActive: true,
    },
  ]);

  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: '1',
      code: 'FIRST100',
      title: 'First Booking Offer',
      description: '₹100 off on your first booking',
      discount: 100,
      expiryDate: '2025-12-31',
      terms: ['Valid for new users only', 'Minimum booking of ₹500'],
      isActive: true,
    },
  ]);

  const [banners, setBanners] = useState<Banner[]>([
    {
      id: '1',
      title: 'Summer Sale',
      subtitle: 'Up to 50% off on all packages',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      link: '/packages',
      position: 'hero',
      isActive: true,
      startDate: '2025-06-01',
      endDate: '2025-08-31',
    },
  ]);

  const openModal = (type: 'promo' | 'coupon' | 'banner') => {
    setModalType(type);
    setShowModal(true);
  };

  const handleDelete = (type: 'promo' | 'coupon' | 'banner', id: string) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'promo') {
        setPromos((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'coupon') {
        setCoupons((prev) => prev.filter((item) => item.id !== id));
      } else {
        setBanners((prev) => prev.filter((item) => item.id !== id));
      }
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`
      );
    }
  };

  const toggleActive = (type: 'promo' | 'coupon' | 'banner', id: string) => {
    if (type === 'promo') {
      setPromos((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isActive: !item.isActive } : item
        )
      );
    } else if (type === 'coupon') {
      setCoupons((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isActive: !item.isActive } : item
        )
      );
    } else {
      setBanners((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isActive: !item.isActive } : item
        )
      );
    }
    toast.success('Status updated successfully!');
  };

  const tabs = [
    {
      id: 'promos',
      label: 'Promo Codes',
      badge: promos.length,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
      content: (
        <div className="space-y-4">
          {promos.map((promo) => (
            <Card key={promo.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {promo.code}
                    </h3>
                    <Badge
                      variant={promo.isActive ? 'success' : 'secondary'}
                      dot
                    >
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    {promo.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Discount:
                      </span>{' '}
                      {promo.discountType === 'percentage'
                        ? `${promo.discountValue}%`
                        : `₹${promo.discountValue}`}
                      {promo.maxDiscount && ` (Max: ₹${promo.maxDiscount})`}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Min Amount:
                      </span>{' '}
                      ₹{promo.minAmount}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Valid Period:
                      </span>{' '}
                      {new Date(promo.validFrom).toLocaleDateString()} -{' '}
                      {new Date(promo.validTo).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Usage:
                      </span>{' '}
                      {promo.usedCount} / {promo.usageLimit}
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex flex-col space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive('promo', promo.id)}
                  >
                    {promo.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete('promo', promo.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: 'coupons',
      label: 'Coupons',
      badge: coupons.length,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
      ),
      content: (
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <Card key={coupon.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {coupon.title}
                    </h3>
                    <Badge
                      variant={coupon.isActive ? 'success' : 'secondary'}
                      dot
                    >
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    Code:{' '}
                    <span className="font-mono font-bold">{coupon.code}</span>
                  </p>
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    {coupon.description}
                  </p>
                  <div className="mb-2 text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Expires:
                    </span>{' '}
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Terms:
                    </span>
                    <ul className="mt-1 list-inside list-disc text-gray-600 dark:text-gray-400">
                      {coupon.terms.map((term, idx) => (
                        <li key={idx}>{term}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="ml-4 flex flex-col space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive('coupon', coupon.id)}
                  >
                    {coupon.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete('coupon', coupon.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: 'banners',
      label: 'Banners',
      badge: banners.length,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      content: (
        <div className="space-y-4">
          {banners.map((banner) => (
            <Card key={banner.id} className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="h-24 w-40 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {banner.title}
                    </h3>
                    <Badge
                      variant={banner.isActive ? 'success' : 'secondary'}
                      dot
                    >
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="info">{banner.position}</Badge>
                  </div>
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    {banner.subtitle}
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      <span className="font-medium">Link:</span> {banner.link}
                    </p>
                    <p>
                      <span className="font-medium">Period:</span>{' '}
                      {new Date(banner.startDate).toLocaleDateString()} -{' '}
                      {new Date(banner.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive('banner', banner.id)}
                  >
                    {banner.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete('banner', banner.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
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
              Marketing Tools
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage promotions, coupons, and marketing banners
            </p>
          </div>

          <div className="flex space-x-3">
            <Button onClick={() => openModal('promo')}>
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
              Add Promo
            </Button>
            <Button onClick={() => openModal('coupon')} variant="secondary">
              Add Coupon
            </Button>
            <Button onClick={() => openModal('banner')} variant="secondary">
              Add Banner
            </Button>
          </div>
        </div>

        {/* Marketing Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Promos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {promos.filter((p) => p.isActive).length}
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
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Coupons
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {coupons.length}
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Banners
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {banners.filter((b) => b.isActive).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} onChange={setActiveTab} variant="underline" />
      </div>
    </DashboardLayout>
  );
};

export default MarketingPage;
