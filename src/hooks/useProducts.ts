import { useQuery } from '@tanstack/react-query';
import { Product } from '@/models/product';
import { apiClient } from '@/lib/api/client';

// Fetch featured products
export const useFeaturedProducts = (limit: number = 6) => {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { data: Product[] } }>('/products', {
        params: { featured: true, limit },
      });
      return response.data.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Disable this query during SSR to prevent server errors
    enabled: typeof window !== 'undefined',
  });
};

// Fetch newest products
export const useNewestProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: ['products', 'newest', limit],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { data: Product[] } }>('/products', {
        params: { sort: 'createdAt', direction: 'desc', limit },
      });
      return response.data.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch products by category
export const useProductsByCategory = (categoryId: string, page: number = 1, limit: number = 12) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId, page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{
        data: { data: Product[]; totalElements: number; totalPages: number };
      }>('/products/categories/' + categoryId, {
        params: { page, size: limit },
      });
      return {
        products: response.data.data.data,
        totalItems: response.data.data.totalElements,
        totalPages: response.data.data.totalPages,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!categoryId,
  });
};

// Fetch product details
export const useProductDetails = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { data: Product } }>(`/products/${slug}`);
      return response.data.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!slug,
  });
};

// Fetch related products
export const useRelatedProducts = (productId: string, limit: number = 4) => {
  return useQuery({
    queryKey: ['products', 'related', productId, limit],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { data: Product[] } }>(
        `/products/${productId}/related`,
        {
          params: { limit },
        }
      );
      return response.data.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!productId,
  });
};

// Search products
export const useSearchProducts = (query: string, page: number = 1, limit: number = 12) => {
  return useQuery({
    queryKey: ['products', 'search', query, page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{
        data: { data: Product[]; totalElements: number; totalPages: number };
      }>('/products/search', {
        params: { keyword: query, page, size: limit },
      });
      return {
        products: response.data.data.data,
        totalItems: response.data.data.totalElements,
        totalPages: response.data.data.totalPages,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!query,
  });
};


