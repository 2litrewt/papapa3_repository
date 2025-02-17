/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.NODE_ENV === "development"
            ? process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT
            : process.env.NEXT_PUBLIC_API_URL_PRODUCTION
        }/api/:path*`,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT
        : process.env.NEXT_PUBLIC_API_URL_PRODUCTION,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
