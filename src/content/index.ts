import "server-only";
import { z } from "zod";
import eventsJson from "../../content/evenements.json";
import reviewsJson from "../../content/avis.json";
import pricingJson from "../../content/tarifs.json";
import partenairesJson from "../../content/partenaires.json";
import associationsJson from "../../content/associations.json";
import blogJson from "../../content/blog.json";
import opportunitesJson from "../../content/opportunites.json";
import defisJson from "../../content/defis.json";
import {
  ArticleSchema,
  AssociationsSchema,
  DefiSchema,
  EventSchema,
  OpportuniteSchema,
  PartenaireSchema,
  PricingSchema,
  ReviewSchema,
  type Article,
  type Defi,
  type LeqEvent,
  type Opportunite,
  type Partenaire,
  type Pricing,
  type Review,
} from "./schema";

/**
 * Point d'accès unique aux contenus du site.
 *
 * Aujourd'hui : lecture des fichiers JSON du dossier /content, vérifiés au
 * build (une faute de frappe dans un fichier fait échouer le build avec un
 * message clair, au lieu de casser une page en ligne).
 *
 * Demain : ces fonctions interrogeront l'API du SaaS. Les pages n'auront
 * pas à changer, car elles n'utilisent que ces fonctions.
 */

function parse<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Contenu invalide dans content/${file} :\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

const EVENTS = parse(z.array(EventSchema), eventsJson, "evenements.json");
const REVIEWS = parse(z.array(ReviewSchema), reviewsJson, "avis.json");
const PRICING = parse(PricingSchema, pricingJson, "tarifs.json");
const PARTENAIRES = parse(z.array(PartenaireSchema), partenairesJson, "partenaires.json");
const ASSOCIATIONS = parse(AssociationsSchema, associationsJson, "associations.json");
const ARTICLES = parse(z.array(ArticleSchema), blogJson, "blog.json");
const OPPORTUNITES = parse(z.array(OpportuniteSchema), opportunitesJson, "opportunites.json");
const DEFIS = parse(z.array(DefiSchema).min(1), defisJson, "defis.json");

/** Événements publiés, du plus proche au plus lointain (dates inconnues en dernier). */
export async function getEvents(): Promise<LeqEvent[]> {
  return EVENTS.filter((e) => e.status === "published").sort((a, b) => {
    if (a.postponed !== b.postponed) return a.postponed ? 1 : -1; // reportés en dernier
    if (!a.startsAt && !b.startsAt) return 0; // dates inconnues : ordre du fichier
    if (!a.startsAt) return 1;
    if (!b.startsAt) return -1;
    return a.startsAt.localeCompare(b.startsAt);
  });
}

export async function getEvent(slug: string): Promise<LeqEvent | undefined> {
  return (await getEvents()).find((e) => e.slug === slug);
}

/** Avis publiés, du plus récent au plus ancien. */
export async function getReviews(): Promise<Review[]> {
  return REVIEWS.filter((r) => r.status === "published").sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export async function getPricing(): Promise<Pricing> {
  return PRICING;
}

/** Articles publiés, du plus récent au plus ancien. */
export async function getArticles(): Promise<Article[]> {
  return ARTICLES.filter((a) => a.status === "published").sort((a, b) => b.date.localeCompare(a.date));
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  return (await getArticles()).find((a) => a.slug === slug);
}

/** Défis de la semaine, dans l'ordre de publication. */
export async function getDefis(): Promise<Defi[]> {
  return DEFIS;
}

/** Opportunités et ressources à publier sur Discord. */
export async function getOpportunites(): Promise<Opportunite[]> {
  return OPPORTUNITES;
}

/** Associations et groupes à choisir au paiement avec un code. */
export async function getAssociations(): Promise<string[]> {
  return ASSOCIATIONS;
}

/** Ambassadeur ou association correspondant à un code (insensible à la casse), s'il est actif. */
/** Tous les codes ambassadeurs et associations, actifs ou non (admin). */
export async function getPartenaires(): Promise<Partenaire[]> {
  return PARTENAIRES;
}

export async function getPartenaire(code: string): Promise<Partenaire | undefined> {
  const c = code.trim().toUpperCase();
  return PARTENAIRES.find((p) => p.actif && p.code === c);
}
