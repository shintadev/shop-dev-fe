'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Trash2, MinusCircle, PlusCircle, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils';
import { CartItem } from '@/models/product';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cartItems, cartItemsCount, cartTotal, updateCartItem, removeFromCart, clearCart, isLoading } = useCart();
  
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate total of selected items
  const selectedItemsTotal = cartItems
    .filter(item => selectedItems[item.id])
    .reduce((total, item) => total + item.subTotal, 0);
  
  const selectedItemsCount = Object.values(selectedItems).filter(Boolean).length;
  
  const isAllSelected = cartItems.length > 0 && selectedItemsCount === cartItems.length;
  
  // Handle quantity change
  const handleQuantityChange = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem({ productId: item.productId, quantity: newQuantity });
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };
  
  // Handle item removal
  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
      // Also remove from selected items
      const newSelectedItems = { ...selectedItems };
      Object.keys(newSelectedItems).forEach(key => {
        const item = cartItems.find(item => item.id === key);
        if (item && item.productId === productId) {
          delete newSelectedItems[key];
        }
      });
      setSelectedItems(newSelectedItems);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems({});
    } else {
      const newSelectedItems: Record<string, boolean> = {};
      cartItems.forEach(item => {
        newSelectedItems[item.id] = true;
      });
      setSelectedItems(newSelectedItems);
    }
  };
  
  // Handle individual item selection
  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: checked,
    }));
  };
  
  // Handle proceed to checkout
  const handleCheckout = () => {
    if (selectedItemsCount === 0) {
      toast.error('Please select at least one item');
      return;
    }
    
    // Store selected items in session storage for checkout
    const selectedItemIds = Object.keys(selectedItems).filter(id => selectedItems[id]);
    sessionStorage.setItem('checkout_items', JSON.stringify(selectedItemIds));
    
    // Navigate to checkout
    router.push('/checkout');
  };
  
  // If not logged in
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet</p>
          <Button asChild>
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Cart with items
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Cart ({cartItemsCount} items)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="md:col-span-2 space-y-4">
          {/* Cart header */}
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
            <div className="flex items-center">
              <Checkbox 
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                id="select-all"
              />
              <label 
                htmlFor="select-all" 
                className="ml-2 text-sm font-medium cursor-pointer select-none"
              >
                Select All
              </label>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto text-red-500 hover:text-red-700 hover:bg-transparent"
              onClick={() => clearCart()}
              disabled={cartItems.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear Cart
            </Button>
          </div>
          
          {/* Cart items list */}
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start gap-4">
                {/* Item checkbox */}
                <div className="pt-1">
                  <Checkbox 
                    checked={!!selectedItems[item.id]}
                    onCheckedChange={(checked) => handleSelectItem(item.id, !!checked)}
                    id={`item-${item.id}`}
                  />
                </div>
                
                {/* Item image */}
                <div className="flex-shrink-0">
                  <Link href={`/product/${item.productSlug}`}>
                    <div className="relative h-24 w-24 bg-gray-100 rounded-md overflow-hidden">
                      {item.productImages && item.productImages.length > 0 ? (
                        <Image
                          src={item.productImages[0]}
                          alt={item.productName}
                          fill
                          sizes="96px"
                          className="object-cover object-center"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
                
                {/* Item details */}
                <div className="flex-1">
                  <Link href={`/product/${item.productSlug}`} className="text-lg font-medium text-gray-900 hover:text-primary">
                    {item.productName}
                  </Link>
                  
                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    {item.discountPrice ? (
                      <>
                        <span className="font-bold text-primary">{formatCurrency(item.discountPrice)}</span>
                        <span className="text-sm text-gray-500 line-through">{formatCurrency(item.price)}</span>
                      </>
                    ) : (
                      <span className="font-bold">{formatCurrency(item.price)}</span>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isProcessing}
                        className="p-1 text-gray-600 hover:text-primary disabled:opacity-50"
                      >
                        <MinusCircle size={18} />
                      </button>
                      <span className="px-3 py-1 text-center w-10">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        disabled={isProcessing}
                        className="p-1 text-gray-600 hover:text-primary disabled:opacity-50"
                      >
                        <PlusCircle size={18} />
                      </button>
                    </div>
                    
                    {/* Remove button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={isProcessing}
                      className="text-gray-500 hover:text-red-500 hover:bg-transparent"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order summary */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 sticky top-24">
            <h2 className="text-lg font-bold border-b pb-2">Order Summary</h2>
            
            <div className="space-y-2 py-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Selected Items:</span>
                <span>{selectedItemsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>{formatCurrency(selectedItemsTotal)}</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-primary">{formatCurrency(selectedItemsTotal)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full mt-4" 
              onClick={handleCheckout} 
              disabled={selectedItemsCount === 0 || isProcessing}
            >
              Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <div className="mt-4">
              <Link href="/products" className="text-primary hover:underline text-sm flex items-center justify-center">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
          <p className="text-gray-600 mb-6">Sign in to view your cart or start shopping</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/login?callbackUrl=/cart">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex gap-4">
                  <Skeleton className="h-24 w-24 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 sticky top-24">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>