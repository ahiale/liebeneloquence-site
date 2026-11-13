import "server-only";
import { SITE, isPlaceholder } from "@/config/site";
import { esc } from "@/lib/mail";
import type { QuizResult } from "@/lib/quiz";

/**
 * Mails automatiques envoyés par le site.
 *
 * Chaque formulaire envoie une CONFIRMATION designée à la personne (…Client).
 * Les demandes qui appellent une réponse (devis, Grand Oral, contact) envoient aussi une
 * NOTIFICATION à Rebecca (…Admin) : répondre à la notification écrit directement à la personne.
 * Newsletter, liste d'attente et quiz : aucune notification, les données sont enregistrées.
 *
 * Pour modifier un texte : changer les phrases entre guillemets ci-dessous.
 * Mise en page compatible avec les messageries (Gmail, Outlook, Apple Mail, mobile).
 */

type Email = { subject: string; html: string };

const C = { navy: "#001636", royal: "#114DA8", gold: "#FFBD59", orange: "#FF5E01", text: "#33415c", muted: "#6b7a90", cloud: "#F6F8FC" };
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";
const LOGO = `${SITE.url}/email/logo-leq.png`;

/* ---------------------------------------------------------------------------
   Briques de mise en page
   ------------------------------------------------------------------------- */

const p = (text: string) => `<p style="margin:0 0 16px;font-family:${FONT};font-size:16px;line-height:1.65;color:${C.text}">${text}</p>`;

const h2 = (text: string) => `<h2 style="margin:28px 0 12px;font-family:${FONT};font-size:18px;line-height:1.3;color:${C.royal}">${text}</h2>`;

/** Bouton orange compatible Outlook (table). */
const button = (href: string, label: string) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0">
  <tr><td style="border-radius:999px;background:${C.orange}">
    <a href="${esc(href)}" style="display:inline-block;padding:15px 30px;font-family:${FONT};font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px">${esc(label)}</a>
  </td></tr>
</table>`;

/** Encadré clair (récapitulatif, infos). */
const box = (inner: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px"><tr><td style="background:${C.cloud};border-left:4px solid ${C.gold};border-radius:12px;padding:18px 20px;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.text}">${inner}</td></tr></table>`;

/** Lignes « libellé : valeur » (récapitulatifs). */
const rows = (items: [string, string | undefined][]) =>
  items
    .filter(([, v]) => v)
    .map(([k, v]) => `<div style="margin:0 0 6px"><span style="color:${C.muted}">${esc(k)} :</span> <strong style="color:${C.navy};white-space:pre-wrap">${esc(v!)}</strong></div>`)
    .join("");

const hello = (prenom?: string) => p(prenom ? `Bonjour ${esc(prenom)},` : "Bonjour,");

const signature = `
<p style="margin:28px 0 0;font-family:${FONT};font-size:16px;line-height:1.6;color:${C.text}">À très vite,</p>
<p style="margin:4px 0 0;font-family:${SERIF};font-style:italic;font-size:22px;color:${C.royal}">Rebecca Lieben Ahiale</p>
<p style="margin:2px 0 0;font-family:${FONT};font-size:13px;color:${C.muted}">Fondatrice de Lieben Éloquence</p>`;

/**
 * Gabarit complet : bandeau bleu nuit + logo, carte blanche, pied de page.
 * `preheader` = aperçu affiché dans la liste des mails.
 */
