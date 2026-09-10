/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5050",
        pathname: "/api/uploads/noticias/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5050",
        pathname: "/api/uploads/noticias/**",
      },
      {
        protocol: "http",
        hostname: "172.16.20.232",
        port: "5050",
        pathname: "/api/uploads/noticias/**",
      },
      {
        protocol: "http",
        hostname: "172.16.11.246",
        port: "5050",
        pathname: "/api/uploads/noticias/**",
      },
      {
        protocol: "http",
        hostname: "172.16.8.5",
        port: "5050",
        pathname: "/api/uploads/noticias/**",
      },
      {
        protocol: "https",
        hostname: "intranet.naturafrig.com.br",
        pathname: "/api/uploads/noticias/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5050",
        pathname: "/api/uploads/recados/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5050",
        pathname: "/api/uploads/recados/**",
      },
      {
        protocol: "http",
        hostname: "172.16.20.232",
        port: "5050",
        pathname: "/api/uploads/recados/**",
      },
      {
        protocol: "http",
        hostname: "172.16.11.246",
        port: "5050",
        pathname: "/api/uploads/recados/**",
      },
      {
        protocol: "http",
        hostname: "172.16.8.5",
        port: "5050",
        pathname: "/api/uploads/recados/**",
      },
      {
        protocol: "https",
        hostname: "intranet.naturafrig.com.br",
        pathname: "/api/uploads/recados/**",
      },
    ],
  },
  allowedDevOrigins: ["172.16.20.232", "localhost:3000", "172.16.11.246"],
  output: "standalone",
};

module.exports = nextConfig;