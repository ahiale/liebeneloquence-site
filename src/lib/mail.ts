import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer, { type Transporter } from "nodemailer";
import { SITE } from "@/config/site";

/**
 * Envoi d'emails depuis la boîte Google Workspace (SMTP de Gmail).
 *
 * Variables d'environnement (jamais dans le code) :
 *   SMTP_USER       adresse Google Workspace qui envoie (ex. formationn@liebeneloquence.com)
 *   SMTP_PASSWORD   « mot de passe d'application » Google (16 caractères), pas le mot de passe du compte
 *   SMTP_HOST       facultatif, défaut smtp.gmail.com
 *   SMTP_PORT       facultatif, défaut 465
 *   MAIL_TO_ADMIN   destinataire des notifications (défaut : SITE.email)
 *
 * Sans SMTP_PASSWORD (développement), le mail est affiché dans la console.
 */

type Attachment = { name: string; file: string };

export type Mail = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  /** Fichiers du dossier /assets à joindre. */
  attachments?: Attachment[];
};

export const ADMIN_EMAIL = process.env.MAIL_TO_ADMIN || SITE.email;

let transport: Transporter | null = null;

function getTransport(): Transporter | null {
  const user = process.env.SMTP_USER || SITE.email;
  const pass = process.env.SMTP_PASSWORD;
  if (!pass) return null;
  const port = Number(process.env.SMTP_PORT || 465);
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transport;
}

export async function sendMail(mail: Mail): Promise<void> {
  const smtp = getTransport();

  if (!smtp) {
    await savePreview(mail);
    console.info(
      `[mail non envoyé : SMTP_PASSWORD absent]\nÀ : ${mail.to}\nObjet : ${mail.subject}\nPièces jointes : ${(mail.attachments ?? []).map((a) => a.name).join(", ") || "aucune"}\n${mail.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}`,
    );
    return;
  }

  await smtp.sendMail({
    from: { name: SITE.name, address: process.env.SMTP_USER || SITE.email },
    to: mail.to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    html: mail.html,
    attachments: (mail.attachments ?? []).map((a) => ({
      filename: a.name,
      path: path.join(process.cwd(), "assets", a.file),
    })),
  });
}

/** Sans SMTP (développement) : enregistre le mail en page web dans data/apercus-mails/ pour le relire. */
export const PREVIEW_DIR = () => path.join(process.env.DATA_DIR || path.join(process.cwd(), "data"), "apercus-mails");

async function savePreview(mail: Mail): Promise<void> {
  try {
    const dir = PREVIEW_DIR();
    await mkdir(dir, { recursive: true });
    const slug = mail.subject.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").toLowerCase().slice(0, 60);
    const file = path.join(dir, `${new Date().toISOString().replace(/[:.]/g, "-")}-${slug}.html`);
    await writeFile(file, `<!doctype html><meta charset="utf-8"><title>${esc(mail.subject)}</title><p style="font:13px Arial;color:#6b7a90">À : ${esc(mail.to)} · Objet : ${esc(mail.subject)}</p><hr>${mail.html}`, "utf8");
  } catch {
    /* aperçu facultatif */
  }
}

/** Échappe le texte saisi par l'utilisateur avant de l'insérer dans un mail HTML. */
export function esc(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Mise en page commune des mails (sobre, compatible messageries). */
export function layout(title: string, body: string): string {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#001636">
<p style="font-size:22px;font-weight:800;color:#114DA8;margin:0 0 16px">LEQ<span style="color:#FF5E01">.</span></p>
<h1 style="font-size:20px;margin:0 0 16px">${title}</h1>
${body}
<p style="margin:28px 0 0;font-size:12px;color:#6b7a90">Lieben Éloquence · ${SITE.url.replace("https://", "")}</p>
</div>`;
}

/** Tableau « champ : valeur » pour les notifications internes. */
export function fieldsTable(rows: [string, string | undefined][]): string {
  return `<table style="border-collapse:collapse;font-size:14px">${rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#6b7a90;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v!)}</td></tr>`,
    )
    .join("")}</table>`;
}
