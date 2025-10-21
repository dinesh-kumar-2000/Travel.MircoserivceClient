import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { catalogService } from '../../services/api/catalogService';
import { Hotel } from '../../types';

const HotelDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    fetchHotel();
  }, [id]);

  const fetchHotel = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await catalogService.getHotelById(id);
      setHotel(data.data || null);
    } catch (error) {
      console.error('Failed to fetch hotel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate(
      `/checkout?type=hotel&id=${id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
    );
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return nights > 0 ? nights : 0;
  };

  const calculateTotal = () => {
    if (!hotel) return 0;
    const pricePerNight =
      (hotel as any).pricePerNight || (hotel as any).price || 0;
    return pricePerNight * calculateNights();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Hotel not found
        </h2>
        <Button onClick={() => navigate('/search?type=hotels')}>
          Back to Search
        </Button>
      </div>
    );
  }

  const images = hotel.images || [
    (hotel as any).imageUrl || 'https://via.placeholder.com/800x600',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <img
            src={images[selectedImage]}
            alt={hotel.name}
            className="mb-4 h-96 w-full rounded-lg object-cover shadow-lg"
          />
          <div className="grid grid-cols-6 gap-2">
            {images.slice(0, 6).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${hotel.name} ${idx + 1}`}
                onClick={() => setSelectedImage(idx)}
                className={`h-24 w-full cursor-pointer rounded object-cover ${
                  selectedImage === idx
                    ? 'border-4 border-blue-600'
                    : 'border border-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Hotel Details */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">
                      {hotel.name}
                    </h1>
                    <p className="text-lg text-gray-600">
                      📍 {(hotel as any).location || 'Location'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 flex text-xl text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < (hotel.rating || 0) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-lg font-semibold">
                      {hotel.rating}/5
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="mb-2 text-xl font-semibold">About</h2>
                  <p className="text-gray-700">{hotel.description}</p>
                </div>

                <div className="mb-6">
                  <h2 className="mb-3 text-xl font-semibold">Amenities</h2>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {hotel.amenities?.map((amenity, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="mr-2 text-green-500">✓</span>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="mb-3 text-xl font-semibold">Location</h2>
                  <div className="flex h-64 items-center justify-center rounded-lg bg-gray-200">
                    <p className="text-gray-500">Map would be displayed here</p>
                  </div>
                </div>

                <div>
                  <h2 className="mb-3 text-xl font-semibold">Reviews</h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border-b border-gray-200 pb-4">
                        <div className="mb-2 flex items-center">
                          <div className="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
                          <div>
                            <p className="font-semibold">Guest {i}</p>
                            <div className="flex text-sm text-yellow-500">
                              {'★★★★★'}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">
                          Great hotel! Clean rooms, friendly staff, and
                          excellent location.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Card */}
          <div>
            <Card className="sticky top-4">
              <div className="p-6">
                <div className="mb-6">
                  <p className="mb-1 text-gray-600">Price per night</p>
                  <p className="text-4xl font-bold text-blue-600">
                    ${(hotel as any).pricePerNight || (hotel as any).price || 0}
                  </p>
                </div>

                <div className="mb-6 space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Guests
                    </label>
                    <input
                      type="number"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      min="1"
                      max="10"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                {checkIn && checkOut && (
                  <div className="mb-6 rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 flex justify-between">
                      <span>
                        $
                        {(hotel as any).pricePerNight ||
                          (hotel as any).price ||
                          0}{' '}
                        x {calculateNights()} nights
                      </span>
                      <span>${calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-300 pt-2 text-lg font-bold">
                      <span>Total</span>
                      <span>${calculateTotal()}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleBookNow}
                  disabled={!checkIn || !checkOut || calculateNights() === 0}
                  className="w-full"
                >
                  Book Now
                </Button>

                <p className="mt-4 text-center text-xs text-gray-500">
                  Free cancellation within 24 hours
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
