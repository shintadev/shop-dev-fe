'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronRight, Filter, Search, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock order data - In a real app, this would come from your API
interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile/orders');
      return;
    }

    // In a real app, you would fetch orders from your API
    // This is just mock data
    setTimeout(() => {
      setOrders([
        {
          id: 'ord-1',
          orderNumber: 'ORD-20230315-001',
          date: '15/03/2023',
          status: 'delivered',
          total: 698000,
          items: 2,
        },
        {
          id: 'ord-2',
          orderNumber: 'ORD-20230428-002',
          date: '28/04/2023',
          status: 'shipped',
          total: 1250000,
          items: 3,
        },
        {
          id: 'ord-3',
          orderNumber: 'ORD-20230510-003',
          date: '10/05/2023',
          status: 'processing',
          total: 499000,
          items: 1,
        },
        {
          id: 'ord-4',
          orderNumber: 'ORD-20230625-004',
          date: '25/06/2023',
          status: 'delivered',
          total: 849000,
          items: 2,
        },
        {
          id: 'ord-5',
          orderNumber: 'ORD-20230712-005',
          date: '12/07/2023',
          status: 'cancelled',
          total: 199000,
          items: 1,
        },
      ]);
      setLoading(false);
    }, 500);
  }, [status, router]);

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const filteredOrders = orders
    .filter((order) => {
      if (statusFilter === 'all') return true;
      return order.status === statusFilter;
    })
    .filter((order) => {
      if (!searchQuery) return true;
      return (
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.date.includes(searchQuery)
      );
    });

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

      <h1 className='text-3xl font-bold mb-6'>Lịch sử đơn hàng</h1>

      {/* Filters */}
      <div className='bg-white p-4 rounded-lg shadow-sm border mb-6'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                placeholder='Tìm kiếm theo mã đơn hàng hoặc ngày đặt'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-9'
              />
            </div>
          </div>
          <div className='w-full md:w-64'>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <div className='flex items-center'>
                  <Filter className='mr-2 h-4 w-4 text-gray-500' />
                  <SelectValue placeholder='Trạng thái đơn hàng' />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả trạng thái</SelectItem>
                <SelectItem value='pending'>Chờ xác nhận</SelectItem>
                <SelectItem value='processing'>Đang xử lý</SelectItem>
                <SelectItem value='shipped'>Đang giao hàng</SelectItem>
                <SelectItem value='delivered'>Đã giao hàng</SelectItem>
                <SelectItem value='cancelled'>Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className='bg-white p-8 rounded-lg shadow-sm border text-center'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <ShoppingBag className='w-12 h-12 text-gray-400' />
            <h2 className='text-xl font-medium'>Không tìm thấy đơn hàng nào</h2>
            <p className='text-gray-500 max-w-md mx-auto'>
              {searchQuery || statusFilter !== 'all'
                ? 'Không tìm thấy đơn hàng nào khớp với bộ lọc của bạn. Hãy thử tìm kiếm với điều kiện khác.'
                : 'Bạn chưa có đơn hàng nào. Hãy khám phá cửa hàng và mua sắm ngay!'}
            </p>
            <Button asChild className='mt-4'>
              <Link href='/products'>Mua sắm ngay</Link>
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
                    Mã đơn hàng
                  </th>
                  <th className='py-4 px-6 text-left text-sm font-medium text-gray-500'>
                    Ngày đặt
                  </th>
                  <th className='py-4 px-6 text-left text-sm font-medium text-gray-500'>
                    Trạng thái
                  </th>
                  <th className='py-4 px-6 text-left text-sm font-medium text-gray-500'>
                    Tổng tiền
                  </th>
                  <th className='py-4 px-6 text-center text-sm font-medium text-gray-500'>
                    Số lượng
                  </th>
                  <th className='py-4 px-6 text-right text-sm font-medium text-gray-500'>
                    Chi tiết
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className='hover:bg-gray-50'>
                    <td className='py-4 px-6'>
                      <span className='text-sm font-medium text-gray-900'>{order.orderNumber}</span>
                    </td>
                    <td className='py-4 px-6'>
                      <span className='text-sm text-gray-700'>{order.date}</span>
                    </td>
                    <td className='py-4 px-6'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className='py-4 px-6'>
                      <span className='text-sm font-medium text-gray-900'>
                        {formatPrice(order.total)}
                      </span>
                    </td>
                    <td className='py-4 px-6 text-center'>
                      <span className='text-sm text-gray-700'>{order.items} sản phẩm</span>
                    </td>
                    <td className='py-4 px-6 text-right'>
                      <Button asChild variant='outline' size='sm'>
                        <Link href={`/profile/orders/${order.id}`}>
                          <span className='flex items-center'>
                            Xem chi tiết <ChevronRight className='ml-1 h-4 w-4' />
                          </span>
                        </Link>
                      </Button>
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
