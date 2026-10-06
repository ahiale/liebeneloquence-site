"use server";

import { z } from "zod";
import { ADMIN_EMAIL, esc, fieldsTable, layout, sendMail } from "@/lib/mail";
import { HONEYPOT, type FormState } from "@/lib/forms";

/* Actions serveur des formulaires du site. Chaque action :
   1. ignore silencieusement les robots (champ invisible rempli),
   2. vérifie les champs,
   3. prévient Rebecca et envoie une confirmation à la personne. */

const email = z.string().trim().email("Adresse email invalide");
const required = (label: string) => z.string().trim().min(1, `${label} : champ obligatoire`).max(2000);

function invalid(error: z.ZodError): FormState {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) fields[String(issue.path[0])] ??= issue.message;
  return { status: "error", message: "Merci de vérifier les champs indiqués.", fields };
}

const isBot = (data: FormData) => Boolean(data.get(HONEYPOT));

const FAILURE: FormState = {
  status: "error",
  message: "L'envoi n'a pas abouti. Réessayez dans un instant ou écrivez directement à formationn@liebeneloquence.com.",
};

/* ---------------------------------------------------------------------------
   Demande de devis (écoles)
   ------------------------------------------------------------------------- */

/** Type de structure → brochure envoyée en pièce jointe. */
const STRUCTURES = {
  scolaire: { label: "Établissement scolaire / université", brochure: "brochures/LEQ-brochure-etudiants.pdf" },
  culturelle: { label: "Structure culturelle / association", brochure: "brochures/LEQ-brochure-acteurs-culturels.pdf" },
} as const;

const DevisSchema = z.object({
  structure: z.enum(["scolaire", "culturelle"], { message: "Choisissez le type de structure" }),
  nom: required("Nom et établissement"),
  email,
  message: z.string().trim().max(4000).optional().default(""),
});

export async function demanderDevis(_: FormState, data: FormData): Promise<FormState> {
  if (isBot(data)) return { status: "success" };
  const parsed = DevisSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  const structure = STRUCTURES[d.structure];

  try {
    await sendMail({
      to: ADMIN_EMAIL,
      replyTo: d.email,
      subject: `Demande de devis : ${d.nom}`,
      html: layout(
        "Nouvelle demande de devis",
        fieldsTable([["Structure", structure.label], ["Nom & établissement", d.nom], ["Email", d.email], ["Message", d.message]]),
      ),
    });
    await sendMail({
      to: d.email,
      replyTo: ADMIN_EMAIL,
      subject: "Votre demande de devis Lieben Éloquence",
      html: layout(
        "Merci pour votre demande",
        `<p>Bonjour,</p><p>Nous avons bien reçu votre demande de devis pour <strong>${esc(d.nom)}</strong>. Vous trouverez ci-joint notre document de présentation avec toutes les informations détaillées sur les parcours.</p><p>Nous revenons vers vous très vite.</p><p>Rebecca Lieben Ahiale<br>Lieben Éloquence</p>`,
      ),
      attachments: [{ name: "Lieben-Eloquence-presentation.pdf", file: structure.brochure }],
    });
    return { status: "success" };
  } catch (e) {
    console.error(e);
    return FAILURE;
  }
}