function layout({ title, accent, preheader, body, reason }: { title: string; accent?: string; preheader: string; body: string; reason: string }): string {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#EAF0F8">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#EAF0F8">
<tr><td align="center" style="padding:28px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">
    <!-- Bandeau -->
    <tr><td style="background:${C.navy};border-radius:24px 24px 0 0;padding:28px 36px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td><a href="${SITE.url}"><img src="${LOGO}" width="92" height="40" alt="LEQ." style="display:block;border:0;width:92px;height:auto;color:#ffffff;font-family:${FONT};font-size:28px;font-weight:bold"></a></td>
        <td align="right" style="font-family:${SERIF};font-style:italic;font-size:15px;color:${C.gold}">Parlez pour plaire, convaincre, impacter.</td>
      </tr></table>
    </td></tr>
    <tr><td style="height:4px;line-height:4px;font-size:0;background:${C.orange}">&nbsp;</td></tr>
    <!-- Carte -->
    <tr><td style="background:#ffffff;padding:36px 36px 40px;border-radius:0 0 24px 24px">
      <h1 style="margin:0 0 22px;font-family:${FONT};font-size:26px;line-height:1.2;letter-spacing:-0.5px;color:${C.navy}">${esc(title)}${accent ? ` <span style="font-family:${SERIF};font-style:italic;font-weight:normal;color:${C.orange}">${esc(accent)}</span>` : ""}</h1>
      ${body}
    </td></tr>
    <!-- Pied -->
    <tr><td align="center" style="padding:26px 24px 8px;font-family:${FONT};font-size:13px;line-height:1.7;color:${C.muted}">
      <strong style="color:${C.navy}">Lieben Éloquence</strong> · Formations et coaching en prise de parole<br>
      <a href="mailto:${SITE.email}" style="color:${C.royal};text-decoration:none">${SITE.email}</a><br>
      <a href="${SITE.url}" style="color:${C.royal}">liebeneloquence.com</a> · <a href="${SITE.instagram}" style="color:${C.royal}">Instagram</a> · <a href="${SITE.linkedin}" style="color:${C.royal}">LinkedIn</a>
    </td></tr>
    <tr><td align="center" style="padding:6px 24px 0;font-family:${FONT};font-size:11.5px;line-height:1.6;color:#94a0b4">${esc(reason)}</td></tr>
  </table>
</td></tr>
</table>
</body></html>`;
}

/** Notification interne pour Rebecca (même gabarit, contenu factuel). */
function admin(title: string, items: [string, string | undefined][], note?: string): string {
  return layout({
    title,
    preheader: items.map(([, v]) => v).filter(Boolean).slice(0, 3).join(" · "),
    body: box(rows(items)) + (note ? p(note) : "") + p(`<span style="color:${C.muted};font-size:14px">Répondez simplement à ce mail pour écrire à la personne.</span>`),
    reason: "Notification automatique du site liebeneloquence.com.",
  });
}

const REASON = "Vous recevez ce mail suite à votre demande sur liebeneloquence.com.";

/* ---------------------------------------------------------------------------
   Devis (écoles et structures culturelles)
   ------------------------------------------------------------------------- */

type Devis = { structure: string; nom: string; email: string; message: string };

export function devisAdmin(d: Devis): Email {
  return {
    subject: `Demande de devis : ${d.nom}`,
    html: admin("Nouvelle demande de devis", [["Structure", d.structure], ["Nom & établissement", d.nom], ["Email", d.email], ["Message", d.message]], "La brochure correspondante lui a été envoyée automatiquement."),
  };
}

export function devisClient(d: Devis): Email {
  return {
    subject: "Votre demande de devis · Lieben Éloquence",
    html: layout({
      title: "Merci pour votre",
      accent: "demande.",
      preheader: "Votre document de présentation est en pièce jointe.",
      reason: REASON,
      body:
        hello() +
        p(`Nous avons bien reçu votre demande d'intervention pour <strong>${esc(d.nom)}</strong>.`) +
        p("Vous trouverez <strong>en pièce jointe notre document de présentation</strong> : les modules, le déroulé des séances et la grille tarifaire.") +
        p("Je reviens vers vous très rapidement pour construire ensemble l'intervention qui correspond à vos publics et à vos objectifs.") +
        box(rows([["Votre structure", d.structure], ["Votre message", d.message || undefined]])) +
        signature,
    }),
  };
}

/* ---------------------------------------------------------------------------
   Réservation Grand Oral
   ------------------------------------------------------------------------- */

type GrandOral = { prenom: string; nom: string; email: string; profil: string; oral: string; date: string; attentes: string };

export function grandOralAdmin(d: GrandOral): Email {
  return {
    subject: `Réservation Grand Oral : ${d.prenom} ${d.nom}`,
    html: admin(
      "Nouvelle réservation Grand Oral",
      [["Prénom", d.prenom], ["Nom", d.nom], ["Email", d.email], ["Profil", d.profil], ["Oral", d.oral], ["Date de l'oral", d.date ? formatDate(d.date) : undefined], ["Attentes", d.attentes]],
      "Le lien de paiement Stripe lui a été envoyé. Vous recevrez la notification de Stripe dès que le paiement est effectué : contactez alors la personne pour planifier les séances.",
    ),
  };
}

