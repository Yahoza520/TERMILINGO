import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizasyonları
  output: "standalone",
  
  // Resim optimizasyonu
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },

  // Powered by header'ını kaldır (güvenlik)
  poweredByHeader: false,

  // Sıkıştırma
  compress: true,
};

export default nextConfig;
