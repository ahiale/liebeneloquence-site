"use server";

import { z } from "zod";
import { ADMIN_EMAIL, sendMail, type Mail } from "@/lib/mail";
import { hasEmail, record } from "@/lib/store";
import { HONEYPOT, type FormState } from "@/lib/forms";
import { tooManyRequests } from "@/lib/rate-limit";
import { computeResult, isComplete, type Answer } from "@/lib/quiz";
import { getPricing } from "@/content";
import { formatPrice } from "@/lib/format";
import * as T from "@/emails/templates";
import { renderFicheOrateur } from "@/emails/fiche-orateur";
import { addToNewsletterList } from "@/lib/brevo";
import { DEMANDES, ORAUX, PROFILS_GRAND_ORAL } from "@/lib/options";

/* Actions serveur des formulaires du site. Chaque action :
   1. ignore silencieusement les robots (champ invisible rempli),
   2. vérifie les champs,
   3. enregistre la demande (data/*.jsonl, repris plus tard par l'espace admin du SaaS),
   4. envoie le mail automatique à la personne ;
   5. prévient Rebecca seulement pour les demandes qui appellent une réponse (devis, Grand Oral, contact). */

const email = z.string().trim().email("Adresse email invalide").max(200);
const required = (label: string, max = 200) => z.string().trim().min(1, `${label} : champ obligatoire`).max(max);
const optional = (max = 4000) => z.string().trim().max(max).optional().default("");

function invalid(error: z.ZodError): FormState {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) fields[String(issue.path[0])] ??= issue.message;
  return { status: "error", message: "Merci de vérifier les champs indiqués.", fields };
}

const isBot = (data: FormData) => Boolean(data.get(HONEYPOT));

const TOO_MANY: FormState = { status: "error", message: "Trop d'envois en peu de temps. Merci de réessayer dans quelques minutes." };

/** Inscription refusée car l'email est déjà enregistré. */
const already = (message: string): FormState => ({ status: "error", message });

const FAILURE: FormState = {
  status: "error",
  message: "L'envoi n'a pas abouti. Réessayez dans un instant ou écrivez directement à formationn@liebeneloquence.com.",
};

/** Notification à Rebecca (uniquement pour les demandes qui appellent une réponse). */
async function notifyAdmin(admin: { subject: string; html: string }, replyTo: string) {
  await sendMail({ to: ADMIN_EMAIL, replyTo, ...admin });
}

/** Mail automatique à la personne (répondre à ce mail écrit à Rebecca). */
async function confirm(client: { subject: string; html: string }, to: string, attachments?: Mail["attachments"]) {
  await sendMail({ to, replyTo: ADMIN_EMAIL, ...client, attachments });
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
  if (await tooManyRequests("devis")) return TOO_MANY;
  const parsed = DevisSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  const structure = STRUCTURES[d.structure];

  await record("demandes", { type: "devis", ...d });
  try {
    await notifyAdmin(T.devisAdmin({ ...d, structure: structure.label }), d.email);
    await confirm(T.devisClient({ ...d, structure: structure.label }), d.email, [{ name: "Lieben-Eloquence-presentation.pdf", file: structure.brochure }]);
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
  if (await tooManyRequests("grand-oral")) return TOO_MANY;
  const parsed = GrandOralSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;
  const price = formatPrice((await getPricing()).grandOral.price);

  await record("demandes", { type: "grand-oral", ...d });
  try {
    await notifyAdmin(T.grandOralAdmin(d), d.email);
    await confirm(T.grandOralClient({ ...d, price }), d.email);
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
  if (await tooManyRequests("contact")) return TOO_MANY;
  const parsed = ContactSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;

  await record("demandes", { type: "contact", ...d });
  try {
    await notifyAdmin(T.contactAdmin(d), d.email);
    await confirm(T.contactClient(d), d.email);
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
  if (await tooManyRequests("newsletter")) return TOO_MANY;
  const parsed = NewsletterSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;

  if (await hasEmail("newsletter", d.email)) return already("Cette adresse est déjà inscrite à la newsletter.");
  await record("newsletter", { ...d, consent: "formulaire newsletter du site" });
  await addToNewsletterList(d).catch((e) => console.error(e));
  try {
    await confirm(T.newsletterClient(d), d.email);
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
  if (await tooManyRequests("liste-attente")) return TOO_MANY;
  const parsed = ListeAttenteSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;

  if (await hasEmail("liste-attente", d.email)) return already("Cette adresse est déjà sur la liste d'attente. Vous serez prévenu·e dès l'ouverture.");
  await record("liste-attente", { ...d, consent: "formulaire liste d'attente LEQ'FAM" });
  try {
    await confirm(T.listeAttenteClient(d), d.email);
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

/** Enregistre un résultat anonyme (appelé à l'affichage du résultat). Pas de mail. */
export async function enregistrerQuiz(answers: Answer[]): Promise<void> {
  const parsed = AnswersSchema.safeParse(answers);
  if (!parsed.success || !isComplete(parsed.data)) return;
  const result = computeResult(parsed.data);
  await record("quiz", { answers: parsed.data, profile: result.profileId, level: result.level.name, pack: result.pack });
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
  if (await tooManyRequests("quiz")) return TOO_MANY;
  const parsed = QuizMailSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const { prenom, email: mail, answers } = parsed.data;
  if (!isComplete(answers)) return FAILURE;
  const result = computeResult(answers);

  if (await hasEmail("quiz", mail)) return already("Votre fiche orateur a déjà été envoyée à cette adresse. Pensez à vérifier vos spams.");
  await record("quiz", { answers, profile: result.profileId, pack: result.pack, prenom, email: mail });
  try {
    const fiche = await renderFicheOrateur(result, prenom);
    await confirm(T.quizClient({ result, prenom }), mail, [{ name: "fiche-orateur-LEQ.png", content: fiche, contentType: "image/png", cid: "fiche" }]);
    return { status: "success" };
  } catch (e) {
    console.error(e);
    return FAILURE;
  }
}
