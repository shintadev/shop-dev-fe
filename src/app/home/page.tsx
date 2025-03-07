import CategoriesList from '@/components/category/CategoriesList';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedProducts from '@/components/product/FeaturedProducts';
import NewestProducts from '@/components/product/NewestProducts';
import CategorySkeleton from '@/components/ui/skeletons/CategorySkeleton';
import ProductSkeleton from '@/components/ui/skeletons/ProductSkeleton';
import { Suspense } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className='flex-1'>
      <HeroBanner />

      <div className='bg-gradient-to-b from-white to-gray-50'>
        <section className='container mx-auto py-16 px-4'>
          <div className='mb-16'>
            <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
              <div className='mb-4 md:mb-0'>
                <h2 className='text-3xl font-bold relative inline-block'>
                  <span className='relative z-10'>Featured Products</span>
                  <span className='absolute bottom-1 left-0 w-full h-3 bg-primary/10 -z-10'></span>
                </h2>
                <p className='text-gray-500 mt-2'>Our handpicked selection of quality products</p>
              </div>
              <a href='/products?featured=true' className='link-arrow text-primary'>
                View All
                <ArrowRight className='h-4 w-4' />
              </a>
            </div>
            <Suspense fallback={<ProductSkeleton count={6} />}>
              <FeaturedProducts />
            </Suspense>
          </div>

          <div className='mb-16'>
            <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
              <div className='mb-4 md:mb-0'>
                <h2 className='text-3xl font-bold relative inline-block'>
                  <span className='relative z-10'>Shop by Category</span>
                  <span className='absolute bottom-1 left-0 w-full h-3 bg-secondary/10 -z-10'></span>
                </h2>
                <p className='text-gray-500 mt-2'>Browse our wide range of categories</p>
              </div>
              <a href='/categories' className='link-arrow text-primary'>
                View All
                <ArrowRight className='h-4 w-4' />
              </a>
            </div>
            <Suspense fallback={<CategorySkeleton count={6} />}>
              <CategoriesList />
            </Suspense>
          </div>

          <div className='mb-16'>
            <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
              <div className='mb-4 md:mb-0'>
                <h2 className='text-3xl font-bold relative inline-block'>
                  <span className='relative z-10'>Newest Arrivals</span>
                  <span className='absolute bottom-1 left-0 w-full h-3 bg-accent/10 -z-10'></span>
                </h2>
                <p className='text-gray-500 mt-2'>The latest additions to our collection</p>
              </div>
              <a href='/products?sort=newest' className='link-arrow text-primary'>
                View All
                <ArrowRight className='h-4 w-4' />
              </a>
            </div>
            <Suspense fallback={<ProductSkeleton count={8} />}>
              <NewestProducts />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}
