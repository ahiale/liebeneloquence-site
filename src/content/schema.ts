import { z } from "zod";

/**
 * Format des contenus modifiables (dossier /content).
 *
 * C'est le contrat partagé avec le futur SaaS : mêmes noms de champs,
 * mêmes types. Le SaaS stockera ces objets en base et le site les lira
 * via son API sans changer les composants.
 */

/** Statut de publication commun à tous les contenus. */
export const PublicationStatus = z.enum(["draft", "published"]);

/* ---------------------------------------------------------------------------
   Événements (content/evenements.json)
   ------------------------------------------------------------------------- */

export const EventSchema = z.object({
  /** Identifiant unique, utilisé dans l'adresse : /evenements/<slug> */
  slug: z.string().regex(/^[a-z0-9-]+$/, "minuscules, chiffres et tirets"),
  status: PublicationStatus,
  /** Type affiché en surtitre : Atelier, Masterclass, Concours… */
  type: z.string().nullable(),
  /** Titre de l'événement (null tant qu'il n'est pas annoncé). */
  title: z.string().nullable(),
  /** Date affichée telle quelle : « Décembre 2026 », « Samedi 12 décembre 2026 ». */
  dateLabel: z.string(),
  /** Date et heure de début au format ISO, si connues (sert au tri). */
  startsAt: z.string().datetime({ offset: true }).nullable(),
  /** Horaires affichés : « 18h30 à 21h ». */
  timeLabel: z.string().nullable(),
  /** Lieu affiché. */
  location: z.string().nullable(),
  /** Prix affiché : « Gratuit », « 25 € ». */
  priceLabel: z.string().nullable(),
  /** Pastille sur la photo : « Coming soon », « Complet »… */
  badge: z.string().nullable(),
  /** Photo dans /public/evenements, ex. « /evenements/atelier.jpg ». */
  image: z.string().nullable(),
  /** Texte court de la carte. */
  summary: z.string(),
  /** Description longue de la page détail, un paragraphe par ligne. */
  description: z.array(z.string()),
  /** Programme (liste), facultatif. */
  program: z.array(z.string()),
  /** Public visé (liste), facultatif. */
  audience: z.array(z.string()),
  /** Intervenants (facultatif) : nom, rôle, ce qu'ils travaillent, photo (/public/…). */
  speakers: z
    .array(z.object({ name: z.string(), role: z.string(), focus: z.array(z.string()), image: z.string().nullable() }))
    .optional()
    .default([]),
  /** Ce que les participants reçoivent (facultatif). */
  includes: z.array(z.string()).optional().default([]),
  /** Reporté : la carte s'affiche en grisé, sans réservation possible, en attendant la nouvelle date. */
  postponed: z.boolean().optional().default(false),
  /** Lien d'inscription : externe (Stripe, billetterie…) ou page du site (« /communaute#rejoindre ») ; sinon le bouton mène à la newsletter. */
  registrationUrl: z.union([z.string().url(), z.string().regex(/^\/[^\s]*$/, "lien interne commençant par /")]).nullable(),
  /** Texte du bouton d'inscription (défaut : « S'inscrire »). */
  registrationLabel: z.string().nullable().optional(),
  /**
   * Inscription gratuite par formulaire sur la page de l'événement (facultatif).
   * Le lien de la visio est envoyé par mail aux inscrits, avec un fichier agenda ; il n'est jamais affiché sur le site.
   */
  signup: z
    .object({ meetingUrl: z.string().url(), durationMinutes: z.number().int().positive().default(60) })
    .nullable()
    .optional()
    .default(null),
});
export type LeqEvent = z.infer<typeof EventSchema>;

/* ---------------------------------------------------------------------------
   Avis (content/avis.json)
   ------------------------------------------------------------------------- */

export const ReviewSchema = z.object({
  id: z.string(),
  status: PublicationStatus,
  /** Prénom et initiale : « Amina L. » */
  author: z.string(),
  /** Profil et ville : « Étudiante en master, Paris » */
  role: z.string(),
  rating: z.number().int().min(1).max(5),
  text: z.string(),
  /** Date de l'avis (AAAA-MM-JJ). */
  date: z.string().date(),
});
export type Review = z.infer<typeof ReviewSchema>;

/* ---------------------------------------------------------------------------
   Tarifs (content/tarifs.json)
   ------------------------------------------------------------------------- */

const Price = z.number().nonnegative();

export const PackSchema = z.object({
  id: z.enum(["senghor", "ciceron", "socrate"]),
  name: z.string(),
  sessions: z.number().int().positive(),
  /** « Pack découverte », « Intermédiaire », « Parcours complet » */
  level: z.string(),
  price: Price,
  /** Nombre de paiements possibles (3 → « Paiement en 3x »). */
  installments: z.number().int().positive(),
  features: z.array(z.string()),
  featured: z.boolean(),
  /** Pastille au-dessus de la carte : « Le plus complet » */
  badge: z.string().nullable(),
});
export type Pack = z.infer<typeof PackSchema>;

