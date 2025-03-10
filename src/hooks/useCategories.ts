import { useQuery } from '@tanstack/react-query';
import { Category } from '@/models/product';
import { apiClient } from '@/lib/api/client';

// Get all categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { data: Category[] } }>('/categories');
      return response.data.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get category details
export const useCategoryDetails = (slug: string) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { data: Category } }>(`/categories/${slug}`);
      return response.data.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug,
  });
};

// Get root categories
export const useRootCategories = () => {
  return useQuery({
    queryKey: ['categories', 'root'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { data: Category[] } }>('/categories/root');
      return response.data.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get subcategories
export const useSubcategories = (categoryId: string) => {
  return useQuery({
    queryKey: ['categories', 'subcategories', categoryId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { data: Category[] } }>(
        `/categories/${categoryId}/subcategories`
      );
      return response.data.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!categoryId,
  });
};

// Search categories
export const useSearchCategories = (keyword: string) => {
  return useQuery({
    queryKey: ['categories', 'search', keyword],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { data: Category[] } }>('/categories/search', {
        params: { keyword },
      });
      return response.data.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!keyword && keyword.length > 2,
  });
};
