import type { NextConfig } from "next";

const nextConfig = {
  allowedDevOrigins: ["192.168.100.10"],
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;