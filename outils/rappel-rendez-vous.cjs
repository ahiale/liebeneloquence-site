// Rappel / invitation de dernière minute au rendez-vous mensuel LEQ, envoyé à toute la base de contacts.
// Exécuté dans le conteneur du site :
//   ssh root@169.58.187.153 "cd /opt/leq && docker compose exec -T -e RAPPEL_MODE=apercu site node -" < outils/rappel-rendez-vous.cjs
// RAPPEL_MODE=compte : nombre de destinataires ; apercu : les deux versions envoyées uniquement à formationn@ ; envoi : envoi à tous.
// Les objets réels n'ont aucune mention d'aperçu : « [Aperçu…] » n'est ajouté qu'en mode apercu.
// Un mail par personne, 1,5 s entre deux envois, jamais deux fois à la même adresse (journal /data/rappels.jsonl).
const { execSync } = require("node:child_process");
const fs = require("node:fs");

const RAPPEL = "rendez-vous-mensuel-2026-10-13";
const MEET = "https://meet.google.com/bqk-cmws-vfd";
const PAGE = "https://liebeneloquence.com/evenements/rendez-vous-mensuel-leq-octobre-2026";
const MODE = ["envoi", "compte"].includes(process.env.RAPPEL_MODE) ? process.env.RAPPEL_MODE : "apercu";
const EXCLUS = new Set(["formationn@liebeneloquence.com"]); // l'expéditrice elle-même

if (!fs.existsSync("/tmp/nm/node_modules/nodemailer")) execSync("npm i --silent --no-audit --no-fund --prefix /tmp/nm nodemailer", { stdio: "ignore" });
const nodemailer = require("/tmp/nm/node_modules/nodemailer");

const lire = (n) => { try { return fs.readFileSync(`/data/${n}.jsonl`, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)); } catch { return []; } };
const norm = (e) => String(e || "").trim().toLowerCase();
const valide = (e) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(e);

// ---------------------------------------------------------------- mise en page (charte des mails du site)
const NAVY = "#001636", ROYAL = "#114DA8", ORANGE = "#FF5E01", GOLD = "#FFBD59", TEXT = "#33415c", MUTED = "#6b7a90";
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif", SERIF = "Georgia,'Times New Roman',serif";
const p = (t) => `<p style="margin:0 0 16px;font-family:${FONT};font-size:16px;line-height:1.65;color:${TEXT}">${t}</p>`;
const bouton = (href, label) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td style="border-radius:999px;background:${ORANGE}"><a href="${href}" style="display:inline-block;padding:15px 30px;font:bold 16px ${FONT};color:#fff;text-decoration:none">${label}</a></td></tr></table>`;
const infos = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 4px"><tr><td style="background:#F6F8FC;border-left:4px solid ${GOLD};border-radius:12px;padding:16px 20px;font-family:${FONT};font-size:15px;line-height:1.7;color:${TEXT}"><span style="color:${MUTED}">Quand :</span> <strong style="color:${NAVY}">ce soir, mardi 13 octobre, de 19h30 à 20h30 (heure de Paris)</strong><br><span style="color:${MUTED}">Où :</span> <strong style="color:${NAVY}">en ligne, sur Google Meet</strong><br><span style="color:${MUTED}">Tarif :</span> <strong style="color:${NAVY}">gratuit</strong></td></tr></table>`;
const signature = `<p style="margin:26px 0 0;font-family:${FONT};font-size:16px;color:${TEXT}">À tout à l'heure,</p><p style="margin:4px 0 0;font-family:${SERIF};font-style:italic;font-size:22px;color:${ROYAL}">Rebecca Lieben Ahiale</p><p style="margin:2px 0 0;font-family:${FONT};font-size:13px;color:${MUTED}">Fondatrice de Lieben Éloquence</p>`;
const gabarit = (titre, accent, corps) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EAF0F8"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EAF0F8"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px">
<tr><td style="background:${NAVY};border-radius:24px 24px 0 0;padding:26px 34px"><table role="presentation" width="100%"><tr><td><img src="https://liebeneloquence.com/email/logo-leq.png" width="92" alt="LEQ." style="display:block;width:92px;height:auto"></td><td align="right" style="font-family:${SERIF};font-style:italic;font-size:15px;color:${GOLD}">Parlez pour plaire, convaincre, impacter.</td></tr></table></td></tr>
<tr><td style="height:4px;line-height:4px;font-size:0;background:${ORANGE}">&nbsp;</td></tr>
<tr><td style="background:#fff;padding:34px 34px 38px;border-radius:0 0 24px 24px">
<h1 style="margin:0 0 22px;font-family:${FONT};font-size:26px;line-height:1.2;color:${NAVY}">${titre} <span style="font-family:${SERIF};font-style:italic;font-weight:normal;color:${ORANGE}">${accent}</span></h1>
${corps}${signature}</td></tr>
<tr><td align="center" style="padding:24px 24px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:#94a0b4">Vous recevez ce mail car vous êtes en contact avec Lieben Éloquence. Pour ne plus recevoir nos invitations, répondez simplement « STOP » à ce mail.</td></tr>
</table></td></tr></table></body></html>`;

const MAILS = {
  inscrit: {
    subject: "C'est ce soir à 19h30 : le rendez-vous mensuel LEQ",
    html: gabarit("C'est", "ce soir !", p("Bonjour,") +
      p("Petit rappel : le <strong>rendez-vous mensuel LEQ</strong> commence ce soir à <strong>19h30</strong>. Une heure ouverte pour poser toutes vos questions sur la prise de parole, l'éloquence et vos blocages à l'oral.") +
      infos + bouton(MEET, "Rejoindre le Google Meet") +
      p("Venez avec vos questions : rien n'est préparé à l'avance, on part de ce qui vous intéresse, simplement, entre nous.")),
  },
  invite: {
    subject: "Ce soir 19h30 : le rendez-vous mensuel LEQ, gratuit et ouvert à tous",
    html: gabarit("On se retrouve", "ce soir ?", p("Bonjour,") +
      p("Ce soir à <strong>19h30</strong>, c'est le <strong>rendez-vous mensuel LEQ</strong> : une heure ouverte et gratuite pour poser toutes vos questions sur la prise de parole, l'éloquence et vos blocages à l'oral.") +
      p("Un examen ou une soutenance qui approche ? Un discours à préparer ? Une conversation qui vous intimide ? C'est le moment d'en parler.") +
      infos + bouton(MEET, "Rejoindre le Google Meet à 19h30") +
      p(`Pas besoin de s'inscrire : il suffit de cliquer sur le lien à 19h30. <a href="${PAGE}" style="color:${ROYAL}">En savoir plus sur le rendez-vous</a>.`)),
  },
};

