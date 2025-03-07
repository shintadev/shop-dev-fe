import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gray-900 text-gray-200'>
      {/* Main footer content */}
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* About section */}
          <div>
            <h3 className='text-lg font-bold mb-4'>ShopDev</h3>
            <p className='text-gray-400 mb-4'>
              Your trusted destination for quality products with excellent customer service and fast
              shipping.
            </p>
            <div className='flex space-x-4'>
              <Link
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-primary transition-colors'
              >
                <Facebook size={20} />
              </Link>
              <Link
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-primary transition-colors'
              >
                <Instagram size={20} />
              </Link>
              <Link
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-primary transition-colors'
              >
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className='text-lg font-bold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/' className='text-gray-400 hover:text-white transition-colors'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/products' className='text-gray-400 hover:text-white transition-colors'>
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href='/categories'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link href='/about' className='text-gray-400 hover:text-white transition-colors'>
                  About Us
                </Link>
              </li>
              <li>
                <Link href='/contact' className='text-gray-400 hover:text-white transition-colors'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h3 className='text-lg font-bold mb-4'>Customer Service</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/faq' className='text-gray-400 hover:text-white transition-colors'>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href='/shipping' className='text-gray-400 hover:text-white transition-colors'>
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href='/returns' className='text-gray-400 hover:text-white transition-colors'>
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href='/privacy' className='text-gray-400 hover:text-white transition-colors'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href='/terms' className='text-gray-400 hover:text-white transition-colors'>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className='text-lg font-bold mb-4'>Contact Us</h3>
            <address className='not-italic'>
              <div className='flex items-start mb-2'>
                <MapPin size={18} className='mr-2 mt-1 text-gray-400' />
                <span className='text-gray-400'>123 Shop Street, Ecommerce City, EC 12345</span>
              </div>
              <div className='flex items-center mb-2'>
                <Phone size={18} className='mr-2 text-gray-400' />
                <span className='text-gray-400'>+1 (123) 456-7890</span>
              </div>
              <div className='flex items-center mb-2'>
                <Mail size={18} className='mr-2 text-gray-400' />
                <a
                  href='mailto:support@shopdev.com'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  support@shopdev.com
                </a>
              </div>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom footer with copyright */}
      <div className='border-t border-gray-800 py-4'>
        <div className='container mx-auto px-4 text-center text-sm text-gray-500'>
          <p>&copy; {currentYear} ShopDev. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
