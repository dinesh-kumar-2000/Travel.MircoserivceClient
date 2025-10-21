import { apiClient } from './apiClient';

export interface SearchToursParams {
  destination?: string;
  minDuration?: number;
  maxDuration?: number;
  minPrice?: number;
  maxPrice?: number;
  difficulty?: string;
  startDate?: string;
  page?: number;
  pageSize?: number;
}

export interface TourDto {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  destination: string;
  locations: string[];
  durationDays: number;
  price: number;
  currency: string;
  maxGroupSize: number;
  availableSpots: number;
  status: string;
  startDate: string;
  endDate: string;
  inclusions: string[];
  exclusions: string[];
  images: string[];
  difficulty: string;
  languages: string[];
  minAge: number;
  meetingPoint?: string;
  guideInfo?: string;
  createdAt: string;
}

export interface PagedToursResponse {
  tours: TourDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const tourService = {
  search: async (params: SearchToursParams) => {
    const queryParams = new URLSearchParams();
    if (params.destination)
      queryParams.append('destination', params.destination);
    if (params.minDuration)
      queryParams.append('minDuration', params.minDuration.toString());
    if (params.maxDuration)
      queryParams.append('maxDuration', params.maxDuration.toString());
    if (params.minPrice)
      queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice)
      queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    queryParams.append('page', (params.page || 1).toString());
    queryParams.append('pageSize', (params.pageSize || 10).toString());

    return apiClient.get<PagedToursResponse>(
      `/catalog/v1/Tours/search?${queryParams.toString()}`
    );
  },

  getById: async (id: string) => {
    return apiClient.get<TourDto>(`/catalog/v1/Tours/${id}`);
  },

  create: async (
    tour: Omit<
      TourDto,
      'id' | 'tenantId' | 'createdAt' | 'availableSpots' | 'status'
    >
  ) => {
    return apiClient.post<TourDto>('/catalog/v1/Tours', tour);
  },

  update: async (id: string, tour: Partial<TourDto>) => {
    return apiClient.put<TourDto>(`/catalog/v1/Tours/${id}`, tour);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/catalog/v1/Tours/${id}`);
  },
};