export function grandOralClient(d: GrandOral & { price: string }): Email {
  const link = isPlaceholder(SITE.stripeGrandOral) ? null : `${SITE.stripeGrandOral}?prefilled_email=${encodeURIComponent(d.email)}`;
  return {
    subject: "Votre place pour l'offre Grand Oral · Lieben Éloquence",
    html: layout({
      title: "Votre demande est bien",
      accent: "reçue.",
      preheader: "Dernière étape : valider votre paiement pour confirmer votre place.",
      reason: REASON,
      body:
        hello(d.prenom) +
        p("Merci pour votre confiance ! Voici le récapitulatif de votre demande :") +
        box(rows([["Offre", `Grand Oral · 5 séances intensives · ${d.price}`], ["Votre oral", d.oral], ["Date", d.date ? formatDate(d.date) : undefined]])) +
        p("<strong>Dernière étape : validez votre paiement</strong> pour confirmer votre place. Le paiement est sécurisé, et possible en plusieurs fois.") +
        (link ? button(link, "Je valide mon paiement") : p("Le lien de paiement vous est envoyé dans un prochain mail.")) +
        p("Dès que votre paiement est validé, je vous contacte pour planifier vos séances ensemble.") +
        signature,
    }),
  };
}

/* ---------------------------------------------------------------------------
   Séance à l'unité
   ------------------------------------------------------------------------- */

type Seance = { prenom: string; nom: string; email: string; seances: number; sujet: string };
const seancesLabel = (n: number) => `${n} séance${n > 1 ? "s" : ""}`;

export function seanceAdmin(d: Seance & { total: string }): Email {
  return {
    subject: `Séance à l'unité : ${d.prenom} ${d.nom} (${seancesLabel(d.seances)})`,
    html: admin(
      "Nouvelle demande de séance à l'unité",
      [["Prénom", d.prenom], ["Nom", d.nom], ["Email", d.email], ["Séances", `${seancesLabel(d.seances)} · ${d.total}`], ["Sujet", d.sujet]],
      isPlaceholder(SITE.stripeSeance)
        ? "Le lien Stripe de la séance n'est pas encore renseigné sur le site : envoyez le lien de paiement à la personne en répondant à ce mail."
        : "Le lien de paiement Stripe lui a été envoyé. Vous recevrez la notification de Stripe dès que le paiement est effectué : contactez alors la personne pour fixer la séance.",
    ),
  };
}

export function seanceClient(d: Seance & { unit: string; total: string }): Email {
  const link = isPlaceholder(SITE.stripeSeance) ? null : `${SITE.stripeSeance}?prefilled_email=${encodeURIComponent(d.email)}`;
  return {
    subject: `Votre ${d.seances > 1 ? "réservation de séances" : "séance"} · Lieben Éloquence`,
    html: layout({
      title: "Votre demande est bien",
      accent: "reçue.",
      preheader: "Dernière étape : valider votre paiement pour confirmer votre séance.",
      reason: REASON,
      body:
        hello(d.prenom) +
        p("Merci pour votre confiance ! Voici le récapitulatif de votre demande :") +
        box(rows([["Formule", `Séance à l'unité · ${d.unit} la séance`], ["Nombre de séances", seancesLabel(d.seances)], ["Total", d.total], ["Votre sujet", d.sujet]])) +
        p(`<strong>Dernière étape : validez votre paiement</strong> pour confirmer ${d.seances > 1 ? "vos séances" : "votre séance"}.${d.seances > 1 ? ` Sur la page de paiement, indiquez <strong>${d.seances}</strong> dans la quantité.` : ""}`) +
        (link ? button(link, "Je valide mon paiement") : p("Le lien de paiement vous est envoyé dans un prochain mail.")) +
        p(`Dès que votre paiement est validé, je vous contacte pour fixer ${d.seances > 1 ? "les dates de vos séances" : "la date de votre séance"}.`) +
        p(`<span style="color:${C.muted};font-size:14px">La séance à l'unité porte sur le sujet que vous avez choisi : elle ne comprend ni suivi ni ressources. Pour un accompagnement complet, découvrez <a href="${SITE.url}/#offres" style="color:${C.royal}">nos packs</a>.</span>`) +
        signature,
    }),
  };
}

/* ---------------------------------------------------------------------------
   Élèves (admin) : diagnostic après la séance découverte, compte-rendu de séance
   ------------------------------------------------------------------------- */

