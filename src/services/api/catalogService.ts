import { Flight, Hotel, TourPackage } from '@/types';
import { AxiosResponse } from 'axios';
import { BaseService } from './baseService';

interface SearchParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface HotelSearchParams extends SearchParams {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  amenities?: string[];
}

interface FlightSearchParams extends SearchParams {
  from?: string;
  to?: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
  class?: 'economy' | 'business' | 'first';
  stops?: 'any' | 'nonstop' | 'one-stop';
  minPrice?: number;
  maxPrice?: number;
}

interface TourSearchParams extends SearchParams {
  destination?: string;
  duration?: string;
  startDate?: string;
  travelers?: number;
  minPrice?: number;
  maxPrice?: number;
  category?: string[];
}

class CatalogService {
  // Hotels
  async searchHotels(params: HotelSearchParams): Promise<
    AxiosResponse<{
      items: Hotel[];
      total: number;
      page: number;
      pageSize: number;
    }>
  > {
    const hotelService = new BaseService<Hotel>('/api/v1/catalog/hotels');
    return hotelService.get<any>('/search', { params });
  }

  async getHotelById(id: string): Promise<AxiosResponse<Hotel>> {
    const hotelService = new BaseService<Hotel>('/api/v1/catalog/hotels');
    return hotelService.getById(id);
  }

  async getHotelAvailability(
    hotelId: string,
    checkIn: string,
    checkOut: string
  ): Promise<AxiosResponse<any>> {
    const hotelService = new BaseService<Hotel>('/api/v1/catalog/hotels');
    return hotelService.get(`/${hotelId}/availability`, {
      params: { checkIn, checkOut },
    });
  }

  async getHotelReviews(
    hotelId: string,
    params?: SearchParams
  ): Promise<AxiosResponse<any>> {
    const hotelService = new BaseService<Hotel>('/api/v1/catalog/hotels');
    return hotelService.get(`/${hotelId}/reviews`, { params });
  }

  // Flights
  async searchFlights(params: FlightSearchParams): Promise<
    AxiosResponse<{
      items: Flight[];
      total: number;
      page: number;
      pageSize: number;
    }>
  > {
    const flightService = new BaseService<Flight>('/api/v1/catalog/flights');
    return flightService.get<any>('/search', { params });
  }

  async getFlightById(id: string): Promise<AxiosResponse<Flight>> {
    const flightService = new BaseService<Flight>('/api/v1/catalog/flights');
    return flightService.getById(id);
  }

  async getFlightSeats(flightId: string): Promise<AxiosResponse<any>> {
    const flightService = new BaseService<Flight>('/api/v1/catalog/flights');
    return flightService.get(`/${flightId}/seats`);
  }

  // Tours
  async searchTours(params: TourSearchParams): Promise<
    AxiosResponse<{
      items: TourPackage[];
      total: number;
      page: number;
      pageSize: number;
    }>
  > {
    const tourService = new BaseService<TourPackage>('/api/v1/catalog/tours');
    return tourService.get<any>('/search', { params });
  }

  async getTourById(id: string): Promise<AxiosResponse<TourPackage>> {
    const tourService = new BaseService<TourPackage>('/api/v1/catalog/tours');
    return tourService.getById(id);
  }

  async getTourItinerary(tourId: string): Promise<AxiosResponse<any>> {
    const tourService = new BaseService<TourPackage>('/api/v1/catalog/tours');
    return tourService.get(`/${tourId}/itinerary`);
  }

  async getTourAvailability(
    tourId: string,
    date: string
  ): Promise<AxiosResponse<any>> {
    const tourService = new BaseService<TourPackage>('/api/v1/catalog/tours');
    return tourService.get(`/${tourId}/availability`, {
      params: { date },
    });
  }

  async getTourReviews(
    tourId: string,
    params?: SearchParams
  ): Promise<AxiosResponse<any>> {
    const tourService = new BaseService<TourPackage>('/api/v1/catalog/tours');
    return tourService.get(`/${tourId}/reviews`, { params });
  }

  // Featured & Popular
  async getFeaturedHotels(): Promise<AxiosResponse<Hotel[]>> {
    const hotelService = new BaseService<Hotel>('/api/v1/catalog/hotels');
    return hotelService.get<Hotel[]>('/featured');
  }

  async getFeaturedTours(): Promise<AxiosResponse<TourPackage[]>> {
    const tourService = new BaseService<TourPackage>('/api/v1/catalog/tours');
    return tourService.get<TourPackage[]>('/featured');
  }

  async getPopularDestinations(): Promise<AxiosResponse<any[]>> {
    const baseService = new BaseService('/api/v1/catalog');
    return baseService.get<any[]>('/destinations/popular');
  }

  // Categories
  async getTourCategories(): Promise<AxiosResponse<string[]>> {
    const tourService = new BaseService<TourPackage>('/api/v1/catalog/tours');
    return tourService.get<string[]>('/categories');
  }

  async getHotelAmenities(): Promise<AxiosResponse<string[]>> {
    const hotelService = new BaseService<Hotel>('/api/v1/catalog/hotels');
    return hotelService.get<string[]>('/amenities');
  }
}

export const catalogService = new CatalogService();
