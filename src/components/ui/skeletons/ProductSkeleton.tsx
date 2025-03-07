import { Skeleton } from '@/components/ui/skeleton';

interface ProductSkeletonProps {
  count?: number;
}

const ProductSkeleton = ({ count = 4 }: ProductSkeletonProps) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className='bg-white rounded-lg shadow-sm overflow-hidden'>
            <Skeleton className='w-full h-[280px]' />
            <div className='p-4'>
              <Skeleton className='h-5 w-2/3 mb-2' />
              <Skeleton className='h-6 w-1/3 mb-2' />
              <Skeleton className='h-4 w-1/4 mt-2' />
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProductSkeleton;
