/** @type {import('next').NextConfig} */
const nextConfig = {

  async rewrites() {
    const api = process.env.NEXT_PUBLIC_API_URL || "https://back-main.fly.dev";
    return [
      { source: "/api/:path*", destination: `${api}/api/:path*` },
    ];
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://back-main.fly.dev",
  },
  
  eslint: {
    ignoreDuringBuilds: true, // ✅ `yarn build` で ESLint のエラーを無視
  },

  images: {
    domains: ['localhost','back-main.fly.dev'],
    formats:['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "back-main.fly.dev",
        pathname: "/**",
      }
    ],
  },
  
};

module.exports = nextConfig;
