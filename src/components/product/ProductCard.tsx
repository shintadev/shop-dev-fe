'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { formatCurrency, cn } from '@/lib/utils';
import { Product } from '@/models/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(product.id));
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error('Please sign in to add items to your cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error('Please sign in to manage your wishlist');
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
        toast.success(`${product.name} removed from wishlist`);
      } else {
        await addToWishlist(product.id);
        setIsWishlisted(true);
        toast.success(`${product.name} added to wishlist`);
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  // Calculate discount percentage
  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div
      className='group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className='block'>
        {/* Product image */}
        <div className='relative aspect-square bg-gray-50 overflow-hidden'>
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes='(max-width: 768px) 100vw, 300px'
              className={cn(
                'object-cover object-center transition-transform duration-500',
                isHovered ? 'scale-110' : 'scale-100'
              )}
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-gray-100'>
              <span className='text-gray-400'>No image</span>
            </div>
          )}

          {/* Sale badge */}
          {product.discountPrice && product.discountPrice < product.price && (
            <div className='absolute top-2 left-2 z-10'>
              <Badge className='bg-accent text-white font-medium px-2 py-1 rounded-lg'>
                -{discountPercentage}%
              </Badge>
            </div>
          )}

          {/* Out of stock overlay */}
          {product.stock <= 0 && (
            <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10'>
              <Badge
                variant='outline'
                className='text-white border-white px-3 py-1.5 text-sm font-medium'
              >
                Out of Stock
              </Badge>
            </div>
          )}

          {/* Quick action buttons with staggered animation */}
          <div
            className={cn(
              'absolute right-2 flex flex-col gap-2 transition-all duration-500 ease-out z-20',
              isHovered ? 'opacity-100 bottom-2' : 'opacity-0 -bottom-20'
            )}
          >
            <Button
              size='icon'
              variant='secondary'
              className='w-9 h-9 rounded-full shadow-md bg-white hover:bg-primary hover:text-white transition-colors'
              onClick={handleToggleWishlist}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-all',
                  isWishlisted ? 'fill-red-500 text-red-500' : ''
                )}
              />
            </Button>

            {product.stock > 0 && (
              <Button
                size='icon'
                variant='secondary'
                className='w-9 h-9 rounded-full shadow-md bg-white hover:bg-primary hover:text-white transition-colors'
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                aria-label='Add to cart'
              >
                <ShoppingCart className='h-4 w-4' />
              </Button>
            )}

            <Link href={`/product/${product.slug}`} onClick={(e) => e.stopPropagation()}>
              <Button
                size='icon'
                variant='secondary'
                className='w-9 h-9 rounded-full shadow-md bg-white hover:bg-primary hover:text-white transition-colors'
                aria-label='View product details'
              >
                <Eye className='h-4 w-4' />
              </Button>
            </Link>
          </div>
        </div>

        {/* Product details */}
        <div className='p-4'>
          {product.categoryName && (
            <div className='text-xs text-primary/80 font-medium mb-1'>{product.categoryName}</div>
          )}

          <h3 className='font-medium text-gray-900 line-clamp-1 mb-1 transition-colors group-hover:text-primary'>
            {product.name}
          </h3>

          <div className='flex items-baseline mt-1'>
            {product.discountPrice ? (
              <>
                <span className='text-lg font-bold text-primary'>
                  {formatCurrency(product.discountPrice)}
                </span>
                <span className='ml-2 text-sm text-gray-500 line-through'>
                  {formatCurrency(product.price)}
                </span>
              </>
            ) : (
              <span className='text-lg font-bold text-gray-900'>
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
