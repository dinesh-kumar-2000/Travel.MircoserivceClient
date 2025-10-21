import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { useNotifications } from '../../hooks/useNotifications';

interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  activities: Activity[];
}

interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
  duration?: string;
  included?: boolean;
  notes?: string;
}

interface BookingDetails {
  id: string;
  type: 'tour' | 'hotel' | 'flight';
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  participants: number;
  totalAmount: number;
}

interface TravelDocument {
  id: string;
  name: string;
  type: 'ticket' | 'voucher' | 'confirmation' | 'visa' | 'other';
  url: string;
}

export const ItineraryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [documents, setDocuments] = useState<TravelDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchItinerary();
    }
  }, [id]);

  const fetchItinerary = async () => {
    setIsLoading(true);
    try {
      // TODO: API call
      setBooking({
        id: 'BK001',
        type: 'tour',
        name: 'European Adventure - 7 Days',
        destination: 'Paris, Rome, Barcelona',
        startDate: '2025-03-01',
        endDate: '2025-03-07',
        participants: 2,
        totalAmount: 3500,
      });

      setItinerary([
        {
          day: 1,
          date: '2025-03-01',
          title: 'Arrival in Paris',
          activities: [
            {
              time: '10:00 AM',
              title: 'Airport Pickup',
              description: 'Meet your guide at Charles de Gaulle Airport',
              location: 'CDG Airport',
              duration: '30 mins',
              included: true,
            },
            {
              time: '12:00 PM',
              title: 'Hotel Check-in',
              description: 'Check in at Hotel Le Marais',
              location: 'Hotel Le Marais, 4th Arrondissement',
              included: true,
            },
            {
              time: '2:00 PM',
              title: 'Lunch at Local Bistro',
              description: 'Enjoy authentic French cuisine',
              location: 'Bistro Paul, Le Marais',
              duration: '1.5 hours',
              included: true,
            },
            {
              time: '4:00 PM',
              title: 'Walking Tour of Le Marais',
              description: 'Explore the historic Jewish quarter and trendy boutiques',
              location: 'Le Marais District',
              duration: '2 hours',
              included: true,
            },
            {
              time: '7:00 PM',
              title: 'Welcome Dinner',
              description: 'Meet your fellow travelers at a traditional French restaurant',
              location: 'Restaurant Chez Janou',
              duration: '2 hours',
              included: true,
            },
          ],
        },
        {
          day: 2,
          date: '2025-03-02',
          title: 'Explore Paris',
          activities: [
            {
              time: '8:00 AM',
              title: 'Breakfast at Hotel',
              description: 'Continental breakfast included',
              included: true,
            },
            {
              time: '9:30 AM',
              title: 'Eiffel Tower Visit',
              description: 'Skip-the-line access to the second floor',
              location: 'Eiffel Tower',
              duration: '2 hours',
              included: true,
            },
            {
              time: '12:00 PM',
              title: 'Seine River Cruise',
              description: 'Scenic lunch cruise on the Seine',
              location: 'Port de la Bourdonnais',
              duration: '1.5 hours',
              included: true,
            },
            {
              time: '3:00 PM',
              title: 'Louvre Museum',
              description: 'Guided tour of world-famous art collections',
              location: 'Louvre Museum',
              duration: '3 hours',
              included: true,
              notes: 'Dress code: no tank tops, comfortable shoes recommended',
            },
            {
              time: '7:00 PM',
              title: 'Free Evening',
              description: 'Explore Montmartre or Champs-Élysées at your leisure',
              included: false,
            },
          ],
        },
        {
          day: 3,
          date: '2025-03-03',
          title: 'Paris to Rome',
          activities: [
            {
              time: '7:00 AM',
              title: 'Hotel Checkout',
              description: 'Prepare for departure to Rome',
              included: true,
            },
            {
              time: '10:00 AM',
              title: 'Flight to Rome',
              description: 'Direct flight from CDG to FCO',
              location: 'Charles de Gaulle Airport',
              duration: '2 hours',
              included: true,
            },
            {
              time: '2:00 PM',
              title: 'Hotel Check-in Rome',
              description: 'Arrive at Hotel Colosseo',
              location: 'Hotel Colosseo, Monti District',
              included: true,
            },
            {
              time: '4:00 PM',
              title: 'Colosseum & Roman Forum',
              description: 'Guided tour of ancient Roman landmarks',
              location: 'Colosseum',
              duration: '3 hours',
              included: true,
            },
            {
              time: '8:00 PM',
              title: 'Dinner in Trastevere',
              description: 'Traditional Roman dinner in charming neighborhood',
              location: 'Trastevere District',
              duration: '2 hours',
              included: true,
            },
          ],
        },
      ]);

      setDocuments([
        {
          id: '1',
          name: 'Flight Tickets - Paris',
          type: 'ticket',
          url: '/documents/flight-tickets-paris.pdf',
        },
        {
          id: '2',
          name: 'Hotel Voucher - Le Marais',
          type: 'voucher',
          url: '/documents/hotel-voucher-paris.pdf',
        },
        {
          id: '3',
          name: 'Tour Confirmation',
          type: 'confirmation',
          url: '/documents/tour-confirmation.pdf',
        },
        {
          id: '4',
          name: 'Travel Insurance Policy',
          type: 'other',
          url: '/documents/insurance-policy.pdf',
        },
      ]);
    } catch (error) {
      showError('Failed to fetch itinerary');
      navigate('/user/bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    // TODO: Generate and download PDF
    showSuccess('Downloading itinerary PDF...');
  };

  const handleShareItinerary = () => {
    // TODO: Share functionality
    if (navigator.share) {
      navigator.share({
        title: `${booking?.name} Itinerary`,
        text: 'Check out my travel itinerary!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6">
        <Card>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Booking not found
          </p>
        </Card>
      </div>
    );
  }

  const tabs = [
    {
      id: 'itinerary',
      label: 'Day-by-Day Itinerary',
      content: (
        <div className="space-y-6">
          {itinerary.map((day) => (
            <Card key={day.day}>
              <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Day {day.day}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge variant="info">{day.title}</Badge>
                </div>
              </div>

              <div className="space-y-4">
                {day.activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex-shrink-0 w-20 text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {activity.time}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold">{activity.title}</h4>
                        {activity.included && (
                          <Badge variant="success" className="ml-2">
                            Included
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {activity.description}
                      </p>
                      {activity.location && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          📍 {activity.location}
                        </p>
                      )}
                      {activity.duration && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          ⏱️ {activity.duration}
                        </p>
                      )}
                      {activity.notes && (
                        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
                          💡 {activity.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Booking Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Booking ID</p>
                <p className="font-semibold">{booking.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                <p className="font-semibold capitalize">{booking.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Destination</p>
                <p className="font-semibold">{booking.destination}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Participants</p>
                <p className="font-semibold">{booking.participants} travelers</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
                <p className="font-semibold">
                  {new Date(booking.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">End Date</p>
                <p className="font-semibold">
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">What's Included</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                Accommodation (6 nights)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                Daily breakfast
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                Airport transfers
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                Guided tours
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                Entry tickets to attractions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                Professional tour guide
              </li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Important Notes</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Please arrive 15 minutes before scheduled activities</li>
              <li>• Wear comfortable walking shoes</li>
              <li>• Bring a valid ID/passport at all times</li>
              <li>• Weather-appropriate clothing recommended</li>
              <li>• Emergency contact: +33 1 234 5678</li>
            </ul>
          </Card>
        </div>
      ),
    },
    {
      id: 'documents',
      label: 'Travel Documents',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Download and save your important travel documents
          </p>
          {documents.map((doc) => (
            <Card key={doc.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded">
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
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">{doc.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {doc.type}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // TODO: Download document
                    showSuccess(`Downloading ${doc.name}...`);
                  }}
                >
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/user/bookings')}
          >
            ← Back to Bookings
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleShareItinerary}>
            🔗 Share
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownloadPDF}>
            📥 Download PDF
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{booking.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your complete travel itinerary and important information
        </p>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
};

