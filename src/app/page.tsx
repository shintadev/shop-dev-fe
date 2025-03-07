import CategoriesList from '@/components/category/CategoriesList';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedProducts from '@/components/product/FeaturedProducts';
import NewestProducts from '@/components/product/NewestProducts';
import CategorySkeleton from '@/components/ui/skeletons/CategorySkeleton';
import ProductSkeleton from '@/components/ui/skeletons/ProductSkeleton';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className='flex-1'>
      <HeroBanner />

      <section className='container mx-auto py-8 px-4'>
        <div className='mb-12'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold'>Featured Products</h2>
            <a href='/products?featured=true' className='text-primary hover:underline'>
              View All
            </a>
          </div>
          <Suspense fallback={<ProductSkeleton count={6} />}>
            <FeaturedProducts />
          </Suspense>
        </div>

        <div className='mb-12'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold'>Categories</h2>
            <a href='/categories' className='text-primary hover:underline'>
              View All
            </a>
          </div>
          <Suspense fallback={<CategorySkeleton count={6} />}>
            <CategoriesList />
          </Suspense>
        </div>

        <div className='mb-12'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold'>Newest Products</h2>
            <a href='/products?sort=newest' className='text-primary hover:underline'>
              View All
            </a>
          </div>
          <Suspense fallback={<ProductSkeleton count={8} />}>
            <NewestProducts />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

