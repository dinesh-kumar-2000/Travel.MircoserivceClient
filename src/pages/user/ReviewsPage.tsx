import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { useNotifications } from '../../hooks/useNotifications';

interface Review {
  id: string;
  bookingId: string;
  serviceType: 'hotel' | 'flight' | 'tour';
  serviceName: string;
  rating: number;
  title: string;
  comment: string;
  photos: string[];
  createdAt: string;
  status: 'pending' | 'published' | 'rejected';
}

interface BookingToReview {
  id: string;
  type: 'hotel' | 'flight' | 'tour';
  name: string;
  date: string;
  canReview: boolean;
}

export const ReviewsPage: React.FC = () => {
  const { showSuccess, showError } = useNotifications();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingReviews, setPendingReviews] = useState<BookingToReview[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingToReview | null>(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
    photos: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchPendingReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // TODO: API call
      setReviews([
        {
          id: '1',
          bookingId: 'BK001',
          serviceType: 'hotel',
          serviceName: 'Grand Hotel Paris',
          rating: 5,
          title: 'Excellent Stay!',
          comment: 'Amazing hotel with great service. The room was clean and spacious. Location was perfect for exploring the city.',
          photos: [],
          createdAt: '2025-01-15',
          status: 'published',
        },
        {
          id: '2',
          bookingId: 'BK002',
          serviceType: 'tour',
          serviceName: 'Swiss Alps Adventure Tour',
          rating: 4,
          title: 'Great Experience',
          comment: 'Beautiful scenery and well-organized tour. Guide was knowledgeable and friendly.',
          photos: [],
          createdAt: '2025-01-10',
          status: 'published',
        },
      ]);
    } catch (error) {
      showError('Failed to fetch reviews');
    }
  };

  const fetchPendingReviews = async () => {
    try {
      // TODO: API call
      setPendingReviews([
        {
          id: 'BK003',
          type: 'flight',
          name: 'New York to Los Angeles - American Airlines',
          date: '2025-01-20',
          canReview: true,
        },
        {
          id: 'BK004',
          type: 'hotel',
          name: 'Beach Resort Bali',
          date: '2025-01-18',
          canReview: true,
        },
      ]);
    } catch (error) {
      showError('Failed to fetch pending reviews');
    }
  };

  const handleOpenReviewModal = (booking: BookingToReview) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
    setReviewForm({
      rating: 5,
      title: '',
      comment: '',
      photos: [],
    });
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.title || !reviewForm.comment) {
      showError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: API call to submit review with photos
      const formData = new FormData();
      formData.append('bookingId', selectedBooking!.id);
      formData.append('rating', reviewForm.rating.toString());
      formData.append('title', reviewForm.title);
      formData.append('comment', reviewForm.comment);
      reviewForm.photos.forEach((photo) => {
        formData.append('photos', photo);
      });

      showSuccess('Review submitted successfully! It will be published after moderation.');
      setShowReviewModal(false);
      fetchReviews();
      fetchPendingReviews();
    } catch (error) {
      showError('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (reviewForm.photos.length + files.length > 5) {
        showError('Maximum 5 photos allowed');
        return;
      }
      setReviewForm({
        ...reviewForm,
        photos: [...reviewForm.photos, ...files],
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setReviewForm({
      ...reviewForm,
      photos: reviewForm.photos.filter((_, i) => i !== index),
    });
  };

  const renderStars = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange && onChange(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-colors`}
          >
            <svg
              className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
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
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Reviews & Ratings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your experience and help other travelers
        </p>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingReviews.map((booking) => (
              <Card key={booking.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded mb-2 inline-block capitalize">
                      {booking.type}
                    </span>
                    <h3 className="font-semibold mb-1">{booking.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleOpenReviewModal(booking)}
                  >
                    Write Review
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Your Reviews */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
        {reviews.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600 dark:text-gray-400">
              You haven't written any reviews yet. Complete a booking and share your experience!
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mr-2 capitalize">
                      {review.serviceType}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        review.status === 'published'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : review.status === 'pending'
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-2">{review.serviceName}</h3>
                
                <div className="mb-3">{renderStars(review.rating)}</div>

                <h4 className="font-semibold mb-2">{review.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{review.comment}</p>

                {review.photos.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {review.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Review photo ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Write a Review"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reviewing:</p>
              <p className="font-semibold">{selectedBooking.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(selectedBooking.date).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Your Rating *
              </label>
              {renderStars(reviewForm.rating, true, (rating) =>
                setReviewForm({ ...reviewForm, rating })
              )}
            </div>

            <Input
              label="Review Title *"
              value={reviewForm.title}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, title: e.target.value })
              }
              placeholder="Summarize your experience"
              required
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Your Review *
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                placeholder="Share your experience in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Photos (Optional, max 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                📷 Upload Photos
              </label>
              {reviewForm.photos.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {reviewForm.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSubmitReview}
                disabled={isSubmitting || !reviewForm.title || !reviewForm.comment}
                isLoading={isSubmitting}
              >
                Submit Review
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

