'use client';

import { useState } from 'react';
import { useNewestProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { Button } from '@/components/ui/button';

const NewestProducts = () => {
  const { data: products, isLoading, error } = useNewestProducts();
  const [visibleCount, setVisibleCount] = useState(8);

  if (error) {
    return <ErrorDisplay message='Failed to load newest products' />;
  }

  if (isLoading || !products) {
    // Skeleton is handled by Suspense in the parent component
    return null;
  }

  const showMoreProducts = () => {
    setVisibleCount((prev) => Math.min(prev + 4, products.length));
  };

  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
        {products.slice(0, visibleCount).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {visibleCount < products.length && (
        <div className='mt-8 flex justify-center'>
          <Button onClick={showMoreProducts}>Show More Products</Button>
        </div>
      )}
    </div>
  );
};

export default NewestProducts;
