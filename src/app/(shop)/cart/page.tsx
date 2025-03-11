'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

// Mock cart data - In a real app, this would come from your API or state management
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxQuantity: number;
  color: string;
  size: string;
  slug: string;
}

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the cart data from your API or state management
    // This is just mock data
    setTimeout(() => {
      setCartItems([
        {
          id: 'cart-1',
          productId: 'prod-1',
          name: 'Áo thun Unisex Cotton Basic',
          price: 199000,
          image: 'https://placehold.co/300x400',
          quantity: 2,
          maxQuantity: 10,
          color: 'Trắng',
          size: 'M',
          slug: 'ao-thun-unisex-cotton-basic',
        },
        {
          id: 'cart-2',
          productId: 'prod-2',
          name: 'Quần jean Nam Slim Fit',
          price: 499000,
          image: 'https://placehold.co/300x400',
          quantity: 1,
          maxQuantity: 5,
          color: 'Xanh đậm',
          size: '32',
          slug: 'quan-jean-nam-slim-fit',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    if (newQuantity > item.maxQuantity) {
      toast.error(`Chỉ còn ${item.maxQuantity} sản phẩm trong kho`);
      return;
    }

    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );

    toast.success('Đã cập nhật số lượng');
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Đã xóa tất cả sản phẩm khỏi giỏ hàng');
  };

  const proceedToCheckout = () => {
    if (!session) {
      router.push('/login?callbackUrl=/checkout');
      return;
    }
    router.push('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate shipping fee (mock logic)
  const shippingFee = subtotal >= 500000 ? 0 : 30000;

  // Calculate total
  const total = subtotal + shippingFee;

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[calc(100vh-200px)]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-10 px-4'>
      <h1 className='text-3xl font-bold mb-6'>Giỏ hàng của bạn</h1>

      {cartItems.length === 0 ? (
        <div className='bg-white p-8 rounded-lg shadow-sm border text-center'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <ShoppingCart className='w-16 h-16 text-gray-300' />
            <h2 className='text-xl font-medium'>Giỏ hàng trống</h2>
            <p className='text-gray-500 max-w-md mx-auto'>
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi và
              thêm vào giỏ hàng.
            </p>
            <Button asChild className='mt-4'>
              <Link href='/products'>Tiếp tục mua sắm</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50 border-b'>
                    <tr>
                      <th className='py-4 px-6 text-left text-sm font-medium text-gray-500'>
                        Sản phẩm
                      </th>
                      <th className='py-4 px-6 text-center text-sm font-medium text-gray-500'>
                        Số lượng
                      </th>
                      <th className='py-4 px-6 text-right text-sm font-medium text-gray-500'>
                        Giá
                      </th>
                      <th className='py-4 px-6 text-right text-sm font-medium text-gray-500'>
                        Tổng
                      </th>
                      <th className='py-4 px-6 text-center text-sm font-medium text-gray-500'>
                        Xóa
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {cartItems.map((item) => (
                      <tr key={item.id} className='hover:bg-gray-50'>
                        <td className='py-4 px-6'>
                          <div className='flex items-center'>
                            <div className='w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border bg-gray-100'>
                              <img
                                src={item.image}
                                alt={item.name}
                                className='w-full h-full object-cover'
                              />
                            </div>
                            <div className='ml-4'>
                              <Link
                                href={`/products/${item.slug}`}
                                className='text-sm font-medium text-gray-900 hover:text-primary'
                              >
                                {item.name}
                              </Link>
                              <p className='text-xs text-gray-500 mt-1'>
                                {item.color} / {item.size}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className='py-4 px-6'>
                          <div className='flex items-center justify-center'>
                            <button
                              className='w-8 h-8 flex items-center justify-center rounded-l-md border border-r-0 border-gray-300'
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className='h-3 w-3' />
                            </button>
                            <input
                              type='number'
                              min='1'
                              max={item.maxQuantity}
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.id, parseInt(e.target.value) || 1)
                              }
                              className='w-10 h-8 border border-gray-300 text-center text-sm'
                            />
                            <button
                              className='w-8 h-8 flex items-center justify-center rounded-r-md border border-l-0 border-gray-300'
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className='h-3 w-3' />
                            </button>
                          </div>
                        </td>
                        <td className='py-4 px-6 text-right'>
                          <span className='text-sm font-medium text-gray-900'>
                            {formatPrice(item.price)}
                          </span>
                        </td>
                        <td className='py-4 px-6 text-right'>
                          <span className='text-sm font-semibold text-gray-900'>
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </td>
                        <td className='py-4 px-6 text-center'>
                          <button
                            className='text-red-500 hover:text-red-700'
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className='h-5 w-5' />
                            <span className='sr-only'>Remove</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='mt-6 flex justify-between'>
              <Button
                variant='outline'
                onClick={clearCart}
                className='text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Xóa giỏ hàng
              </Button>
              <Button asChild variant='outline'>
                <Link href='/products'>Tiếp tục mua sắm</Link>
              </Button>
            </div>
          </div>

          <div>
            <div className='bg-white rounded-lg shadow-sm border p-6'>
              <h2 className='text-lg font-semibold mb-6'>Tóm tắt đơn hàng</h2>

              <div className='space-y-4'>
                <div className='flex justify-between py-2'>
                  <span className='text-gray-600'>Tạm tính ({cartItems.length} sản phẩm):</span>
                  <span className='font-medium'>{formatPrice(subtotal)}</span>
                </div>

                <div className='flex justify-between py-2'>
                  <span className='text-gray-600'>Phí vận chuyển:</span>
                  {shippingFee === 0 ? (
                    <span className='text-green-600'>Miễn phí</span>
                  ) : (
                    <span>{formatPrice(shippingFee)}</span>
                  )}
                </div>

                <div className='border-t pt-4 mt-2'>
                  <div className='flex justify-between'>
                    <span className='font-semibold'>Tổng cộng:</span>
                    <span className='font-bold text-lg'>{formatPrice(total)}</span>
                  </div>
                </div>

                {shippingFee > 0 && (
                  <div className='bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-start mt-4'>
                    <AlertCircle className='h-5 w-5 mr-2 flex-shrink-0 mt-0.5' />
                    <p>Mua thêm {formatPrice(500000 - subtotal)} để được miễn phí vận chuyển</p>
                  </div>
                )}

                <Button className='w-full mt-6' onClick={proceedToCheckout}>
                  <span className='flex items-center'>
                    Tiến hành thanh toán <ArrowRight className='ml-2 h-4 w-4' />
                  </span>
                </Button>

                <div className='mt-6'>
                  <h3 className='font-medium text-sm mb-2'>Chúng tôi chấp nhận:</h3>
                  <div className='flex space-x-2'>
                    <div className='w-12 h-8 bg-gray-100 rounded border flex items-center justify-center'>
                      <span className='text-xs'>VISA</span>
                    </div>
                    <div className='w-12 h-8 bg-gray-100 rounded border flex items-center justify-center'>
                      <span className='text-xs'>MC</span>
                    </div>
                    <div className='w-12 h-8 bg-gray-100 rounded border flex items-center justify-center'>
                      <span className='text-xs'>Momo</span>
                    </div>
                    <div className='w-12 h-8 bg-gray-100 rounded border flex items-center justify-center'>
                      <span className='text-xs'>COD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}