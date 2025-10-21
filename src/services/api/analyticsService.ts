import { AxiosResponse } from 'axios';
import { BaseService } from './baseService';

interface AnalyticsEvent {
  eventName: string;
  eventData?: Record<string, any>;
  timestamp?: number;
}

interface DashboardMetrics {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  conversionRate: number;
  periodComparison: {
    bookings: number;
    revenue: number;
    users: number;
  };
}

interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

interface PopularItem {
  id: string;
  name: string;
  count: number;
  revenue: number;
}

class AnalyticsService extends BaseService {
  constructor() {
    super('/analytics');
  }

  /**
   * Track page view
   */
  async trackPageView(data: {
    page: string;
    title: string;
    referrer?: string;
  }): Promise<void> {
    try {
      await this.post('/track/pageview', data);
    } catch (error) {
      // Silently fail for analytics
      console.warn('Failed to track page view:', error);
    }
  }

  /**
   * Track custom event
   */
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      await this.post('/track/event', {
        ...event,
        timestamp: event.timestamp || Date.now(),
      });
    } catch (error) {
      // Silently fail for analytics
      console.warn('Failed to track event:', error);
    }
  }

  /**
   * Track search
   */
  async trackSearch(data: {
    query: string;
    category: 'hotels' | 'flights' | 'tours';
    filters?: Record<string, any>;
    resultsCount: number;
  }): Promise<void> {
    try {
      await this.post('/track/search', data);
    } catch (error) {
      console.warn('Failed to track search:', error);
    }
  }

  /**
   * Track booking conversion
   */
  async trackConversion(data: {
    bookingId: string;
    itemType: 'hotel' | 'flight' | 'tour';
    itemId: string;
    amount: number;
    currency: string;
  }): Promise<void> {
    try {
      await this.post('/track/conversion', data);
    } catch (error) {
      console.warn('Failed to track conversion:', error);
    }
  }

  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics(params: {
    startDate: string;
    endDate: string;
    tenantId?: string;
  }): Promise<AxiosResponse<DashboardMetrics>> {
    return this.get<DashboardMetrics>('/dashboard', { params });
  }

  /**
   * Get revenue chart data
   */
  async getRevenueData(params: {
    startDate: string;
    endDate: string;
    groupBy: 'day' | 'week' | 'month';
    tenantId?: string;
  }): Promise<AxiosResponse<RevenueData[]>> {
    return this.get<RevenueData[]>('/revenue', { params });
  }

  /**
   * Get booking trends
   */
  async getBookingTrends(params: {
    startDate: string;
    endDate: string;
    groupBy: 'day' | 'week' | 'month';
  }): Promise<AxiosResponse<any[]>> {
    return this.get<any[]>('/bookings/trends', { params });
  }

  /**
   * Get popular hotels
   */
  async getPopularHotels(params: {
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<AxiosResponse<PopularItem[]>> {
    return this.get<PopularItem[]>('/popular/hotels', { params });
  }

  /**
   * Get popular tours
   */
  async getPopularTours(params: {
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<AxiosResponse<PopularItem[]>> {
    return this.get<PopularItem[]>('/popular/tours', { params });
  }

  /**
   * Get popular destinations
   */
  async getPopularDestinations(params: {
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<AxiosResponse<any[]>> {
    return this.get<any[]>('/popular/destinations', { params });
  }

  /**
   * Get user behavior analytics
   */
  async getUserBehavior(params: {
    startDate: string;
    endDate: string;
  }): Promise<
    AxiosResponse<{
      averageSessionDuration: number;
      bounceRate: number;
      pagesPerSession: number;
      topPages: Array<{ page: string; views: number }>;
    }>
  > {
    return this.get('/user-behavior', { params });
  }

  /**
   * Get conversion funnel
   */
  async getConversionFunnel(params: {
    startDate: string;
    endDate: string;
    type?: 'hotel' | 'flight' | 'tour';
  }): Promise<
    AxiosResponse<{
      stages: Array<{
        name: string;
        count: number;
        percentage: number;
      }>;
    }>
  > {
    return this.get('/funnel', { params });
  }

  /**
   * Export analytics report
   */
  async exportReport(params: {
    reportType: 'revenue' | 'bookings' | 'users' | 'comprehensive';
    startDate: string;
    endDate: string;
    format: 'pdf' | 'excel' | 'csv';
  }): Promise<AxiosResponse<Blob>> {
    return this.get('/export', {
      params,
      responseType: 'blob',
    });
  }

  /**
   * Get real-time metrics
   */
  async getRealTimeMetrics(): Promise<
    AxiosResponse<{
      activeUsers: number;
      ongoingBookings: number;
      recentActivities: any[];
    }>
  > {
    return this.get('/realtime');
  }
}

export const analyticsService = new AnalyticsService();
