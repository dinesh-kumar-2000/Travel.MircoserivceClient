import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { userService } from '../../services/api/userService';

interface WishlistItem {
  id: string;
  type: 'hotel' | 'flight' | 'tour';
  itemId: string;
  name: string;
  location?: string;
  price: number;
  imageUrl?: string;
  addedAt: string;
}

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await userService.getWishlist();
      setWishlist(data.data || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await userService.removeFromWishlist(id);
      setWishlist(wishlist.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleViewDetails = (item: WishlistItem) => {
    navigate(`/${item.type}s/${item.itemId}`);
  };

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
        <h1 className="mb-6 text-3xl font-bold text-gray-900">My Wishlist</h1>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => (
              <Card key={item.id}>
                <div className="relative">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/400x300'}
                    alt={item.name}
                    className="h-48 w-full rounded-t-lg object-cover"
                  />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-lg hover:bg-red-50"
                  >
                    <span className="text-xl text-red-500">♥</span>
                  </button>
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  {item.location && (
                    <p className="mb-2 text-sm text-gray-600">
                      📍 {item.location}
                    </p>
                  )}
                  <p className="mb-3 text-xl font-bold text-blue-600">
                    ${item.price}
                  </p>
                  <Button
                    onClick={() => handleViewDetails(item)}
                    className="w-full"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="p-12 text-center">
              <div className="mb-4 text-6xl">💙</div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Your wishlist is empty
              </h2>
              <p className="mb-6 text-gray-600">
                Start adding your favorite hotels, flights, and tours!
              </p>
              <Button onClick={() => navigate('/search')}>Explore Now</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
