/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://ezsubcontractor.designspartans.com/api/:path*', // Proxy to real API
      },
    ];
  },
  images: {
    domains: ['ezsubcontractor.designspartans.com'],
  },
  reactStrictMode: true,
  images: {
    domains: ['ezsubcontractor.designspartans.com'],
  },
};

module.exports = nextConfig;
