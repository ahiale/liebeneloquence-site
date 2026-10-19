/** Produits à venir pour lesquels on peut demander à être prévenu (formulaire « Être prévenu »). */
export const LANCEMENTS = {
  "jeu-avocat": "le jeu de cartes Avocat du diable",
  "application-mobile": "l'application mobile LEQ",
} as const;
export type Lancement = keyof typeof LANCEMENTS;
