/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.ezsubcontractor.com/api/:path*', // Proxy to real API
      },
    ];
  },
  images: {
    unoptimized: true,
    domains: ['api.ezsubcontractor.com'],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
