// services/auth.service.ts
import { AccountUser, AuthAccountResponse, LoginPayload } from '@/src/@types/models';
import apiClient from '../client';
import { ApiResponse } from '@/src/@types/api';

export const authService = {

  async login(payload: LoginPayload): Promise<AuthAccountResponse> {
    // ✅ CORRECTION : apiClient.post<T> retourne déjà response.data de type T
    // Donc on type directement <ApiResponse<AuthAccountResponse>> et on accède à .data
    // pour obtenir AuthAccountResponse — pas de double .data.data
    const response = await apiClient.post<ApiResponse<AuthAccountResponse>>(
      '/account/login',
      payload
    );
    
    const data = response.data; // Type : AuthAccountResponse
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
  }): Promise<AuthAccountResponse> {
    const response = await apiClient.post<ApiResponse<AuthAccountResponse>>(
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

  async refreshToken(refresh_token: string): Promise<AuthAccountResponse> {
    const response = await apiClient.post<ApiResponse<AuthAccountResponse>>(
      '/account/refresh',
      { refresh_token }
    );
    return response.data;
  },
};