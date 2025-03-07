'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  MinusCircle,
  PlusCircle,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Product } from '@/models/product';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { formatCurrency, calculateDiscountPercentage, stripHtml } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(product.id));
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showBuyNowDialog, setShowBuyNowDialog] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const discountPercentage = product.discountPrice
    ? calculateDiscountPercentage(product.price, product.discountPrice)
    : 0;

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!session) {
      setShowAuthDialog(true);
      return;
    }

    if (isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }

    setIsLoading(true);
    try {
      await addToCart({ productId: product.id, quantity });
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add product to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!session) {
      setShowAuthDialog(true);
      return;
    }

    if (isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }

    setShowBuyNowDialog(true);
  };

  const handleContinueAnonCheckout = async () => {
    // Add to cart first
    try {
      await addToCart({ productId: product.id, quantity });
      router.push('/checkout');
    } catch (error) {
      toast.error('Failed to proceed to checkout');
    }
  };

  const handleToggleWishlist = async () => {
    if (!session) {
      setShowAuthDialog(true);
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

  const handleLoginRedirect = () => {
    router.push(`/login?callbackUrl=/product/${product.slug}`);
  };

  const handleRegisterRedirect = () => {
    router.push(`/register?callbackUrl=/product/${product.slug}`);
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12'>
      {/* Product images */}
      <div className='space-y-4'>
        <div className='relative aspect-square bg-gray-100 rounded-lg overflow-hidden'>
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              sizes='(max-width: 768px) 100vw, 600px'
              className='object-contain object-center'
              priority
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-gray-200'>
              <span className='text-gray-400'>No image</span>
            </div>
          )}

          {isOutOfStock && (
            <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
              <Badge variant='outline' className='text-white border-white text-lg py-1 px-3'>
                Out of Stock
              </Badge>
            </div>
          )}

          {discountPercentage > 0 && (
            <Badge className='absolute top-4 left-4 bg-red-500 text-white'>
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>

        {/* Thumbnail images */}
        {product.images.length > 1 && (
          <div className='flex space-x-2 overflow-x-auto pb-2'>
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative w-20 h-20 border-2 rounded-md overflow-hidden flex-shrink-0 ${
                  selectedImage === image ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image}
                  alt={`${product.name} - view ${index + 1}`}
                  fill
                  sizes='80px'
                  className='object-cover object-center'
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product details */}
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>{product.name}</h1>
          <div className='mt-1'>
            <Link
              href={`/category/${product.categorySlug}`}
              className='text-primary hover:underline'
            >
              {product.categoryName}
            </Link>
          </div>
        </div>

        {/* Price */}
        <div className='flex items-baseline'>
          {product.discountPrice ? (
            <>
              <span className='text-2xl font-bold text-primary'>
                {formatCurrency(product.discountPrice)}
              </span>
              <span className='ml-2 text-lg text-gray-500 line-through'>
                {formatCurrency(product.price)}
              </span>
              <span className='ml-2 text-sm bg-red-100 text-red-800 px-2 py-0.5 rounded-md'>
                Save {discountPercentage}%
              </span>
            </>
          ) : (
            <span className='text-2xl font-bold text-gray-900'>
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {/* Stock status */}
        <div className='flex items-center space-x-2'>
          {isOutOfStock ? (
            <>
              <AlertCircle className='text-red-500 h-5 w-5' />
              <span className='text-red-500'>Out of stock</span>
            </>
          ) : (
            <>
              <Check className='text-green-500 h-5 w-5' />
              <span className='text-green-600'>In stock ({product.stock} available)</span>
            </>
          )}
        </div>

        {/* Description */}
        <div className='prose prose-sm max-w-none text-gray-600'>
          {stripHtml(product.description)}
        </div>

        {/* Quantity selector */}
        {!isOutOfStock && (
          <div className='flex items-center space-x-4'>
            <span className='text-gray-700'>Quantity:</span>
            <div className='flex items-center border border-gray-300 rounded-md'>
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className='p-2 text-gray-600 hover:text-primary disabled:opacity-50'
              >
                <MinusCircle size={20} />
              </button>
              <span className='px-4 py-2 text-center w-12'>{quantity}</span>
              <button
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
                className='p-2 text-gray-600 hover:text-primary disabled:opacity-50'
              >
                <PlusCircle size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className='flex flex-wrap gap-4'>
          <Button onClick={handleAddToCart} disabled={isOutOfStock || isLoading} className='flex-1'>
            <ShoppingBag className='mr-2 h-5 w-5' />
            Add to Cart
          </Button>

          <Button
            onClick={handleBuyNow}
            disabled={isOutOfStock || isLoading}
            variant='secondary'
            className='flex-1'
          >
            Buy Now
          </Button>

          <Button
            onClick={handleToggleWishlist}
            variant='outline'
            className={`w-12 flex-shrink-0 ${isWishlisted ? 'bg-red-50' : ''}`}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>

        {/* Additional info */}
        <div className='bg-gray-50 rounded-lg p-4 space-y-3'>
          <div className='flex items-start space-x-2'>
            <Truck className='h-5 w-5 text-gray-600 mt-0.5' />
            <div>
              <span className='text-sm font-medium'>Free delivery</span>
              <p className='text-xs text-gray-500'>Orders over $50 qualify for free shipping</p>
            </div>
          </div>

          <div className='flex items-start space-x-2'>
            <RotateCcw className='h-5 w-5 text-gray-600 mt-0.5' />
            <div>
              <span className='text-sm font-medium'>Easy returns</span>
              <p className='text-xs text-gray-500'>30 day return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>You need to be signed in to perform this action.</DialogDescription>
          </DialogHeader>
          <div className='flex flex-col space-y-4 mt-4'>
            <Button onClick={handleLoginRedirect}>Sign In</Button>
            <Button variant='outline' onClick={handleRegisterRedirect}>
              Create an Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Buy now dialog */}
      <Dialog open={showBuyNowDialog} onOpenChange={setShowBuyNowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Continue with checkout</DialogTitle>
            <DialogDescription>
              Would you like to continue with your existing account or proceed without signing in?
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col space-y-4 mt-4'>
            <Button onClick={handleContinueAnonCheckout}>Continue to Checkout</Button>
            <Button variant='outline' onClick={() => setShowBuyNowDialog(false)}>
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
