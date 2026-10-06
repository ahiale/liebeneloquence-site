"use server";

import { z } from "zod";
import { ADMIN_EMAIL, sendMail, type Mail } from "@/lib/mail";
import { record } from "@/lib/store";
import { HONEYPOT, type FormState } from "@/lib/forms";
import { computeResult, describeAnswers, isComplete, type Answer } from "@/lib/quiz";
import { getPricing } from "@/content";
import { formatPrice } from "@/lib/format";
import * as T from "@/emails/templates";
import { renderFicheOrateur } from "@/emails/fiche-orateur";
import { addToNewsletterList } from "@/lib/brevo";
import { DEMANDES, ORAUX, PROFILS_GRAND_ORAL } from "@/lib/options";

/* Actions serveur des formulaires du site. Chaque action :
   1. ignore silencieusement les robots (champ invisible rempli),
   2. vérifie les champs,
   3. enregistre la demande (data/*.jsonl),
   4. prévient Rebecca et envoie une confirmation à la personne. */

const email = z.string().trim().email("Adresse email invalide").max(200);
const required = (label: string, max = 200) => z.string().trim().min(1, `${label} : champ obligatoire`).max(max);
const optional = (max = 4000) => z.string().trim().max(max).optional().default("");

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

/** Envoie la notification à Rebecca puis la confirmation à la personne. */
async function notify(admin: { subject: string; html: string }, client: { subject: string; html: string } | null, replyTo: string, attachments?: Mail["attachments"]) {
  await sendMail({ to: ADMIN_EMAIL, replyTo, ...admin });
  if (client) await sendMail({ to: replyTo, replyTo: ADMIN_EMAIL, ...client, attachments });
}

/* ---------------------------------------------------------------------------
   Demande de devis (écoles et structures)
   ------------------------------------------------------------------------- */

const STRUCTURES = {
  scolaire: { label: "Établissement scolaire / université", brochure: "brochures/LEQ-brochure-etudiants.pdf" },
  culturelle: { label: "Structure culturelle / association", brochure: "brochures/LEQ-brochure-acteurs-culturels.pdf" },
} as const;

const DevisSchema = z.object({
  structure: z.enum(["scolaire", "culturelle"], { message: "Choisissez le type de structure" }),
  nom: required("Nom et établissement"),
  email,
  message: optional(),
});

export async function demanderDevis(_: FormState, data: FormData): Promise<FormState> {
  if (isBot(data)) return { status: "success" };
  const parsed = DevisSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  const structure = STRUCTURES[d.structure];

  await record("demandes", { type: "devis", ...d });
  try {
    await notify(T.devisAdmin({ ...d, structure: structure.label }), T.devisClient(d), d.email, [
      { name: "Lieben-Eloquence-presentation.pdf", file: structure.brochure },
    ]);
    return { status: "success" };
  } catch (e) {
    console.error(e);
    return FAILURE;
  }
}

/* ---------------------------------------------------------------------------
   Réservation Grand Oral
   ------------------------------------------------------------------------- */

const GrandOralSchema = z.object({
  prenom: required("Prénom"),
  nom: required("Nom"),
  email,
  profil: z.enum(PROFILS_GRAND_ORAL, { message: "Indiquez votre profil" }),
  oral: z.enum(ORAUX, { message: "Indiquez votre oral" }),
  date: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide")]).default(""),
  attentes: optional(),
});

export async function reserverGrandOral(_: FormState, data: FormData): Promise<FormState> {
  if (isBot(data)) return { status: "success" };
  const parsed = GrandOralSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  const price = formatPrice((await getPricing()).grandOral.price);

  await record("demandes", { type: "grand-oral", ...d });
  try {
    await notify(T.grandOralAdmin(d), T.grandOralClient({ ...d, price }), d.email);
    return { status: "success" };
  } catch (e) {
    console.error(e);
    return FAILURE;
  }
}

/* ---------------------------------------------------------------------------
   Contact (discours, animation, coaching, partenariat)
   ------------------------------------------------------------------------- */

const ContactSchema = z.object({
  nom: required("Prénom et nom"),
  email,
  demande: z.enum(DEMANDES, { message: "Choisissez le type de demande" }),
  message: required("Message", 4000),
});

