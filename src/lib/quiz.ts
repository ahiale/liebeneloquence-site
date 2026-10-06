/**
 * Quiz d'orateur : questions, profils et calcul du résultat.
 * Logique reprise à l'identique de la maquette V2 (Quiz.dc.html).
 * Utilisé à la fois par la page (affichage) et par le serveur (mail du résultat).
 */

export type Answer = string | number;

export type QuizOption = { label: string; tag: Answer; img: string };
export type QuizQuestion = { axis: string; text: string; options: QuizOption[] };

const img = (name: string) => `/quiz/q-${name}.svg`;

const q = (axis: string, text: string, opts: [string, Answer, string][]): QuizQuestion => ({
  axis,
  text,
  options: opts.map(([label, tag, icon]) => ({ label, tag, img: img(icon) })),
});

export const QUESTIONS: QuizQuestion[] = [
  q("Votre nature", "On vous donne la parole sans prévenir. Votre premier réflexe ?", [
    ["Je raconte une anecdote pour capter l’attention", "conteur", "book"],
    ["Je pose trois idées claires dans ma tête", "stratege", "list"],
    ["Je me lance avec énergie, on verra bien", "tribun", "zap"],
    ["J’observe d’abord qui m’écoute", "diplomate", "eye"],
  ]),
  q("Votre nature", "Dans un débat, ce qui fait votre force, c’est plutôt…", [
    ["Les exemples qui parlent à tout le monde", "conteur", "chat"],
    ["La logique de mes arguments", "stratege", "bulb"],
    ["Ma capacité à rebondir sur tout", "improvisateur", "shuffle"],
    ["Le calme et la nuance", "diplomate", "scale"],
  ]),
  q("Votre niveau", "À quelle fréquence prenez-vous la parole devant un groupe ?", [
    ["Presque jamais", 0, "moon"],
    ["Quelques fois par an", 1, "calendar"],
    ["Régulièrement", 2, "users"],
    ["C’est mon quotidien", 3, "mic"],
  ]),
  q("Votre niveau", "Le jour J, le trac, pour vous, c’est…", [
    ["Paralysant, j’évite si je peux", 0, "snow"],
    ["Présent, mais je fais avec", 1, "cloud"],
    ["Un peu de stress, vite oublié", 2, "sun"],
    ["Un carburant, j’adore ça", 3, "flame"],
  ]),
  q("Vos points à travailler", "Ce qui vous freine le plus aujourd’hui ?", [
    ["Je perds le fil de mon propos", "structure", "repeat"],
    ["Ma voix tremble, je ne sais pas quoi faire de mes mains", "nonverbal", "waves"],
    ["Les questions imprévues me déstabilisent", "impro", "help"],
    ["Je doute de la valeur de ce que j’ai à dire", "confiance", "feather"],
  ]),
  q("Votre objectif", "Pourquoi voulez-vous progresser maintenant ?", [
    ["Un examen ou un oral bientôt", "examen", "grad"],
    ["Ma vie professionnelle", "pro", "brief"],
    ["Un projet à défendre ou à pitcher", "pitch", "rocket"],
    ["Pour moi, pour oser enfin", "perso", "heart"],
  ]),
];

export type ProfileId = "conteur" | "stratege" | "tribun" | "diplomate" | "improvisateur";

export const PROFILES: Record<ProfileId, { name: string; img: string; desc: string }> = {
  conteur: { name: "Le Conteur", img: img("book"), desc: "Vous captez l’attention par les histoires et les images. Votre public se souvient de vous. Votre défi : mettre ce talent au service d’un message clair." },
  stratege: { name: "Le Stratège", img: img("bulb"), desc: "Vous construisez avant de parler et vos arguments tiennent debout. Votre défi : toucher autant que convaincre, et oser l’émotion." },
  tribun: { name: "Le Tribun", img: img("mic"), desc: "Vous avez de l’énergie et de la présence. Quand vous parlez, la salle se réveille. Votre défi : canaliser cette force et structurer votre propos." },
  diplomate: { name: "Le Diplomate", img: img("users"), desc: "Vous écoutez, vous nuancez, vous rassemblez. On vous fait confiance. Votre défi : affirmer votre voix et prendre davantage de place." },
  improvisateur: { name: "L’Improvisateur", img: img("zap"), desc: "Vous êtes à l’aise dans l’imprévu et rebondissez sur tout. Votre défi : préparer sans perdre votre spontanéité." },
};

