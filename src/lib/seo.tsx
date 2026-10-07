import type { Metadata } from "next";
import { SITE } from "@/config/site";
import type { LeqEvent, Pricing } from "@/content/schema";

/**
 * Données structurées schema.org (JSON-LD) lues par Google.
 * Testeur : https://search.google.com/test/rich-results
 */

const ORG_ID = `${SITE.url}/#organisation`;
const PERSON_ID = `${SITE.url}/#rebecca`;
const abs = (p: string) => (p.startsWith("http") ? p : `${SITE.url}${p}`);

/** Mots-clés travaillés par le site (aussi utilisés dans les métadonnées). */
export const KEYWORDS = [
  "coaching prise de parole",
  "formation éloquence",
  "préparation Grand Oral",
  "oral de BTS",
  "soutenance",
  "concours d'éloquence",
  "prise de parole en public",
  "art oratoire",
];

export function JsonLd({ data }: { data: object }) {
  // « < » échappé : le contenu ne peut pas fermer la balise script.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Organisation, formatrice et site : présents sur toutes les pages. */
export function siteGraph(pricing: Pricing, distinctions: readonly { year: string; text: string }[]) {
  const eur = (price: number) => ({ "@type": "Offer", price: price.toFixed(2), priceCurrency: "EUR" });
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": ORG_ID,
        name: SITE.name,
        alternateName: SITE.shortName,
        url: SITE.url,
        logo: abs("/apple-icon.png"),
        image: abs("/images/rebecca/pont-du-gard.jpg"),
        email: SITE.email,
        description:
          "Coaching en prise de parole et formation à l'éloquence : packs individuels, préparation au Grand Oral, à l'oral de BTS, aux soutenances et aux concours d'éloquence. En visio ou en présentiel.",
        areaServed: { "@type": "Country", name: "France" },
        availableLanguage: "fr",
        founder: { "@id": PERSON_ID },
        sameAs: [SITE.instagram, SITE.linkedin],
        knowsAbout: KEYWORDS,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Formations en prise de parole",
          itemListElement: [
            ...pricing.packs.map((p) => ({
              ...eur(p.price),
              itemOffered: { "@type": "Service", name: `Pack ${p.name} (${p.sessions} séances)`, description: p.features.join(", ") },
            })),
            {
              ...eur(pricing.grandOral.price),
              itemOffered: {
                "@type": "Service",
                name: `Préparation Grand Oral, oral de BTS et soutenance (${pricing.grandOral.sessions} séances)`,
                description: pricing.grandOral.features.join(", "),
              },
            },
          ],
        },
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: SITE.founder,
        jobTitle: "Formatrice et coach en prise de parole",
        url: abs("/a-propos"),
        image: abs("/images/rebecca/portrait-rose.jpg"),
        sameAs: [SITE.instagram, SITE.linkedin],
        worksFor: { "@id": ORG_ID },
        knowsAbout: KEYWORDS,
        award: distinctions.map((d) => `${d.text} (${d.year})`),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#site`,
        name: SITE.name,
        url: SITE.url,
        inLanguage: "fr-FR",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

export function faqLd(items: readonly (readonly [string, string])[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

/** Événement (uniquement si la date de début est connue, sinon Google le refuse). */
export function eventLd(e: LeqEvent) {
  if (!e.startsAt) return null;
  const online = /meet|zoom|visio|en ligne|teams/i.test(e.location ?? "");
  const price = e.priceLabel?.match(/(\d+(?:[.,]\d+)?)/)?.[1]?.replace(",", ".");
  const free = /gratuit/i.test(e.priceLabel ?? "");
  const url = abs(`/evenements/${e.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title ?? `Événement LEQ · ${e.dateLabel}`,
    startDate: e.startsAt,
    description: e.summary,
    url,
    image: e.image ? [abs(e.image)] : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: online ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    location: online
      ? { "@type": "VirtualLocation", url }
      : e.location
        ? { "@type": "Place", name: e.location, address: { "@type": "PostalAddress", addressLocality: e.location, addressCountry: "FR" } }
        : undefined,
    organizer: { "@id": ORG_ID, "@type": "Organization", name: SITE.name, url: SITE.url },
    performer: e.speakers.length ? e.speakers.map((s) => ({ "@type": "Person", name: s.name })) : { "@id": PERSON_ID, "@type": "Person", name: SITE.founder },
    offers:
      price || free
        ? {
            "@type": "Offer",
            price: free ? "0" : price,
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: e.registrationUrl ? abs(e.registrationUrl) : url,
          }
        : undefined,
  };
}

/** Image de partage par défaut (WhatsApp, LinkedIn, Instagram…), 1200 × 630. */
export const SHARE_IMAGE = { url: "/partage.jpg", width: 1200, height: 630, alt: "Lieben Éloquence, coaching en prise de parole" };

/** Titre, description, adresse canonique et aperçu de partage d'une page. */
export function pageMeta({ title, description, path, image, absolute = false }: { title: string; description: string; path: string; image?: string | null; absolute?: boolean }): Metadata {
  const full = absolute ? title : `${title} · ${SITE.name}`;
  const images = image ? [{ url: image, alt: title }] : [SHARE_IMAGE];
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "fr_FR", siteName: SITE.name, url: path, title: full, description, images },
    twitter: { card: "summary_large_image", title: full, description, images: images.map((i) => i.url) },
  };
}
