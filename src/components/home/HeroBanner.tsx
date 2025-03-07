'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

// Define banner slide type
interface BannerSlide {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  textColor: string;
}

// Sample banner data
const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    imageUrl: '/assets/images/banner-1.jpg',
    title: 'New Summer Collection',
    description: 'Discover the latest fashion trends for this season',
    buttonText: 'Shop Now',
    buttonLink: '/category/clothing',
    textColor: 'text-white',
  },
  {
    id: 2,
    imageUrl: '/assets/images/banner-2.jpg',
    title: 'Smart Gadgets',
    description: 'Upgrade your tech with our latest electronics',
    buttonText: 'Explore',
    buttonLink: '/category/electronics',
    textColor: 'text-white',
  },
  {
    id: 3,
    imageUrl: '/assets/images/banner-3.jpg',
    title: 'Home Essentials',
    description: 'Transform your space with our home collection',
    buttonText: 'Discover',
    buttonLink: '/category/home',
    textColor: 'text-black',
  },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  return (
    <div className='relative overflow-hidden h-[300px] md:h-[400px] lg:h-[500px]'>
      {/* Slides */}
      <div className='h-full'>
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
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
              <div className='absolute inset-0 bg-black bg-opacity-30' />
              <div className='absolute inset-0 flex flex-col items-center justify-center text-center p-4'>
                <h1
                  className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 ${slide.textColor}`}
                >
                  {slide.title}
                </h1>
                <p
                  className={`text-sm md:text-base lg:text-lg mb-4 md:mb-6 max-w-md ${slide.textColor}`}
                >
                  {slide.description}
                </p>
                <Link href={slide.buttonLink}>
                  <Button size='lg' className='font-medium'>
                    {slide.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant='outline'
        size='icon'
        className='absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full shadow-md hover:bg-white/90'
        onClick={goToPrevSlide}
      >
        <ChevronLeft className='h-6 w-6' />
      </Button>

      <Button
        variant='outline'
        size='icon'
        className='absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full shadow-md hover:bg-white/90'
        onClick={goToNextSlide}
      >
        <ChevronRight className='h-6 w-6' />
      </Button>

      {/* Dots indicators */}
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2'>
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentSlide ? 'bg-primary' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
