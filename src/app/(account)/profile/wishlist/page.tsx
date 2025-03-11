'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShoppingCart, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Mock wishlist data - In a real app, this would come from your API
interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  slug: string;
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile/wishlist');
      return;
    }

    // In a real app, you would fetch the wishlist from your API
    // This is just mock data
    setTimeout(() => {
      setWishlistItems([
        {
          id: '1',
          productId: 'prod-1',
          name: 'Áo thun Unisex Cotton Basic',
          price: 199000,
          image: 'https://placehold.co/300x400',
          inStock: true,
          slug: 'ao-thun-unisex-cotton-basic',
        },
        {
          id: '2',
          productId: 'prod-2',
          name: 'Quần jean Nam Slim Fit',
          price: 499000,
          image: 'https://placehold.co/300x400',
          inStock: true,
          slug: 'quan-jean-nam-slim-fit',
        },
        {
          id: '3',
          productId: 'prod-3',
          name: 'Giày Sneaker Nữ',
          price: 799000,
          image: 'https://placehold.co/300x400',
          inStock: false,
          slug: 'giay-sneaker-nu',
        },
      ]);
      setLoading(false);
    }, 500);
  }, [status, router]);

  const removeFromWishlist = (id: string) => {
    // In a real app, you would call your API to remove the item
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    toast.success('Đã xóa sản phẩm khỏi danh sách yêu thích');
  };

  const addToCart = (item: WishlistItem) => {
    // In a real app, you would call your API to add to cart
    toast.success(`Đã thêm "${item.name}" vào giỏ hàng`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[calc(100vh-200px)]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-10 px-4'>
      <div className='mb-6'>
        <Link
          href='/profile'
          className='text-sm text-gray-600 hover:text-primary flex items-center'
        >
          ← Quay lại tài khoản
        </Link>
      </div>

      <h1 className='text-3xl font-bold mb-6'>Sản phẩm yêu thích</h1>

      {wishlistItems.length === 0 ? (
        <div className='bg-white p-8 rounded-lg shadow-sm border text-center'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <AlertCircle className='w-12 h-12 text-gray-400' />
            <h2 className='text-xl font-medium'>Danh sách yêu thích trống</h2>
            <p className='text-gray-500 max-w-md mx-auto'>
              Bạn chưa có sản phẩm nào trong danh sách yêu thích. Hãy khám phá cửa hàng và lưu lại
              những sản phẩm bạn thích.
            </p>
            <Button asChild className='mt-4'>
              <Link href='/products'>Khám phá sản phẩm</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  <th className='py-4 px-6 text-left text-sm font-medium text-gray-500'>
                    Sản phẩm
                  </th>
                  <th className='py-4 px-6 text-left text-sm font-medium text-gray-500'>Giá</th>
                  <th className='py-4 px-6 text-left text-sm font-medium text-gray-500'>
                    Trạng thái
                  </th>
                  <th className='py-4 px-6 text-right text-sm font-medium text-gray-500'>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {wishlistItems.map((item) => (
                  <tr key={item.id} className='hover:bg-gray-50'>
                    <td className='py-4 px-6'>
                      <div className='flex items-center space-x-4'>
                        <div className='w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border bg-gray-100'>
                          <img
                            src={item.image}
                            alt={item.name}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div>
                          <Link
                            href={`/products/${item.slug}`}
                            className='text-sm font-medium text-gray-900 hover:text-primary'
                          >
                            {item.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className='py-4 px-6'>
                      <span className='text-sm font-medium text-gray-900'>
                        {formatPrice(item.price)}
                      </span>
                    </td>
                    <td className='py-4 px-6'>
                      {item.inStock ? (
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                          Còn hàng
                        </span>
                      ) : (
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                          Hết hàng
                        </span>
                      )}
                    </td>
                    <td className='py-4 px-6 text-right'>
                      <div className='flex justify-end space-x-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                          <span className='sr-only'>Remove</span>
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-primary'
                          disabled={!item.inStock}
                          onClick={() => addToCart(item)}
                        >
                          <ShoppingCart className='h-4 w-4 mr-1' />
                          <span className='hidden sm:inline'>Thêm vào giỏ</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
