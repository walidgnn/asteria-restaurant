import type { NextConfig } from "next";

const nextConfig = {
  allowedDevOrigins: ["192.168.100.10"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;