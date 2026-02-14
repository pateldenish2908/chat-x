import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
=======
  productionBrowserSourceMaps: false,
>>>>>>> main
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
