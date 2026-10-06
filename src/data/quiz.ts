/* ============================================================================
   Quiz « Quel type d'orateur êtes-vous ? »
   6 questions · 17 points maximum · 5 profils
   ========================================================================== */

export type Answer = { label: string; points: number };
export type Question = { id: number; prompt: string; answers: Answer[] };

export const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "Une prise de parole imprévue, c'est pour vous…",
    answers: [
      { label: "Une opportunité, vous vous lancez sans hésiter", points: 3 },
      {
        label: "Un défi que vous relevez après une rapide organisation mentale",
        points: 2,
      },
      { label: "Un moment stressant où vous cherchez vos mots", points: 1 },
      { label: "Une situation que vous évitez autant que possible", points: 0 },
    ],
  },
  {
    id: 2,
    prompt: "Dans une conversation, les gens remarquent surtout…",
    answers: [
      { label: "Votre capacité à convaincre et à argumenter", points: 3 },
      { label: "Votre façon de raconter des histoires qui captivent", points: 3 },
      {
        label: "Votre écoute et votre capacité à reformuler les idées des autres",
        points: 2,
      },
      {
        label: "Votre humour et votre façon de mettre les gens à l'aise",
        points: 2,
      },
      { label: "Votre discrétion, vous parlez peu", points: 0 },
    ],
  },
  {
    id: 3,
    prompt: "Avant une prise de parole importante, vous…",
    answers: [
      { label: "Écrivez tout mot pour mot et apprenez par cœur", points: 1 },
      {
        label: "Préparez un plan structuré avec les grandes idées clés",
        points: 3,
      },
      {
        label: "Vous fiez à votre instinct, sans préparation particulière",
        points: 2,
      },
      {
        label: "Répétez plusieurs fois à voix haute ou devant un miroir",
        points: 2,
      },
      {
        label: "Procrastinez et évitez d'y penser jusqu'au dernier moment",
        points: 0,
      },
    ],
  },
  {
    id: 4,
    prompt: "Ce qui vous freine le plus à l'oral aujourd'hui, c'est…",
    answers: [
      { label: "Le regard des autres posé sur vous", points: 0 },
      { label: "Perdre le fil de vos idées en cours de route", points: 1 },
      {
        label: "Les silences et les blancs qui vous mettent mal à l'aise",
        points: 1,
      },
      {
        label: "Ne pas savoir si vous convainquez vraiment votre audience",
        points: 2,
      },
      { label: "Rien de particulier, vous êtes globalement à l'aise", points: 3 },
    ],
  },
  {
    id: 5,
    prompt:
      "Si vous deviez décrire honnêtement votre prise de parole aujourd'hui…",
    answers: [
      { label: "Je parle trop vite, j'enchaîne les idées sans respirer", points: 1 },
      {
        label: "Mes idées partent dans tous les sens, je manque de structure",
        points: 1,
      },
      {
        label: "Je suis trop monotone, je manque d'expressivité et de relief",
        points: 2,
      },
      { label: "Je m'efface, je parle trop bas, je manque de présence", points: 0 },
      { label: "Je suis à l'aise, je cherche juste à me perfectionner", points: 3 },
    ],
  },
  {
    id: 6,
    prompt: "Votre objectif principal en travaillant votre prise de parole, c'est…",
    answers: [
      { label: "Oser prendre la parole sans paniquer", points: 0 },
      { label: "Structurer mes idées pour être plus clair et percutant", points: 1 },
      { label: "Captiver mon audience et marquer les esprits", points: 3 },
      { label: "Gagner en confiance et en présence à l'oral", points: 1 },
      {
        label: "Maîtriser les techniques avancées pour atteindre l'excellence",
        points: 3,
      },
    ],
  },
];

export const MAX_SCORE = 17;

export type Profile = {
  id: string;
  min: number;
  max: number;
  name: string;
  reference: string;
  level: string;
  /** Couleur d'accent du profil (badges, puces, dégradés). */
  color: string;
  description: string;
  strengths: string[];
  axes: string[];
  change: string[];
  advice: string;
  packId: string;
  /** Argumentaire du pack recommandé, affiché sur la page de résultat. */
  packPitch: string;
};

