import { AxiosResponse } from 'axios';
import { apiClient } from './apiClient';

/**
 * Base API Service Class
 *
 * Provides common CRUD operations and utility methods for all API services
 * Wraps axios with error handling and response transformation
 */
export class BaseService<T = any> {
  protected client: typeof apiClient;
  protected baseURL: string;

  constructor(baseURL: string) {
    this.client = apiClient;
    this.baseURL = baseURL;
  }

  /**
   * GET request
   */
  public async get<R = T>(
    endpoint: string = '',
    config?: any
  ): Promise<AxiosResponse<R>> {
    try {
      return await this.client.get<R>(`${this.baseURL}${endpoint}`, config);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * POST request
   */
  public async post<R = T>(
    endpoint: string = '',
    data?: any,
    config?: any
  ): Promise<AxiosResponse<R>> {
    try {
      return await this.client.post<R>(
        `${this.baseURL}${endpoint}`,
        data,
        config
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  public async put<R = T>(
    endpoint: string = '',
    data?: any,
    config?: any
  ): Promise<AxiosResponse<R>> {
    try {
      return await this.client.put<R>(
        `${this.baseURL}${endpoint}`,
        data,
        config
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PATCH request
   */
  public async patch<R = T>(
    endpoint: string = '',
    data?: any,
    config?: any
  ): Promise<AxiosResponse<R>> {
    try {
      return await this.client.patch<R>(
        `${this.baseURL}${endpoint}`,
        data,
        config
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  public async delete<R = any>(
    endpoint: string = '',
    config?: any
  ): Promise<AxiosResponse<R>> {
    try {
      return await this.client.delete<R>(`${this.baseURL}${endpoint}`, config);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * GET all items with optional query parameters
   */
  async getAll(params?: Record<string, any>): Promise<AxiosResponse<T[]>> {
    return this.get<T[]>('', { params });
  }

  /**
   * GET single item by ID
   */
  async getById(id: string | number): Promise<AxiosResponse<T>> {
    return this.get<T>(`/${id}`);
  }

  /**
   * CREATE new item
   */
  async create(data: Partial<T>): Promise<AxiosResponse<T>> {
    return this.post<T>('', data);
  }

  /**
   * UPDATE existing item
   */
  async update(
    id: string | number,
    data: Partial<T>
  ): Promise<AxiosResponse<T>> {
    return this.put<T>(`/${id}`, data);
  }

  /**
   * PARTIAL UPDATE existing item
   */
  async partialUpdate(
    id: string | number,
    data: Partial<T>
  ): Promise<AxiosResponse<T>> {
    return this.patch<T>(`/${id}`, data);
  }

  /**
   * DELETE item by ID
   */
  async deleteById(id: string | number): Promise<AxiosResponse<void>> {
    return this.delete<void>(`/${id}`);
  }

  /**
   * Handle API errors and provide meaningful error messages
   */
  protected handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message =
        data?.message || data?.error || `Request failed with status ${status}`;

      const apiError: any = new Error(message);
      apiError.status = status;
      apiError.data = data;

      return apiError;
    } else if (error.request) {
      // Request made but no response received
      return new Error(
        'No response from server. Please check your connection.'
      );
    } else {
      // Error in request configuration
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  /**
   * Build query string from object
   */
  protected buildQueryString(params: Record<string, any>): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => query.append(key, v));
        } else {
          query.append(key, String(value));
        }
      }
    });
    return query.toString();
  }
}

export default BaseService;
