import { cleServeurValide } from "@/lib/cle-serveur";
import { z } from "zod";
import { getEvent } from "@/content";
import { SITE } from "@/config/site";
import { ADMIN_EMAIL, sendMail } from "@/lib/mail";
import { readAll, record, sameEmail } from "@/lib/store";
import * as T from "@/emails/templates";

/**
 * Envoi d'une invitation à un événement à une liste d'adresses (outils/envoyer-invitation.ps1).
 * Accès réservé : en-tête « X-LEQ-Cle » égal à DATA_API_KEY (appel fait depuis le serveur).
 * Un mail par personne (personne ne voit les autres adresses), 2 secondes entre deux envois,
 * et jamais deux fois la même invitation à la même adresse (journal data/invitations.jsonl).
 */
export const dynamic = "force-dynamic";
export const maxDuration = 3600;

const Body = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  emails: z.array(z.string().trim().toLowerCase().email()).min(1).max(500),
  /** Numéro affiché : « deuxième » → « Le deuxième rendez-vous mensuel LEQ ». */
  edition: z.string().max(30).optional(),
  /** Envoi de test : une seule adresse, sans journal ni contrôle des doublons. */
  test: z.boolean().optional(),
});

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  if (!cleServeurValide(req)) return new Response("Not found", { status: 404 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ erreur: parsed.error.issues.map((i) => i.message) }, { status: 400 });
  const { slug, edition, test } = parsed.data;

  const event = await getEvent(slug);
  if (!event) return Response.json({ erreur: `Événement introuvable : ${slug}` }, { status: 404 });
  const url = `${SITE.url}/evenements/${slug}?utm_source=invitation&utm_medium=email`;
  const mail = T.invitationEvenement({ title: event.title ?? "Événement LEQ", edition, dateLabel: event.dateLabel, timeLabel: event.timeLabel, url });

  const emails = [...new Set(parsed.data.emails)];
  if (test && emails.length > 1) return Response.json({ erreur: "Un envoi de test se fait à une seule adresse." }, { status: 400 });
  const deja = test ? [] : (await readAll("invitations")).filter((l) => l.event === slug);
  const envoyes: string[] = [];
  const ignores: string[] = [];
  const echecs: string[] = [];

  for (const to of emails) {
    if (deja.some((l) => sameEmail(l.email, to))) {
      ignores.push(to);
      continue;
    }
    try {
      await sendMail({ to, replyTo: ADMIN_EMAIL, ...mail });
      if (!test) await record("invitations", { event: slug, email: to });
      envoyes.push(to);
    } catch (e) {
      console.error(`Invitation non envoyée à ${to}`, e);
      echecs.push(to);
    }
    await pause(2000);
  }
  return Response.json({ objet: mail.subject, envoyes: envoyes.length, dejaInvites: ignores, echecs });
}
