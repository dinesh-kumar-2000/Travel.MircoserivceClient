import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { bookingService } from '../../services/api/bookingService';
import { Booking } from '../../types';

const BookingConfirmationPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    if (!bookingId) return;

    try {
      setLoading(true);
      const data = await bookingService.getBookingById(bookingId);
      setBooking(data?.data?.data || null);
    } catch (error) {
      console.error('Failed to fetch booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Booking not found
        </h2>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-12 w-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your booking has been successfully confirmed
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Booking Number</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(booking as any).bookingNumber || booking.id}
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-4 py-2 font-medium text-green-800">
                {booking.status}
              </span>
            </div>

            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div>
                <p className="text-sm text-gray-600">Guest Name</p>
                <p className="font-medium">
                  {(booking as any).customerName || 'Guest'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">
                  {(booking as any).customerEmail || '-'}
                </p>
              </div>

              {(booking as any).checkIn && (booking as any).checkOut && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium">
                      {new Date((booking as any).checkIn).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium">
                      {new Date((booking as any).checkOut).toLocaleDateString()}
                    </p>
                  </div>
                </>
              )}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${booking.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* What's Next */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">What's Next?</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-3 text-green-500">✓</span>
                <span className="text-gray-700">
                  You'll receive a confirmation email at{' '}
                  {(booking as any).customerEmail || 'your email'}
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-green-500">✓</span>
                <span className="text-gray-700">
                  Your booking details are saved in your account
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-green-500">✓</span>
                <span className="text-gray-700">
                  You can manage or cancel your booking from your bookings page
                </span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/bookings')}
            className="flex-1"
          >
            View My Bookings
          </Button>
          <Button onClick={() => navigate('/')} className="flex-1">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
