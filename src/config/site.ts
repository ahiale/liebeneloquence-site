/**
 * Coordonnées et liens externes du site, réunis à un seul endroit.
 * Les valeurs entre crochets sont à compléter avant la mise en ligne.
 */
export const SITE = {
  name: "Lieben Éloquence",
  shortName: "LEQ",
  url: "https://liebeneloquence.com",
  email: "formationn@liebeneloquence.com",
  phone: "06 67 46 67 01",
  founder: "Rebecca Lieben Ahiale",

  calendly: "https://calendly.com/formationn-liebeneloquence/30min",
  /** Liens de paiement Stripe (à créer dans le tableau de bord Stripe). */
  stripeGrandOral: "https://buy.stripe.com/dRm7sKguQ8wA4Hm5jl2B203",
  /** Séance à l'unité : lien Stripe avec quantité réglable (le client choisit 1 à 3 séances sur la page de paiement). */
  stripeSeance: "https://buy.stripe.com/dRmbJ03I4fZ26PubHJ2B204",
  stripeLeqfam: "[LIEN STRIPE LEQ'FAM]",

  instagram: "https://www.instagram.com/becca_lieben/",
  linkedin: "https://www.linkedin.com/in/rebecca-lieben-ahiale/",
} as const;

export const NAV = [
  { label: "Méthode", href: "/#methode" },
  { label: "Formations", href: "/#offres" },
  { label: "Grand Oral", href: "/grand-oral" },
  { label: "Autres services", href: "/autres-services" },
  { label: "Communauté", href: "/communaute" },
  { label: "Événements", href: "/evenements" },
  { label: "À propos", href: "/a-propos" },
] as const;

export const FOOTER_LINKS = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
  { label: "Cookies", href: "/cookies" },
  { label: "CGV", href: "/cgv" },
  { label: "Contact", href: "/autres-services#contact" },
  { label: "Instagram", href: SITE.instagram, external: true },
  { label: "LinkedIn", href: SITE.linkedin, external: true },
] as const;

/** Vrai si le lien est encore un emplacement « [À COMPLÉTER] ». */
export const isPlaceholder = (href: string) => href.startsWith("[");

/** Lien de paiement, ou repli vers le formulaire de contact tant que le lien Stripe n'est pas renseigné. */
export const paymentHref = (href: string) => (isPlaceholder(href) ? "/autres-services#contact" : href);

/** Informations légales (page Mentions légales). */
export const LEGAL = {
  owner: "Rebecca Lieben Ahiale",
  status: "Entrepreneure individuelle",
  siren: "106 469 240",
  siret: "106 469 240 00019",
  /** Adresse professionnelle ou de domiciliation (masquée sur le site en attendant une domiciliation). */
  address: "31 avenue Saint-Jean-d'Angély, 79000 Niort",
  host: {
    name: "Contabo GmbH",
    address: "Aschauer Straße 32a, 81549 Munich, Allemagne",
    url: "https://contabo.com",
  },
} as const;
