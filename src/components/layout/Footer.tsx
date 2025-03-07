import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-white py-10'>
      <div className='container mx-auto px-40'>
        <div className='flex flex-wrap gap-8 justify-between'>
          {/* Quick Links section */}
          <div>
            <h2 className='text-lg font-bold mb-4 text-blue-600'>Liên kết nhanh</h2>
            <ul className='list-disc pl-5 space-y-2'>
              <li>
                <Link href='/home' className='text-blue-500 hover:underline'>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href='/products' className='text-blue-500 hover:underline'>
                  Cửa hàng
                </Link>
              </li>
              <li>
                <Link href='/categories' className='text-blue-500 hover:underline'>
                  Danh mục
                </Link>
              </li>
              <li>
                <Link href='/about' className='text-blue-500 hover:underline'>
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href='/contact' className='text-blue-500 hover:underline'>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service section */}
          <div>
            <h2 className='text-lg font-bold mb-4 text-blue-600'>Dịch vụ khách hàng</h2>
            <ul className='space-y-3'>
              <li className='mb-1'>
                <Link href='/faq' className='text-blue-500 hover:underline'>
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li className='mb-1'>
                <Link href='/shipping' className='text-blue-500 hover:underline'>
                  Chính sách vận chuyển
                </Link>
              </li>
              <li className='mb-1'>
                <Link href='/returns' className='text-blue-500 hover:underline'>
                  Đổi trả & Hoàn tiền
                </Link>
              </li>
              <li className='mb-1'>
                <Link href='/privacy' className='text-blue-500 hover:underline'>
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href='/terms' className='text-blue-500 hover:underline'>
                  Điều khoản & Điều kiện
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us section */}
          <div>
            <h2 className='text-lg font-bold mb-4 text-blue-600'>Liên hệ với chúng tôi</h2>
            <ul className='space-y-2'>
              <li className='flex items-center'>
                <MapPinIcon className='w-4 h-4 mr-2 flex-shrink-0' /> 123 Shop Street, Ecommerce
                City, EC 12345
              </li>
              <li className='flex items-center'>
                <PhoneIcon className='w-4 h-4 mr-2 flex-shrink-0' /> +1 (123) 456-7890
              </li>
              <li className='flex items-center'>
                <MailIcon className='w-4 h-4 mr-2 flex-shrink-0' />{' '}
                <a href='mailto:support@shopdev.com' className='text-blue-500 hover:underline'>
                  support@shopdev.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500'>
          <p>&copy; {currentYear} ShopDev. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
