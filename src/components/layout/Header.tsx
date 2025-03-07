'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { cartItemsCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='text-xl font-bold text-primary'>
            ShopDev
          </Link>

          {/* Search Form - Hidden on mobile */}
          <form
            onSubmit={handleSearch}
            className='hidden md:flex items-center w-full max-w-lg mx-4'
          >
            <div className='relative w-full'>
              <Input
                type='text'
                placeholder='Search products...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pr-10 w-full'
              />
              <Button type='submit' variant='ghost' size='icon' className='absolute right-0 top-0'>
                <Search className='h-5 w-5' />
              </Button>
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center gap-4'>
            {status === 'authenticated' ? (
              <>
                <Link href='/cart' className='relative'>
                  <Button variant='ghost' size='icon'>
                    <ShoppingCart className='h-5 w-5' />
                    {cartItemsCount > 0 && (
                      <span className='absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center'>
                        {cartItemsCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link href='/profile/wishlist'>
                  <Button variant='ghost' size='icon'>
                    <Heart className='h-5 w-5' />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                      <User className='h-5 w-5' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem>
                      <Link href='/profile' className='w-full'>
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href='/profile/orders' className='w-full'>
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href='/profile/addresses' className='w-full'>
                        My Addresses
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href='/api/auth/signout' className='w-full'>
                        Sign Out
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href='/login'>
                  <Button variant='outline'>Sign In</Button>
                </Link>
                <Link href='/register'>
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className='flex md:hidden'>
            <Button variant='ghost' size='icon' onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </Button>
          </div>
        </div>

        {/* Mobile search - visible only on mobile */}
        <div className='mt-4 md:hidden'>
          <form onSubmit={handleSearch} className='flex items-center'>
            <div className='relative w-full'>
              <Input
                type='text'
                placeholder='Search products...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pr-10 w-full'
              />
              <Button type='submit' variant='ghost' size='icon' className='absolute right-0 top-0'>
                <Search className='h-5 w-5' />
              </Button>
            </div>
          </form>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className='md:hidden mt-4 py-4 border-t'>
            <ul className='space-y-4'>
              <li>
                <Link href='/products' className='block py-2'>
                  All Products
                </Link>
              </li>
              <li>
                <Link href='/categories' className='block py-2'>
                  Categories
                </Link>
              </li>
              {status === 'authenticated' ? (
                <>
                  <li className='flex items-center gap-2'>
                    <Link href='/cart' className='block py-2'>
                      Cart ({cartItemsCount})
                    </Link>
                  </li>
                  <li>
                    <Link href='/profile/wishlist' className='block py-2'>
                      Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link href='/profile' className='block py-2'>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link href='/profile/orders' className='block py-2'>
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link href='/api/auth/signout' className='block py-2'>
                      Sign Out
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href='/login' className='block py-2'>
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link href='/register' className='block py-2'>
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>

      {/* Category navigation bar */}
      <div className='hidden md:block bg-gray-100 border-t border-b'>
        <div className='container mx-auto px-4'>
          <nav className='flex space-x-6 overflow-x-auto py-3 scrollbar-hide'>
            <Link href='/products' className='whitespace-nowrap hover:text-primary font-medium'>
              All Products
            </Link>
            <Link href='/categories/electronics' className='whitespace-nowrap hover:text-primary'>
              Electronics
            </Link>
            <Link href='/categories/clothing' className='whitespace-nowrap hover:text-primary'>
              Clothing
            </Link>
            <Link href='/categories/home' className='whitespace-nowrap hover:text-primary'>
              Home & Kitchen
            </Link>
            <Link href='/categories/books' className='whitespace-nowrap hover:text-primary'>
              Books
            </Link>
            <Link href='/categories/sports' className='whitespace-nowrap hover:text-primary'>
              Sports
            </Link>
            <Link href='/categories/beauty' className='whitespace-nowrap hover:text-primary'>
              Beauty
            </Link>
            <Link href='/categories/toys' className='whitespace-nowrap hover:text-primary'>
              Toys & Games
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
