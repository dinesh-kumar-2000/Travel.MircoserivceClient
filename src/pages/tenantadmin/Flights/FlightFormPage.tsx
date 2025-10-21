import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { useNotifications } from '../../../hooks/useNotifications';
import { flightService } from '../../../services/api/flightService';

interface FlightFormData {
  flightNumber: string;
  airline: string;
  aircraftType: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  economyPrice: number;
  businessPrice: number;
  firstClassPrice: number;
  economySeats: number;
  businessSeats: number;
  firstClassSeats: number;
  baggageAllowance: string;
  meals: boolean;
  wifi: boolean;
  status: 'active' | 'cancelled' | 'delayed';
  layovers: string;
  notes: string;
}

export const FlightFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const isEditMode = !!id && id !== 'new';

  const [formData, setFormData] = useState<FlightFormData>({
    flightNumber: '',
    airline: '',
    aircraftType: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    duration: '',
    economyPrice: 0,
    businessPrice: 0,
    firstClassPrice: 0,
    economySeats: 0,
    businessSeats: 0,
    firstClassSeats: 0,
    baggageAllowance: '23 kg',
    meals: false,
    wifi: false,
    status: 'active',
    layovers: '',
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchFlight();
    }
  }, [id]);

  const fetchFlight = async () => {
    setIsLoading(true);
    try {
      const flight = await flightService.getById(id!);
      setFormData(flight);
    } catch (error) {
      showError('Failed to fetch flight details');
      navigate('/tenantadmin/flights');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isEditMode) {
        await flightService.update(id!, formData);
        showSuccess('Flight updated successfully');
      } else {
        await flightService.create(formData);
        showSuccess('Flight created successfully');
      }
      navigate('/tenantadmin/flights');
    } catch (error) {
      showError(
        isEditMode ? 'Failed to update flight' : 'Failed to create flight'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">
          {isEditMode ? 'Edit Flight' : 'Add New Flight'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditMode
            ? 'Update flight information'
            : 'Create a new flight schedule'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <h3 className="mb-4 text-lg font-semibold">Basic Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Flight Number"
              name="flightNumber"
              value={formData.flightNumber}
              onChange={handleChange}
              placeholder="e.g., AA1234"
              required
            />
            <Input
              label="Airline"
              name="airline"
              value={formData.airline}
              onChange={handleChange}
              placeholder="e.g., American Airlines"
              required
            />
            <Input
              label="Aircraft Type"
              name="aircraftType"
              value={formData.aircraftType}
              onChange={handleChange}
              placeholder="e.g., Boeing 737"
              required
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'delayed', label: 'Delayed' },
              ]}
            />
          </div>
        </Card>

        {/* Route Information */}
        <Card>
          <h3 className="mb-4 text-lg font-semibold">Route Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Origin"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              placeholder="e.g., JFK, New York"
              required
            />
            <Input
              label="Destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g., LAX, Los Angeles"
              required
            />
            <Input
              label="Departure Time"
              name="departureTime"
              type="datetime-local"
              value={formData.departureTime}
              onChange={handleChange}
              required
            />
            <Input
              label="Arrival Time"
              name="arrivalTime"
              type="datetime-local"
              value={formData.arrivalTime}
              onChange={handleChange}
              required
            />
            <Input
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 5h 30m"
              required
            />
            <Input
              label="Layovers (optional)"
              name="layovers"
              value={formData.layovers}
              onChange={handleChange}
              placeholder="e.g., ORD (1h 30m)"
            />
          </div>
        </Card>

        {/* Pricing */}
        <Card>
          <h3 className="mb-4 text-lg font-semibold">Pricing</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              label="Economy Price ($)"
              name="economyPrice"
              type="number"
              value={formData.economyPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
            <Input
              label="Business Price ($)"
              name="businessPrice"
              type="number"
              value={formData.businessPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
            <Input
              label="First Class Price ($)"
              name="firstClassPrice"
              type="number"
              value={formData.firstClassPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
        </Card>

        {/* Seat Availability */}
        <Card>
          <h3 className="mb-4 text-lg font-semibold">Seat Availability</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              label="Economy Seats"
              name="economySeats"
              type="number"
              value={formData.economySeats}
              onChange={handleChange}
              min="0"
              required
            />
            <Input
              label="Business Seats"
              name="businessSeats"
              type="number"
              value={formData.businessSeats}
              onChange={handleChange}
              min="0"
              required
            />
            <Input
              label="First Class Seats"
              name="firstClassSeats"
              type="number"
              value={formData.firstClassSeats}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </Card>

        {/* Amenities */}
        <Card>
          <h3 className="mb-4 text-lg font-semibold">Amenities & Services</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Baggage Allowance"
              name="baggageAllowance"
              value={formData.baggageAllowance}
              onChange={handleChange}
              placeholder="e.g., 23 kg"
            />
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="meals"
                  checked={formData.meals}
                  onChange={handleChange}
                  className="rounded"
                />
                <span>Meals Included</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="wifi"
                  checked={formData.wifi}
                  onChange={handleChange}
                  className="rounded"
                />
                <span>WiFi Available</span>
              </label>
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Additional information about this flight..."
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/tenantadmin/flights')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
            isLoading={isSaving}
          >
            {isEditMode ? 'Update Flight' : 'Create Flight'}
          </Button>
        </div>
      </form>
    </div>
  );
};
