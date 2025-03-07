'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

// Define banner slide type
interface BannerSlide {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  textColor: string;
  accent?: string;
}

// Sample banner data
const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    imageUrl: '/assets/images/banner-1.jpg',
    title: 'Summer Collection',
    description: 'Discover the latest fashion trends for this season',
    buttonText: 'Shop Now',
    buttonLink: '/category/clothing',
    textColor: 'text-white',
    accent: 'from-blue-600 to-violet-600',
  },
  {
    id: 2,
    imageUrl: '/assets/images/banner-2.jpg',
    title: 'Smart Gadgets',
    description: 'Upgrade your tech with our latest electronics',
    buttonText: 'Explore',
    buttonLink: '/category/electronics',
    textColor: 'text-white',
    accent: 'from-purple-600 to-pink-600',
  },
  {
    id: 3,
    imageUrl: '/assets/images/banner-3.jpg',
    title: 'Home Essentials',
    description: 'Transform your space with our home collection',
    buttonText: 'Discover',
    buttonLink: '/category/home',
    textColor: 'text-black',
    accent: 'from-amber-500 to-orange-500',
  },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    if (index === currentSlide || isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 900);
  };

  const goToPrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
    setTimeout(() => setIsAnimating(false), 900);
  };

  const goToNextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    setTimeout(() => setIsAnimating(false), 900);
  };

  return (
    <div className='relative overflow-hidden h-[350px] md:h-[450px] lg:h-[550px]'>
      {/* Slides */}
      <div className='h-full'>
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              'absolute top-0 left-0 w-full h-full transition-all duration-700',
              index === currentSlide
                ? 'opacity-100 z-10 translate-x-0'
                : index < currentSlide || (currentSlide === 0 && index === bannerSlides.length - 1)
                ? 'opacity-0 -translate-x-full z-0'
                : 'opacity-0 translate-x-full z-0'
            )}
          >
            <div className='relative w-full h-full'>
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                priority
                sizes='100vw'
                className='object-cover object-center'
              />
              {/* Overlay */}
              <div
                className={cn('absolute inset-0 bg-gradient-to-r opacity-80', slide.accent)}
                style={{ opacity: 0.6 }}
              />

              {/* Content */}
              <div className='absolute inset-0 flex items-center justify-center md:justify-start md:pl-16 lg:pl-24'>
                <div className='text-center md:text-left max-w-lg p-6 md:p-0'>
                  <div
                    className={cn(
                      'transform transition-all duration-700 delay-100',
                      index === currentSlide
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-4 opacity-0'
                    )}
                  >
                    <h1
                      className={cn(
                        'text-4xl md:text-5xl lg:text-6xl font-bold mb-4',
                        slide.textColor
                      )}
                    >
                      {slide.title}
                    </h1>
                    <p className={cn('text-base md:text-lg mb-6 max-w-md', slide.textColor)}>
                      {slide.description}
                    </p>
                    <Link href={slide.buttonLink}>
                      <Button
                        size='lg'
                        className='font-medium px-8 rounded-full shadow-lg hover:shadow-xl transition-all'
                      >
                        {slide.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant='outline'
        size='icon'
        className='absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white/90 w-10 h-10 transition-transform hover:scale-110'
        onClick={goToPrevSlide}
        disabled={isAnimating}
      >
        <ChevronLeft className='h-5 w-5' />
      </Button>

      <Button
        variant='outline'
        size='icon'
        className='absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white/90 w-10 h-10 transition-transform hover:scale-110'
        onClick={goToNextSlide}
        disabled={isAnimating}
      >
        <ChevronRight className='h-5 w-5' />
      </Button>

      {/* Dots indicators */}
      <div className='absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3'>
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-300',
              index === currentSlide ? 'bg-white w-8' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            )}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
