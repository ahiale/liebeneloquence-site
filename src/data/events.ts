export type EventCategory = "atelier" | "concours";

export type LeqEvent = {
  slug: string;
  category: EventCategory;
  /** Libellé court affiché en surtitre de carte. */
  kind: string;
  title: string;
  excerpt: string;
  description: string;
  dateLabel: string;
  /** ISO 8601, utilisé pour le tri et les données structurées. */
  dateISO: string;
  timeLabel: string;
  place: string;
  capacity: string;
  level: string;
  priceLabel: string;
  program: string[];
  audience: string[];
  featured?: boolean;
};

export const EVENTS: LeqEvent[] = [
  {
    slug: "premier-atelier-leq",
    category: "atelier",
    kind: "Atelier en groupe",
    title: "L'art de captiver son auditoire",
    excerpt:
      "Techniques d'accroche, gestion du silence, rythme et présence scénique. Une soirée intense et utile, pour tous les niveaux.",
    description:
      "Une soirée intensive autour de la prise de parole publique. Au programme : techniques d'accroche, gestion du silence, rythme et présence scénique, exercices pratiques en groupe et une compétition d'éloquence finale. Tous les niveaux sont les bienvenus, aucun prérequis nécessaire.",
    dateLabel: "16 décembre 2026",
    dateISO: "2026-12-16T18:30:00+01:00",
    timeLabel: "18h30 – 21h00 (2h30 de formation)",
    place: "Paris — adresse exacte à confirmer",
    capacity: "15 participants maximum",
    level: "Tous niveaux — aucun prérequis",
    priceLabel: "À partir de 79 €",
    program: [
      "Icebreaker et mise en voix collective",
      "Techniques d'accroche : les dix premières secondes",
      "Gestion du silence, du rythme et du regard",
      "Exercices pratiques en binôme et en groupe",
      "Compétition d'éloquence finale et feedback",
    ],
    audience: [
      "Lycéens et étudiants",
      "Professionnels et entrepreneurs",
      "Toute personne qui veut oser prendre la parole",
    ],
    featured: true,
  },
  {
    slug: "atelier-structurer-son-discours",
    category: "atelier",
    kind: "Atelier en groupe",
    title: "Structurer un discours qui tient debout",
    excerpt:
      "Plan, arguments, accroche, chute : la méthode complète pour construire un propos clair et mémorable.",
    description:
      "Un atelier entièrement consacré à la construction du discours. On travaille le plan, la hiérarchie des arguments, l'accroche et la chute, puis chacun repart avec un discours structuré et testé devant le groupe.",
    dateLabel: "Novembre / décembre 2026",
    dateISO: "2026-11-20T18:30:00+01:00",
    timeLabel: "3h de formation en groupe",
    place: "Paris — lieu à confirmer",
    capacity: "12 participants maximum",
    level: "Débutant à intermédiaire",
    priceLabel: "À partir de 79 €",
    program: [
      "Les trois architectures de discours qui fonctionnent",
      "Hiérarchiser ses arguments : logos, pathos, ethos",
      "Écrire une accroche et une chute mémorables",
      "Test en conditions réelles et retours du groupe",
    ],
    audience: [
      "Étudiants en soutenance",
      "Professionnels qui pitchent régulièrement",
    ],
  },
  {
    slug: "concours-eloquence-leq",
    category: "concours",
    kind: "Concours d'éloquence",
    title: "La scène ouverte LEQ",
    excerpt:
      "Une scène, un sujet, trois minutes. Un concours ouvert pour se confronter au public et au jury.",
    description:
      "Une scène ouverte format concours : un sujet, trois minutes, un jury. L'occasion de se confronter à un vrai public dans un cadre exigeant mais bienveillant, avec un débriefing individuel à la clé.",
    dateLabel: "Premier trimestre 2027",
    dateISO: "2027-02-12T19:00:00+01:00",
    timeLabel: "Soirée — 3h",
    place: "Région parisienne — lieu à confirmer",
    capacity: "20 candidats",
    level: "Intermédiaire à confirmé",
    priceLabel: "Inscription à partir de 25 €",
    program: [
      "Tirage des sujets et temps de préparation encadré",
      "Passage sur scène de trois minutes",
      "Délibération et retours du jury",
      "Débriefing individuel écrit",
    ],
    audience: [
      "Orateurs confirmés",
      "Anciens participants aux ateliers LEQ",
    ],
  },
];

export function getEvent(slug: string): LeqEvent | undefined {
  return EVENTS.find((e) => e.slug === slug);
}

export const FEATURED_EVENT =
  EVENTS.find((e) => e.featured) ?? EVENTS[0];
