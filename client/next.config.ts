import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mui.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "another-example.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Add other valid config options here
};

export default nextConfig;
