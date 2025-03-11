'use client';

import { useState } from 'react';
import { useNewestProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import ProductSkeleton from '@/components/ui/skeletons/ProductSkeleton';

const NewestProducts = () => {
  const { data: products, isLoading, error } = useNewestProducts();
  const [visibleCount, setVisibleCount] = useState(8);

  if (error) {
    return <ErrorDisplay message='Failed to load newest products' />;
  }

  if (isLoading) {
    return <ProductSkeleton count={8} />;
  }

  if (!products || products.length === 0) {
    return <div className='text-center py-8'>No new products available</div>;
  }

  const showMoreProducts = () => {
    setVisibleCount((prev) => Math.min(prev + 4, products.length));
  };

  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6'>
        {products.slice(0, visibleCount).map((product, index) => (
          <div
            key={product.id}
            className='animate-fadeIn'
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {visibleCount < products.length && (
        <div className='mt-10 flex justify-center'>
          <Button
            onClick={showMoreProducts}
            className='rounded-full px-6 py-6 font-medium flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors'
          >
            Show More Products <ArrowDown className='h-4 w-4 ml-1' />
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewestProducts;
