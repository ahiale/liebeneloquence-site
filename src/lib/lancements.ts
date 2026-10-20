/** Produits à venir pour lesquels on peut demander à être prévenu (formulaire « Être prévenu »). */
export const LANCEMENTS = {
  "jeu-avocat": "le jeu de cartes Avocat du diable",
  "application-mobile": "l'application mobile LEQ",
} as const;
export type Lancement = keyof typeof LANCEMENTS;

/** E-books gratuits envoyés par mail (formulaire prénom + email). */
export const EBOOKS = {
  mellie: { titre: "Mellie a le trac", fichier: "/mellie/mellie-a-le-trac.pdf" },
} as const;
export type Ebook = keyof typeof EBOOKS;
