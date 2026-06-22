// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http', 
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: '172.16.8.5',
      },
      {
        protocol: 'http',
        hostname: 'intranet.naturafrig.com.br',
      },
    ],
  },
  allowedDevOrigins: ['172.16.20.232', 'localhost:3000'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // ✅ IMPORTANTE: Servir uploads estáticos
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/public/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
