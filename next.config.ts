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
  // Photos servies telles quelles (toutes déjà allégées, 125 Ko au plus) : pas de recadrage à la volée
  // sur le serveur, qui pouvait rester bloqué sur une taille et laisser l'image vide sur mobile.
  // Toute nouvelle photo dans public/ doit donc être allégée avant d'être ajoutée (1600 px de large, 150 Ko maximum).
  images: { unoptimized: true },
  // Anciennes adresses : page « Autres produits », rendez-vous mensuel passé (lien des mails d'octobre)
  async redirects() {
    return [
      { source: "/autres-produits", destination: "/autres-services", permanent: true },
      { source: "/evenements/rendez-vous-mensuel-leq-octobre-2026", destination: "/evenements/rendez-vous-mensuel-leq-novembre-2026", permanent: false },
    ];
  },
};

export default nextConfig;
