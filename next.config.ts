import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // AVIF/WebP para las fotos del catálogo (más ligeras en datos móviles)
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    // Videos, pósters y logos rara vez cambian: caché de 7 días en el navegador/CDN
    const cache = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
    return [
      { source: "/media/:path*", headers: cache },
      { source: "/brand/:path*", headers: cache },
    ];
  },
};

export default nextConfig;
