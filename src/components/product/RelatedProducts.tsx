'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { useRelatedProducts } from '@/hooks/useProducts';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedProductsProps {
  productId: string;
  limit?: number;
}

const RelatedProducts = ({ productId, limit = 6 }: RelatedProductsProps) => {
  const { data: products, isLoading, error } = useRelatedProducts(productId, limit);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 320; // Approximate width of a card + margin

      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (error) {
    return <ErrorDisplay message='Failed to load related products' />;
  }

  if (isLoading) {
    return (
      <div className='flex overflow-x-auto gap-4 pb-4'>
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div key={index} className='min-w-[280px] max-w-[280px]'>
              <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
                <Skeleton className='w-full h-[280px]' />
                <div className='p-4'>
                  <Skeleton className='h-5 w-2/3 mb-2' />
                  <Skeleton className='h-6 w-1/3 mb-2' />
                  <Skeleton className='h-4 w-1/4 mt-2' />
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className='relative'>
      <Button
        variant='outline'
        size='icon'
        className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full -ml-4 shadow-md hidden md:flex'
        onClick={() => scroll('left')}
      >
        <ChevronLeft className='h-6 w-6' />
      </Button>

      <div ref={scrollContainerRef} className='flex overflow-x-auto gap-4 pb-4 scrollbar-hide'>
        {products.map((product) => (
          <div key={product.id} className='min-w-[280px] max-w-[280px]'>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <Button
        variant='outline'
        size='icon'
        className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full -mr-4 shadow-md hidden md:flex'
        onClick={() => scroll('right')}
      >
        <ChevronRight className='h-6 w-6' />
      </Button>
    </div>
  );
};

export default RelatedProducts;
