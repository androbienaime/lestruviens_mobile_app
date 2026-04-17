// services/auth.service.ts
import apiClient from '../client';
import { ApiResponse } from '@/src/@types/api';
import { AccountUser } from '@/utils/multiAccountStorage';

// 🔐 Types spécifiques à l'auth

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  // ✅ CORRECTION : renommé "AccountUser" → "user" (minuscule)
  // "AccountUser" (majuscule) créait un conflit avec le type importé du même nom
  user: AccountUser;
  token: string;
  refresh_token: string;
}

export const authService = {

  async login(payload: LoginPayload): Promise<AuthResponse> {
    // ✅ CORRECTION : apiClient.post<T> retourne déjà response.data de type T
    // Donc on type directement <ApiResponse<AuthResponse>> et on accède à .data
    // pour obtenir AuthResponse — pas de double .data.data
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/account/login',
      payload
    );
    
    const data = response.data; // Type : AuthResponse
    return {
      user: data.account, // 🔥 mapping ici
      token: data.token,
      refresh_token: data.refresh_token,
    };

  },

  async register(payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/account/register',
      payload
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/account/logout');
  },

  async me(): Promise<AccountUser> {
    const response = await apiClient.get<ApiResponse<AccountUser>>('/account/me');
    return response.data;
  },

  async refreshToken(refresh_token: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/account/refresh',
      { refresh_token }
    );
    return response.data;
  },
};