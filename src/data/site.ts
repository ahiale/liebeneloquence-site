/** Constantes globales du site : navigation, contacts, liens externes. */

export const SITE = {
  name: "Lieben Éloquence",
  shortName: "LEQ",
  tagline: "Parlez pour plaire, convaincre, impacter.",
  email: "contact@lieben-eloquence.fr",
  instagram: "https://www.instagram.com/",
  linkedin: "https://www.linkedin.com/",
  calendly: "https://calendly.com/",
  zone: "Région parisienne · Sud de la France · Visio",
} as const;

export const NAV = [
  { label: "Méthode", href: "/#methode" },
  { label: "Formations", href: "/#offres" },
  { label: "Événements", href: "/evenements" },
  { label: "À propos", href: "/a-propos" },
] as const;

export const FOOTER_LINKS = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Contact", href: "/#ecoles" },
  { label: "Instagram", href: SITE.instagram, external: true },
  { label: "LinkedIn", href: SITE.linkedin, external: true },
] as const;
