'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Check, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check for callback parameters
  const callbackStatus = searchParams.get('status');
  const callbackOrderId = searchParams.get('orderId');

  useEffect(() => {
    // If there's a callback status, handle it
    if (callbackStatus && callbackOrderId) {
      handlePaymentCallback(callbackStatus, callbackOrderId);
      return;
    }

    // Otherwise, get the order ID from the query params and generate payment QR
    const queryOrderId = searchParams.get('orderId');
    if (!queryOrderId) {
      setErrorMessage('Order ID is missing');
      setPaymentStatus('error');
      setIsLoading(false);
      return;
    }

    setOrderId(queryOrderId);
    generatePaymentQR(queryOrderId);
  }, [searchParams]);

  const generatePaymentQR = async (orderId: string) => {
    try {
      const response = await apiClient.post<{ data: { paymentUrl: string } }>(
        `/payments/create/${orderId}`
      );
      setPaymentUrl(response.data.data.paymentUrl);
      setIsLoading(false);

      // Set up polling to check payment status
      const intervalId = setInterval(() => {
        checkPaymentStatus(orderId);
      }, 5000); // Check every 5 seconds

      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    } catch (error) {
      setErrorMessage('Failed to generate payment QR code');
      setPaymentStatus('error');
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async (orderId: string) => {
    try {
      const response = await apiClient.get<{ data: { status: string } }>(
        `/payments/status/${orderId}`
      );

      if (response.data.data.status === 'COMPLETED') {
        setPaymentStatus('success');

        // After 3 seconds, redirect to order details
        setTimeout(() => {
          router.push(`/profile/orders/${orderId}`);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to check payment status', error);
    }
  };

  const handlePaymentCallback = async (status: string, orderId: string) => {
    setOrderId(orderId);

    if (status === 'success') {
      setPaymentStatus('success');

      // After 3 seconds, redirect to order details
      setTimeout(() => {
        router.push(`/profile/orders/${orderId}`);
      }, 3000);
    } else {
      setErrorMessage('Payment failed or was cancelled');
      setPaymentStatus('error');
    }

    setIsLoading(false);
  };

  // Redirect to home if not authenticated
  if (!session) {
    return (
      <div className='container mx-auto px-4 py-12 text-center'>
        <Loader2 className='h-8 w-8 animate-spin mx-auto text-primary' />
        <p className='mt-4'>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center mb-8 text-sm'>
        <Button variant='ghost' size='sm' asChild className='mr-2'>
          <a href='/checkout'>
            <ArrowLeft className='h-4 w-4 mr-1' />
            Back to Checkout
          </a>
        </Button>
        <div className='flex items-center'>
          <span className='text-gray-500'>Cart</span>
          <span className='mx-2'>→</span>
          <span className='text-gray-500'>Checkout</span>
          <span className='mx-2'>→</span>
          <span className='font-medium'>Payment</span>
        </div>
      </div>

      <div className='max-w-md mx-auto bg-white rounded-lg shadow-sm p-8'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Payment</h1>

        {isLoading ? (
          <div className='text-center py-12'>
            <Loader2 className='h-12 w-12 animate-spin mx-auto text-primary mb-4' />
            <p>Preparing payment...</p>
          </div>
        ) : paymentStatus === 'success' ? (
          <div className='text-center py-8'>
            <div className='bg-green-100 text-green-700 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4'>
              <Check className='h-8 w-8' />
            </div>
            <h2 className='text-xl font-bold mb-2'>Payment Successful!</h2>
            <p className='text-gray-600 mb-6'>
              Your order has been placed and payment was successful.
            </p>
            <p className='text-sm text-gray-500'>
              You will be redirected to your order details shortly...
            </p>
            <div className='mt-8 space-x-4'>
              <Button asChild>
                <a href={`/profile/orders/${orderId}`}>View Order</a>
              </Button>
              <Button variant='outline' asChild>
                <a href='/'>Return to Home</a>
              </Button>
            </div>
          </div>
        ) : paymentStatus === 'error' ? (
          <div className='text-center py-8'>
            <div className='bg-red-100 text-red-700 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4'>
              <AlertCircle className='h-8 w-8' />
            </div>
            <h2 className='text-xl font-bold mb-2'>Payment Failed</h2>
            <p className='text-gray-600 mb-6'>
              {errorMessage || 'There was a problem processing your payment.'}
            </p>
            <div className='mt-8 space-x-4'>
              <Button asChild>
                <a href='/checkout'>Try Again</a>
              </Button>
              <Button variant='outline' asChild>
                <a href='/cart'>Return to Cart</a>
              </Button>
            </div>
          </div>
        ) : (
          <div className='text-center'>
            {/* Payment QR Code */}
            {paymentUrl && (
              <div className='mb-6'>
                <h2 className='text-lg font-bold mb-4'>Scan QR Code to Pay</h2>
                <div className='bg-white p-4 rounded-lg border border-gray-200 inline-block'>
                  <img src={paymentUrl} alt='Payment QR Code' className='w-64 h-64 mx-auto' />
                </div>
                <p className='text-sm text-gray-500 mt-4'>
                  Scan this QR code with your banking app to complete payment
                </p>
              </div>
            )}

            <div className='mt-6 py-2 px-4 bg-gray-50 rounded-md text-sm text-gray-600'>
              <p>Order #: {orderId}</p>
              <p className='mt-1'>Please do not close this page until payment is complete</p>
            </div>

            <div className='mt-8'>
              <Button variant='outline' asChild>
                <a href='/checkout'>Cancel Payment</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
