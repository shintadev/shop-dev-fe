'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { useFeaturedProducts } from '@/hooks/useProducts';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

const FeaturedProducts = () => {
  const { data: products, isLoading, error } = useFeaturedProducts();
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
    return <ErrorDisplay message='Failed to load featured products' />;
  }

  if (isLoading || !products) {
    // Skeleton is handled by Suspense in the parent component
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

export default FeaturedProducts;
