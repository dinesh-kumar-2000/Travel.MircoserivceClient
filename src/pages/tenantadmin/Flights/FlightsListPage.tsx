import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Modal } from '../../../components/common/Modal';
import { Pagination } from '../../../components/common/Pagination';
import Table from '../../../components/common/Table';
import { useNotifications } from '../../../hooks/useNotifications';
import { flightService } from '../../../services/api/flightService';

interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  status: 'active' | 'cancelled' | 'delayed' | 'completed';
  class: 'economy' | 'business' | 'first';
}

export const FlightsListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();

  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    id: string | null;
  }>({
    show: false,
    id: null,
  });

  useEffect(() => {
    fetchFlights();
  }, [currentPage, searchTerm]);

  const fetchFlights = async () => {
    setIsLoading(true);
    try {
      const response = await flightService.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm,
      });
      setFlights(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      showError('Failed to fetch flights');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    try {
      await flightService.delete(deleteModal.id);
      showSuccess('Flight deleted successfully');
      setDeleteModal({ show: false, id: null });
      fetchFlights();
    } catch (error) {
      showError('Failed to delete flight');
    }
  };

  const getStatusBadge = (status: Flight['status']) => {
    const variants: Record<
      Flight['status'],
      'success' | 'warning' | 'error' | 'info'
    > = {
      active: 'success',
      delayed: 'warning',
      cancelled: 'error',
      completed: 'info',
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const columns = [
    {
      header: 'Flight Number',
      accessor: 'flightNumber' as keyof Flight,
    },
    {
      header: 'Airline',
      accessor: 'airline' as keyof Flight,
    },
    {
      header: 'Route',
      accessor: 'origin' as keyof Flight,
      cell: (row: Flight) => `${row.origin} → ${row.destination}`,
    },
    {
      header: 'Departure',
      accessor: 'departureTime' as keyof Flight,
      cell: (row: Flight) => new Date(row.departureTime).toLocaleString(),
    },
    {
      header: 'Arrival',
      accessor: 'arrivalTime' as keyof Flight,
      cell: (row: Flight) => new Date(row.arrivalTime).toLocaleString(),
    },
    {
      header: 'Class',
      accessor: 'class' as keyof Flight,
      cell: (row: Flight) => row.class.toUpperCase(),
    },
    {
      header: 'Price',
      accessor: 'price' as keyof Flight,
      cell: (row: Flight) => `$${row.price.toFixed(2)}`,
    },
    {
      header: 'Available Seats',
      accessor: 'availableSeats' as keyof Flight,
    },
    {
      header: 'Status',
      accessor: 'status' as keyof Flight,
      cell: (row: Flight) => getStatusBadge(row.status),
    },
    {
      header: 'Actions',
      accessor: 'id' as keyof Flight,
      cell: (row: Flight) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/tenantadmin/flights/${row.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteModal({ show: true, id: row.id })}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Flight Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage flight schedules, pricing, and availability
        </p>
      </div>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
        <div className="max-w-md flex-1">
          <Input
            type="search"
            placeholder="Search flights by number, airline, or route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/tenantadmin/flights/new')}
        >
          + Add New Flight
        </Button>
      </div>

      <div className="rounded-lg bg-white shadow dark:bg-gray-800">
        <Table
          columns={columns}
          data={flights}
          isLoading={isLoading}
          emptyMessage="No flights found. Add your first flight to get started."
        />
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        title="Delete Flight"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this flight? This action cannot be
            undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setDeleteModal({ show: false, id: null })}
            >
              Cancel
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
