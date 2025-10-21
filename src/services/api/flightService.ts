import { apiClient } from './apiClient';

export interface SearchFlightsParams {
  departureCity?: string;
  arrivalCity?: string;
  departureDate?: string;
  minPrice?: number;
  maxPrice?: number;
  flightClass?: string;
  airline?: string;
  page?: number;
  pageSize?: number;
}

export interface FlightDto {
  id: string;
  tenantId: string;
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureCity: string;
  arrivalCity: string;
  departureCountry: string;
  arrivalCountry: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  currency: string;
  totalSeats: number;
  availableSeats: number;
  flightClass: string;
  status: string;
  aircraftType?: string;
  baggageAllowanceKg?: number;
  hasMeal: boolean;
  isRefundable: boolean;
  createdAt: string;
}

export interface PagedFlightsResponse {
  flights: FlightDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const flightService = {
  search: async (params: SearchFlightsParams) => {
    const queryParams = new URLSearchParams();
    if (params.departureCity)
      queryParams.append('departureCity', params.departureCity);
    if (params.arrivalCity)
      queryParams.append('arrivalCity', params.arrivalCity);
    if (params.departureDate)
      queryParams.append('departureDate', params.departureDate);
    if (params.minPrice)
      queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice)
      queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.flightClass)
      queryParams.append('flightClass', params.flightClass);
    if (params.airline) queryParams.append('airline', params.airline);
    queryParams.append('page', (params.page || 1).toString());
    queryParams.append('pageSize', (params.pageSize || 10).toString());

    return apiClient.get<PagedFlightsResponse>(
      `/catalog/v1/Flights/search?${queryParams.toString()}`
    );
  },

  getById: async (id: string) => {
    return apiClient.get<FlightDto>(`/catalog/v1/Flights/${id}`);
  },

  create: async (
    flight: Omit<
      FlightDto,
      'id' | 'tenantId' | 'createdAt' | 'availableSeats' | 'status'
    >
  ) => {
    return apiClient.post<FlightDto>('/catalog/v1/Flights', flight);
  },

  update: async (id: string, flight: Partial<FlightDto>) => {
    return apiClient.put<FlightDto>(`/catalog/v1/Flights/${id}`, flight);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/catalog/v1/Flights/${id}`);
  },
};
