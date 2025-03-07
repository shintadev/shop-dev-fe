'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[70vh] px-4 text-center'>
      <div className='space-y-6 max-w-md'>
        <h1 className='text-6xl font-bold text-primary'>404</h1>
        <h2 className='text-2xl font-semibold text-gray-800'>Không Tìm Thấy Trang</h2>
        <p className='text-gray-600'>
          Rất tiếc! Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>

        <div className='flex flex-wrap gap-4 justify-center mt-8'>
          <Button
            onClick={() => window.history.back()}
            variant='outline'
            className='flex items-center gap-2'
          >
            <ArrowLeft className='h-4 w-4' />
            Quay Lại
          </Button>

          <Link href='/home'>
            <Button className='flex items-center gap-2'>
              <Home className='h-4 w-4' />
              Về Trang Chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
