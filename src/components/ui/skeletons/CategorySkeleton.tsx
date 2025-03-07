import { Skeleton } from '@/components/ui/skeleton';

interface CategorySkeletonProps {
  count?: number;
}

const CategorySkeleton = ({ count = 6 }: CategorySkeletonProps) => {
  return (
    <div className='flex overflow-x-auto gap-4 pb-4'>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className='min-w-[180px] max-w-[180px]'>
            <div className='rounded-lg overflow-hidden shadow-sm bg-white'>
              <Skeleton className='w-full h-36' />
              <div className='p-3 text-center'>
                <Skeleton className='h-5 w-3/4 mx-auto mb-2' />
                <Skeleton className='h-3 w-1/2 mx-auto' />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CategorySkeleton;
