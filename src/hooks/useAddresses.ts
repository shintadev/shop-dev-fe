import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

export interface Address {
  id: string;
  userId: string;
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  ward: string;
  district: string;
  provinceCity: string;
  postalCode: string;
  isDefault: boolean;
  formattedAddress: string;
}

export interface AddressFormData {
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  ward: string;
  district: string;
  provinceCity: string;
  postalCode: string;
  isDefault?: boolean;
}

export const useAddresses = () => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const isAuthenticated = status === 'authenticated';

  // Fetch all addresses
  const {
    data: addresses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Address[] }>('/addresses');
      return response.data.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get default address
  const { data: defaultAddress } = useQuery({
    queryKey: ['addresses', 'default'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Address }>('/addresses/default');
      return response.data.data;
    },
    enabled: isAuthenticated,
  });

  // Create a new address
  const createAddress = useMutation({
    mutationFn: async (addressData: AddressFormData) => {
      const response = await apiClient.post<{ data: Address }>('/addresses', addressData);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Address added successfully');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: () => {
      toast.error('Failed to add address');
    },
  });

  // Update an address
  const updateAddress = useMutation({
    mutationFn: async ({ id, ...addressData }: AddressFormData & { id: string }) => {
      const response = await apiClient.put<{ data: Address }>(`/addresses/${id}`, addressData);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Address updated successfully');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: () => {
      toast.error('Failed to update address');
    },
  });

  // Set an address as default
  const setDefaultAddress = useMutation({
    mutationFn: async (addressId: string) => {
      const response = await apiClient.put<{ data: Address }>(`/addresses/${addressId}/default`);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Default address updated');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: () => {
      toast.error('Failed to update default address');
    },
  });

  // Delete an address
  const deleteAddress = useMutation({
    mutationFn: async (addressId: string) => {
      await apiClient.delete(`/addresses/${addressId}`);
      return addressId;
    },
    onSuccess: () => {
      toast.success('Address deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: () => {
      toast.error('Failed to delete address');
    },
  });

  return {
    addresses,
    defaultAddress,
    isLoading,
    error,
    createAddress: (data: AddressFormData) => createAddress.mutateAsync(data),
    updateAddress: (id: string, data: AddressFormData) =>
      updateAddress.mutateAsync({ id, ...data }),
    setDefaultAddress: (id: string) => setDefaultAddress.mutateAsync(id),
    deleteAddress: (id: string) => deleteAddress.mutateAsync(id),
  };
};
