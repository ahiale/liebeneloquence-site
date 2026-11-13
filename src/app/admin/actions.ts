"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { estAdmin, exigerAdmin, LIEN_MINUTES, lienConnexion } from "@/lib/admin";
import { sendMail } from "@/lib/mail";
import { tooManyRequests } from "@/lib/rate-limit";
import { instantParis, programmerMessage, supprimerMessage } from "@/lib/publications-discord";
import { record } from "@/lib/store";
import type { FormState } from "@/lib/forms";
import * as T from "@/emails/templates";

/* ---------------------------------------------------------------------------
   Connexion : lien envoyé par mail (même réponse que l'adresse soit autorisée ou non)
   ------------------------------------------------------------------------- */

export async function demanderConnexion(_: FormState, data: FormData): Promise<FormState> {
  if (await tooManyRequests("admin")) return { status: "error", message: "Trop d'essais. Réessayez dans quelques minutes." };
  const email = z.string().trim().toLowerCase().email().safeParse(data.get("email"));
  if (!email.success) return { status: "error", message: "Adresse email invalide.", fields: { email: "Adresse email invalide" } };
  if (estAdmin(email.data)) {
    await sendMail({ to: email.data, ...T.adminConnexion({ lien: lienConnexion(email.data), minutes: LIEN_MINUTES }) }).catch((e) => console.error("Lien admin", e));
  }
  return { status: "success" };
}

/* ---------------------------------------------------------------------------
   Discord : messages programmés, opportunités
   ------------------------------------------------------------------------- */

const MessageSchema = z.object({
  salon: z.string().trim().min(1, "Choisissez un salon"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
  heure: z.string().regex(/^\d{2}:\d{2}$/, "Heure invalide"),
  message: z.string().trim().min(1, "Le message est vide").max(2000, "2 000 caractères maximum"),
  image: z.union([z.literal(""), z.string().trim().url("Lien d'image invalide")]).optional().default(""),
});

export async function programmer(_: FormState, data: FormData): Promise<FormState> {
  await exigerAdmin();
  const parsed = MessageSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) fields[String(i.path[0])] ??= i.message;
    return { status: "error", message: "Merci de vérifier les champs indiqués.", fields };
  }
  const d = parsed.data;
  const quand = instantParis(d.date, d.heure); // la date et l'heure saisies sont celles de Paris
  if (quand.getTime() < Date.now() - 60_000) return { status: "error", message: "Cette date est déjà passée.", fields: { date: "Date passée" } };
  await programmerMessage({ salon: d.salon, quand: quand.toISOString(), message: d.message, image: d.image || undefined });
  revalidatePath("/admin/discord");
  return { status: "success" };
}

export async function annulerMessage(data: FormData): Promise<void> {
  await exigerAdmin();
  await supprimerMessage(String(data.get("id")));
  revalidatePath("/admin/discord");
}

/** Valide une opportunité en brouillon : le robot la publie dans le forum dans les 5 minutes. */
export async function validerOpportunite(data: FormData): Promise<void> {
  await exigerAdmin();
  await record("opportunites-validees", { id: String(data.get("id")) });
  revalidatePath("/admin/discord");
}
