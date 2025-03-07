'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { formatCurrency } from '@/lib/utils';
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

  return (
    <div className='group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow'>
      <Link href={`/product/${product.slug}`} className='block'>
        {/* Product image */}
        <div className='relative aspect-square bg-gray-100'>
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes='(max-width: 768px) 100vw, 300px'
              className='object-cover object-center group-hover:scale-105 transition-transform duration-300'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-gray-200'>
              <span className='text-gray-400'>No image</span>
            </div>
          )}

          {/* Sale badge */}
          {product.discountPrice && product.discountPrice < product.price && (
            <Badge className='absolute top-2 left-2 bg-red-500'>Sale</Badge>
          )}

          {/* Out of stock badge */}
          {product.stock <= 0 && (
            <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
              <Badge variant='outline' className='text-white border-white'>
                Out of Stock
              </Badge>
            </div>
          )}

          {/* Quick action buttons */}
          <div className='absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
            <Button
              size='icon'
              variant='secondary'
              className='w-8 h-8 rounded-full shadow'
              onClick={handleToggleWishlist}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            {product.stock > 0 && (
              <Button
                size='icon'
                variant='secondary'
                className='w-8 h-8 rounded-full shadow'
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                <ShoppingCart className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>

        {/* Product details */}
        <div className='p-4'>
          <h3 className='font-medium text-gray-900 mb-1 line-clamp-1'>{product.name}</h3>

          <div className='flex items-baseline'>
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

          {/* Category */}
          {product.categoryName && (
            <div className='mt-2 text-xs text-gray-500'>{product.categoryName}</div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
