import "server-only";
import { SITE, isPlaceholder } from "@/config/site";
import { esc, fieldsTable, layout } from "@/lib/mail";
import type { QuizResult } from "@/lib/quiz";

/**
 * Textes des mails automatiques envoyés par le site.
 * Un modèle = un objet { subject, html }. Modifier ici le texte d'un mail.
 */

type Email = { subject: string; html: string };

const p = (text: string) => `<p style="font-size:15px;line-height:1.6;margin:0 0 14px">${text}</p>`;

const button = (href: string, label: string) =>
  `<p style="margin:22px 0"><a href="${esc(href)}" style="display:inline-block;background:#FF5E01;color:#fff;text-decoration:none;font-weight:bold;padding:13px 26px;border-radius:999px">${esc(label)}</a></p>`;

const signature = p(`À très vite,<br><strong>Rebecca Lieben Ahiale</strong><br>Lieben Éloquence<br><a href="mailto:${SITE.email}" style="color:#114DA8">${SITE.email}</a>`);

const hello = (prenom?: string) => p(prenom ? `Bonjour ${esc(prenom)},` : "Bonjour,");

/* ---------------------------------------------------------------------------
   Devis (écoles et structures)
   ------------------------------------------------------------------------- */

export function devisAdmin(d: { structure: string; nom: string; email: string; message: string }): Email {
  return {
    subject: `Demande de devis : ${d.nom}`,
    html: layout("Nouvelle demande de devis", fieldsTable([["Structure", d.structure], ["Nom & établissement", d.nom], ["Email", d.email], ["Message", d.message]]) + p("Répondez directement à ce mail pour écrire à la personne.")),
  };
}

export function devisClient(d: { nom: string }): Email {
  return {
    subject: "Votre demande de devis Lieben Éloquence",
    html: layout(
      "Merci pour votre demande",
      hello() +
        p(`Nous avons bien reçu votre demande de devis pour <strong>${esc(d.nom)}</strong>.`) +
        p("Vous trouverez en pièce jointe notre document de présentation, avec le détail des modules, le déroulé des séances et la grille tarifaire.") +
        p("Je reviens vers vous très rapidement pour construire ensemble l'intervention qui correspond à vos publics et à vos objectifs.") +
        signature,
    ),
  };
}

/* ---------------------------------------------------------------------------
   Réservation Grand Oral
   ------------------------------------------------------------------------- */

type GrandOral = { prenom: string; nom: string; email: string; profil: string; oral: string; date: string; attentes: string };

export function grandOralAdmin(d: GrandOral): Email {
  return {
    subject: `Réservation Grand Oral : ${d.prenom} ${d.nom}`,
    html: layout(
      "Nouvelle réservation Grand Oral",
      fieldsTable([["Prénom", d.prenom], ["Nom", d.nom], ["Email", d.email], ["Profil", d.profil], ["Oral", d.oral], ["Date de l'oral", d.date], ["Attentes", d.attentes]]) +
        p("Le lien de paiement lui a été envoyé automatiquement. Une fois le paiement reçu sur Stripe, contactez la personne pour planifier les séances."),
    ),
  };
}

export function grandOralClient(d: GrandOral & { price: string }): Email {
  const link = isPlaceholder(SITE.stripeGrandOral) ? null : `${SITE.stripeGrandOral}?prefilled_email=${encodeURIComponent(d.email)}`;
  return {
    subject: "Votre place pour l'offre Grand Oral",
    html: layout(
      "Votre demande est bien reçue",
      hello(d.prenom) +
        p(`Merci pour votre demande d'accompagnement pour votre <strong>${esc(d.oral.toLowerCase())}</strong>${d.date ? ` du ${esc(formatDate(d.date))}` : ""}.`) +
        p(`Pour confirmer votre place dans l'offre Grand Oral (5 séances intensives, ${esc(d.price)}), il vous reste à effectuer le paiement en ligne. Le paiement en plusieurs fois est possible.`) +
        (link ? button(link, "Je confirme ma place") : p("Je vous envoie le lien de paiement dans un prochain mail.")) +
        p("Une fois le paiement effectué, je vous contacte pour planifier vos séances.") +
        signature,
    ),
  };
}

/* ---------------------------------------------------------------------------
   Contact (discours, animation, coaching, partenariat)
   ------------------------------------------------------------------------- */

type Contact = { nom: string; email: string; demande: string; message: string };

export function contactAdmin(d: Contact): Email {
  return {
    subject: `${d.demande} : ${d.nom}`,
    html: layout("Nouvelle demande de contact", fieldsTable([["Nom", d.nom], ["Email", d.email], ["Demande", d.demande], ["Message", d.message]]) + p("Répondez directement à ce mail pour écrire à la personne.")),
  };
}

export function contactClient(d: Contact): Email {
  return {
    subject: "Votre message à Lieben Éloquence",
    html: layout(
      "Message bien reçu",
      hello(d.nom.split(" ")[0]) +
        p(`Merci pour votre message concernant : <strong>${esc(d.demande.toLowerCase())}</strong>. Je le lis avec attention et je vous réponds par mail dans les meilleurs délais.`) +
        signature,
    ),
  };
}

