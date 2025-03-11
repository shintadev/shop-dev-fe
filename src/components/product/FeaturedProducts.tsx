'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { useFeaturedProducts } from '@/hooks/useProducts';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import ProductSkeleton from '@/components/ui/skeletons/ProductSkeleton';

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

  if (isLoading) {
    return <ProductSkeleton count={6} />;
  }

  if (!products || products.length === 0) {
    return <div className='text-center py-8'>No featured products available</div>;
  }

  return (
    <div className='relative'>
      <Button
        variant='outline'
        size='icon'
        className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full -ml-5 shadow-md hidden md:flex h-10 w-10 hover:bg-primary hover:text-white transition-colors'
        onClick={() => scroll('left')}
      >
        <ChevronLeft className='h-5 w-5' />
      </Button>

      <div
        ref={scrollContainerRef}
        className='flex overflow-x-auto gap-6 pb-4 scrollbar-hide pl-1 pr-1 -mx-1 py-1'
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className='min-w-[280px] max-w-[280px] animate-fadeIn'
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <Button
        variant='outline'
        size='icon'
        className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full -mr-5 shadow-md hidden md:flex h-10 w-10 hover:bg-primary hover:text-white transition-colors'
        onClick={() => scroll('right')}
      >
        <ChevronRight className='h-5 w-5' />
      </Button>
    </div>
  );
};

export default FeaturedProducts;


