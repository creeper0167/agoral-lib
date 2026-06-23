/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local dev
      { protocol: "http",  hostname: "localhost", port: "5000", pathname: "/uploads/**" },
      // Production backend
      { protocol: "https", hostname: "lib.fanavaranpars.com", pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;
