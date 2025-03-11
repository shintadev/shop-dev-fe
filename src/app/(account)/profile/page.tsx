'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { User, Settings, Package, MapPin, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  joinDate: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile');
      return;
    }

    if (status === 'authenticated' && session?.user) {
      // In a real app, you would fetch the full profile from your API
      setProfile({
        id: (session.user.id as string) || '1',
        name: session.user.name ?? 'Người dùng',
        email: session.user.email ?? 'user@example.com',
        image: session.user.image ?? '',
        joinDate: new Date().toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });
      setLoading(false);
    }
  }, [session, status, router]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast.success('Đăng xuất thành công');
    router.push('/');
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
      <h1 className='text-3xl font-bold mb-8'>Tài khoản của tôi</h1>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
        {/* Profile Sidebar */}
        <div className='col-span-1'>
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <div className='flex flex-col items-center text-center mb-6'>
              <div className='w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4'>
                {profile?.image ? (
                  <img
                    src={profile.image}
                    alt={profile?.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-primary/10'>
                    <User className='w-12 h-12 text-primary' />
                  </div>
                )}
              </div>
              <h2 className='text-xl font-semibold'>{profile?.name}</h2>
              <p className='text-gray-500 text-sm mt-1'>{profile?.email}</p>
              <p className='text-gray-400 text-xs mt-1'>Thành viên từ {profile?.joinDate}</p>
            </div>

            <nav className='space-y-1'>
              <Link
                href='/profile'
                className='flex items-center p-3 text-gray-900 rounded-md bg-primary/10'
              >
                <User className='mr-3 h-5 w-5 text-primary' />
                Tổng quan tài khoản
              </Link>
              <Link
                href='/profile/orders'
                className='flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100'
              >
                <Package className='mr-3 h-5 w-5 text-gray-500' />
                Lịch sử đơn hàng
              </Link>
              <Link
                href='/profile/addresses'
                className='flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100'
              >
                <MapPin className='mr-3 h-5 w-5 text-gray-500' />
                Địa chỉ của tôi
              </Link>
              <Link
                href='/profile/wishlist'
                className='flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100'
              >
                <Heart className='mr-3 h-5 w-5 text-gray-500' />
                Sản phẩm yêu thích
              </Link>
              <Link
                href='/profile/settings'
                className='flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100'
              >
                <Settings className='mr-3 h-5 w-5 text-gray-500' />
                Cài đặt tài khoản
              </Link>
              <button
                onClick={handleSignOut}
                className='flex w-full items-center p-3 text-gray-700 rounded-md hover:bg-gray-100'
              >
                <LogOut className='mr-3 h-5 w-5 text-gray-500' />
                Đăng xuất
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className='col-span-1 md:col-span-3'>
          <div className='bg-white p-6 rounded-lg shadow-sm border mb-6'>
            <h2 className='text-xl font-semibold mb-4'>Tổng quan tài khoản</h2>
            <p className='text-gray-600 mb-6'>
              Xin chào, <span className='font-medium'>{profile?.name}</span>! Từ trang tổng quan tài
              khoản, bạn có thể quản lý thông tin cá nhân, xem lịch sử đơn hàng, cập nhật địa chỉ
              giao hàng và nhiều hơn nữa.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='p-4 border rounded-lg bg-gray-50'>
                <h3 className='font-medium mb-2 flex items-center'>
                  <Package className='mr-2 h-4 w-4' /> Đơn hàng gần đây
                </h3>
                <p className='text-gray-500 text-sm mb-3'>
                  Xem và theo dõi các đơn hàng gần đây của bạn
                </p>
                <Button asChild variant='outline' size='sm'>
                  <Link href='/profile/orders'>Xem đơn hàng</Link>
                </Button>
              </div>

              <div className='p-4 border rounded-lg bg-gray-50'>
                <h3 className='font-medium mb-2 flex items-center'>
                  <MapPin className='mr-2 h-4 w-4' /> Địa chỉ của tôi
                </h3>
                <p className='text-gray-500 text-sm mb-3'>
                  Quản lý địa chỉ giao hàng và thanh toán
                </p>
                <Button asChild variant='outline' size='sm'>
                  <Link href='/profile/addresses'>Quản lý địa chỉ</Link>
                </Button>
              </div>

              <div className='p-4 border rounded-lg bg-gray-50'>
                <h3 className='font-medium mb-2 flex items-center'>
                  <Heart className='mr-2 h-4 w-4' /> Sản phẩm yêu thích
                </h3>
                <p className='text-gray-500 text-sm mb-3'>Xem danh sách sản phẩm bạn đã lưu</p>
                <Button asChild variant='outline' size='sm'>
                  <Link href='/profile/wishlist'>Xem danh sách</Link>
                </Button>
              </div>

              <div className='p-4 border rounded-lg bg-gray-50'>
                <h3 className='font-medium mb-2 flex items-center'>
                  <Settings className='mr-2 h-4 w-4' /> Cài đặt tài khoản
                </h3>
                <p className='text-gray-500 text-sm mb-3'>Cập nhật thông tin cá nhân và mật khẩu</p>
                <Button asChild variant='outline' size='sm'>
                  <Link href='/profile/settings'>Cập nhật</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
