import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sin pipeline de optimización por ahora (no hay fotos todavía).
    // Cuando se carguen las fotos reales en public/aircraft/, quitar esta
    // línea para servirlas optimizadas (salvo que se use `output: "export"`).
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
