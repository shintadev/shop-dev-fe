import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/models/product';
import { apiClient } from '@/lib/api/client';

// Fetch featured products
export const useFeaturedProducts = (limit: number = 6) => {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Product[] }>('/products', {
        params: { featured: true, limit },
      });
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch newest products
export const useNewestProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: ['products', 'newest', limit],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Product[] }>('/products', {
        params: { sort: 'newest', limit },
      });
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch products by category
export const useProductsByCategory = (categoryId: string, page: number = 1, limit: number = 12) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId, page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Product[]; total: number; pages: number }>(
        '/products',
        {
          params: { categoryId, page, limit },
        }
      );
      return {
        products: response.data.data,
        totalItems: response.data.total,
        totalPages: response.data.pages,
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
      const response = await apiClient.get<{ data: Product }>(`/products/${slug}`);
      return response.data.data;
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
      const response = await apiClient.get<{ data: Product[] }>(`/products/${productId}/related`, {
        params: { limit },
      });
      return response.data.data;
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
      const response = await apiClient.get<{ data: Product[]; total: number; pages: number }>(
        '/products/search',
        {
          params: { q: query, page, limit },
        }
      );
      return {
        products: response.data.data,
        totalItems: response.data.total,
        totalPages: response.data.pages,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!query,
  });
};
