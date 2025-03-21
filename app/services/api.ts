import { supabase } from './supabase';
import { ApiResponse, PaginatedResponse } from '../types/api';

class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Servicio básico para realizar peticiones a la API
let authToken: string | null = null;

export const apiService = {
  baseUrl: '/api',

  setToken(token: string): void {
    authToken = token;
  },

  clearToken(): void {
    authToken = null;
  },

  getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    return headers;
  },

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<{ data?: T; error?: Error }> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      if (params) {
        Object.keys(params).forEach(key => 
          url.searchParams.append(key, params[key])
        );
      }
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error en la petición GET:', error);
      return { error: error as Error };
    }
  },

  async post<T>(endpoint: string, data?: any): Promise<{ data?: T; error?: Error }> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }
      
      const responseData = await response.json();
      return { data: responseData };
    } catch (error) {
      console.error('Error en la petición POST:', error);
      return { error: error as Error };
    }
  },

  async put<T>(endpoint: string, data?: any): Promise<{ data?: T; error?: Error }> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }
      
      const responseData = await response.json();
      return { data: responseData };
    } catch (error) {
      console.error('Error en la petición PUT:', error);
      return { error: error as Error };
    }
  },

  async delete<T>(endpoint: string): Promise<{ data?: T; error?: Error }> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error en la petición DELETE:', error);
      return { error: error as Error };
    }
  }
};

export class ApiService {
  private static instance: ApiService;
  private baseUrl: string;
  private token: string | null = null;

  private constructor() {
    this.baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://api.nexwise.com/v2';
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public setToken(token: string): void {
    this.token = token;
  }

  public clearToken(): void {
    this.token = null;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error?.code || 'UNKNOWN_ERROR',
        data.error?.message || 'Error desconocido',
        data.error?.details
      );
    }

    return {
      success: true,
      data: data.data
    };
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  public async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse<T>(response);
  }

  public async post<T>(
    endpoint: string,
    data: any
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse<T>(response);
  }

  public async put<T>(
    endpoint: string,
    data: any
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse<T>(response);
  }

  public async delete<T>(
    endpoint: string
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    return this.handleResponse<T>(response);
  }

  public async getPaginated<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<PaginatedResponse<T>> {
    const response = await this.get<{
      data: T[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(endpoint, params);

    return {
      success: true,
      data: response.data?.data,
      pagination: response.data?.pagination
    };
  }
}

export const apiServiceInstance = ApiService.getInstance(); 