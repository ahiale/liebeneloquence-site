import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { SITE } from "@/config/site";

/**
 * Envoi d'emails via l'API transactionnelle de Brevo.
 *
 * Variables d'environnement (jamais dans le code) :
 *   BREVO_API_KEY       clé API Brevo
 *   MAIL_FROM           adresse d'expédition validée dans Brevo (défaut : SITE.email)
 *   MAIL_TO_ADMIN       destinataire des notifications (défaut : SITE.email)
 *
 * Sans BREVO_API_KEY (développement), le mail est affiché dans la console.
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

export async function sendMail(mail: Mail): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.info(
      `[mail non envoyé : BREVO_API_KEY absente]\nÀ : ${mail.to}\nObjet : ${mail.subject}\nPièces jointes : ${(mail.attachments ?? []).map((a) => a.name).join(", ") || "aucune"}\n${mail.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}`,
    );
    return;
  }

  const attachment = await Promise.all(
    (mail.attachments ?? []).map(async (a) => ({
      name: a.name,
      content: (await readFile(path.join(process.cwd(), "assets", a.file))).toString("base64"),
    })),
  );

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: SITE.name, email: process.env.MAIL_FROM || SITE.email },
      to: [{ email: mail.to }],
      replyTo: mail.replyTo ? { email: mail.replyTo } : undefined,
      subject: mail.subject,
      htmlContent: mail.html,
      attachment: attachment.length ? attachment : undefined,
    }),
  });

  if (!res.ok) {
    throw new Error(`Brevo a refusé l'envoi (${res.status}) : ${await res.text()}`);
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
