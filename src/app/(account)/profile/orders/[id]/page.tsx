'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft,
  Printer,
  ChevronDown,
  ChevronUp,
  Truck,
  Package,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Mock order data - In a real app, this would come from your API
interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
  variant: string;
}

interface OrderAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shippingAddress: OrderAddress;
  paymentMethod: string;
  shippingMethod: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  timeline: {
    date: string;
    status: string;
    description: string;
  }[];
}

export default function OrderDetailPage() {
  const { data: session, status: sessionStatus } = useSession();
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile/orders');
      return;
    }

    // In a real app, you would fetch the specific order from your API
    // This is just mock data
    setTimeout(() => {
      if (orderId === 'ord-1') {
        setOrder({
          id: 'ord-1',
          orderNumber: 'ORD-20230315-001',
          date: '15/03/2023 14:30',
          status: 'delivered',
          items: [
            {
              id: 'item-1',
              productId: 'prod-1',
              name: 'Áo thun Unisex Cotton Basic',
              price: 199000,
              image: 'https://placehold.co/300x400',
              quantity: 2,
              variant: 'Màu: Trắng / Kích thước: M',
              slug: 'ao-thun-unisex-cotton-basic',
            },
            {
              id: 'item-2',
              productId: 'prod-2',
              name: 'Quần jean Nam Slim Fit',
              price: 300000,
              image: 'https://placehold.co/300x400',
              quantity: 1,
              variant: 'Màu: Xanh đậm / Kích thước: 32',
              slug: 'quan-jean-nam-slim-fit',
            },
          ],
          shippingAddress: {
            name: 'Nguyễn Văn A',
            phone: '0912345678',
            address: '123 Đường Lê Lợi',
            ward: 'Phường Bến Nghé',
            district: 'Quận 1',
            city: 'TP Hồ Chí Minh',
          },
          paymentMethod: 'Thanh toán khi nhận hàng (COD)',
          shippingMethod: 'Giao hàng tiêu chuẩn',
          subtotal: 698000,
          shippingFee: 30000,
          discount: 0,
          total: 728000,
          timeline: [
            {
              date: '15/03/2023 14:30',
              status: 'Đơn hàng đã đặt',
              description: 'Đơn hàng của bạn đã được tạo thành công',
            },
            {
              date: '15/03/2023 15:45',
              status: 'Xác nhận đơn hàng',
              description: 'Đơn hàng đã được xác nhận và đang chờ xử lý',
            },
            {
              date: '16/03/2023 10:20',
              status: 'Đóng gói',
              description: 'Đơn hàng của bạn đang được đóng gói',
            },
            {
              date: '16/03/2023 16:30',
              status: 'Đang giao hàng',
              description: 'Đơn hàng đã được bàn giao cho đơn vị vận chuyển',
            },
            {
              date: '18/03/2023 09:15',
              status: 'Đã giao hàng',
              description: 'Đơn hàng đã được giao thành công',
            },
          ],
        });
      } else {
        // Default order for unknown order IDs
        setOrder({
          id: orderId,
          orderNumber: `ORD-${orderId}`,
          date: '15/03/2023 14:30',
          status: 'processing',
          items: [
            {
              id: 'item-1',
              productId: 'prod-1',
              name: 'Áo thun Unisex Cotton Basic',
              price: 199000,
              image: 'https://placehold.co/300x400',
              quantity: 1,
              variant: 'Màu: Đen / Kích thước: L',
              slug: 'ao-thun-unisex-cotton-basic',
            },
          ],
          shippingAddress: {
            name: 'Nguyễn Văn A',
            phone: '0912345678',
            address: '123 Đường Lê Lợi',
            ward: 'Phường Bến Nghé',
            district: 'Quận 1',
            city: 'TP Hồ Chí Minh',
          },
          paymentMethod: 'Thanh toán khi nhận hàng (COD)',
          shippingMethod: 'Giao hàng tiêu chuẩn',
          subtotal: 199000,
          shippingFee: 30000,
          discount: 0,
          total: 229000,
          timeline: [
            {
              date: '15/03/2023 14:30',
              status: 'Đơn hàng đã đặt',
              description: 'Đơn hàng của bạn đã được tạo thành công',
            },
            {
              date: '15/03/2023 15:45',
              status: 'Xác nhận đơn hàng',
              description: 'Đơn hàng đã được xác nhận và đang chờ xử lý',
            },
            {
              date: '16/03/2023 10:20',
              status: 'Đóng gói',
              description: 'Đơn hàng của bạn đang được đóng gói',
            },
          ],
        });
      }
      setLoading(false);
    }, 500);
  }, [orderId, sessionStatus, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className='h-5 w-5 text-yellow-500' />;
      case 'processing':
        return <Package className='h-5 w-5 text-blue-500' />;
      case 'shipped':
        return <Truck className='h-5 w-5 text-purple-500' />;
      case 'delivered':
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      case 'cancelled':
        return <XCircle className='h-5 w-5 text-red-500' />;
      default:
        return <Package className='h-5 w-5 text-gray-500' />;
    }
  };

  const getStatusColor = (status: OrderDetail['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'shipped':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: OrderDetail['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[calc(100vh-200px)]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='container mx-auto py-10 px-4'>
        <div className='mb-6'>
          <Link
            href='/profile/orders'
            className='text-sm text-gray-600 hover:text-primary flex items-center'
          >
            <ArrowLeft className='mr-2 h-4 w-4' /> Quay lại danh sách đơn hàng
          </Link>
        </div>
        <div className='bg-white p-8 rounded-lg shadow-sm border text-center'>
          <h2 className='text-xl font-medium text-red-600'>Không tìm thấy đơn hàng</h2>
          <p className='text-gray-500 mt-2'>
            Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button asChild className='mt-6'>
            <Link href='/profile/orders'>Quay lại danh sách đơn hàng</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-10 px-4 print:py-2 print:px-0'>
      <div className='mb-6 print:hidden'>
        <Link
          href='/profile/orders'
          className='text-sm text-gray-600 hover:text-primary flex items-center'
        >
          <ArrowLeft className='mr-2 h-4 w-4' /> Quay lại danh sách đơn hàng
        </Link>
      </div>

      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold print:text-2xl'>Chi tiết đơn hàng</h1>
        <Button variant='outline' size='sm' onClick={handlePrint} className='print:hidden'>
          <Printer className='mr-2 h-4 w-4' /> In đơn hàng
        </Button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          {/* Order Summary */}
          <div className='bg-white rounded-lg shadow-sm border p-6'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4'>
              <div>
                <h2 className='text-xl font-semibold'>Đơn hàng #{order.orderNumber}</h2>
                <p className='text-gray-500 text-sm'>Đặt ngày: {order.date}</p>
              </div>
              <div
                className={`mt-2 sm:mt-0 px-4 py-2 rounded-full border ${getStatusColor(
                  order.status
                )}`}
              >
                <span className='flex items-center'>
                  {getStatusIcon(order.status)}
                  <span className='ml-2 font-medium'>{getStatusText(order.status)}</span>
                </span>
              </div>
            </div>

            {/* Order Timeline */}
            <div className='border rounded-lg mt-6 overflow-hidden print:hidden'>
              <div
                className='flex justify-between items-center p-4 bg-gray-50 cursor-pointer'
                onClick={() => setShowTimeline(!showTimeline)}
              >
                <h3 className='font-medium'>Tiến trình đơn hàng</h3>
                <button className='text-gray-500'>
                  {showTimeline ? (
                    <ChevronUp className='h-5 w-5' />
                  ) : (
                    <ChevronDown className='h-5 w-5' />
                  )}
                </button>
              </div>
              {showTimeline && (
                <div className='p-4'>
                  <div className='relative'>
                    {order.timeline.map((event, index) => (
                      <div key={index} className='flex mb-4 last:mb-0'>
                        <div className='mr-4 relative'>
                          <div className='w-3 h-3 rounded-full bg-primary border-4 border-primary/20 z-10 relative'></div>
                          {index < order.timeline.length - 1 && (
                            <div className='absolute top-3 left-1.5 w-0.5 h-full bg-gray-200 -translate-x-1/2'></div>
                          )}
                        </div>
                        <div>
                          <p className='font-medium'>{event.status}</p>
                          <p className='text-gray-500 text-sm'>{event.description}</p>
                          <p className='text-gray-400 text-xs mt-1'>{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
            <h2 className='text-lg font-semibold p-6 border-b'>Sản phẩm đã mua</h2>
            <div className='divide-y'>
              {order.items.map((item) => (
                <div key={item.id} className='p-6 flex flex-col sm:flex-row'>
                  <div className='flex-shrink-0 w-full sm:w-20 h-20 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0 sm:mr-6'>
                    <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
                  </div>
                  <div className='flex-1'>
                    <Link
                      href={`/products/${item.slug}`}
                      className='font-medium hover:text-primary print:text-black print:no-underline'
                    >
                      {item.name}
                    </Link>
                    <p className='text-gray-500 text-sm mt-1'>{item.variant}</p>
                    <div className='flex justify-between items-center mt-2'>
                      <p className='text-gray-600'>
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                      <p className='font-semibold'>{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Order Details */}
          <div className='bg-white rounded-lg shadow-sm border p-6'>
            <h2 className='text-lg font-semibold mb-4'>Tóm tắt thanh toán</h2>
            <div className='space-y-3 text-sm'>
              <div className='flex justify-between py-1'>
                <span className='text-gray-600'>Tạm tính:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className='flex justify-between py-1'>
                <span className='text-gray-600'>Phí vận chuyển:</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className='flex justify-between py-1 text-green-600'>
                  <span>Giảm giá:</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className='border-t my-2'></div>
              <div className='flex justify-between py-1 font-bold text-base'>
                <span>Tổng cộng:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className='bg-white rounded-lg shadow-sm border p-6'>
            <h2 className='text-lg font-semibold mb-4'>Địa chỉ giao hàng</h2>
            <div className='space-y-2 text-sm'>
              <p className='font-medium'>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>
                {order.shippingAddress.address}, {order.shippingAddress.ward},{' '}
                {order.shippingAddress.district}, {order.shippingAddress.city}
              </p>
            </div>
          </div>

          {/* Payment & Shipping Method */}
          <div className='bg-white rounded-lg shadow-sm border p-6'>
            <h2 className='text-lg font-semibold mb-4'>Phương thức thanh toán & vận chuyển</h2>
            <div className='space-y-4 text-sm'>
              <div>
                <p className='text-gray-600 mb-1'>Phương thức thanh toán:</p>
                <p className='font-medium'>{order.paymentMethod}</p>
              </div>
              <div>
                <p className='text-gray-600 mb-1'>Phương thức vận chuyển:</p>
                <p className='font-medium'>{order.shippingMethod}</p>
              </div>
            </div>
          </div>

          {/* Customer Actions */}
          <div className='bg-white rounded-lg shadow-sm border p-6 print:hidden'>
            <h2 className='text-lg font-semibold mb-4'>Bạn cần hỗ trợ?</h2>
            <div className='space-y-3'>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => toast.info('Tính năng đang phát triển')}
              >
                Liên hệ hỗ trợ
              </Button>
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <Button
                  variant='outline'
                  className='w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700'
                  onClick={() => toast.info('Tính năng đang phát triển')}
                >
                  Yêu cầu hủy đơn
                </Button>
              )}
              {order.status === 'delivered' && (
                <Button className='w-full' onClick={() => toast.info('Tính năng đang phát triển')}>
                  Đánh giá sản phẩm
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
