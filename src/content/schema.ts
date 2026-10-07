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
  leqfam: z.object({
    monthlyPrice: Price,
    /** Mention de disponibilité : « Bientôt disponible · fin octobre » (null = disponible) */
    availability: z.string().nullable(),
    partnerMonthlyPrice: Price,
    partnerDurationMonths: z.number().int().positive(),
  }),
});
export type Pricing = z.infer<typeof PricingSchema>;