export const PROFILES: Profile[] = [
  {
    id: "silencieux",
    min: 0,
    max: 4,
    name: "L'Orateur Silencieux",
    reference: "Le jeune Malcolm",
    level: "Débutant",
    color: "#ff5e01",
    description:
      "Vous avez des choses à dire, mais quelque chose vous retient. Le potentiel est là, il attend juste d'être libéré.",
    strengths: [
      "Authenticité",
      "Capacité d'écoute et d'observation",
      "Envie réelle de progresser",
    ],
    axes: [
      "Oser prendre la parole sans se censurer",
      "Gagner en confiance face à un public",
      "Apprendre à structurer ses premières idées",
    ],
    change: [
      "Exercices progressifs dans un cadre bienveillant",
      "Techniques concrètes pour comprendre son public et adapter ses prises de parole",
      "Aisance à l'oral et accompagnement personnalisé",
    ],
    advice:
      "Commencez par des prises de parole courtes dans des environnements familiers. Chaque prise de parole, aussi petite soit-elle, est une victoire.",
    packId: "senghor",
    packPitch:
      "Un premier pas concret et efficace pour installer les bases de la confiance à l'oral.",
  },
  {
    id: "construction",
    min: 5,
    max: 8,
    name: "L'Orateur en Construction",
    reference: "Le jeune Obama",
    level: "Débutant+",
    color: "#ffbd59",
    description:
      "Vous êtes méthodique, appliqué, et vous savez ce que vous voulez améliorer. La progression est déjà dans votre ADN.",
    strengths: [
      "Sérieux et sens de la préparation",
      "Volonté réelle de progresser",
      "Écoute et réceptivité aux retours",
    ],
    axes: [
      "Gagner en fluidité et en naturel",
      "Dépasser la rigidité de la préparation",
      "Développer le verbal et le non-verbal en parallèle",
    ],
    change: [
      "Exercices pour trouver votre style propre",
      "Structurer vos prises de parole de bout en bout",
      "Accompagnement adapté à votre rythme",
    ],
    advice:
      "Travaillez la structuration de vos idées avant de vouloir convaincre. Un propos clair en 3 étapes change tout immédiatement.",
    packId: "senghor",
    packPitch:
      "Les fondations à consolider : structure, clarté et premiers automatismes de prise de parole.",
  },
  {
    id: "affirmatif",
    min: 9,
    max: 12,
    name: "L'Orateur Affirmatif",
    reference: "Le style Yann Barthès",
    level: "Intermédiaire",
    color: "#3ad07a",
    description:
      "Vous êtes à l'aise, vous avez un style qui se dessine. Il vous manque juste les outils pour passer au niveau au-dessus.",
    strengths: [
      "Aisance naturelle à l'oral",
      "Capacité à créer du lien avec votre audience",
      "Style personnel déjà identifiable",
    ],
    axes: [
      "Aller plus loin dans l'expressivité et la profondeur",
      "Maîtriser les moments à fort enjeu",
      "Travailler la variation vocale et le non-verbal",
    ],
    change: [
      "Techniques avancées de captation de l'audience",
      "Exercices de mise en situation à fort enjeu",
      "Travail sur votre signature oratoire",
    ],
    advice:
      "Travaillez l'expressivité et l'art de captiver sur la durée. Apprenez à varier les registres pour ne jamais perdre votre audience.",
    packId: "ciceron",
    packPitch:
      "Le pack qui transforme une aisance naturelle en style affirmé et maîtrisé.",
  },
  {
    id: "inspire",
    min: 13,
    max: 15,
    name: "L'Orateur Inspiré",
    reference: "Le style Chimamanda",
    level: "Confirmé",
    color: "#3d74cd",
    description:
      "Vous maîtrisez les bases et vous avez une vraie présence. Vous touchez votre audience, maintenant il faut la marquer durablement.",
    strengths: [
      "Présence naturelle et charisme à l'oral",
      "Capacité à allier intelligence et émotion",
      "Aisance dans la plupart des situations",
    ],
    axes: [
      "Affiner la précision et l'impact de chaque mot",
      "Performer dans les situations à très fort enjeu",
      "Développer une culture oratoire plus profonde",
    ],
    change: [
      "Travail sur les discours complexes et exigeants",
      "Maîtrise du verbal et du non-verbal",
      "Gestion du trac et de l'improvisation",
    ],
    advice:
      "Approfondissez votre culture oratoire et travaillez dans des conditions réelles et exigeantes. L'excellence est dans les détails.",
    packId: "socrate",
    packPitch:
      "Le parcours complet pour transformer une belle présence en impact durable.",
  },
  {
    id: "accompli",
    min: 16,
    max: 17,
    name: "L'Orateur Accompli",
    reference: "Le style Mandela",
    level: "Expert",
    color: "#ffbd59",
    description:
      "Vous n'avez plus rien à prouver, mais tout à perfectionner. Votre parole a du poids : apprenez à l'utiliser pleinement.",
    strengths: [
      "Maîtrise des bases de la prise de parole",
      "Présence scénique forte et naturelle",
      "Capacité à convaincre et à émouvoir",
    ],
    axes: [
      "Atteindre une précision chirurgicale dans le discours",
      "Se confronter aux situations les plus exigeantes",
      "Développer un leadership oratoire affirmé",
    ],
    change: [
      "Ateliers en groupe pour se confronter aux meilleurs",
      "Préparation aux concours d'éloquence et grandes scènes",
      "Coaching sur mesure pour atteindre l'excellence",
      "Gestion du trac et de l'improvisation",
    ],
    advice:
      "L'excellence se perfectionne toujours. Confrontez-vous à des contextes exigeants, croisez d'autres orateurs et continuez à grandir.",
    packId: "socrate",
    packPitch:
      "Le parcours le plus exigeant : concours, grandes scènes et leadership oratoire.",
  },
];

export function getProfile(score: number): Profile {
  return (
    PROFILES.find((p) => score >= p.min && score <= p.max) ??
    PROFILES[PROFILES.length - 1]
  );
}
