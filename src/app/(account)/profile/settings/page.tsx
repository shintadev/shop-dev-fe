'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define form schemas with Zod
const profileSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    newPassword: z.string().min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(8, 'Xác nhận mật khẩu phải có ít nhất 8 ký tự'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile/settings');
      return;
    }

    if (status === 'authenticated' && session?.user) {
      // Set default values for profile form
      resetProfile({
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        phone: '', // Assuming phone is not in the session
      });
      setLoading(false);
    }
  }, [session, status, router, resetProfile]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);

    try {
      // In a real app, you would call your API to update the profile
      // This is just a mock update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
        },
      });

      toast.success('Thông tin cá nhân đã được cập nhật');
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi cập nhật thông tin');
      console.error(error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsUpdatingPassword(true);

    try {
      // In a real app, you would call your API to update the password
      // This is just a mock update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Mật khẩu đã được cập nhật');
      resetPassword({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi cập nhật mật khẩu');
      console.error(error);
    } finally {
      setIsUpdatingPassword(false);
    }
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
          <ArrowLeft className='mr-2 h-4 w-4' /> Quay lại tài khoản
        </Link>
      </div>

      <h1 className='text-3xl font-bold mb-8'>Cài đặt tài khoản</h1>

      <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
        <Tabs defaultValue='profile' className='w-full'>
          <TabsList className='w-full border-b px-6'>
            <TabsTrigger
              value='profile'
              className='data-[state=active]:border-b-2 data-[state=active]:border-primary py-4'
            >
              <User className='mr-2 h-4 w-4' />
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger
              value='password'
              className='data-[state=active]:border-b-2 data-[state=active]:border-primary py-4'
            >
              <Lock className='mr-2 h-4 w-4' />
              Đổi mật khẩu
            </TabsTrigger>
          </TabsList>

          <TabsContent value='profile' className='p-6'>
            <form onSubmit={handleSubmitProfile(onProfileSubmit)} className='space-y-6'>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='name'>Họ và tên</Label>
                  <Input
                    id='name'
                    {...registerProfile('name')}
                    className={profileErrors.name ? 'border-red-300' : ''}
                  />
                  {profileErrors.name && (
                    <p className='text-red-500 text-sm mt-1'>{profileErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    {...registerProfile('email')}
                    className={profileErrors.email ? 'border-red-300' : ''}
                    disabled // Email is usually not editable
                  />
                  {profileErrors.email && (
                    <p className='text-red-500 text-sm mt-1'>{profileErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor='phone'>Số điện thoại</Label>
                  <Input
                    id='phone'
                    {...registerProfile('phone')}
                    className={profileErrors.phone ? 'border-red-300' : ''}
                  />
                  {profileErrors.phone && (
                    <p className='text-red-500 text-sm mt-1'>{profileErrors.phone.message}</p>
                  )}
                </div>
              </div>

              <Button type='submit' disabled={isUpdatingProfile}>
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Đang cập nhật...
                  </>
                ) : (
                  'Cập nhật thông tin'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value='password' className='p-6'>
            <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className='space-y-6'>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='currentPassword'>Mật khẩu hiện tại</Label>
                  <div className='relative'>
                    <Input
                      id='currentPassword'
                      type={showCurrentPassword ? 'text' : 'password'}
                      {...registerPassword('currentPassword')}
                      className={passwordErrors.currentPassword ? 'border-red-300 pr-10' : 'pr-10'}
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-3 flex items-center'
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className='h-4 w-4 text-gray-400' />
                      ) : (
                        <Eye className='h-4 w-4 text-gray-400' />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className='text-red-500 text-sm mt-1'>
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor='newPassword'>Mật khẩu mới</Label>
                  <div className='relative'>
                    <Input
                      id='newPassword'
                      type={showNewPassword ? 'text' : 'password'}
                      {...registerPassword('newPassword')}
                      className={passwordErrors.newPassword ? 'border-red-300 pr-10' : 'pr-10'}
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-3 flex items-center'
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className='h-4 w-4 text-gray-400' />
                      ) : (
                        <Eye className='h-4 w-4 text-gray-400' />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className='text-red-500 text-sm mt-1'>
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor='confirmPassword'>Xác nhận mật khẩu mới</Label>
                  <div className='relative'>
                    <Input
                      id='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...registerPassword('confirmPassword')}
                      className={passwordErrors.confirmPassword ? 'border-red-300 pr-10' : 'pr-10'}
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-3 flex items-center'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='h-4 w-4 text-gray-400' />
                      ) : (
                        <Eye className='h-4 w-4 text-gray-400' />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className='text-red-500 text-sm mt-1'>
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <Button type='submit' disabled={isUpdatingPassword}>
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Đang cập nhật...
                  </>
                ) : (
                  'Cập nhật mật khẩu'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