/** Texte de la fiche (une idée par ligne) → liste à puces ; vide → rien. */
const puces = (texte: string) => {
  const lignes = texte.split("\n").map((l) => l.replace(/^[-•*\d.)\s]+/, "").trim()).filter(Boolean);
  return lignes.length ? `<ul style="margin:0 0 16px;padding-left:20px;font-family:${FONT};font-size:16px;line-height:1.65;color:${C.text}">${lignes.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>` : "";
};
const bloc = (titre: string, texte: string) => (texte.trim() ? p(`<strong>${esc(titre)}</strong>`) + puces(texte) : "");

export function diagnosticEleve(d: { prenom: string; objectif: string; qualites: string; pointsForts: string; pointsFaibles: string; blocages: string; pack: string; message: string }): Email {
  return {
    subject: "Votre diagnostic de prise de parole · Lieben Éloquence",
    html: layout({
      title: "Votre",
      accent: "diagnostic.",
      preheader: "Ce qui ressort de notre séance découverte, et la suite que je vous propose.",
      reason: REASON,
      body:
        hello(d.prenom) +
        p("Merci pour notre séance découverte ! Voici ce que j'en retiens, pour que vous partiez sur de bonnes bases.") +
        (d.objectif.trim() ? box(rows([["Votre objectif", esc(d.objectif)]])) : "") +
        bloc("Vos points forts", d.pointsForts) +
        bloc("Vos qualités d'orateur", d.qualites) +
        bloc("Ce que nous allons travailler", d.pointsFaibles) +
        bloc("Ce qui vous freine aujourd'hui", d.blocages) +
        (d.message.trim() ? p(esc(d.message).replace(/\n/g, "<br>")) : "") +
        (d.pack ? p(`Pour atteindre votre objectif, je vous recommande le <strong>pack ${esc(d.pack)}</strong>.`) + button(`${SITE.url}/#offres`, "Découvrir le pack") : "") +
        p("Une question ? Répondez simplement à ce mail.") +
        signature,
    }),
  };
}

export function compteRenduSeance(d: { prenom: string; numero: number; theme: string; bienFonctionne: string; aTravailler: string; exercice: string }): Email {
  return {
    subject: `Compte-rendu de votre séance ${d.numero}${d.theme ? ` : ${d.theme}` : ""}`,
    html: layout({
      title: `Séance ${d.numero},`,
      accent: "c'est fait !",
      preheader: "Ce qui a bien fonctionné, ce qu'on continue à travailler, et votre exercice.",
      reason: REASON,
      body:
        hello(d.prenom) +
        p(`Voici le compte-rendu de notre séance${d.theme ? ` sur <strong>${esc(d.theme)}</strong>` : ""}.`) +
        bloc("Ce qui a bien fonctionné", d.bienFonctionne) +
        bloc("Ce qu'on continue à travailler", d.aTravailler) +
        (d.exercice.trim() ? box(rows([["Votre exercice d'ici la prochaine séance", esc(d.exercice).replace(/\n/g, "<br>")]])) : "") +
        p("Une question en faisant l'exercice ? Répondez à ce mail.") +
        signature,
    }),
  };
}

/* ---------------------------------------------------------------------------
   Contact (discours, animation, coaching, partenariat…)
   ------------------------------------------------------------------------- */

type Contact = { nom: string; email: string; demande: string; message: string };

export function contactAdmin(d: Contact): Email {
  return {
    subject: `${d.demande} : ${d.nom}`,
    html: admin("Nouvelle demande de contact", [["Nom", d.nom], ["Email", d.email], ["Demande", d.demande], ["Message", d.message]]),
  };
}

export function contactClient(d: Contact): Email {
  return {
    subject: "Votre message à Lieben Éloquence",
    html: layout({
      title: "Message bien",
      accent: "reçu.",
      preheader: "Je vous réponds par mail dans les meilleurs délais.",
      reason: REASON,
      body:
        hello(d.nom.split(" ")[0]) +
        p("Merci pour votre message ! Je le lis avec attention et je vous réponds par mail dans les meilleurs délais.") +
        box(rows([["Votre demande", d.demande], ["Votre message", d.message]])) +
        p("En attendant, vous pouvez découvrir toutes les offres sur le site :") +
        button(SITE.url, "Découvrir Lieben Éloquence") +
        signature,
    }),
  };
}

/* ---------------------------------------------------------------------------
   Newsletter
   ------------------------------------------------------------------------- */

type Newsletter = { nom: string; email: string; profil: string; thematique: string };

