import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { bookingService } from '../../services/api/bookingService';
import { catalogService } from '../../services/api/catalogService';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const [item, setItem] = useState<any>(null);

  const [bookingDetails, setBookingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    fetchItemDetails();
  }, [type, id]);

  const fetchItemDetails = async () => {
    if (!id || !type) return;

    try {
      setLoading(true);
      const data =
        type === 'hotel'
          ? await catalogService.getHotelById(id)
          : type === 'flight'
            ? await catalogService.getFlightById(id)
            : await catalogService.getTourById(id);
      setItem(data?.data);
    } catch (error) {
      console.error('Failed to fetch item details:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!item) return 0;
    if (type === 'hotel') {
      const checkIn = searchParams.get('checkIn');
      const checkOut = searchParams.get('checkOut');
      const pricePerNight = (item as any).pricePerNight || item.price || 0;
      if (!checkIn || !checkOut) return pricePerNight;
      const nights = Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return pricePerNight * nights;
    }
    return item.price || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setProcessing(true);

      // Create booking
      const booking = await bookingService.createBooking({
        userId: 'current-user',
        itemId: id || '',
        totalAmount: calculateTotal(),
        status: 'Pending',
        ...bookingDetails,
      } as any);

      // Process payment - mock for now
      console.log('Processing payment:', {
        amount: calculateTotal(),
        ...paymentDetails,
      });

      // Redirect to confirmation
      navigate(`/booking-confirmation/${booking.data?.data?.id}`);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Item not found
        </h2>
        <Button onClick={() => navigate('/search')}>Back to Search</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-900">
            Complete Your Booking
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Booking Form */}
            <div className="space-y-6 lg:col-span-2">
              {/* Guest Details */}
              <Card>
                <div className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">Guest Details</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                      label="First Name"
                      required
                      value={bookingDetails.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setBookingDetails({
                          ...bookingDetails,
                          firstName: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Last Name"
                      required
                      value={bookingDetails.lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setBookingDetails({
                          ...bookingDetails,
                          lastName: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Email"
                      type="email"
                      required
                      value={bookingDetails.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setBookingDetails({
                          ...bookingDetails,
                          email: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Phone"
                      required
                      value={bookingDetails.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setBookingDetails({
                          ...bookingDetails,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mt-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={bookingDetails.specialRequests}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setBookingDetails({
                          ...bookingDetails,
                          specialRequests: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                      placeholder="Any special requirements or requests..."
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Details */}
              <Card>
                <div className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">
                    Payment Information
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label="Card Number"
                      required
                      value={paymentDetails.cardNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          cardNumber: e.target.value,
                        })
                      }
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    <Input
                      label="Cardholder Name"
                      required
                      value={paymentDetails.cardName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          cardName: e.target.value,
                        })
                      }
                      placeholder="John Doe"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        required
                        value={paymentDetails.expiryDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            expiryDate: e.target.value,
                          })
                        }
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      <Input
                        label="CVV"
                        required
                        value={paymentDetails.cvv}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            cvv: e.target.value,
                          })
                        }
                        placeholder="123"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <div className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

                  {/* Item Details */}
                  <div className="mb-4">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name || item.title}
                        className="mb-3 h-32 w-full rounded-lg object-cover"
                      />
                    )}
                    <h3 className="text-lg font-semibold">
                      {item.name || item.title}
                    </h3>
                    {item.location && (
                      <p className="text-sm text-gray-600">{item.location}</p>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="mb-4 space-y-2 text-sm">
                    {type === 'hotel' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-in:</span>
                          <span className="font-medium">
                            {searchParams.get('checkIn')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-out:</span>
                          <span className="font-medium">
                            {searchParams.get('checkOut')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Guests:</span>
                          <span className="font-medium">
                            {searchParams.get('guests')}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="mb-4 space-y-2 border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxes & Fees:</span>
                      <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        ${(calculateTotal() * 1.1).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    isLoading={processing}
                    className="w-full"
                  >
                    Complete Booking
                  </Button>

                  <p className="mt-4 text-center text-xs text-gray-500">
                    By completing this booking, you agree to our terms and
                    conditions
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
