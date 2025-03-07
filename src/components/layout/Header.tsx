'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Add scroll detection for changing header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      subcategories: ['Smartphones', 'Laptops', 'Audio', 'Accessories'],
    },
    {
      name: 'Clothing',
      slug: 'clothing',
      subcategories: ["Men's", "Women's", 'Kids', 'Activewear'],
    },
    {
      name: 'Home & Kitchen',
      slug: 'home',
      subcategories: ['Furniture', 'Decor', 'Appliances', 'Kitchen'],
    },
    {
      name: 'Books',
      slug: 'books',
      subcategories: ['Fiction', 'Non-Fiction', "Children's", 'Academic'],
    },
    {
      name: 'Sports',
      slug: 'sports',
      subcategories: ['Equipment', 'Clothing', 'Footwear', 'Accessories'],
    },
    {
      name: 'Beauty',
      slug: 'beauty',
      subcategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrance'],
    },
    {
      name: 'Toys & Games',
      slug: 'toys',
      subcategories: ['Toys', 'Games', 'Puzzles', 'Outdoor Play'],
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/75 backdrop-blur-md shadow-md' : 'bg-white'
      }`}
    >
      <div className='container mx-auto px-4 py-3'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <Link href='/home' className='flex items-center'>
            <span className='text-2xl font-extrabold gradient-text'>ShopDev</span>
          </Link>

          {/* Desktop Main Navigation */}
          <nav className='hidden md:flex items-center space-x-6 ml-6 text-gray-800'>
            <Link
              href='/products'
              className={`py-2 transition-colors relative ${
                pathname === '/products'
                  ? 'text-primary font-medium'
                  : 'text-gray-800 hover:text-primary'
              }`}
            >
              All Products
              {pathname === '/products' && (
                <span className='absolute bottom-0 left-0 w-full h-0.5 bg-primary'></span>
              )}
            </Link>

            <div
              className='relative group'
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
            >
              <button
                className='flex items-center gap-1 py-2 text-gray-800 hover:text-primary transition-colors'
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              >
                Categories{' '}
                <ChevronDown className='h-4 w-4 transition-transform duration-200 group-hover:rotate-180' />
              </button>

              {isCategoryMenuOpen && (
                <div className='absolute top-full left-0 w-[700px] bg-white shadow-lg rounded-lg py-4 px-6 grid grid-cols-3 gap-x-6 gap-y-2 z-50 mt-1'>
                  {categories.map((category) => (
                    <div key={category.slug} className='py-2'>
                      <Link
                        href={`/categories/${category.slug}`}
                        className='font-medium hover:text-primary transition-colors'
                      >
                        {category.name}
                      </Link>
                      <ul className='mt-1 space-y-1'>
                        {category.subcategories.map((sub, index) => (
                          <li key={index}>
                            <Link
                              href={`/categories/${category.slug}/${sub
                                .toLowerCase()
                                .replace(/[' ]/g, '-')}`}
                              className='text-sm text-gray-600 hover:text-primary transition-colors'
                            >
                              {sub}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href='/new-arrivals'
              className={`py-2 transition-colors relative ${
                pathname === '/new-arrivals'
                  ? 'text-primary font-medium'
                  : 'text-gray-800 hover:text-primary'
              }`}
            >
              New Arrivals
              {pathname === '/new-arrivals' && (
                <span className='absolute bottom-0 left-0 w-full h-0.5 bg-primary'></span>
              )}
            </Link>

            <Link
              href='/sale'
              className={`py-2 transition-colors relative ${
                pathname === '/sale' ? 'text-primary font-medium' : 'hover:text-primary'
              }`}
            >
              <span className='text-red-500'>Sale</span>
              {pathname === '/sale' && (
                <span className='absolute bottom-0 left-0 w-full h-0.5 bg-red-500'></span>
              )}
            </Link>
          </nav>

          {/* Search Form - Hidden on mobile */}
          <form
            onSubmit={handleSearch}
            className='hidden md:flex items-center w-full max-w-sm mx-6'
          >
            <div className='relative w-full'>
              <Input
                type='text'
                placeholder='Search products...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pr-10 w-full rounded-full border-gray-200 focus:border-primary focus:ring-primary pl-5'
              />
              <Button
                type='submit'
                variant='ghost'
                size='icon'
                className='absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-primary/10'
              >
                <Search className='h-4 w-4 text-gray-500' />
              </Button>
            </div>
          </form>

          {/* Desktop User Actions */}
          <div className='hidden md:flex items-center gap-1'>
            {status === 'authenticated' ? (
              <>
                <Link href='/cart' className='relative'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='rounded-full hover:bg-primary/10 w-10 h-10'
                  >
                    <ShoppingCart className='h-5 w-5' />
                    {cartItemsCount > 0 && (
                      <span className='absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-fadeIn'>
                        {cartItemsCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link href='/profile/wishlist'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='rounded-full hover:bg-primary/10 w-10 h-10'
                  >
                    <Heart className='h-5 w-5' />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className='rounded-full hover:bg-primary/10 flex items-center gap-2 font-medium'
                    >
                      <User className='h-4 w-4' />
                      <span>Account</span>
                      <ChevronDown className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='w-56 mt-1 border-gray-200 shadow-lg rounded-lg p-1'
                  >
                    <DropdownMenuItem className='rounded-md p-2.5 focus:bg-primary/10 cursor-pointer'>
                      <Link href='/profile' className='w-full flex items-center gap-2'>
                        <User className='h-4 w-4' />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='rounded-md p-2.5 focus:bg-primary/10 cursor-pointer'>
                      <Link href='/profile/orders' className='w-full flex items-center gap-2'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='16'
                          height='16'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='h-4 w-4'
                        >
                          <rect width='16' height='20' x='4' y='2' rx='2' />
                          <path d='M9 22v-4h6v4' />
                          <path d='M8 10h8' />
                          <path d='M8 14h8' />
                          <path d='M8 6h8' />
                        </svg>
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='rounded-md p-2.5 focus:bg-primary/10 cursor-pointer'>
                      <Link href='/profile/addresses' className='w-full flex items-center gap-2'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='16'
                          height='16'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='h-4 w-4'
                        >
                          <path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' />
                          <circle cx='12' cy='10' r='3' />
                        </svg>
                        <span>My Addresses</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='rounded-md p-2.5 focus:bg-red-50 text-red-600 cursor-pointer'>
                      <Link href='/api/auth/signout' className='w-full flex items-center gap-2'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='16'
                          height='16'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='h-4 w-4'
                        >
                          <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
                          <polyline points='16 17 21 12 16 7' />
                          <line x1='21' y1='12' x2='9' y2='12' />
                        </svg>
                        <span>Sign Out</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href='/login'>
                  <Button
                    variant='ghost'
                    className='rounded-full px-5 font-medium text-gray-800 hover:bg-primary/10 hover:text-primary'
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href='/register'>
                  <Button className='rounded-full px-5 font-medium bg-primary hover:bg-primary/90'>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='flex md:hidden gap-2'>
            <Link href='/cart' className='relative'>
              <Button variant='ghost' size='icon' className='rounded-full h-10 w-10'>
                <ShoppingCart className='h-5 w-5' />
                {cartItemsCount > 0 && (
                  <span className='absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center'>
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='rounded-full h-10 w-10'
            >
              {isMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </Button>
          </div>
        </div>

        {/* Mobile search - visible only on mobile */}
        <div className='mt-3 md:hidden'>
          <form onSubmit={handleSearch} className='flex items-center'>
            <div className='relative w-full'>
              <Input
                type='text'
                placeholder='Search products...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pr-10 w-full rounded-full border-gray-200 pl-4'
              />
              <Button
                type='submit'
                variant='ghost'
                size='icon'
                className='absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full'
              >
                <Search className='h-4 w-4 text-gray-500' />
              </Button>
            </div>
          </form>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className='md:hidden mt-3 py-4 border-t animate-fadeIn'>
            <ul className='space-y-1'>
              <li>
                <Link
                  href='/products'
                  className='flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-gray-100'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='m20.2 7.8-7.7 7.7-4-4-5.7 5.7' />
                    <path d='M15 7h6v6' />
                  </svg>
                  <span className='font-medium'>All Products</span>
                </Link>
              </li>
              <li>
                <div className='px-2 py-3'>
                  <div
                    className='flex items-center justify-between rounded-lg hover:bg-gray-100 px-2 py-1 cursor-pointer'
                    onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  >
                    <div className='flex items-center gap-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <path d='M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z' />
                        <line x1='18' x2='18' y1='9' y2='15' />
                      </svg>
                      <span className='font-medium'>Categories</span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        isCategoryMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {isCategoryMenuOpen && (
                    <div className='mt-2 pl-8 space-y-2'>
                      {categories.map((category) => (
                        <div key={category.slug} className='py-1'>
                          <Link
                            href={`/categories/${category.slug}`}
                            className='font-medium hover:text-primary transition-colors'
                          >
                            {category.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </li>
              <li>
                <Link
                  href='/new-arrivals'
                  className='flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-gray-100'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M6 2h12l5 5v12a3 3 0 0 1-3 3H4a2 2 0 0 1-2-2V7l5-5Z' />
                    <path d='M6 2v5H1' />
                    <path d='M18 2v5h5' />
                    <path d='M12 18v-6' />
                    <path d='M9 15h6' />
                  </svg>
                  <span className='font-medium'>New Arrivals</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/sale'
                  className='flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-gray-100'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M9.5 2.5L11 5l-1 3h4l-1-3 1.5-2.5h-5Z' />
                    <path d='M7 15a4 4 0 0 1-4-4 8 8 0 0 1 15.3-3.2' />
                    <path d='M4.7 17.6a8 8 0 0 0 10.3-1.4' />
                    <path d='M15 13v-3h3v2' />
                    <path d='M18 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8' />
                    <path d='m16.5 14.5 2.5 2.5' />
                    <path d='m19 14.5-2.5 2.5' />
                  </svg>
                  <span className='font-medium text-red-500'>Sale</span>
                </Link>
              </li>

              {status === 'authenticated' ? (
                <>
                  <li>
                    <Link
                      href='/profile/wishlist'
                      className='flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-gray-100'
                    >
                      <Heart className='h-5 w-5' />
                      <span className='font-medium'>Wishlist</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/profile'
                      className='flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-gray-100'
                    >
                      <User className='h-5 w-5' />
                      <span className='font-medium'>My Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/profile/orders'
                      className='flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-gray-100'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <rect width='16' height='20' x='4' y='2' rx='2' />
                        <path d='M9 22v-4h6v4' />
                        <path d='M8 10h8' />
                        <path d='M8 14h8' />
                        <path d='M8 6h8' />
                      </svg>
                      <span className='font-medium'>My Orders</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/api/auth/signout'
                      className='flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-red-50 text-red-600'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
                        <polyline points='16 17 21 12 16 7' />
                        <line x1='21' y1='12' x2='9' y2='12' />
                      </svg>
                      <span className='font-medium'>Sign Out</span>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href='/login'>
                      <div className='flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-gray-100 cursor-pointer'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='20'
                          height='20'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <path d='M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4' />
                          <polyline points='10 17 15 12 10 7' />
                          <line x1='15' y1='12' x2='3' y2='12' />
                        </svg>
                        <span className='font-medium'>Sign In</span>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href='/register'>
                      <div className='flex items-center gap-2 px-2 py-3 rounded-lg bg-primary/10 text-primary cursor-pointer'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='20'
                          height='20'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                          <circle cx='9' cy='7' r='4' />
                          <line x1='19' y1='8' x2='19' y2='14' />
                          <line x1='22' y1='11' x2='16' y2='11' />
                        </svg>
                        <span className='font-medium'>Sign Up</span>
                      </div>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