(async () => {
  const inscrits = new Set(lire("inscriptions").filter((l) => String(l.event).startsWith("rendez-vous-mensuel")).map((l) => norm(l.email)));
  const base = new Set([
    ...inscrits,
    ...lire("liste-attente").map((l) => norm(l.email)),
    ...lire("invitations").map((l) => norm(l.email)),
    // Les personnes du quiz (fiche orateur) ne sont pas invitées : elles n'ont donné leur email que pour leur fiche.
    ...lire("demandes").map((l) => norm(l.email)),
    ...lire("newsletter").map((l) => norm(l.email)),
    ...lire("membres").map((l) => norm(l.email)),
  ].filter((e) => valide(e) && !EXCLUS.has(e)));
  const deja = new Set(lire("rappels").filter((l) => l.rappel === RAPPEL).map((l) => norm(l.email)));

  const t = nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } });
  const envoyer = (to, m) => t.sendMail({ from: `"Lieben Éloquence" <${process.env.SMTP_USER}>`, replyTo: process.env.SMTP_USER, to, subject: m.subject, html: m.html });

  if (MODE === "compte") {
    console.log(`destinataires : ${[...base].filter((e) => inscrits.has(e)).length} inscrits + ${[...base].filter((e) => !inscrits.has(e)).length} autres = ${base.size} (déjà envoyés : ${deja.size})`);
    return;
  }
  if (MODE === "apercu") {
    await envoyer(process.env.SMTP_USER, { ...MAILS.inscrit, subject: `[Aperçu : déjà inscrits] ${MAILS.inscrit.subject}` });
    await envoyer(process.env.SMTP_USER, { ...MAILS.invite, subject: `[Aperçu : autres contacts] ${MAILS.invite.subject}` });
    console.log(`aperçus envoyés · destinataires prévus : ${[...base].filter((e) => inscrits.has(e)).length} inscrits + ${[...base].filter((e) => !inscrits.has(e)).length} autres = ${base.size}`);
    return;
  }
  let ok = 0, echecs = 0;
  for (const e of base) {
    if (deja.has(e)) continue;
    try {
      await envoyer(e, inscrits.has(e) ? MAILS.inscrit : MAILS.invite);
      fs.appendFileSync("/data/rappels.jsonl", JSON.stringify({ createdAt: new Date().toISOString(), rappel: RAPPEL, email: e, version: inscrits.has(e) ? "inscrit" : "invite" }) + "\n");
      ok++;
    } catch (err) {
      echecs++;
      console.error("échec", e, err.message);
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  console.log(`envoi terminé : ${ok} envoyés, ${echecs} échecs`);
})();
