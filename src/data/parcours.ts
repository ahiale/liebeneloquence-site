/** Parcours de Rebecca Lieben Ahiale : jalons, distinctions, expériences. */

export type Milestone = {
  year: string;
  title: string;
  summary: string;
  items: string[];
};

export const MILESTONES: Milestone[] = [
  {
    year: "2019",
    title: "Le début du parcours oratoire",
    summary:
      "Première fois sur la scène d'un concours d'éloquence. Tout commence là.",
    items: [
      "Double championne d'un concours national d'argumentation poétique",
      "Responsable communication du magazine scolaire",
      "Animatrice des jeux de culture générale au lycée",
      "Paire éducatrice : accompagnement des élèves à la prise de parole",
    ],
  },
  {
    year: "2022",
    title: "Révélation & montée en puissance",
    summary:
      "Une deuxième compétition qui révèle un potentiel — et fédère une vraie communauté.",
    items: [
      "Vice-championne du concours d'art oratoire au féminin",
      "Maîtrise de cérémonie et modération de conférences",
      "Organisation d'événements universitaires",
      "Responsable du club d'éloquence de l'université pendant 2 ans",
    ],
  },
  {
    year: "2023",
    title: "Reconnaissance nationale",
    summary:
      "Le travail est distingué au-delà du cercle universitaire.",
    items: [
      "Lauréate du Trophée Coup de Cœur de la meilleure compétition d'éloquence du Togo",
      "Distinctions honorifiques et apparitions dans la presse",
      "Début de la création de contenu autour de l'éloquence",
      "Membre de jury dans plusieurs concours d'art oratoire",
    ],
  },
  {
    year: "2024",
    title: "Influence & création de contenu",
    summary:
      "La parole passe de la scène à l'écran, avec des formats culturels travaillés.",
    items: [
      "Top 3 des créatrices de contenu culture générale du pays",
      "Interviews, vidéos, tournages",
      "Collaboration avec des scénaristes et créateurs de formats culturels",
    ],
  },
  {
    year: "2025",
    title: "Leadership & professionnalisation",
    summary:
      "Direction d'association, organisation de compétition et premiers accompagnements individuels.",
    items: [
      "Présidente d'Eloquentia Toulon",
      "Organisation d'une compétition d'éloquence de bout en bout : logistique, coaching, jury",
      "Lancement des cours particuliers dans le sud de la France",
      "Accompagnement de profils variés : docteurs, ingénieurs, étudiants, lycéens",
    ],
  },
];

export type Expertise = { title: string; desc: string };

export const EXPERTISES: Expertise[] = [
  {
    title: "Coach en prise de parole",
    desc: "Accompagnement personnalisé, analyse fine des discours et transmission de techniques concrètes adaptées à chaque profil.",
  },
  {
    title: "Data Analyst & profil tech",
    desc: "Analyse de données, structuration de l'information, optimisation de processus. Passionnée de Product Management et de transformation digitale.",
  },
  {
    title: "Animation & médias",
    desc: "Maîtrise de cérémonie, modération de conférences, création de contenu culturel et travail avec des équipes de production.",
  },
];

/** Chiffres clés affichés en bandeau sur la page « À propos ». */
export const FACTS = [
  { value: "2019", label: "premier concours d'éloquence" },
  { value: "6 ans", label: "de scène, de jury et de coaching" },
  { value: "5", label: "distinctions et titres remportés" },
  { value: "100 %", label: "des profils accompagnés, du lycée au doctorat" },
] as const;
