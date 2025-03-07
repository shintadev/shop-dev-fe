import { useQuery } from '@tanstack/react-query';
import { Category } from '@/models/product';
import { apiClient } from '@/lib/api/client';

// Fetch all categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Category[] }>('/categories');
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch category details
export const useCategoryDetails = (slug: string) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Category }>(`/categories/${slug}`);
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug,
  });
};

// Fetch root categories
export const useRootCategories = () => {
  return useQuery({
    queryKey: ['categories', 'root'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Category[] }>('/categories/root');
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch subcategories
export const useSubcategories = (categoryId: string) => {
  return useQuery({
    queryKey: ['categories', 'subcategories', categoryId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Category[] }>(
        `/categories/${categoryId}/subcategories`
      );
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!categoryId,
  });
};
