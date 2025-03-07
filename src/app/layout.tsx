import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Providers from '@/components/providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopDev - Điểm đến Thương mại điện tử Tuyệt vời của Bạn',
  description:
    'ShopDev cung cấp nhiều loại sản phẩm với giao hàng nhanh và dịch vụ khách hàng tuyệt vời',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='vi'>
      <body className={inter.className}>
        <Providers>
          <div className='flex flex-col min-h-screen bg-gray-50'>
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
