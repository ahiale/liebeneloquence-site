"use server";

import { z } from "zod";
import { estAdmin, LIEN_MINUTES, lienConnexion } from "@/lib/admin";
import { sendMail } from "@/lib/mail";
import { tooManyRequests } from "@/lib/rate-limit";
import type { FormState } from "@/lib/forms";
import * as T from "@/emails/templates";

/** Connexion : lien envoyé par mail (même réponse que l'adresse soit autorisée ou non). Les actions de chaque module sont dans son dossier. */
export async function demanderConnexion(_: FormState, data: FormData): Promise<FormState> {
  if (await tooManyRequests("admin")) return { status: "error", message: "Trop d'essais. Réessayez dans quelques minutes." };
  const email = z.string().trim().toLowerCase().email().safeParse(data.get("email"));
  if (!email.success) return { status: "error", message: "Adresse email invalide.", fields: { email: "Adresse email invalide" } };
  if (estAdmin(email.data)) {
    await sendMail({ to: email.data, ...T.adminConnexion({ lien: lienConnexion(email.data), minutes: LIEN_MINUTES }) }).catch((e) => console.error("Lien admin", e));
  }
  return { status: "success" };
}
