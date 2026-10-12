"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getPartenaire } from "@/content";
import { ADMIN_EMAIL, sendMail } from "@/lib/mail";
import { HONEYPOT, type FormState } from "@/lib/forms";
import { tooManyRequests } from "@/lib/rate-limit";
import { lienAutorisation } from "@/lib/discord";
import { lire, noterMembre, signer } from "@/lib/leqfam";
import { stripe, stripeMode, type StripeMode } from "@/lib/stripe";
import * as T from "@/emails/templates";

/* ---------------------------------------------------------------------------
   Adhésion : formule, code, conditions générales, puis connexion Discord
   ------------------------------------------------------------------------- */

const AdhesionSchema = z.object({
  formule: z.enum(["engagement", "libre"], { message: "Choisissez une formule" }),
  code: z.string().trim().max(30).optional().default(""),
  cgv: z.literal("on", { message: "Merci d'accepter les conditions générales de vente" }),
});

export async function demarrerAdhesion(_: FormState, data: FormData): Promise<FormState> {
  if (data.get(HONEYPOT)) return { status: "idle" };
  if (!stripeMode()) return { status: "error", message: "Les adhésions ne sont pas encore ouvertes." };
  if (await tooManyRequests("leqfam")) return { status: "error", message: "Trop d'essais en peu de temps. Réessayez dans quelques minutes." };
  const parsed = AdhesionSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) fields[String(i.path[0])] ??= i.message;
    return { status: "error", message: "Merci de vérifier les champs indiqués.", fields };
  }
  const { formule, code } = parsed.data;
  if (code && !(await getPartenaire(code))) {
    return { status: "error", message: "Merci de vérifier les champs indiqués.", fields: { code: "Code inconnu ou expiré. Vérifiez l'orthographe, ou laissez le champ vide." } };
  }
  const etat = signer({ formule, code: code ? code.toUpperCase() : null, cgv: new Date().toISOString() }, 30);
  redirect(lienAutorisation(etat));
}

/* ---------------------------------------------------------------------------
   Résiliation en ligne (lien envoyé par mail, puis confirmation)
   ------------------------------------------------------------------------- */

type Abonnement = { id: string; status: string; cancel_at: number | null; cancel_at_period_end: boolean; items: { data: { current_period_end: number }[] }; metadata: Record<string, string> };

export async function demanderResiliation(_: FormState, data: FormData): Promise<FormState> {
  if (data.get(HONEYPOT)) return { status: "success" };
  if (await tooManyRequests("resiliation")) return { status: "error", message: "Trop d'essais en peu de temps. Réessayez dans quelques minutes." };
  const email = z.string().trim().toLowerCase().email().safeParse(data.get("email"));
  if (!email.success) return { status: "error", message: "Adresse email invalide.", fields: { email: "Adresse email invalide" } };
  const mode = stripeMode();
  if (!mode) return { status: "success" };
  // Même réponse que l'adresse soit connue ou non (aucune information divulguée)
  try {
    const clients = await stripe<{ data: { id: string }[] }>("GET", "/customers", { email: email.data, limit: 10 });
    for (const c of clients.data) {
      const abos = await stripe<{ data: Abonnement[] }>("GET", "/subscriptions", { customer: c.id, status: "active", limit: 10 });
      for (const a of abos.data.filter((x) => x.metadata.formule)) {
        const lien = `https://liebeneloquence.com/communaute/resilier?jeton=${signer({ ab: a.id, mode }, 60 * 48)}`;
        await sendMail({ to: email.data, replyTo: ADMIN_EMAIL, ...T.leqfamLienResiliation({ lien }) });
      }
    }
  } catch (e) {
    console.error("Demande de résiliation", e);
  }
  return { status: "success" };
}

/** Date de fin d'une résiliation : fin de l'engagement s'il est en cours, sinon fin du mois payé. */
async function finDeResiliation(a: Abonnement): Promise<{ fin: number; engagement: boolean }> {
  const finPeriode = a.items.data[0]?.current_period_end ?? Math.floor(Date.now() / 1000);
  const engagementFin = a.metadata.engagement_fin ? Math.floor(new Date(`${a.metadata.engagement_fin}T00:00:00+01:00`).getTime() / 1000) : 0;
  return engagementFin > finPeriode ? { fin: engagementFin, engagement: true } : { fin: finPeriode, engagement: false };
}

export async function confirmerResiliation(_: FormState, data: FormData): Promise<FormState> {
  const jeton = lire<{ ab: string; mode: StripeMode }>(String(data.get("jeton") ?? ""));
  if (!jeton) return { status: "error", message: "Ce lien a expiré. Demandez-en un nouveau ci-dessous." };
  try {
    const a = await stripe<Abonnement>("GET", `/subscriptions/${jeton.ab}`, {}, jeton.mode);
    if (a.status !== "active") return { status: "success" };
    const { fin, engagement } = await finDeResiliation(a);
    await stripe("POST", `/subscriptions/${a.id}`, engagement ? { cancel_at: fin } : { cancel_at_period_end: true }, jeton.mode);
    const finIso = new Date(fin * 1000).toISOString().slice(0, 10);
    await noterMembre({ evenement: "resiliation_demandee", mode: jeton.mode, abonnement: a.id, discordId: a.metadata.discord_id, discordNom: a.metadata.discord_nom, finPrevue: finIso });
    const client = await stripe<{ customer: string }>("GET", `/subscriptions/${a.id}`, {}, jeton.mode);
    const c = await stripe<{ email: string | null }>("GET", `/customers/${client.customer}`, {}, jeton.mode);
    if (c.email) await sendMail({ to: c.email, replyTo: ADMIN_EMAIL, ...T.leqfamResiliation({ dateFin: finIso, engagement }) }).catch((e) => console.error(e));
    return { status: "success" };
  } catch (e) {
    console.error("Résiliation", e);
    return { status: "error", message: "La résiliation n'a pas abouti. Réessayez ou écrivez à formationn@liebeneloquence.com." };
  }
}
