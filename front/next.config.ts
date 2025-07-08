/** @type {import('next').NextConfig} */
const nextConfig = {

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/:path*`,
      },
    ];
  },

  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://back-main.fly.dev",
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ `yarn build` で ESLint のエラーを無視
  },

  images: {
    domains: ['localhost'], // ← 追加
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/images/**",
      },
    ],
  },
  
};

module.exports = nextConfig;
