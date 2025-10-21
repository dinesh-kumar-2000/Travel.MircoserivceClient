import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { useNotifications } from '../../hooks/useNotifications';
import { bookingService } from '../../services/api/bookingService';

interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'tour';
  destination: string;
  travelDate: string;
  returnDate?: string;
  passengers: number;
  totalAmount: number;
  status: string;
  canModify: boolean;
  canCancel: boolean;
  cancellationDeadline: string;
  modificationFee: number;
  cancellationFee: number;
}

export const BookingModificationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [modificationData, setModificationData] = useState({
    newTravelDate: '',
    newReturnDate: '',
    newPassengers: 0,
  });
  const [cancellationReason, setCancellationReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getById(id!);
      setBooking(data);
      setModificationData({
        newTravelDate: data.travelDate,
        newReturnDate: data.returnDate || '',
        newPassengers: data.passengers,
      });
    } catch (error) {
      showError('Failed to fetch booking details');
      navigate('/user/bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModify = async () => {
    try {
      await bookingService.modify(id!, modificationData);
      showSuccess('Booking modified successfully');
      setShowModifyModal(false);
      fetchBooking();
    } catch (error) {
      showError('Failed to modify booking');
    }
  };

  const handleCancel = async () => {
    if (!cancellationReason) {
      showError('Please provide a cancellation reason');
      return;
    }

    try {
      await bookingService.cancel(id!, { reason: cancellationReason });
      showSuccess(
        `Booking cancelled successfully. Refund of $${refundAmount.toFixed(2)} will be processed within 5-7 business days.`
      );
      setShowCancelModal(false);
      navigate('/user/bookings');
    } catch (error) {
      showError('Failed to cancel booking');
    }
  };

  const calculateRefund = () => {
    if (!booking) return 0;
    return booking.totalAmount - booking.cancellationFee;
  };

  useEffect(() => {
    if (booking) {
      setRefundAmount(calculateRefund());
    }
  }, [booking]);

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/user/bookings')}
        >
          ← Back to Bookings
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Manage Booking #{booking.id}</h1>

      {/* Booking Details */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
            <p className="font-semibold capitalize">{booking.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Destination</p>
            <p className="font-semibold">{booking.destination}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Travel Date</p>
            <p className="font-semibold">
              {new Date(booking.travelDate).toLocaleDateString()}
            </p>
          </div>
          {booking.returnDate && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Return Date</p>
              <p className="font-semibold">
                {new Date(booking.returnDate).toLocaleDateString()}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Passengers</p>
            <p className="font-semibold">{booking.passengers}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
            <p className="font-semibold">${booking.totalAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
            <p className="font-semibold capitalize">{booking.status}</p>
          </div>
        </div>
      </Card>

      {/* Modification Options */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Modification Options</h2>
        
        <div className="space-y-4">
          {/* Modify Booking */}
          <div className="flex items-start justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Modify Booking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Change travel dates, number of passengers, or other details.
              </p>
              {booking.canModify ? (
                <>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Modification fee: ${booking.modificationFee.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Subject to availability
                  </p>
                </>
              ) : (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Modification not available for this booking
                </p>
              )}
            </div>
            <Button
              variant="primary"
              disabled={!booking.canModify}
              onClick={() => setShowModifyModal(true)}
            >
              Modify Booking
            </Button>
          </div>

          {/* Cancel Booking */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Cancel Booking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Cancel this booking and receive a refund.
              </p>
              {booking.canCancel ? (
                <>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Cancellation fee: ${booking.cancellationFee.toFixed(2)}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Refund amount: ${calculateRefund().toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Must cancel before:{' '}
                    {new Date(booking.cancellationDeadline).toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Cancellation deadline has passed or not available
                </p>
              )}
            </div>
            <Button
              variant="danger"
              disabled={!booking.canCancel}
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      </Card>

      {/* Important Information */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Important Information</h2>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>• Modifications are subject to availability and may incur price differences</li>
          <li>• Refunds will be processed within 5-7 business days</li>
          <li>• Some bookings may have specific terms and conditions</li>
          <li>• Contact support if you need assistance</li>
        </ul>
      </Card>

      {/* Modify Modal */}
      <Modal
        isOpen={showModifyModal}
        onClose={() => setShowModifyModal(false)}
        title="Modify Booking"
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Modification fee: ${booking.modificationFee.toFixed(2)} will be charged.
              Additional charges may apply based on new dates and availability.
            </p>
          </div>

          <Input
            label="New Travel Date"
            type="date"
            value={modificationData.newTravelDate}
            onChange={(e) =>
              setModificationData({
                ...modificationData,
                newTravelDate: e.target.value,
              })
            }
            min={new Date().toISOString().split('T')[0]}
          />

          {booking.returnDate && (
            <Input
              label="New Return Date"
              type="date"
              value={modificationData.newReturnDate}
              onChange={(e) =>
                setModificationData({
                  ...modificationData,
                  newReturnDate: e.target.value,
                })
              }
              min={modificationData.newTravelDate}
            />
          )}

          <Input
            label="Number of Passengers"
            type="number"
            value={modificationData.newPassengers}
            onChange={(e) =>
              setModificationData({
                ...modificationData,
                newPassengers: parseInt(e.target.value),
              })
            }
            min="1"
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowModifyModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleModify}>
              Confirm Modification
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setCancellationReason('');
        }}
        title="Cancel Booking"
      >
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
              Cancellation Summary
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              Original Amount: ${booking.totalAmount.toFixed(2)}
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              Cancellation Fee: ${booking.cancellationFee.toFixed(2)}
            </p>
            <p className="text-sm font-semibold text-red-800 dark:text-red-200 mt-2">
              Refund Amount: ${refundAmount.toFixed(2)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Reason for Cancellation *
            </label>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              placeholder="Please tell us why you're cancelling..."
              required
            />
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            This action cannot be undone. The refund will be processed to your
            original payment method within 5-7 business days.
          </p>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowCancelModal(false);
                setCancellationReason('');
              }}
            >
              Keep Booking
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleCancel}
              disabled={!cancellationReason}
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

