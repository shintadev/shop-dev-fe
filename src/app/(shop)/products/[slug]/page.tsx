import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/product/ProductDetails';
import RelatedProducts from '@/components/product/RelatedProducts';
import { apiClient } from '@/lib/api/client';
import { Product } from '@/models/product';

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const product = await getProduct(params.slug);

    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }

    return {
      title: `${product.name} | ShopDev`,
      description: product.description.substring(0, 160),
      openGraph: {
        title: product.name,
        description: product.description.substring(0, 160),
        images: product.images.length > 0 ? [product.images[0]] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Product | ShopDev',
      description: 'Discover our wide range of products.',
    };
  }
}

// Fetch product data
async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await apiClient.get(`/products/${slug}`);
    return response.data.data;
  } catch (error) {
    return null;
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <ProductDetail product={product} />

      <div className='mt-16'>
        <h2 className='text-2xl font-bold mb-6'>Related Products</h2>
        <RelatedProducts productId={product.id} />
      </div>
    </div>
  );
}
