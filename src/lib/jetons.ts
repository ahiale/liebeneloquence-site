import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Jetons signés : liens entre le site, Discord et Stripe (adhésion, résiliation) et connexion à l'admin.
 * Le jeton contient ses données et sa date d'expiration ; la signature HMAC (clé DATA_API_KEY) empêche toute falsification.
 * Ne pas changer la clé dérivée (« leqfam ») : les liens de résiliation déjà envoyés par mail deviendraient invalides.
 */
const SECRET = () => createHmac("sha256", process.env.DATA_API_KEY ?? "").update("leqfam").digest();

export function signer(donnees: Record<string, unknown>, minutes: number): string {
  const corps = Buffer.from(JSON.stringify({ ...donnees, exp: Date.now() + minutes * 60_000 })).toString("base64url");
  return `${corps}.${createHmac("sha256", SECRET()).update(corps).digest("base64url")}`;
}

export function lire<T>(jeton: string | null | undefined): T | null {
  if (!jeton) return null;
  const [corps, sig] = jeton.split(".");
  if (!corps || !sig) return null;
  const attendu = Buffer.from(createHmac("sha256", SECRET()).update(corps).digest("base64url"));
  if (sig.length !== attendu.length || !timingSafeEqual(Buffer.from(sig), attendu)) return null;
  const d = JSON.parse(Buffer.from(corps, "base64url").toString()) as T & { exp: number };
  return d.exp > Date.now() ? d : null;
}
