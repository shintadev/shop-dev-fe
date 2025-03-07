import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CartItem } from '@/models/product';
import { apiClient } from '@/lib/api/client';

interface AddToCartPayload {
  productId: string;
  quantity: number;
}

interface UpdateCartItemPayload {
  productId: string;
  quantity: number;
}

export const useCart = () => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const [localCart, setLocalCart] = useLocalStorage<CartItem[]>('cart', []);

  const isAuthenticated = status === 'authenticated';

  // Fetch cart data for authenticated users
  const {
    data: cartData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { items: CartItem[]; totalPrice: number } }>(
        '/cart'
      );
      return response.data.data;
    },
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Add item to cart
  const addToCartMutation = useMutation({
    mutationFn: async (payload: AddToCartPayload) => {
      if (isAuthenticated) {
        const response = await apiClient.post<{ data: { items: CartItem[] } }>(
          '/cart/add',
          payload
        );
        return response.data.data;
      } else {
        // For guest users, handle cart locally
        const existingItemIndex = localCart.findIndex(
          (item) => item.productId === payload.productId
        );

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          const updatedCart = [...localCart];
          updatedCart[existingItemIndex].quantity += payload.quantity;
          setLocalCart(updatedCart);
          return { items: updatedCart };
        } else {
          // Fetch product details to add to cart
          const productResponse = await apiClient.get(`/products/${payload.productId}`);
          const product = productResponse.data.data;

          const newItem: CartItem = {
            id: Date.now().toString(), // Temporary ID
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            productImages: product.images,
            price: product.price,
            discountPrice: product.discountPrice,
            quantity: payload.quantity,
            subTotal: product.discountPrice
              ? product.discountPrice * payload.quantity
              : product.price * payload.quantity,
            updatedAt: new Date().toISOString(),
          };

          const updatedCart = [...localCart, newItem];
          setLocalCart(updatedCart);
          return { items: updatedCart };
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Update cart item
  const updateCartItemMutation = useMutation({
    mutationFn: async (payload: UpdateCartItemPayload) => {
      if (isAuthenticated) {
        const response = await apiClient.put<{ data: { items: CartItem[] } }>(
          '/cart/update',
          payload
        );
        return response.data.data;
      } else {
        // For guest users, handle cart locally
        const updatedCart = localCart.map((item) => {
          if (item.productId === payload.productId) {
            const newQuantity = payload.quantity;
            return {
              ...item,
              quantity: newQuantity,
              subTotal: item.discountPrice
                ? item.discountPrice * newQuantity
                : item.price * newQuantity,
            };
          }
          return item;
        });

        setLocalCart(updatedCart);
        return { items: updatedCart };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Remove item from cart
  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (isAuthenticated) {
        const response = await apiClient.delete<{ data: { items: CartItem[] } }>(
          `/cart/remove?productId=${productId}`
        );
        return response.data.data;
      } else {
        // For guest users, handle cart locally
        const updatedCart = localCart.filter((item) => item.productId !== productId);
        setLocalCart(updatedCart);
        return { items: updatedCart };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Clear cart
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (isAuthenticated) {
        const response = await apiClient.delete<{ data: { items: CartItem[] } }>('/cart/clear');
        return response.data.data;
      } else {
        // For guest users, handle cart locally
        setLocalCart([]);
        return { items: [] };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Get cart items and count
  const cartItems = isAuthenticated ? cartData?.items || [] : localCart;
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.subTotal, 0);

  return {
    cartItems,
    cartItemsCount,
    cartTotal,
    isLoading,
    error,
    addToCart: (payload: AddToCartPayload) => addToCartMutation.mutateAsync(payload),
    updateCartItem: (payload: UpdateCartItemPayload) => updateCartItemMutation.mutateAsync(payload),
    removeFromCart: (productId: string) => removeFromCartMutation.mutateAsync(productId),
    clearCart: () => clearCartMutation.mutateAsync(),
  };
};
