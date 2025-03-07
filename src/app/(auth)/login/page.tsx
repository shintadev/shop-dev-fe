'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Define form schema with Zod
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setAuthError('Invalid email or password');
        toast.error('Invalid email or password');
      } else {
        toast.success('Logged in successfully');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setAuthError('An error occurred. Please try again.');
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-bold text-gray-900'>Welcome back</h2>
          <p className='mt-2 text-sm text-gray-600'>Sign in to your account to continue shopping</p>
        </div>

        {authError && (
          <div className='bg-red-50 border border-red-200 text-red-700 rounded-md p-4 text-sm'>
            {authError}
          </div>
        )}

        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email address
              </label>
              <div className='mt-1'>
                <Input
                  id='email'
                  type='email'
                  autoComplete='email'
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='mt-1 relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  {...register('password')}
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' aria-hidden='true' />
                  ) : (
                    <Eye className='h-5 w-5' aria-hidden='true' />
                  )}
                </button>
                {errors.password && (
                  <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div className='text-sm'>
              <Link
                href='/forgot-password'
                className='font-medium text-primary hover:text-primary/80'
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? <Loader2 className='h-4 w-4 mr-2 animate-spin' /> : null}
              Sign in
            </Button>
          </div>

          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>Or continue with</span>
              </div>
            </div>

            <div className='mt-6'>
              <Button
                type='button'
                variant='outline'
                className='w-full'
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className='h-5 w-5 mr-2' viewBox='0 0 24 24'>
                  <g transform='matrix(1, 0, 0, 1, 27.009001, -39.238998)'>
                    <path
                      fill='#4285F4'
                      d='M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z'
                    />
                    <path
                      fill='#34A853'
                      d='M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z'
                    />
                    <path
                      fill='#FBBC05'
                      d='M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z'
                    />
                    <path
                      fill='#EA4335'
                      d='M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z'
                    />
                  </g>
                </svg>
                Google
              </Button>
            </div>
          </div>
        </form>

        <div className='text-center mt-4'>
          <p className='text-sm text-gray-600'>
            Don&apos;t have an account?{' '}
            <Link href='/register' className='font-medium text-primary hover:text-primary/80'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
