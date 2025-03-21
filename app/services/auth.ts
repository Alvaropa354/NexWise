import { apiService } from './api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/api';
import { supabase } from './supabase';

// Función signIn que utiliza directamente Supabase
export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

// Función signUp que utiliza directamente Supabase
export async function signUp(email: string, password: string, metadata: { fullName: string; company?: string }) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
}

// Función signOut que utiliza directamente Supabase
export async function signOut() {
  return await supabase.auth.signOut();
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', data);
    if (response.data?.token) {
      apiService.setToken(response.data.token);
    }
    return response.data!;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', data);
    if (response.data?.token) {
      apiService.setToken(response.data.token);
    }
    return response.data!;
  },

  async logout(): Promise<void> {
    await apiService.post('/auth/logout');
    apiService.clearToken();
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiService.post<{ token: string }>('/auth/refresh');
    if (response.data?.token) {
      apiService.setToken(response.data.token);
    }
    return response.data!;
  },

  async resetPassword(email: string): Promise<void> {
    await apiService.post('/auth/reset-password', { email });
  },

  async verifyEmail(token: string): Promise<void> {
    await apiService.post('/auth/verify-email', { token });
  },

  async updateProfile(data: {
    fullName?: string;
    company?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<void> {
    await apiService.put('/auth/profile', data);
  },

  async getProfile(): Promise<AuthResponse['user']> {
    const response = await apiService.get<AuthResponse['user']>('/auth/profile');
    return response.data!;
  }
}; 