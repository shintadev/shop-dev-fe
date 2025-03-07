'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

// Define form schema with Zod
const registerSchema = z
  .object({
    email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ'),
    firstName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    lastName: z.string().min(2, 'Họ phải có ít nhất 2 ký tự'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setRegistrationError(null);

    try {
      // Register the user
      const response = await apiClient.post('/auth/register', {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      });

      toast.success('Đăng ký thành công! Vui lòng xác minh email của bạn.');

      // Navigate to verification page or login page
      router.push('/login?registered=true');
    } catch (error: any) {
      if (error.response?.data?.message) {
        setRegistrationError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setRegistrationError('Đăng ký thất bại. Vui lòng thử lại.');
        toast.error('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      toast.error('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-bold text-gray-900'>Tạo tài khoản mới</h2>
          <p className='mt-2 text-sm text-gray-600'>
            Đăng ký để bắt đầu mua sắm và theo dõi đơn hàng của bạn
          </p>
        </div>

        {registrationError && (
          <div className='bg-red-50 border border-red-200 text-red-700 rounded-md p-4 text-sm'>
            {registrationError}
          </div>
        )}

        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor='firstName' className='block text-sm font-medium text-gray-700'>
                  Tên
                </label>
                <div className='mt-1'>
                  <Input
                    id='firstName'
                    type='text'
                    autoComplete='given-name'
                    {...register('firstName')}
                    className={`${errors.firstName ? 'border-red-300 focus:border-red-500' : ''}`}
                  />
                  {errors.firstName && (
                    <p className='mt-1 text-sm text-red-600'>{errors.firstName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor='lastName' className='block text-sm font-medium text-gray-700'>
                  Họ
                </label>
                <div className='mt-1'>
                  <Input
                    id='lastName'
                    type='text'
                    autoComplete='family-name'
                    {...register('lastName')}
                    className={`${errors.lastName ? 'border-red-300 focus:border-red-500' : ''}`}
                  />
                  {errors.lastName && (
                    <p className='mt-1 text-sm text-red-600'>{errors.lastName.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Địa chỉ Email
              </label>
              <div className='mt-1'>
                <Input
                  id='email'
                  type='email'
                  autoComplete='email'
                  {...register('email')}
                  className={`${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                Mật khẩu
              </label>
              <div className='mt-1 relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  {...register('password')}
                  className={`${errors.password ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4 text-gray-400' />
                  ) : (
                    <Eye className='h-4 w-4 text-gray-400' />
                  )}
                </button>
                {errors.password && (
                  <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
                Xác nhận mật khẩu
              </label>
              <div className='mt-1 relative'>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  {...register('confirmPassword')}
                  className={`${
                    errors.confirmPassword ? 'border-red-300 focus:border-red-500' : ''
                  }`}
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
                {errors.confirmPassword && (
                  <p className='mt-1 text-sm text-red-600'>{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Button
              type='submit'
              className='w-full flex justify-center py-2 px-4'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Đang đăng ký...
                </>
              ) : (
                'Đăng ký'
              )}
            </Button>
          </div>
        </form>

        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className='mt-6'>
            <Button
              type='button'
              onClick={handleGoogleSignIn}
              className='w-full flex justify-center items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              disabled={isLoading}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 48 48'
                width='24px'
                height='24px'
              >
                <path
                  fill='#FFC107'
                  d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
                />
                <path
                  fill='#FF3D00'
                  d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
                />
                <path
                  fill='#4CAF50'
                  d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
                />
                <path
                  fill='#1976D2'
                  d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
                />
              </svg>
              <span>Google</span>
            </Button>
          </div>
        </div>

        <div className='text-center mt-4'>
          <p className='text-sm text-gray-600'>
            Đã có tài khoản?{' '}
            <Link href='/login' className='font-medium text-primary hover:text-primary/80'>
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
