import { apiClient } from './apiClient';

export interface SearchHotelsParams {
  city?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  starRating?: number;
  amenities?: string[];
  page?: number;
  pageSize?: number;
}

export interface HotelDto {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  location: string;
  address: string;
  city: string;
  country: string;
  starRating: number;
  pricePerNight: number;
  currency: string;
  totalRooms: number;
  availableRooms: number;
  status: string;
  amenities: string[];
  images: string[];
  latitude?: number;
  longitude?: number;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
}

export interface PagedHotelsResponse {
  hotels: HotelDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const hotelService = {
  search: async (params: SearchHotelsParams) => {
    const queryParams = new URLSearchParams();
    if (params.city) queryParams.append('city', params.city);
    if (params.country) queryParams.append('country', params.country);
    if (params.minPrice)
      queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice)
      queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.starRating)
      queryParams.append('starRating', params.starRating.toString());
    queryParams.append('page', (params.page || 1).toString());
    queryParams.append('pageSize', (params.pageSize || 10).toString());

    return apiClient.get<PagedHotelsResponse>(
      `/catalog/v1/Hotels/search?${queryParams.toString()}`
    );
  },

  getById: async (id: string) => {
    return apiClient.get<HotelDto>(`/catalog/v1/Hotels/${id}`);
  },

  create: async (
    hotel: Omit<
      HotelDto,
      'id' | 'tenantId' | 'createdAt' | 'availableRooms' | 'status'
    >
  ) => {
    return apiClient.post<HotelDto>('/catalog/v1/Hotels', hotel);
  },

  update: async (id: string, hotel: Partial<HotelDto>) => {
    return apiClient.put<HotelDto>(`/catalog/v1/Hotels/${id}`, hotel);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/catalog/v1/Hotels/${id}`);
  },
};