export function newsletterClient(d: Newsletter): Email {
  return {
    subject: "Bienvenue dans la newsletter LEQ",
    html: layout({
      title: "Bienvenue dans la",
      accent: "newsletter LEQ.",
      preheader: "Votre inscription est confirmée.",
      reason: "Vous recevez ce mail suite à votre inscription à la newsletter sur liebeneloquence.com. Pour vous désinscrire, répondez simplement à ce mail.",
      body:
        hello(d.nom.split(" ")[0]) +
        p("Votre inscription est confirmée ! Vous recevrez en avant-première les dates des ateliers, des ressources gratuites, des conseils oratoires et les annonces importantes.") +
        p("Pas de spam, promis. Pour vous désinscrire à tout moment, il suffit de répondre à ce mail.") +
        signature,
    }),
  };
}

/* ---------------------------------------------------------------------------
   Liste d'attente LEQ'FAM
   ------------------------------------------------------------------------- */

export function listeAttenteClient(d: { prenom: string }): Email {
  return {
    subject: "Vous êtes sur la liste d'attente de la LEQ'FAM",
    html: layout({
      title: "Bienvenue sur la liste",
      accent: "d'attente !",
      preheader: "Vous serez parmi les premiers prévenus à l'ouverture de la LEQ'FAM.",
      reason: "Vous recevez ce mail suite à votre inscription à la liste d'attente LEQ'FAM. Pour vous retirer de la liste, répondez simplement à ce mail.",
      body:
        hello(d.prenom) +
        p("Votre place sur la liste d'attente de la <strong>LEQ'FAM</strong>, la communauté dédiée à la prise de parole, à l'éloquence et aux soft skills, est bien enregistrée.") +
        p("Vous serez parmi les premières personnes prévenues à l'ouverture, avec le lien pour rejoindre la communauté sur Discord. Aucun paiement n'est demandé pour l'instant.") +
        signature,
    }),
  };
}

/** E-book gratuit : le lien de téléchargement, et les deux façons d'aller plus loin. */
export function ebookClient(d: { prenom: string; titre: string; lien: string; soutien: string; precommande: string; objectif: number }): Email {
  return {
    subject: `Votre BD « ${d.titre} » est arrivée 🐝`,
    html: layout({
      title: "Votre BD est",
      accent: "arrivée !",
      preheader: `Le lien pour télécharger « ${d.titre} », gratuitement.`,
      reason: "Vous recevez ce mail car vous avez demandé un e-book gratuit sur liebeneloquence.com. Pour ne plus rien recevoir, répondez simplement « STOP » à ce mail.",
      body:
        hello(d.prenom) +
        p(`Voici votre BD <strong>« ${esc(d.titre)} »</strong>, avec son cahier d'exercices anti-trac. Elle est gratuite et à partager librement, sans modification ni usage commercial.`) +
        button(d.lien, "Télécharger la BD") +
        p("<strong>Mellie vous a aidé ?</strong> Elle est gratuite et le restera. Si vous le souhaitez, vous pouvez soutenir LEQ du montant de votre choix : c'est ce qui nous permet de créer de nouveaux outils pour apprendre à parler en public.") +
        button(d.soutien, "Soutenir LEQ") +
        p(`<strong>Envie de la version papier ?</strong> Le cahier se remplit mieux sur papier. Elle est en précommande à partir de 8 €, un prix qui couvre uniquement l'impression et l'envoi (en France seulement). L'impression sera lancée dès ${d.objectif} précommandes, pas avant ; si elle n'a pas lieu, vous êtes remboursé·e. <a href="${d.precommande}">Précommander la version papier</a>.`) +
        signature,
    }),
  };
}

/** Lien de connexion à l'admin (valable quelques minutes). */
export function adminConnexion(d: { lien: string; minutes: number }): Email {
  return {
    subject: "Votre lien de connexion à l'admin LEQ",
    html: layout({
      title: "Connexion",
      accent: "à l'admin",
      preheader: `Votre lien de connexion, valable ${d.minutes} minutes.`,
      reason: "Vous recevez ce mail car une connexion à l'admin de liebeneloquence.com a été demandée avec votre adresse. Si ce n'est pas vous, ignorez simplement ce mail.",
      body:
        hello() +
        p(`Cliquez sur le bouton pour ouvrir l'admin. Le lien est valable <strong>${d.minutes} minutes</strong> et ne sert qu'une fois par appareil.`) +
        button(d.lien, "Ouvrir l'admin") +
        p("Si vous n'avez rien demandé, ignorez ce mail : personne ne peut se connecter sans ce lien."),
    }),
  };
}

