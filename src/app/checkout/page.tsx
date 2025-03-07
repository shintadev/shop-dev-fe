'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { useAddresses } from '@/hooks/useAddresses';
import { formatCurrency } from '@/lib/utils';
import { apiClient } from '@/lib/api/client';
import { CartItem } from '@/models/product';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

// Checkout form schema
const checkoutSchema = z.object({
  // Personal information (for guest checkout)
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),

  // Shipping information
  addressId: z.string().optional(),
  shippingAddress: z
    .object({
      recipientName: z.string().min(2, 'Recipient name is required'),
      phoneNumber: z.string().min(10, 'Phone number is required'),
      addressLine1: z.string().min(5, 'Address line 1 is required'),
      addressLine2: z.string().optional(),
      ward: z.string().min(2, 'Ward is required'),
      district: z.string().min(2, 'District is required'),
      provinceCity: z.string().min(2, 'Province/City is required'),
      postalCode: z.string().min(5, 'Postal code is required'),
    })
    .optional(),

  // Payment method
  paymentMethod: z.enum(['cod', 'payos']),

  // Order notes
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cartItems } = useCart();
  const { addresses, isLoading: isLoadingAddresses } = useAddresses();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [useNewAddress, setUseNewAddress] = useState(false);

  // Form initialization
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'payos',
      notes: '',
    },
  });

  // Calculate order totals
  useEffect(() => {
    // If we have an authenticated user, get the selected items from session storage
    if (session && cartItems.length > 0) {
      const selectedItemIds = JSON.parse(sessionStorage.getItem('checkout_items') || '[]');

      if (selectedItemIds.length === 0) {
        // If no items were selected, redirect back to cart
        toast.error('No items selected for checkout');
        router.push('/cart');
        return;
      }

      const selectedItems = cartItems.filter((item: CartItem) => selectedItemIds.includes(item.id));
      setCheckoutItems(selectedItems);

      // Calculate totals
      const itemsSubtotal = selectedItems.reduce(
        (sum: number, item: CartItem) => sum + item.subTotal,
        0
      );
      setSubtotal(itemsSubtotal);

      // Calculate shipping fee (free over $50, otherwise $5)
      const calculatedShippingFee = itemsSubtotal >= 50 ? 0 : 5;
      setShippingFee(calculatedShippingFee);

      // Calculate total
      setTotal(itemsSubtotal + calculatedShippingFee);
    } else if (!session) {
      // Handle guest checkout (not implemented in this example)
      router.push('/login?callbackUrl=/checkout');
    }
  }, [session, cartItems, router]);

  // Watch for address selection changes
  const selectedAddressId = form.watch('addressId');

  useEffect(() => {
    // Reset the "use new address" flag when an existing address is selected
    if (selectedAddressId) {
      setUseNewAddress(false);
    }
  }, [selectedAddressId]);

  // Handle form submission
  const onSubmit = async (data: CheckoutFormData) => {
    if (checkoutItems.length === 0) {
      toast.error('No items in cart');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        items: checkoutItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        addressId: useNewAddress ? null : data.addressId,
        shippingAddress: useNewAddress ? data.shippingAddress : undefined,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      };

      // Create order
      const response = await apiClient.post('/orders', orderData);
      const order = response.data.data;

      // Clear checkout items from session storage
      sessionStorage.removeItem('checkout_items');

      // If payment method is PayOS, redirect to payment page
      if (data.paymentMethod === 'payos') {
        router.push(`/checkout/payment?orderId=${order.id}`);
      } else {
        // Otherwise, show success and redirect to order detail
        toast.success('Order placed successfully!');
        router.push(`/profile/orders/${order.id}`);
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not logged in or loading
  if (!session || checkoutItems.length === 0) {
    return (
      <div className='container mx-auto px-4 py-12 text-center'>
        <Loader2 className='h-8 w-8 animate-spin mx-auto text-primary' />
        <p className='mt-4'>Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center mb-8 text-sm'>
        <Button variant='ghost' size='sm' asChild className='mr-2'>
          <Link href='/cart'>
            <ChevronLeft className='h-4 w-4 mr-1' />
            Back to Cart
          </Link>
        </Button>
        <div className='flex items-center'>
          <span className='text-primary font-medium'>Cart</span>
          <span className='mx-2'>→</span>
          <span className='font-medium'>Checkout</span>
          <span className='mx-2'>→</span>
          <span className='text-gray-500'>Payment</span>
        </div>
      </div>

      <h1 className='text-2xl font-bold mb-8'>Checkout</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Checkout form */}
        <div className='lg:col-span-2'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              {/* Shipping Information */}
              <div className='bg-white rounded-lg shadow-sm p-6'>
                <h2 className='text-lg font-bold mb-4'>Shipping Information</h2>

                {!isLoadingAddresses && addresses && addresses.length > 0 && (
                  <div className='mb-6'>
                    <FormField
                      control={form.control}
                      name='addressId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select an address</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setUseNewAddress(false);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select an address' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {addresses.map((address) => (
                                <SelectItem key={address.id} value={address.id}>
                                  {address.formattedAddress}
                                </SelectItem>
                              ))}
                              <SelectItem value='new'>Use a new address</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Show option to enter new address */}
                    {selectedAddressId === 'new' && (
                      <div className='mt-4'>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => setUseNewAddress(true)}
                        >
                          Enter New Address
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* New address form */}
                {(useNewAddress || !addresses || addresses.length === 0) && (
                  <div className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='shippingAddress.recipientName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Name</FormLabel>
                          <FormControl>
                            <Input placeholder='Full name' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='shippingAddress.phoneNumber'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder='Phone number' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='shippingAddress.addressLine1'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 1</FormLabel>
                          <FormControl>
                            <Input placeholder='Street address' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='shippingAddress.addressLine2'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 2 (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder='Apartment, suite, etc.' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='grid grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='shippingAddress.ward'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ward</FormLabel>
                            <FormControl>
                              <Input placeholder='Ward' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='shippingAddress.district'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District</FormLabel>
                            <FormControl>
                              <Input placeholder='District' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='shippingAddress.provinceCity'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Province/City</FormLabel>
                            <FormControl>
                              <Input placeholder='Province/City' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='shippingAddress.postalCode'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder='Postal code' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className='bg-white rounded-lg shadow-sm p-6'>
                <h2 className='text-lg font-bold mb-4'>Payment Method</h2>

                <FormField
                  control={form.control}
                  name='paymentMethod'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex flex-col space-y-1'
                        >
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='payos' />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              Pay with PayOS (Credit/Debit Card, Bank Transfer)
                            </FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='cod' />
                            </FormControl>
                            <FormLabel className='font-normal'>Cash on Delivery (COD)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Order Notes */}
              <div className='bg-white rounded-lg shadow-sm p-6'>
                <h2 className='text-lg font-bold mb-4'>Order Notes (Optional)</h2>

                <FormField
                  control={form.control}
                  name='notes'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special instructions for your order</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Add any special instructions or notes about your order here'
                          className='resize-none h-24'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type='submit' className='w-full' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Processing...
                  </>
                ) : (
                  'Complete Order'
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Order summary */}
        <div>
          <div className='bg-white rounded-lg shadow-sm p-6 space-y-4 sticky top-24'>
            <h2 className='text-lg font-bold border-b pb-2'>Order Summary</h2>

            {/* Order items */}
            <div className='space-y-4'>
              {checkoutItems.map((item) => (
                <div key={item.id} className='flex items-start gap-3'>
                  <div className='relative h-16 w-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden'>
                    {item.productImages && item.productImages.length > 0 ? (
                      <Image
                        src={item.productImages[0]}
                        alt={item.productName}
                        fill
                        sizes='64px'
                        className='object-cover object-center'
                      />
                    ) : (
                      <div className='flex items-center justify-center h-full bg-gray-200'>
                        <span className='text-gray-400 text-xs'>No image</span>
                      </div>
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-sm font-medium truncate'>{item.productName}</h3>
                    <p className='text-xs text-gray-500'>Qty: {item.quantity}</p>
                    <p className='text-sm font-medium mt-1'>{formatCurrency(item.subTotal)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order totals */}
            <div className='border-t pt-4 space-y-2'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className='flex justify-between'>
                <span className='text-gray-600'>Shipping:</span>
                <span>{shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}</span>
              </div>

              <div className='flex justify-between font-bold pt-2 border-t'>
                <span>Total:</span>
                <span className='text-primary'>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
