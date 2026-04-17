import axios from 'axios';
import type { AxiosRequestConfig, AxiosError, AxiosInstance } from 'axios';
import { storage } from '@/utils/storage';
import API_CONFIG from '@/src/api/config';

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: any[] = [];

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // ✅ REQUEST INTERCEPTOR (TOKEN AUTO)
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await storage.getData('auth_token');

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ RESPONSE INTERCEPTOR (AUTO REFRESH)
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest: any = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest?._retry
        ) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.instance(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          this.isRefreshing = true;
          originalRequest._retry = true;

          try {
            const refresh_token = await storage.getData('refresh_token');

            const response = await axios.post(
              `${API_CONFIG.BASE_URL}/account/refresh`,
              { refresh_token }
            );

            const { token } = response.data as any;

            await storage.setData('auth_token', token);

            this.processQueue(null, token);

            originalRequest.headers.Authorization = `Bearer ${token}`;

            return this.instance(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);

            await storage.removeData('auth_token');
            await storage.removeData('refresh_token');

            // 👉 Ici tu peux déclencher logout global
            // ex: event emitter ou navigationRef

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  // ✅ IMPORTANT : retourner response.data
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }
}

const apiClient = new ApiClient();
export default apiClient;