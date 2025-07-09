import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // permite qualquer domínio
      },
    ],
    // Se quiser restringir só para alguns domínios, use:
    // domains: ['media.licdn.com'],
  },
};

export default nextConfig;