/** Confirmation « Être prévenu » d'un lancement (jeu de cartes, application mobile). */
export function prevenirClient(d: { prenom: string; produit: string }): Email {
  return {
    subject: `C'est noté : vous serez prévenu·e du lancement`,
    html: layout({
      title: "C'est noté,",
      accent: "à très vite !",
      preheader: `Vous serez parmi les premiers prévenus du lancement de ${d.produit}.`,
      reason: "Vous recevez ce mail car vous avez demandé à être prévenu·e d'un lancement sur liebeneloquence.com. Pour ne plus rien recevoir, répondez simplement « STOP » à ce mail.",
      body:
        hello(d.prenom) +
        p(`Votre demande est bien enregistrée : vous serez parmi les premières personnes prévenues du lancement de <strong>${esc(d.produit)}</strong>.`) +
        signature,
    }),
  };
}

/* ---------------------------------------------------------------------------
   Inscription à un événement gratuit (rendez-vous mensuel…)
   ------------------------------------------------------------------------- */

/** Mail d'inscription : le lien de la visio, le récapitulatif et un fichier agenda joint. */
export function inscriptionEvenementClient(d: { prenom: string; title: string; dateLabel: string; timeLabel: string | null; meetingUrl: string; dateAVenir?: boolean }): Email {
  return {
    subject: `Votre inscription : ${d.title}, ${d.dateLabel.charAt(0).toLowerCase()}${d.dateLabel.slice(1)}`,
    html: layout({
      title: "C'est noté,",
      accent: "à très vite !",
      preheader: `${d.dateLabel}${d.timeLabel ? `, ${d.timeLabel}` : ""} : voici votre lien pour nous rejoindre.`,
      reason: "Vous recevez ce mail suite à votre inscription à un événement sur liebeneloquence.com. Pour vous désinscrire, répondez simplement à ce mail.",
      body:
        hello(d.prenom) +
        p(`Votre inscription au <strong>${esc(d.title)}</strong> est bien enregistrée. Voici le lien pour nous rejoindre le jour J :`) +
        box(rows([["Date", d.dateLabel], ["Horaires", d.timeLabel ?? undefined], ["Lieu", "En ligne, sur Google Meet"]])) +
        button(d.meetingUrl, "Rejoindre le Google Meet") +
        p(
          d.dateAVenir
            ? "La date exacte n'est pas encore fixée : vous la recevrez par mail dès qu'elle sera annoncée. Gardez ce mail, le lien sera le même le jour J."
            : "Gardez ce mail : le lien sera le même le jour J. Le fichier joint vous permet d'ajouter le rendez-vous à votre agenda en un clic, avec un rappel 30 minutes avant.",
        ) +
        p("Venez avec toutes vos questions sur la prise de parole, l'éloquence ou vos blocages à l'oral : rien n'est préparé à l'avance, c'est un moment ouvert, entre nous.") +
        signature,
    }),
  };
}

/** Invitation envoyée à une liste (outils/envoyer-invitation.ps1) : un bouton vers la page d'inscription. */
export function invitationEvenement(d: { title: string; edition?: string; dateLabel: string; timeLabel: string | null; url: string }): Email {
  const quand = d.dateLabel.charAt(0).toLowerCase() + d.dateLabel.slice(1);
  const nom = d.edition ? d.title.replace(/^Le /, `Le ${d.edition} `) : d.title;
  return {
    subject: `${nom} : ${quand.replace(/\s+\d{4}$/, "")}, inscrivez-vous !`,
    html: layout({
      title: "C'est le moment",
      accent: `du ${d.edition ? `${d.edition} ` : ""}rendez-vous LEQ !`,
      preheader: `${d.dateLabel}${d.timeLabel ? `, ${d.timeLabel}` : ""}, en ligne et gratuit. Inscrivez-vous pour recevoir le lien.`,
      reason: "Vous recevez ce mail car vous êtes en contact avec Lieben Éloquence. Pour ne plus recevoir nos invitations, répondez simplement « STOP » à ce mail.",
      body:
        hello() +
        p(`${esc(nom)} arrive ! Une heure ouverte et gratuite pour poser toutes vos questions sur la prise de parole, l'éloquence et vos blocages à l'oral.`) +
        box(rows([["Date", d.dateLabel], ["Horaires", d.timeLabel ?? undefined], ["Lieu", "En ligne, sur Google Meet"], ["Tarif", "Gratuit"]])) +
        p("Un examen ou une soutenance approche ? Un discours à préparer ? Une conversation qui vous intimide ? Rien n'est préparé à l'avance : on part de vos questions, simplement, entre nous.") +
        button(d.url, "Je m'inscris gratuitement") +
        p("Une fois inscrit·e, vous recevez aussitôt le lien Google Meet par mail, avec un rappel pour votre agenda.") +
        signature,
    }),
  };
}

