import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { catalogService } from '../../services/api/catalogService';
import { Flight, Hotel, TourPackage } from '../../types';

type SearchType = 'hotels' | 'flights' | 'tours';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState<SearchType>(
    (searchParams.get('type') as SearchType) || 'hotels'
  );
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    minPrice: '',
    maxPrice: '',
    rating: '',
  });

  useEffect(() => {
    handleSearch();
  }, [searchType]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      let data;

      if (searchType === 'hotels') {
        const response = await catalogService.searchHotels({});
        data = response.data?.items || [];
      } else if (searchType === 'flights') {
        const response = await catalogService.searchFlights({});
        data = response.data?.items || [];
      } else {
        const response = await catalogService.searchTours({});
        data = response.data?.items || [];
      }

      setResults(data || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const renderHotelCard = (hotel: Hotel) => (
    <Card
      key={hotel.id}
      className="cursor-pointer transition-shadow hover:shadow-lg"
    >
      <div className="flex gap-4 p-4">
        <img
          src={(hotel as any).imageUrl || 'https://via.placeholder.com/200x150'}
          alt={hotel.name}
          className="h-36 w-48 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {hotel.name}
              </h3>
              <p className="text-gray-600">
                {(hotel as any).location || 'Location'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                ${(hotel as any).pricePerNight || (hotel as any).price || 0}
                /night
              </p>
            </div>
          </div>
          <div className="mb-2 flex items-center">
            <div className="mr-2 flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < (hotel.rating || 0) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-gray-600">{hotel.rating || 0}/5</span>
          </div>
          <p className="mb-3 line-clamp-2 text-gray-700">{hotel.description}</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {hotel.amenities?.slice(0, 5).map((amenity, idx) => (
              <span
                key={idx}
                className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
              >
                {amenity}
              </span>
            ))}
          </div>
          <Button
            onClick={() => (window.location.href = `/hotels/${hotel.id}`)}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderFlightCard = (flight: Flight) => (
    <Card
      key={flight.id}
      className="cursor-pointer transition-shadow hover:shadow-lg"
    >
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{flight.airline}</h3>
            <p className="text-sm text-gray-600">
              Flight {flight.flightNumber}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              ${(flight as any).price || 0}
            </p>
            <p className="text-xs text-gray-500">
              {(flight as any).class || 'Economy'}
            </p>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-center">
            <p className="text-2xl font-bold">{flight.departureTime}</p>
            <p className="text-gray-600">
              {(flight as any).origin || flight.departureAirport}
            </p>
          </div>
          <div className="mx-4 flex-1">
            <div className="relative border-t-2 border-gray-300">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-white px-2">
                ✈️
              </div>
            </div>
            <p className="mt-1 text-center text-xs text-gray-500">
              {flight.duration}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{flight.arrivalTime}</p>
            <p className="text-gray-600">
              {(flight as any).destination || flight.arrivalAirport}
            </p>
          </div>
        </div>
        <Button
          onClick={() => (window.location.href = `/flights/${flight.id}`)}
          className="w-full"
        >
          Select Flight
        </Button>
      </div>
    </Card>
  );

  const renderTourCard = (tour: TourPackage) => (
    <Card
      key={tour.id}
      className="cursor-pointer transition-shadow hover:shadow-lg"
    >
      <div className="flex gap-4 p-4">
        <img
          src={
            (tour as any).imageUrl ||
            tour.images?.[0] ||
            'https://via.placeholder.com/200x150'
          }
          alt={tour.name}
          className="h-36 w-48 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {tour.name}
              </h3>
              <p className="text-gray-600">{tour.destination}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">${tour.price}</p>
              <p className="text-xs text-gray-500">per person</p>
            </div>
          </div>
          <p className="mb-3 line-clamp-2 text-gray-700">{tour.description}</p>
          <div className="mb-3 flex gap-4 text-sm text-gray-600">
            <span>📅 {tour.duration} days</span>
            <span>👥 Max {tour.maxGroupSize} people</span>
          </div>
          <Button onClick={() => (window.location.href = `/tours/${tour.id}`)}>
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex gap-4">
            <button
              onClick={() => setSearchType('hotels')}
              className={`rounded-lg px-6 py-2 font-medium ${
                searchType === 'hotels'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏨 Hotels
            </button>
            <button
              onClick={() => setSearchType('flights')}
              className={`rounded-lg px-6 py-2 font-medium ${
                searchType === 'flights'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✈️ Flights
            </button>
            <button
              onClick={() => setSearchType('tours')}
              className={`rounded-lg px-6 py-2 font-medium ${
                searchType === 'tours'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🗺️ Tours
            </button>
          </div>

          {/* Search Filters */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <Input
              placeholder={
                searchType === 'hotels'
                  ? 'Location'
                  : searchType === 'flights'
                    ? 'Origin'
                    : 'Destination'
              }
              value={filters.location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFilterChange('location', e.target.value)
              }
            />
            {searchType === 'hotels' && (
              <>
                <Input
                  type="date"
                  placeholder="Check-in"
                  value={filters.checkIn}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange('checkIn', e.target.value)
                  }
                />
                <Input
                  type="date"
                  placeholder="Check-out"
                  value={filters.checkOut}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange('checkOut', e.target.value)
                  }
                />
              </>
            )}
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFilterChange('minPrice', e.target.value)
              }
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <div className="p-4">
                <h3 className="mb-4 text-lg font-semibold">Filters</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Price Range
                    </label>
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleFilterChange('minPrice', e.target.value)
                      }
                      className="mb-2"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleFilterChange('maxPrice', e.target.value)
                      }
                    />
                  </div>
                  {searchType === 'hotels' && (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Rating
                      </label>
                      <select
                        value={filters.rating}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          handleFilterChange('rating', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                      >
                        <option value="">Any</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="3">3+ Stars</option>
                      </select>
                    </div>
                  )}
                  <Button
                    variant="secondary"
                    onClick={handleSearch}
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Results List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-gray-700">
                    {results.length} {searchType} found
                  </p>
                </div>
                <div className="space-y-4">
                  {results.length > 0 ? (
                    results.map((result) => {
                      if (searchType === 'hotels')
                        return renderHotelCard(result);
                      if (searchType === 'flights')
                        return renderFlightCard(result);
                      return renderTourCard(result);
                    })
                  ) : (
                    <Card>
                      <div className="p-12 text-center text-gray-500">
                        No {searchType} found. Try adjusting your filters.
                      </div>
                    </Card>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
