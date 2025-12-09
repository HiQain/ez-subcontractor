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
  reactStrictMode: true,
  // experimental: {
  //   appDir: true,
  // },
};
module.exports = nextConfig;
