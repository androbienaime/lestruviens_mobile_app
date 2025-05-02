import apiClient from '../client';
import { ApiResponse, CategoriesQueryParams, PaginatedResponse, ProductsQueryParams } from '@/src/@types/api';
import { Category, Product, Review } from '@/src/@types/models';

export const productsService = {
  async getCategories(params: CategoriesQueryParams = {}): Promise<PaginatedResponse<Category>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Category>>>('/categories', { params });
    return response.data;
  },

  async getCategoryById(id: string): Promise<Category> {
    const response = await apiClient.get<ApiResponse<Category>>(`/category/${id}`);
    return response.data;
  },

  async searchCategories(query: string, params: CategoriesQueryParams = {}): Promise<PaginatedResponse<Category>> {
    const searchParams = { ...params, search: query };
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>('/category/search', { params: searchParams });
    return response.data;
  },

  async getFeaturedCategories(): Promise<Category[]> {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories/featured');
    return response.data;
  },
};