/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://back:3000/api/:path*",
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ `yarn build` で ESLint のエラーを無視
  },
};

module.exports = nextConfig;
