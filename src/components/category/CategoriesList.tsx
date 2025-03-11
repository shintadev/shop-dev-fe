'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import CategorySkeleton from '@/components/ui/skeletons/CategorySkeleton';

const CategoriesList = () => {
  const { data: categories, isLoading, error } = useCategories();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 220; // Approximate width of a card + margin

      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (error) {
    return <ErrorDisplay message='Failed to load categories' />;
  }

  if (isLoading) {
    return <CategorySkeleton count={8} />;
  }

  if (!categories || categories.length === 0) {
    return <div className='text-center py-8'>No categories available</div>;
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
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className='block min-w-[180px] max-w-[180px] group'
          >
            <div className='rounded-lg overflow-hidden shadow-sm bg-white group-hover:shadow-md transition-shadow'>
              <div className='relative h-36 bg-gray-100'>
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes='180px'
                    className='object-cover object-center group-hover:scale-105 transition-transform duration-300'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-gray-200'>
                    <span className='text-gray-400'>No image</span>
                  </div>
                )}
              </div>
              <div className='p-3 text-center'>
                <h3 className='font-medium text-gray-900'>{category.name}</h3>
                {category.productCount != null && (
                  <p className='text-xs text-gray-500 mt-1'>{category.productCount} products</p>
                )}
              </div>
            </div>
          </Link>
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

export default CategoriesList;
