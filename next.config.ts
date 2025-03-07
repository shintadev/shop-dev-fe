/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'picsum.photos', 'images.unsplash.com', 'localhost'],
  },
};

module.exports = nextConfig;
