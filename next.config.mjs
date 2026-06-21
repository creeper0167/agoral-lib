/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        // Production — replace with your actual domain
        protocol: "https",
        hostname: "yourdomain.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