export async function envoyerContact(_: FormState, data: FormData): Promise<FormState> {
  if (isBot(data)) return { status: "success" };
  const parsed = ContactSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;

  await record("demandes", { type: "contact", ...d });
  try {
    await notify(T.contactAdmin(d), T.contactClient(d), d.email);
    return { status: "success" };
  } catch (e) {
    console.error(e);
    return FAILURE;
  }
}

/* ---------------------------------------------------------------------------
   Newsletter
   ------------------------------------------------------------------------- */

const NewsletterSchema = z.object({
  nom: required("Prénom et nom"),
  email,
  profil: optional(100),
  thematique: optional(100),
});

export async function inscrireNewsletter(_: FormState, data: FormData): Promise<FormState> {
  if (isBot(data)) return { status: "success" };
  const parsed = NewsletterSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;

  await record("newsletter", { ...d, consent: "formulaire newsletter du site" });
  await addToNewsletterList(d).catch((e) => console.error(e));
  try {
    await notify(T.newsletterAdmin(d), T.newsletterClient(d), d.email);
    return { status: "success" };
  } catch (e) {
    console.error(e);
    return FAILURE;
  }
}

/* ---------------------------------------------------------------------------
   Liste d'attente LEQ'FAM
   ------------------------------------------------------------------------- */

const ListeAttenteSchema = z.object({ prenom: required("Prénom"), email });

export async function rejoindreListeAttente(_: FormState, data: FormData): Promise<FormState> {
  if (isBot(data)) return { status: "success" };
  const parsed = ListeAttenteSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;

  await record("liste-attente", { ...d, consent: "formulaire liste d'attente LEQ'FAM" });
  try {
    await notify(T.listeAttenteAdmin(d), T.listeAttenteClient(d), d.email);
    return { status: "success" };
  } catch (e) {
    console.error(e);
    return FAILURE;
  }
}

/* ---------------------------------------------------------------------------
   Quiz d'orateur
   ------------------------------------------------------------------------- */

const AnswersSchema = z.array(z.union([z.string().max(30), z.number().int(), z.array(z.string().max(30)).max(4)])).length(6);

/** Enregistre un résultat anonyme et prévient Rebecca (appelé à l'affichage du résultat). */
export async function enregistrerQuiz(answers: Answer[]): Promise<void> {
  const parsed = AnswersSchema.safeParse(answers);
  if (!parsed.success || !isComplete(parsed.data)) return;
  const result = computeResult(parsed.data);
  await record("quiz", { answers: parsed.data, profile: result.profileId, level: result.level.name, pack: result.pack });
  try {
    await sendMail({ to: ADMIN_EMAIL, ...T.quizAdmin({ result, answers: describeAnswers(parsed.data) }) });
  } catch (e) {
    console.error(e);
  }
}

const QuizMailSchema = z.object({
  prenom: required("Prénom"),
  email,
  answers: z.string().transform((s, ctx) => {
    try {
      return AnswersSchema.parse(JSON.parse(s));
    } catch {
      ctx.addIssue({ code: "custom", message: "Réponses invalides" });
      return z.NEVER;
    }
  }),
});

/** Envoie le résultat du quiz à la personne qui le demande. */
export async function recevoirResultatQuiz(_: FormState, data: FormData): Promise<FormState> {
  if (isBot(data)) return { status: "success" };
  const parsed = QuizMailSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const { prenom, email: mail, answers } = parsed.data;
  if (!isComplete(answers)) return FAILURE;
  const result = computeResult(answers);

  await record("quiz", { answers, profile: result.profileId, pack: result.pack, prenom, email: mail });
  try {
    const fiche = await renderFicheOrateur(result, prenom);
    await notify(T.quizAdmin({ result, answers: describeAnswers(answers), prenom, email: mail }), T.quizClient({ result, prenom }), mail, [
      { name: "fiche-orateur-LEQ.png", content: fiche, contentType: "image/png", cid: "fiche" },
    ]);
    return { status: "success" };
  } catch (e) {
    console.error(e);
    return FAILURE;
  }
}