/* ---------------------------------------------------------------------------
   Newsletter
   ------------------------------------------------------------------------- */

type Newsletter = { nom: string; email: string; profil: string; thematique: string };

export function newsletterAdmin(d: Newsletter): Email {
  return {
    subject: `Nouvelle inscription newsletter : ${d.nom}`,
    html: layout("Nouvelle inscription à la newsletter", fieldsTable([["Nom", d.nom], ["Email", d.email], ["Profil", d.profil], ["Thématique", d.thematique]])),
  };
}

export function newsletterClient(d: Newsletter): Email {
  return {
    subject: "Bienvenue dans la newsletter LEQ",
    html: layout(
      "Bienvenue dans la newsletter LEQ.",
      hello(d.nom.split(" ")[0]) +
        p("Votre inscription est confirmée. Vous recevrez en avant-première les dates des ateliers, des ressources gratuites, des conseils oratoires et les annonces importantes.") +
        p("Pas de spam, promis. Pour vous désinscrire à tout moment, il suffit de répondre à ce mail.") +
        signature,
    ),
  };
}

/* ---------------------------------------------------------------------------
   Liste d'attente LEQ'FAM
   ------------------------------------------------------------------------- */

export function listeAttenteAdmin(d: { prenom: string; email: string }): Email {
  return {
    subject: `Liste d'attente LEQ'FAM : ${d.prenom}`,
    html: layout("Nouvelle inscription à la liste d'attente LEQ'FAM", fieldsTable([["Prénom", d.prenom], ["Email", d.email]])),
  };
}

export function listeAttenteClient(d: { prenom: string }): Email {
  return {
    subject: "Vous êtes sur la liste d'attente de la LEQ'FAM",
    html: layout(
      "Bienvenue sur la liste d'attente !",
      hello(d.prenom) +
        p("Votre place sur la liste d'attente de la <strong>LEQ'FAM</strong>, la communauté dédiée à la prise de parole, à l'éloquence et aux soft skills, est bien enregistrée.") +
        p("Vous serez parmi les premières personnes prévenues à l'ouverture, avec le lien pour rejoindre la communauté sur Discord.") +
        p("Aucun paiement n'est demandé pour l'instant. Pour vous retirer de la liste, il suffit de répondre à ce mail.") +
        signature,
    ),
  };
}

/* ---------------------------------------------------------------------------
   Quiz d'orateur
   ------------------------------------------------------------------------- */

export function quizAdmin(d: { result: QuizResult; answers: [string, string][]; prenom?: string; email?: string }): Email {
  return {
    subject: `Quiz d'orateur : ${d.result.profile.name}${d.prenom ? ` (${d.prenom})` : ""}`,
    html: layout(
      "Nouveau résultat de quiz",
      fieldsTable([
        ["Prénom", d.prenom],
        ["Email", d.email],
        ["Profil", d.result.profile.name],
        ["Niveau", d.result.level.name],
        ["Points à travailler", d.result.points.map((pt) => pt.title).join(", ")],
        ["Pack conseillé", d.result.pack],
      ]) +
        `<h2 style="font-size:16px;margin:24px 0 8px">Réponses</h2>` +
        fieldsTable(d.answers),
    ),
  };
}

/** Fiche orateur envoyée par mail : ce que la page n'affiche pas (exercices, pack conseillé). */
export function quizClient(d: { result: QuizResult; prenom: string; pack: { name: string; sessions: number; price: string } }): Email {
  const r = d.result;
  const h2 = (t: string) => `<h2 style="font-size:17px;margin:28px 0 10px;color:#114DA8">${t}</h2>`;
  const exercises = r.points
    .map(
      (pt, i) =>
        `<div style="margin:0 0 12px;padding:14px 16px;border-radius:12px;background:#F6F8FC;border-left:4px solid #FFBD59"><p style="margin:0 0 6px;font-size:15px"><strong>${i + 1}. ${esc(pt.title)}</strong></p><p style="margin:0;font-size:14.5px;line-height:1.6">${esc(pt.exercise)}</p></div>`,
    )
    .join("");
  return {
    subject: `Votre fiche orateur : ${r.profile.name}`,
    html: layout(
      `Votre fiche orateur, ${esc(d.prenom)}`,
      p(`Vous êtes <strong>${esc(r.profile.name)}</strong>, niveau <strong>${esc(r.level.name.toLowerCase())}</strong>. ${esc(r.profile.desc)}`) +
        h2("Votre plan d'entraînement") +
        p("Un exercice concret pour chacun de vos points à travailler. Quelques minutes par jour suffisent pour sentir la différence.") +
        exercises +
        h2("Le pack que je vous conseille") +
        p(`<strong>${esc(d.pack.name)}</strong> · ${d.pack.sessions} séances · ${esc(d.pack.price)}<br>${esc(r.packWhy)}`) +
        (r.examNote ? p(`${esc(r.examNote)} <a href="${SITE.url}/grand-oral" style="color:#114DA8">Découvrir l'offre Grand Oral</a>`) : "") +
        p("Le plus simple pour démarrer : une séance diagnostic de 30 minutes, offerte, pour faire le point ensemble sur vos objectifs.") +
        button(SITE.calendly, "Réserver ma séance offerte") +
        signature,
    ),
  };
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
