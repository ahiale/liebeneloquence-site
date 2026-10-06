import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Image Docker légère : le serveur et ses dépendances sont regroupés dans .next/standalone
  output: "standalone",
  // Les brochures (dossier assets/) doivent être embarquées pour les pièces jointes des mails
  outputFileTracingIncludes: { "/*": ["./assets/**/*"] },
  // Permet de compiler dans un autre dossier (ex. pendant que le serveur de dev tourne)
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
};

export default nextConfig;