const POINTS = {
  structure: { title: "Structurer son discours", desc: "Un plan clair, une accroche et une chute mémorables." },
  nonverbal: { title: "Voix et non-verbal", desc: "Poser sa voix, ancrer son corps, occuper l’espace." },
  impro: { title: "Improvisation", desc: "Répondre aux questions avec calme et assurance." },
  confiance: { title: "Confiance et légitimité", desc: "Croire en la valeur de ce que vous avez à dire." },
  trac: { title: "Gestion du trac", desc: "Transformer la pression en énergie positive." },
  ethos: { title: "Toucher son public", desc: "Allier logos, pathos et ethos pour convaincre." },
};

const LEVELS = [
  { name: "Orateur en éveil", width: "33%", desc: "Vous posez les premières bases. Chaque séance vous fera gagner en aisance." },
  { name: "Orateur en progression", width: "66%", desc: "Vous avez des acquis solides. Il est temps de les affiner et de gagner en impact." },
  { name: "Orateur confirmé", width: "92%", desc: "Vous êtes à l’aise à l’oral. On travaille la finesse, la présence et l’impact." },
];

const PACK_NAMES = ["Senghor", "Cicéron", "Socrate"] as const;

export type QuizResult = {
  profileId: ProfileId;
  profile: (typeof PROFILES)[ProfileId];
  level: (typeof LEVELS)[number];
  points: { title: string; desc: string }[];
  /** Pack conseillé (non affiché dans la maquette, transmis à Rebecca). */
  pack: (typeof PACK_NAMES)[number];
};

/** Vrai si les 6 réponses sont valides. */
export function isComplete(a: Answer[]): boolean {
  return a.length === QUESTIONS.length && QUESTIONS.every((qq, i) => qq.options.some((o) => o.tag === a[i]));
}

export function computeResult(a: Answer[]): QuizResult {
  const count: Record<string, number> = {};
  [0, 1].forEach((i) => {
    if (a[i] !== undefined) count[a[i]] = (count[a[i]] || 0) + (i === 0 ? 1.1 : 1);
  });
  const best = (Object.keys(count).sort((x, y) => count[y] - count[x])[0] || "conteur") as ProfileId;

  const lv = Number(a[2] || 0) + Number(a[3] || 0);
  const levelIdx = lv <= 2 ? 0 : lv <= 4 ? 1 : 2;

  const pts: { title: string; desc: string }[] = [];
  const frein = a[4] as keyof typeof POINTS | undefined;
  if (frein && POINTS[frein]) pts.push(POINTS[frein]);
  if (Number(a[3] || 0) <= 1) pts.push(POINTS.trac);
  if (best === "stratege") pts.push(POINTS.ethos);
  if (best !== "stratege" && best !== "diplomate" && frein !== "structure") pts.push(POINTS.structure);
  if (best === "diplomate" && frein !== "confiance") pts.push(POINTS.confiance);
  const points = pts.slice(0, 3);

  const packIdx = points.length >= 3 && levelIdx < 2 ? 2 : levelIdx;

  return { profileId: best, profile: PROFILES[best], level: LEVELS[levelIdx], points, pack: PACK_NAMES[packIdx] };
}

/** Réponses lisibles (question → réponse) pour le mail à Rebecca. */
export function describeAnswers(a: Answer[]): [string, string][] {
  return QUESTIONS.map((qq, i) => [qq.text, qq.options.find((o) => o.tag === a[i])?.label ?? "?"]);
}