export const PricingSchema = z.object({
  currency: z.literal("EUR"),
  packs: z.array(PackSchema),
  grandOral: z.object({
    price: Price,
    sessions: z.number().int().positive(),
    sessionDuration: z.string(),
    installments: z.number().int().positive(),
    features: z.array(z.string()),
  }),
  /** Séance à l'unité sur un sujet précis : sans suivi ni ressources (le client choisit 1 à maxSessions séances). */
  seance: z.object({
    price: Price,
    maxSessions: z.number().int().positive(),
  }),
  leqfam: z.object({
    monthlyPrice: Price,
    /** Mention de disponibilité : « Bientôt disponible · fin octobre » (null = disponible) */
    availability: z.string().nullable(),
    partnerMonthlyPrice: Price,
    partnerDurationMonths: z.number().int().positive(),
    /** Les deux formules d'abonnement (les prix doivent correspondre à ceux créés dans Stripe). */
    formules: z.object({
      engagement: z.object({ label: z.string(), monthlyPrice: Price, engagementMonths: z.number().int().min(0) }),
      libre: z.object({ label: z.string(), monthlyPrice: Price, engagementMonths: z.number().int().min(0) }),
    }),
    /** Offre de lancement : prix du premier mois, pendant `jours` jours à partir de `debut` (AAAA-MM-JJ), pour les `places` premiers. */
    lancement: z.object({
      debut: z.string().date().nullable(),
      jours: z.number().int().positive(),
      places: z.number().int().positive(),
      prixPremierMois: Price,
    }),
  }),
});
export type Pricing = z.infer<typeof PricingSchema>;

/* ---------------------------------------------------------------------------
   Codes ambassadeurs et associations partenaires (content/partenaires.json)
   ------------------------------------------------------------------------- */

export const PartenaireSchema = z.object({
  /** Code à saisir au moment de l'adhésion (majuscules, chiffres et tirets). */
  code: z.string().regex(/^[A-Z0-9-]{3,30}$/, "majuscules, chiffres et tirets"),
  /** Nom de l'ambassadeur ou de l'association. */
  nom: z.string(),
  type: z.enum(["ambassadeur", "association"]),
  /** false : le code n'est plus accepté. */
  actif: z.boolean(),
  /** Nombre maximum d'adhésions avec ce code (20 par défaut ; null : sans limite). Au-delà, le code est refusé. */
  limite: z.number().int().positive().nullable().optional().default(20),
  note: z.string().optional(),
});
export type Partenaire = z.infer<typeof PartenaireSchema>;

/** Associations et groupes proposés au paiement quand un code est saisi (content/associations.json). */
export const AssociationsSchema = z.array(z.string().min(1));

/* ---------------------------------------------------------------------------
   Blog (content/blog.json)
   ------------------------------------------------------------------------- */

/** Bloc d'un article : intertitre, paragraphe, liste (à puces ou numérotée) ou boutons de liens. */
const BlocSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("h2"), text: z.string() }),
  z.object({ type: z.literal("p"), text: z.string() }),
  z.object({ type: z.literal("list"), numbered: z.boolean().optional().default(false), items: z.array(z.object({ title: z.string(), text: z.string() })) }),
  z.object({ type: z.literal("links"), links: z.array(z.object({ label: z.string(), href: z.string().regex(/^\/[^\s]*$/, "lien interne commençant par /") })) }),
]);

export const ArticleSchema = z.object({
  /** Identifiant, utilisé dans l'adresse : /blog/<slug> (mots-clés séparés par des tirets). */
  slug: z.string().regex(/^[a-z0-9-]+$/, "minuscules, chiffres et tirets"),
  status: PublicationStatus,
  title: z.string(),
  /** Résumé : carte du blog et description pour Google (150 caractères environ). */
  description: z.string(),
  /** Date de publication, AAAA-MM-JJ. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  readingMinutes: z.number().int().positive(),
  /** Image de l'article et de partage (dans /public). */
  image: z.string().nullable(),
  keywords: z.array(z.string()),
  blocks: z.array(BlocSchema),
});
export type Article = z.infer<typeof ArticleSchema>;

/* ---------------------------------------------------------------------------
   Opportunités et ressources pour Discord (content/opportunites.json)
   Ajoutées chaque semaine par l'agent Claude, publiées par le robot LEQ en fiches dans #ressources-et-opportunités.
   ------------------------------------------------------------------------- */

export const OpportuniteSchema = z.object({
  /** Identifiant unique (ex. « 2026-10-concours-eloquence-lyon ») : une fiche n'est publiée qu'une fois. */
  id: z.string().regex(/^[a-z0-9-]+$/, "minuscules, chiffres et tirets"),
  titre: z.string().max(100),
  /** Ce que c'est et ce qu'on y gagne, en 2 à 4 phrases. */
  resume: z.string().max(1200),
  /** Public visé : « Étudiants francophones du monde entier », « 21 à 30 ans »… */
  pourQui: z.string().max(200),
  /** « 2 novembre 2026 » ; null pour une ressource sans échéance. */
  dateLimite: z.string().max(60).nullable(),
  /** Lieu et dates de l'événement : « En ligne, 10 au 14 décembre 2026 » (facultatif). */
  lieu: z.string().max(120).nullable().optional(),
  /** Page officielle (bouton « En savoir plus »). */
  lien: z.string().url(),
  /** Étiquettes du forum : « Concours », « Opportunité internationale », « Ressource ». */
  etiquettes: z.array(z.string()).default([]),
  /** Date d'ajout, AAAA-MM-JJ. */
  ajout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** Brouillon : jamais publié dans le forum, seulement envoyé en aperçu dans #staffchat. */
  brouillon: z.boolean().optional().default(false),
});
export type Opportunite = z.infer<typeof OpportuniteSchema>;

/* ---------------------------------------------------------------------------
   Défis de la semaine (content/defis.json) : un par lundi, dans l'ordre, puis on recommence
   ------------------------------------------------------------------------- */

export const DefiSchema = z.object({ titre: z.string(), consigne: z.string(), astuce: z.string() });
export type Defi = z.infer<typeof DefiSchema>;
