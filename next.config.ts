import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixa a raiz no diretório do app (há um package-lock.json na pasta-pai
  // que confunde a detecção automática do Turbopack).
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
