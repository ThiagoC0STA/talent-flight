import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // permite qualquer domínio
      },
    ],
    // Se quiser restringir só para alguns domínios, use:
    // domains: ['media.licdn.com'],
  },

  // Redirecionamento para resolver problema do www
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.talentflight.com",
          },
        ],
        destination: "https://talentflight.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
