import "server-only";
import { headers } from "next/headers";

/**
 * Limite le nombre d'envois de formulaires par visiteur (adresse IP) :
 * empêche un robot d'utiliser le site pour envoyer des mails en masse.
 * En mémoire : remis à zéro au redémarrage du site, ce qui suffit ici.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
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
  return recent.length > MAX_PER_WINDOW;
}
