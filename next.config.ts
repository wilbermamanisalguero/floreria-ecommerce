import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos del catálogo en Vercel Blob (ADR-14, CONTRATO-HU-05 D5).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        search: "",
      },
    ],
  },
};

export default nextConfig;
