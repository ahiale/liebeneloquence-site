import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SITE } from "@/config/site";
import { lire, signer } from "@/lib/jetons";
import { ADMIN_EMAIL } from "@/lib/mail";
import type { IconName } from "@/components/ui/Icons";

/**
 * Accès à l'admin (/admin) : pas de mot de passe. On saisit son adresse, on reçoit un lien de connexion
 * valable 15 minutes, et la session dure 30 jours sur cet appareil (cookie signé, inaccessible au JavaScript).
 */
export const COOKIE_ADMIN = "leq_admin";
const SESSION_JOURS = 30;
export const LIEN_MINUTES = 15;

/** Adresses autorisées à se connecter. */
const ADMINS = new Set([ADMIN_EMAIL, SITE.email].map((e) => e.trim().toLowerCase()));
export const estAdmin = (email: string) => ADMINS.has(email.trim().toLowerCase());

export const lienConnexion = (email: string) => `${SITE.url}/admin/connexion/valider?jeton=${encodeURIComponent(signer({ usage: "admin-lien", email }, LIEN_MINUTES))}`;

/** Jeton de session posé dans le cookie après un lien valide (null si le lien est expiré ou faux). */
export function sessionDepuisLien(jeton: string | null): { valeur: string; maxAge: number } | null {
  const d = lire<{ usage: string; email: string }>(jeton);
  if (!d || d.usage !== "admin-lien" || !estAdmin(d.email)) return null;
  return { valeur: signer({ usage: "admin", email: d.email }, SESSION_JOURS * 24 * 60), maxAge: SESSION_JOURS * 86400 };
}

/** Adresse de l'admin connectée ; sinon, renvoie vers la page de connexion. À appeler dans chaque page et action de l'admin. */
export async function exigerAdmin(): Promise<string> {
  const d = lire<{ usage: string; email: string }>((await cookies()).get(COOKIE_ADMIN)?.value);
  if (!d || d.usage !== "admin" || !estAdmin(d.email)) redirect("/admin/connexion");
  return d.email;
}

/** Modules de l'admin, dans l'ordre du menu. */
export const MODULES: { href: string; label: string; icone: IconName }[] = [
  { href: "/admin", label: "Tableau de bord", icone: "dashboard" },
  { href: "/admin/eleves", label: "LEQ'ORA (élèves)", icone: "graduationCap" },
  { href: "/admin/bibliotheque", label: "Bibliothèque", icone: "library" },
  { href: "/admin/discord", label: "Discord", icone: "discord" },
  { href: "/admin/communaute", label: "Communauté", icone: "users" },
  { href: "/admin/contenu", label: "Contenu du site", icone: "globe" },
  { href: "/admin/mails", label: "Mails automatiques", icone: "mail" },
];
