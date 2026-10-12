import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Accès à l'API Stripe (sans bibliothèque) pour l'abonnement LEQ'FAM.
 * LEQFAM_STRIPE choisit l'environnement : « test » (fausses cartes) ou « live » (vrais paiements).
 * Non renseigné : l'adhésion en ligne est fermée (la page Communauté reste en liste d'attente).
 */
export type StripeMode = "test" | "live";

export function stripeMode(): StripeMode | null {
  const m = process.env.LEQFAM_STRIPE;
  return m === "test" || m === "live" ? m : null;
}

function cle(mode: StripeMode): string {
  const k = mode === "live" ? process.env.STRIPE_SECRET_KEY : process.env.STRIPE_SECRET_KEY_TEST;
  if (!k || !k.startsWith(mode === "live" ? "sk_live_" : "sk_test_")) throw new Error(`Clé Stripe ${mode} absente ou incorrecte`);
  return k;
}

/** Encode un objet au format attendu par Stripe : a[b][0][c]=… */
function encoder(obj: Record<string, unknown>, prefixe = ""): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const cleParam = prefixe ? `${prefixe}[${k}]` : k;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (item !== null && typeof item === "object") out.push(...encoder(item as Record<string, unknown>, `${cleParam}[${i}]`));
        else out.push(`${encodeURIComponent(`${cleParam}[${i}]`)}=${encodeURIComponent(String(item))}`);
      });
    } else if (typeof v === "object") out.push(...encoder(v as Record<string, unknown>, cleParam));
    else out.push(`${encodeURIComponent(cleParam)}=${encodeURIComponent(String(v))}`);
  }
  return out;
}

export async function stripe<T = Record<string, unknown>>(
  method: "GET" | "POST" | "DELETE",
  chemin: string,
  params: Record<string, unknown> = {},
  mode: StripeMode | null = stripeMode(),
): Promise<T> {
  if (!mode) throw new Error("Adhésion en ligne fermée (LEQFAM_STRIPE non renseigné)");
  const corps = encoder(params).join("&");
  const url = `https://api.stripe.com/v1${chemin}${method === "GET" && corps ? `?${corps}` : ""}`;
  const r = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${cle(mode)}`, ...(method === "POST" ? { "Content-Type": "application/x-www-form-urlencoded" } : {}) },
    body: method === "POST" ? corps : undefined,
    cache: "no-store",
  });
  const data = (await r.json()) as T & { error?: { message: string } };
  if (!r.ok) throw new Error(`Stripe ${method} ${chemin} : ${data.error?.message ?? r.status}`);
  return data;
}

/** Vérifie la signature d'un webhook Stripe (en-tête Stripe-Signature) et renvoie l'environnement d'origine. */
export function verifierWebhook(corpsBrut: string, entete: string | null): StripeMode | null {
  if (!entete) return null;
  const parts = Object.fromEntries(entete.split(",").map((p) => p.split("=") as [string, string]));
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return null;
  const signatures = entete.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  for (const [mode, secret] of [["live", process.env.STRIPE_WEBHOOK_SECRET], ["test", process.env.STRIPE_WEBHOOK_SECRET_TEST]] as const) {
    if (!secret) continue;
    const attendu = Buffer.from(createHmac("sha256", secret).update(`${t}.${corpsBrut}`).digest("hex"));
    if (signatures.some((s) => s.length === attendu.length && timingSafeEqual(Buffer.from(s), attendu))) return mode;
  }
  return null;
}
