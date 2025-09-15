import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@neondatabase/serverless"],
  },
  /* config options here */
  // in case of any issues
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

export default nextConfig;
