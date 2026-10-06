export type Pack = {
  id: string;
  name: string;
  /** Ligne de contexte affichée sous le nom : séances + positionnement. */
  meta: string;
  priceStandard: number;
  priceStudent: number;
  /** Ex. « Paiement en 3x » */
  installment: string;
  features: string[];
  featured?: boolean;
};

export const PACKS: Pack[] = [
  {
    id: "senghor",
    name: "Senghor",
    meta: "3 séances · Pack découverte",
    priceStandard: 89,
    priceStudent: 69,
    installment: "Paiement en 3x",
    features: [
      "Culture oratoire & concepts de base",
      "Comprendre son public",
      "L'art de se vendre et du storytelling",
      "Suivi post-formation",
    ],
  },
  {
    id: "ciceron",
    name: "Cicéron",
    meta: "5 séances · Intermédiaire",
    priceStandard: 149,
    priceStudent: 119,
    installment: "Paiement en 3x",
    features: [
      "Tout le pack Senghor (optionnel)",
      "Structurer et rédiger un discours",
      "Les bases du logos, pathos, ethos",
      "Quiz & ressources inclus",
    ],
  },
  {
    id: "socrate",
    name: "Socrate",
    meta: "7 séances · Parcours complet",
    priceStandard: 225,
    priceStudent: 179,
    installment: "Paiement en 4x",
    features: [
      "Tout le pack Cicéron (optionnel)",
      "Gestion du trac et de l'improvisation",
      "Maîtrise du non-verbal & variation vocale",
      "Autre sujet au choix",
    ],
    featured: true,
  },
];

/** Offre dédiée aux épreuves orales du bac et assimilées. */
export const GRAND_ORAL = {
  id: "grand-oral",
  name: "L'offre Grand Oral",
  subtitle: "Terminale, BTS, soutenance, pitch",
  sessions: "5 séances intensives",
  duration: "50 min par séance · Sans diagnostic préalable",
  price: 120,
  installment: "Paiement en 4 fois possible",
  /** Suite de la phrase introduite par `sessions` (« 5 séances intensives … »). */
  summary:
    "dédiées aux différentes épreuves orales. Un accompagnement axé sur le fond, la forme et la prise de parole, avec des exercices pratiques et des mises en situation réelles pour gagner en aisance, structurer son discours et se préparer efficacement face au jury.",
  includes: [
    "Structuration du discours",
    "Maîtrise du fond & de la forme",
    "Verbal & non-verbal",
    "Mise en situation réelle",
    "Préparation aux questions du jury",
    "Relecture & feedback personnalisé",
  ],
} as const;

export function getPack(id: string): Pack | undefined {
  return PACKS.find((p) => p.id === id);
}
