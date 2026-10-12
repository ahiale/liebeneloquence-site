import "server-only";
import { headers } from "next/headers";

/**
 * Limite le nombre d'envois de formulaires par visiteur (adresse IP) :
 * empêche un robot d'utiliser le site pour envoyer des mails en masse.
 * En mémoire : remis à zéro au redémarrage du site, ce qui suffit ici.
 *
 * Plusieurs personnes peuvent partager la même adresse IP (wifi d'une école, réseau mobile) :
 * les inscriptions (déjà protégées contre les doublons d'email) acceptent donc plus d'envois
 * que les formulaires qui vous écrivent un mail (devis, Grand Oral, contact).
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW: Record<string, number> = { evenement: 30, "liste-attente": 30, newsletter: 30, quiz: 30, leqfam: 30, resiliation: 10 };
const DEFAULT_MAX = 5; // devis, Grand Oral, séance, contact : vous recevez un mail à chaque envoi
const hits = new Map<string, number[]>();

export async function tooManyRequests(form: string): Promise<boolean> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "inconnu";
  const key = `${form}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  // Nettoyage léger pour ne pas garder d'anciennes entrées en mémoire
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  return recent.length > (MAX_PER_WINDOW[form] ?? DEFAULT_MAX);
}
