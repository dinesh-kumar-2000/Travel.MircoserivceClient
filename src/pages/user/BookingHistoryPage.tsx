import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { bookingService } from '../../services/api/bookingService';
import { Booking } from '../../types';

const BookingHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    'all' | 'upcoming' | 'past' | 'cancelled'
  >('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call when available
      setBookings([]);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?'))
      return;

    try {
      await bookingService.updateBooking(bookingId, {
        status: 'Cancelled' as any,
      });
      await fetchBookings();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      return (
        booking.status === 'Confirmed' &&
        new Date((booking as any).checkIn || booking.createdAt) > new Date()
      );
    }
    if (filter === 'past') {
      return (
        booking.status === 'Completed' ||
        ((booking as any).checkOut &&
          new Date((booking as any).checkOut) < new Date())
      );
    }
    if (filter === 'cancelled') return booking.status === 'Cancelled';
    return true;
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">My Bookings</h1>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          {(['all', 'upcoming', 'past', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-4 py-2 font-medium capitalize ${
                filter === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id}>
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {(booking as any).itemName || `Booking`}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            booking.status === 'Confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : booking.status === 'Cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        Booking #{(booking as any).bookingNumber || booking.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        ${booking.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium capitalize">
                        {(booking as any).type || 'booking'}
                      </p>
                    </div>
                    {(booking as any).checkIn && (
                      <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-medium">
                          {new Date(
                            (booking as any).checkIn
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {(booking as any).checkOut && (
                      <div>
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-medium">
                          {new Date(
                            (booking as any).checkOut
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Booked on</p>
                      <p className="font-medium">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        navigate(`/booking-confirmation/${booking.id}`)
                      }
                    >
                      View Details
                    </Button>
                    {booking.status === 'Confirmed' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="p-12 text-center">
              <div className="mb-4 text-6xl">📅</div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                No bookings found
              </h2>
              <p className="mb-6 text-gray-600">
                {filter === 'all'
                  ? "You haven't made any bookings yet."
                  : `You don't have any ${filter} bookings.`}
              </p>
              <Button onClick={() => navigate('/search')}>
                Start Exploring
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