/* ---------------------------------------------------------------------------
   Abonnement LEQ'FAM
   ------------------------------------------------------------------------- */

const dateFr = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const euros = (n: number) => `${n.toFixed(2).replace(".", ",").replace(",00", "")} €`;

export function leqfamBienvenue(d: { nom: string; formule: string; prix: number; engagementFin: string | null; lienDiscord: string; lienResiliation: string }): Email {
  return {
    subject: "Bienvenue dans la LEQ'FAM !",
    html: layout({
      title: "Bienvenue dans",
      accent: "la LEQ'FAM !",
      preheader: "Ton accès membre est activé sur Discord.",
      reason: "Vous recevez ce mail suite à votre abonnement à la LEQ'FAM sur liebeneloquence.com.",
      body:
        hello(d.nom) +
        p("Ton abonnement est activé : tous les salons membres de la LEQ'FAM sont ouverts sur Discord. Commence par <strong>#fonctionnement</strong>, puis les règles, puis présente-toi : la communauté t'attend.") +
        button(d.lienDiscord, "Ouvrir la LEQ'FAM sur Discord") +
        box(rows([["Formule", d.formule], ["Prix normal", `${euros(d.prix)} par mois`], ["Engagement", d.engagementFin ? `jusqu'au ${dateFr(d.engagementFin)}, puis reconduit chaque mois` : "aucun, résiliable à tout moment"]])) +
        p(`Tes reçus de paiement t'arrivent par mail à chaque prélèvement. Pour résilier ton abonnement à tout moment, <a href="${esc(d.lienResiliation)}" style="color:${C.royal}">utilise ce lien</a> (garde ce mail).`) +
        p(`<span style="color:${C.muted};font-size:14px">Conditions générales de vente : <a href="${SITE.url}/cgv" style="color:${C.royal}">${SITE.url.replace("https://", "")}/cgv</a></span>`) +
        signature,
    }),
  };
}

export function leqfamLienResiliation(d: { lien: string }): Email {
  return {
    subject: "Résilier ton abonnement LEQ'FAM",
    html: layout({
      title: "Résilier ton",
      accent: "abonnement",
      preheader: "Le lien pour résilier ton abonnement LEQ'FAM.",
      reason: "Vous recevez ce mail car une demande de résiliation a été faite sur liebeneloquence.com avec votre adresse.",
      body:
        hello() +
        p("Tu as demandé à résilier ton abonnement à la LEQ'FAM. Clique sur le bouton pour voir la date de fin et confirmer :") +
        button(d.lien, "Résilier mon abonnement") +
        p("Ce lien est valable 48 heures. Si tu n'es pas à l'origine de cette demande, ignore simplement ce mail : rien ne change.") +
        signature,
    }),
  };
}

export function leqfamResiliation(d: { dateFin: string; engagement: boolean }): Email {
  return {
    subject: "Ta résiliation LEQ'FAM est enregistrée",
    html: layout({
      title: "Résiliation",
      accent: "enregistrée.",
      preheader: `Ton accès reste ouvert jusqu'au ${dateFr(d.dateFin)}.`,
      reason: "Vous recevez ce mail suite à la résiliation de votre abonnement LEQ'FAM.",
      body:
        hello() +
        p(`Ta résiliation est bien enregistrée. ${d.engagement ? "Comme prévu par ton engagement, ton abonnement" : "Ton abonnement"} s'arrête le <strong>${dateFr(d.dateFin)}</strong> : d'ici là, ton accès à la LEQ'FAM reste ouvert et aucun autre prélèvement n'aura lieu après cette date.`) +
        p("Merci d'avoir fait partie de la famille. Tu restes sur le serveur Discord et tu pourras revenir quand tu veux.") +
        signature,
    }),
  };
}

