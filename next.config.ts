import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Image Docker légère : le serveur et ses dépendances sont regroupés dans .next/standalone
  output: "standalone",
  // Embarqués sur le serveur : brochures (pièces jointes), polices et icônes (fiche orateur)
  outputFileTracingIncludes: { "/*": ["./assets/**/*", "./src/design/fonts/**/*", "./public/quiz/**/*"] },
  // Permet de compiler dans un autre dossier (ex. pendant que le serveur de dev tourne)
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  // Ancienne adresse de la page « Autres produits »
  async redirects() {
    return [{ source: "/autres-produits", destination: "/autres-services", permanent: true }];
  },
};

export default nextConfig;
