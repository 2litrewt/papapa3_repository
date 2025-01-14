/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://back:3000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