/* ---------------------------------------------------------------------------
   Avis reçu (notification à Rebecca)
   ------------------------------------------------------------------------- */

export function avisAdmin(d: { prenom: string; contexte: string; note: number; texte: string; publication: boolean }): Email {
  return {
    subject: `Nouvel avis ${"★".repeat(d.note)}${"☆".repeat(5 - d.note)} : ${d.prenom}`,
    html: admin(
      "Nouvel avis reçu",
      [["Prénom", d.prenom], ["Contexte", d.contexte || undefined], ["Note", `${d.note} / 5`], ["Avis", d.texte], ["Publication", d.publication ? "Accepte d'être publié sur le site" : "Ne souhaite pas être publié"]],
      d.publication ? "Pour le publier sur le site, ajoutez-le dans content/avis.json (ou demandez-le à Claude)." : undefined,
    ),
  };
}

/* ---------------------------------------------------------------------------
   Candidature ambassadeur
   ------------------------------------------------------------------------- */

type Candidature = { prenom: string; nom: string; email: string; reseaux: string; association: string; concours: "oui" | "non"; parcours: string; motivation: string };

export function candidatureAmbassadeurAdmin(d: Candidature): Email {
  return {
    subject: `Candidature ambassadeur : ${d.prenom} ${d.nom}`,
    html: admin(
      "Nouvelle candidature ambassadeur",
      [
        ["Prénom et nom", `${d.prenom} ${d.nom}`],
        ["Email", d.email],
        ["Réseaux sociaux", d.reseaux || undefined],
        ["Association ou groupe", d.association || undefined],
        ["Concours d'éloquence", d.concours === "oui" ? "A déjà participé à un concours" : "N'a jamais participé à un concours"],
        ["Parcours en éloquence", d.parcours],
        ["Motivation", d.motivation],
      ],
      "Pour l'accepter : lui créer un code dans content/partenaires.json (type « ambassadeur ») et lui donner le rôle LeqAmbassadeur sur Discord (ou demandez-le à Claude).",
    ),
  };
}

export function candidatureAmbassadeurClient(d: { prenom: string }): Email {
  return {
    subject: "Votre candidature pour devenir ambassadeur LEQ",
    html: layout({
      title: "Merci pour",
      accent: "votre candidature !",
      preheader: "Votre candidature pour devenir ambassadeur LEQ est bien reçue.",
      reason: "Vous recevez ce mail car vous avez candidaté pour devenir ambassadeur LEQ sur liebeneloquence.com.",
      body:
        hello(d.prenom) +
        p("Votre candidature pour devenir <strong>ambassadeur LEQ</strong> est bien reçue. Je la lis avec attention et je reviens vers vous par mail.") +
        p("Merci de vouloir faire grandir la communauté avec nous !") +
        signature,
    }),
  };
}

/* ---------------------------------------------------------------------------
   Quiz d'orateur
   ------------------------------------------------------------------------- */

/** Mail du quiz : court, avec la fiche infographie (image `cid:fiche`) et le lien de réservation. */
export function quizClient(d: { result: QuizResult; prenom: string }): Email {
  const r = d.result;
  return {
    subject: `Votre fiche orateur : ${r.profile.name}`,
    html: layout({
      title: "Votre fiche",
      accent: "orateur.",
      preheader: `Vous êtes ${r.profile.name}. Voici votre fiche et vos exercices.`,
      reason: "Vous recevez ce mail car vous avez demandé votre fiche orateur sur liebeneloquence.com.",
      body:
        hello(d.prenom) +
        p(`Merci d'avoir fait le quiz ! Vous êtes <strong>${esc(r.profile.name)}</strong>, niveau <strong>${esc(r.level.name.toLowerCase())}</strong>. Voici votre fiche orateur : vos forces et un exercice concret pour chacun de vos points à travailler. Elle est aussi en pièce jointe, pour la garder ou la partager.`) +
        `<img src="cid:fiche" width="528" alt="Votre fiche orateur : ${esc(r.profile.name)}" style="display:block;width:100%;max-width:528px;height:auto;border:0;border-radius:18px;margin:8px 0 24px">` +
        h2("Envie d'aller plus loin ?") +
        p("Réservez votre séance diagnostic de 30 minutes, offerte : on fait le point ensemble sur votre profil et vos objectifs.") +
        button(SITE.calendly, "Réserver ma séance offerte") +
        signature,
    }),
  };
}

/* ------------------------------------------------------------------------- */

function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
