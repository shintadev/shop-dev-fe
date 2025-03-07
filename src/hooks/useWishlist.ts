import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { WishlistItem } from '@/models/product';
import { apiClient } from '@/lib/api/client';

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const [localWishlist, setLocalWishlist] = useLocalStorage<string[]>('wishlist', []);

  const isAuthenticated = status === 'authenticated';

  // Fetch wishlist data for authenticated users
  const {
    data: wishlistData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { items: WishlistItem[]; itemCount: number } }>(
        '/wishlist'
      );
      return response.data.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add to wishlist
  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (isAuthenticated) {
        const response = await apiClient.post<{ data: { items: WishlistItem[] } }>(
          '/wishlist/add',
          { productId }
        );
        return response.data.data;
      } else {
        // For guest users, handle wishlist locally
        if (!localWishlist.includes(productId)) {
          const updatedWishlist = [...localWishlist, productId];
          setLocalWishlist(updatedWishlist);
        }
        return { items: [] };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  // Remove from wishlist
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (isAuthenticated) {
        const response = await apiClient.delete<{ data: { items: WishlistItem[] } }>(
          `/wishlist/remove?productId=${productId}`
        );
        return response.data.data;
      } else {
        // For guest users, handle wishlist locally
        const updatedWishlist = localWishlist.filter((id) => id !== productId);
        setLocalWishlist(updatedWishlist);
        return { items: [] };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  // Clear wishlist
  const clearWishlistMutation = useMutation({
    mutationFn: async () => {
      if (isAuthenticated) {
        const response = await apiClient.delete<{ data: { items: WishlistItem[] } }>(
          '/wishlist/clear'
        );
        return response.data.data;
      } else {
        // For guest users, handle wishlist locally
        setLocalWishlist([]);
        return { items: [] };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    if (isAuthenticated) {
      return wishlistData?.items.some((item) => item.productId === productId) || false;
    } else {
      return localWishlist.includes(productId);
    }
  };

  // Get wishlist items and count
  const wishlistItems = isAuthenticated ? wishlistData?.items || [] : [];
  const wishlistCount = isAuthenticated ? wishlistData?.itemCount || 0 : localWishlist.length;

  return {
    wishlistItems,
    wishlistCount,
    isLoading,
    error,
    isInWishlist,
    addToWishlist: (productId: string) => addToWishlistMutation.mutateAsync(productId),
    removeFromWishlist: (productId: string) => removeFromWishlistMutation.mutateAsync(productId),
    clearWishlist: () => clearWishlistMutation.mutateAsync(),
  };
};
