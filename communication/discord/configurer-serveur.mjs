// Met en place le serveur Discord LEQ'FAM : rôles, catégories, salons, permissions, textes et bannières.
// Exécuté sur le serveur, dans le conteneur du site (le token du robot y est déjà) :
//   ssh root@169.58.187.153 "cd /opt/leq && docker compose exec -T site node --input-type=module -" < communication/discord/configurer-serveur.mjs
// Les bannières doivent être copiées au préalable dans /tmp/bannieres du conteneur (voir communication/discord/LISEZMOI.md).
// Relançable sans risque : les salons existants sont mis à jour, les messages du robot remplacés, rien n'est dupliqué.

import { readFile } from "node:fs/promises";

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const G = "1547666371704520825";
const SITE = "https://liebeneloquence.com";
const ORANGE = 0xff5e01, GOLD = 0xffbd59, ROYAL = 0x114da8;
const MARQUE = "LEQ'FAM · Lieben Éloquence";

const pause = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(method, path, body, files) {
  for (let essai = 0; essai < 5; essai++) {
    const init = { method, headers: { Authorization: `Bot ${TOKEN}` } };
    if (files) {
      const fd = new FormData();
      fd.append("payload_json", JSON.stringify(body));
      files.forEach((f, i) => fd.append(`files[${i}]`, new Blob([f.data], { type: "image/png" }), f.name));
      init.body = fd;
    } else if (body !== undefined) {
      init.headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }
    const r = await fetch(`https://discord.com/api/v10${path}`, init);
    if (r.status === 429) {
      const attente = (await r.json()).retry_after ?? 1;
      if (attente > 60) throw new Error(`${method} ${path} : limite Discord, réessayer dans ${Math.ceil(attente / 60)} min`);
      await pause(attente * 1000 + 200);
      continue;
    }
    if (r.status === 204) return null;
    const data = await r.json().catch(() => null);
    if (!r.ok) throw new Error(`${method} ${path} → ${r.status} ${JSON.stringify(data)}`);
    return data;
  }
  throw new Error(`${method} ${path} : trop de tentatives`);
}

// ---------------------------------------------------------------- permissions
const P = { VIEW: 1n << 10n, SEND: 1n << 11n, HIST: 1n << 16n, REACT: 1n << 6n, EMBED: 1n << 14n, ATTACH: 1n << 15n, THREAD: 1n << 35n, SEND_THREAD: 1n << 38n, CONNECT: 1n << 20n, SPEAK: 1n << 21n, STREAM: 1n << 9n, VOICE_ACT: 1n << 25n };
const bits = (...k) => String(k.reduce((a, n) => a | P[n], 0n));
const ECRIRE = bits("VIEW", "SEND", "HIST", "REACT", "EMBED", "ATTACH", "THREAD", "SEND_THREAD", "CONNECT", "SPEAK", "STREAM", "VOICE_ACT");
const LIRE = bits("VIEW", "HIST", "REACT", "THREAD", "SEND_THREAD", "CONNECT");

// ---------------------------------------------------------------- état actuel
const me = await api("GET", "/users/@me");
let roles = await api("GET", `/guilds/${G}/roles`);
const role = (nom) => roles.find((r) => r.name === nom);
const EVERYONE = G;

// Rôle Ambassadeur (créé une seule fois) et rôle Membre (LeqOra) affiché à part dans la liste des membres
if (!role("LeqAmbassadeur")) {
  await api("POST", `/guilds/${G}/roles`, { name: "LeqAmbassadeur", color: GOLD, hoist: true, mentionable: true });
  console.log("+ rôle LeqAmbassadeur");
}
roles = await api("GET", `/guilds/${G}/roles`);
await api("PATCH", `/guilds/${G}/roles/${role("LeqOra").id}`, { hoist: true, color: ROYAL });
// Juste au-dessus de LeqOra (le robot ne peut déplacer que les rôles situés sous le sien)
if (role("LeqAmbassadeur").position <= role("LeqOra").position) {
  await api("PATCH", `/guilds/${G}/roles`, [{ id: role("LeqAmbassadeur").id, position: role("LeqOra").position + 1 }]);
}
roles = await api("GET", `/guilds/${G}/roles`);
const AMB = role("LeqAmbassadeur").id, MEMBRE = role("LeqOra").id;
console.log("= rôles prêts (LeqOra = membres, LeqAmbassadeur au-dessus)");

const PUBLIC = [
  { id: EVERYONE, type: 0, allow: bits("VIEW", "HIST", "REACT"), deny: bits("SEND", "THREAD", "SEND_THREAD") },
];
const MEMBRES_ECRIRE = [
  { id: EVERYONE, type: 0, allow: "0", deny: bits("VIEW") },
  { id: MEMBRE, type: 0, allow: ECRIRE, deny: "0" },
  { id: AMB, type: 0, allow: ECRIRE, deny: "0" },
];
const MEMBRES_LIRE = [
  { id: EVERYONE, type: 0, allow: "0", deny: bits("VIEW") },
  { id: MEMBRE, type: 0, allow: LIRE, deny: bits("SEND") },
  { id: AMB, type: 0, allow: LIRE, deny: bits("SEND") },
];
const AMBASSADEURS = [
  { id: EVERYONE, type: 0, allow: "0", deny: bits("VIEW") },
  { id: AMB, type: 0, allow: ECRIRE, deny: "0" },
];

// L'accueil automatique (onboarding) donnait le rôle membre, qui est payant : il est désactivé,
// et ses salons par défaut deviennent ceux de l'espace public (exigence de Discord avant de fermer les autres).
const salonsInit = await api("GET", `/guilds/${G}/channels`);
const accueilInit = salonsInit.find((c) => c.type === 4 && /accueil|acceuil/i.test(c.name));
const onboarding = await api("GET", `/guilds/${G}/onboarding`);
await api("PUT", `/guilds/${G}/onboarding`, { prompts: [], default_channel_ids: [accueilInit.id], enabled: false, mode: onboarding.mode ?? 0 });
console.log("✓ question d'accueil désactivée (elle donnait le rôle membre gratuitement)");

// Guide du serveur : les étapes proposées aux nouveaux arrivants doivent viser des salons publics.
// L'étape « Se présenter » (salon membres) est retirée ; « Rejoindre la LEQ'FAM » est ajoutée en fin de script.
const guide = await api("GET", `/guilds/${G}/new-member-welcome`);
const publics = salonsInit.filter((c) => c.parent_id === accueilInit.id).map((c) => c.id);
const horsPublic = guide.new_member_actions.filter((a) => !publics.includes(a.channel_id));
// Les robots ne peuvent pas modifier le guide du serveur : ces étapes sont à changer à la main.
if (horsPublic.length) console.log("! guide du serveur : à modifier à la main (étapes vers des salons membres) :", horsPublic.map((a) => a.title.trim()).join(", "));
const bloquesParLeGuide = new Set(horsPublic.map((a) => a.channel_id));
const publicsDuGuide = new Set(guide.new_member_actions.map((a) => a.channel_id));

// ---------------------------------------------------------------- salons
let salons = await api("GET", `/guilds/${G}/channels`);
const base = (n) => n.normalize("NFD").replace(/[^a-z0-9]/gi, "").toLowerCase();
const trouver = (anciens, type) => salons.find((c) => (type === undefined || c.type === type) && anciens.some((a) => base(c.name) === base(a)));

// N'envoie que les champs qui changent : Discord limite à 2 modifications de nom ou de sujet par salon toutes les 10 minutes.
const memesDroits = (a = [], b = []) => JSON.stringify([...a].map((o) => [o.id, String(o.allow), String(o.deny)]).sort()) === JSON.stringify([...b].map((o) => [o.id, String(o.allow), String(o.deny)]).sort());
function changements(c, corps) {
  const d = {};
  for (const [k, v] of Object.entries(corps)) {
    if (v === undefined) continue;
    if (k === "permission_overwrites") { if (!memesDroits(c.permission_overwrites, v)) d[k] = v; }
    else if ((c[k] ?? null) !== (v ?? null)) d[k] = v;
  }
  return d;
}
async function maj(c, corps) {
  const d = changements(c, corps);
  return Object.keys(d).length ? api("PATCH", `/channels/${c.id}`, d) : c;
}

async function categorie(nom, anciens, droits, position) {
  let c = trouver([nom, ...anciens], 4);
  const corps = { name: nom, permission_overwrites: droits, position };
  if (c) c = await maj(c, corps);
  else { c = await api("POST", `/guilds/${G}/channels`, { ...corps, type: 4 }); console.log("+ catégorie", nom); }
  salons = await api("GET", `/guilds/${G}/channels`);
  return c.id;
}
async function salon({ nom, anciens = [], type = 0, parent, droits, sujet, position }) {
  let c = trouver([nom, ...anciens], type);
  const corps = { name: nom, parent_id: parent, permission_overwrites: droits, position, ...(type === 2 ? {} : { topic: sujet ?? null }) };
  if (c && bloquesParLeGuide.has(c.id)) {
    // Salon cité dans le guide du serveur : Discord exige qu'il reste visible par tous tant que le guide le cite.
    await maj(c, { ...corps, permission_overwrites: undefined });
    console.log(`! ${nom} reste public tant que le guide du serveur y renvoie`);
    salons = await api("GET", `/guilds/${G}/channels`);
    return c.id;
  }
  if (c) c = await maj(c, corps);
  else { c = await api("POST", `/guilds/${G}/channels`, { ...corps, type }); console.log("+ salon", nom); }
  salons = await api("GET", `/guilds/${G}/channels`);
  return c.id;
}

const ACCUEIL = await categorie("📌 Accueil & informations", ["📌 Acceuil & informations"], PUBLIC, 0);
const LEQFAM = await categorie("👥LeqFam ( Communauté )", [], MEMBRES_ECRIRE, 1);
const ATELIERS = await categorie("📹LeqAteliers ( Live )", [], MEMBRES_ECRIRE, 2);
const CAT_AMB = await categorie("🌟LeqAmbassadeurs", [], AMBASSADEURS, 3);
const staff = trouver(["🪿Staff"], 4);
if (staff) await maj(staff, { position: 4 });

const S = {};
// Accueil : 4 salons publics en lecture seule
S.bienvenue = await salon({ nom: "👋bienvenue", parent: ACCUEIL, droits: PUBLIC, position: 0, sujet: "Chaque nouvel arrivant est salué ici. Ensuite, direction #📜règlements et #⚙️fonctionnement." });
S.reglements = await salon({ nom: "📜règlements", parent: ACCUEIL, droits: PUBLIC, position: 1, sujet: "Les règles de la LEQ'FAM. En restant sur le serveur, tu les acceptes." });
S.fonctionnement = await salon({ nom: "⚙️fonctionnement", parent: ACCUEIL, droits: PUBLIC, position: 2, sujet: "Tout comprendre en une minute : la LEQ'FAM, les salons, comment rejoindre, les liens utiles." });
S.liens = await salon({ nom: "🔗liens-utiles", parent: ACCUEIL, droits: PUBLIC, position: 4, sujet: "Tous les liens Lieben Éloquence : site, quiz, formations, événements, réseaux." });
S.annonces = await salon({ nom: "🔈annonces", parent: ACCUEIL, droits: PUBLIC, position: 3, sujet: "Les annonces officielles : dates des lives, Grand Prix, nouveautés LEQ." });

// Communauté : membres et ambassadeurs
S.presente = await salon({ nom: "👀présente-toi", parent: LEQFAM, droits: MEMBRES_ECRIRE, position: 0, sujet: "Présente-toi à la communauté avec le modèle épinglé." });
S.discussion = await salon({ nom: "💬discussion-générale", anciens: ["💬discussion-génerale"], parent: LEQFAM, droits: MEMBRES_ECRIRE, position: 1, sujet: "Éloquence, communication, culture générale et tout ce qui gravite autour." });
S.entraide = await salon({ nom: "🤝entraide", parent: LEQFAM, droits: MEMBRES_ECRIRE, position: 2, sujet: "Un discours, un entretien, une soutenance ? Demande conseils et retours sur tes textes, audios et vidéos." });
S.temoignages = await salon({ nom: "🗣️témoignages", parent: LEQFAM, droits: MEMBRES_ECRIRE, position: 3, sujet: "Tes progrès, tes prises de parole et tes déclics, pour inspirer la communauté." });
S.ressources = await salon({ nom: "📚ressources-et-opportunités", type: 15, parent: LEQFAM, droits: MEMBRES_LIRE, position: 4,
  sujet: "Une fiche par ressource ou opportunité. Filtre avec les étiquettes, commente sous chaque fiche." });
S.grandprix = await salon({ nom: "🏆grand-prix-leq", parent: LEQFAM, droits: MEMBRES_LIRE, position: 5, sujet: "Le Grand Prix LEQ, chaque trimestre : thème, règlement, résultats et archives." });

// Étiquettes du forum (créées une fois)
const forum = salons.find((c) => c.id === S.ressources);
const ETIQUETTES = ["Ressource", "Opportunité internationale", "Concours"];
const manquantes = ETIQUETTES.filter((t) => !(forum.available_tags ?? []).some((x) => x.name === t));
if (manquantes.length) {
  await api("PATCH", `/channels/${S.ressources}`, { available_tags: [...(forum.available_tags ?? []), ...manquantes.map((name) => ({ name }))], default_forum_layout: 1, default_sort_order: 1 });
  console.log("+ étiquettes du forum ressources");
}

// Lives : les deux salons vocaux (le calendrier passe par les Événements Discord)
await salon({ nom: "Live conseils prise de parole", type: 2, parent: ATELIERS, droits: MEMBRES_ECRIRE, position: 0 });
await salon({ nom: "🎙️Discours et débats", type: 2, parent: ATELIERS, droits: MEMBRES_ECRIRE, position: 1 });

S.ambassadeurs = await salon({ nom: "🌟espace-ambassadeurs", parent: CAT_AMB, droits: AMBASSADEURS, position: 0, sujet: "L'espace des ambassadeurs LEQ : ton code, tes visuels à partager, les nouveautés." });

// Salons retirés de la structure (vides, sauf les messages du robot)
const A_SUPPRIMER = ["🎟️rejoindre-la-leqfam", "🏋️entraînements", "🎯défis-de-la-semaine", "⭐feed", "🗳️quiz", "🗳️quizz", "📚ressources", "🌍organisations-internationales", "🗓️programme-des-lives"];
for (const nom of A_SUPPRIMER) {
  const c = salons.find((x) => x.type !== 4 && base(x.name) === base(nom));
  if (!c) continue;
  if (publicsDuGuide.has(c.id)) { console.log(`! ${c.name} conservé : le guide du serveur y renvoie encore`); continue; }
  try { await api("DELETE", `/channels/${c.id}`); console.log("- salon supprimé :", c.name); }
  catch (e) { console.log(`! ${c.name} non supprimé : ${e.message}`); }
}
salons = await api("GET", `/guilds/${G}/channels`);
console.log("= catégories et salons prêts");

// ---------------------------------------------------------------- textes et bannières
const lien = (id) => `<#${id}>`;
const bouton = (label, url) => ({ type: 2, style: 5, label, url });
const rangee = (...b) => ({ type: 1, components: b });
const salonUrl = (id) => `https://discord.com/channels/${G}/${id}`;

const FONCTIONNEMENT = {
  embeds: [
    { color: ORANGE, title: "Bienvenue dans la LEQ'FAM", description:
      "La toute première communauté francophone dédiée à la prise de parole en public et à la culture sociétale.\n\n" +
      "Je m'appelle **Rebecca Lieben Ahiale**, coach en éloquence et en prise de parole en public. J'ai créé cet espace bienveillant pour démocratiser la prise de parole, s'entraîner, s'entraider et montrer tout le champ des possibles quand on sait bien manier sa langue.\n\n" +
      "Que vous soyez débutant ou déjà expert, quel que soit votre pays ou votre continent, vous êtes toutes et tous les bienvenus. 😊",
      footer: { text: MARQUE } },
    { color: GOLD, title: "Ce qu'on fait ensemble", description:
      "**Les lives** · 3 à 4 fois par mois, j'anime un atelier en direct sur des thèmes choisis par la communauté : prise de parole, storytelling, gestion du trac, improvisation. Des séances pratiques où l'on apprend en faisant, parfois avec des invités surprises.\n\n" +
      "**Le Grand Prix LEQ** · chaque trimestre, un concours d'éloquence et de culture sociétale ouvert à tous les membres, sur un thème tiré au sort. Le gagnant est désigné par les votes de ses pairs et par un jury invité, différent à chaque édition.\n\n" +
      "**L'entraide au quotidien** · tu prépares un discours, un entretien ou une soutenance ? Partage tes textes, tes audios ou tes vidéos : la communauté te fait des retours bienveillants et constructifs.\n\n" +
      "**Des avantages et des opportunités** · des réductions sur les événements et formations LEQ, et une sélection d'opportunités : organisations internationales, associations, cours, concours." },
    { color: ROYAL, title: "Comment s'organise le serveur", description:
      `${lien(S.annonces)} · les informations importantes : dates des lives, Grand Prix, nouveautés LEQ.\n\n` +
      "**Réservés aux membres de la LEQ'FAM :**\n" +
      `${lien(S.presente)} · pour te présenter et créer des liens.\n` +
      `${lien(S.discussion)} · éloquence, communication, culture générale et tout ce qui gravite autour.\n` +
      `${lien(S.entraide)} · conseils et retours sur tes discours, entretiens et soutenances.\n` +
      `${lien(S.temoignages)} · tes progrès et tes déclics, pour inspirer les autres.\n` +
      `${lien(S.ressources)} · articles, podcasts, vidéos, outils et opportunités, à filtrer par étiquette.\n` +
      `${lien(S.grandprix)} · thèmes, règlement, résultats et archives du Grand Prix.\n` +
      "**Les salons vocaux** · un pour les ateliers en direct, un pour s'entraîner librement avec un admin.\n\n" +
      "Les lives sont programmés dans les **Événements** du serveur, tout en haut de la liste des salons : clique sur « Intéressé » pour recevoir un rappel." },
    { color: ORANGE, title: "Rejoindre la LEQ'FAM", description:
      "Les salons membres s'ouvrent dès que tu as rejoint la LEQ'FAM :\n" +
      "• **avec engagement** : 3,99 € par mois ;\n" +
      "• **sans engagement** : 4,99 € par mois.\n\n" +
      "**Offre de lancement : 1 € le premier mois.** Tu as un code ambassadeur ? Il s'utilise au moment du paiement.",
      image: { url: "attachment://bienvenue.png" } },
  ],
  components: [
    rangee(bouton("Rejoindre la LEQ'FAM", `${SITE}/communaute`)),
    rangee(bouton("Le site", SITE), bouton("Le quiz d'orateur", `${SITE}/quiz`), bouton("Les événements", `${SITE}/evenements`), bouton("Instagram", "https://www.instagram.com/becca_lieben/")),
    rangee(bouton("Membre ? Étape suivante : les règles →", salonUrl(S.reglements))),
  ],
};

const MESSAGES = {
  reglements: { img: "reglements", color: GOLD, title: "Les règles de la maison", description:
    "**1. Le respect avant tout.** Traitez tout le monde avec respect. Aucun harcèlement, chasse aux sorcières, sexisme, racisme ou discours de haine ne sera toléré.\n\n" +
    "**2. Des retours bienveillants.** On commente une prise de parole, jamais une personne. Un retour utile dit ce qui marche, puis ce qui peut progresser.\n\n" +
    "**3. Ce qui se dit ici reste ici.** Les vidéos, enregistrements et témoignages partagés dans la LEQ'FAM ne sortent pas du serveur sans l'accord de leur auteur.\n\n" +
    "**4. Pas de spam ni de publicité** sans l'accord de l'équipe.\n\n" +
    "**5. Attention aux plus jeunes.** Certains membres sont mineurs : les échanges se font dans les salons du serveur, pas en message privé.\n\n" +
    "**6. Signale ce qui ne va pas.** Si tu remarques quelque chose de contraire aux règles ou qui te met mal à l'aise, informe-en l'équipe. Nous voulons que ce serveur soit accueillant pour tout le monde !\n\n" +
    "En cas de manquement, l'équipe peut retirer l'accès au serveur.",
    boutons: [bouton("Membre ? Étape suivante : me présenter →", salonUrl(S.presente))] },
  presente: { img: "presente-toi", color: ORANGE, title: "Présente-toi, on t'écoute !", description:
    "Copie ce modèle, complète-le et publie-le ici :\n\n```\nPrénom :\nCe que je fais (études, métier…) :\nMon objectif à l'oral :\nMon plus grand défi quand je prends la parole :\nUne phrase ou une personne qui m'inspire :\n```\nPrends le temps de lire et d'accueillir les autres présentations : c'est comme ça que la famille s'agrandit.\n\nEnsuite, à toi d'explorer :",
    boutons: [bouton("Entraide", salonUrl(S.entraide)), bouton("Ressources et opportunités", salonUrl(S.ressources)), bouton("Grand Prix LEQ", salonUrl(S.grandprix))] },
  entraide: { img: "entraide", color: ROYAL, title: "Une question ? On s'entraide.", description:
    "Un discours, un entretien ou une soutenance à préparer ? Pose ta question ou partage ton texte, ton audio ou ta vidéo : la communauté et l'équipe te répondent.\n\n**Pour une réponse utile, précise :**\n• le contexte (examen, entretien, soutenance, discours…) et la date ;\n• ce sur quoi tu veux un avis (structure, voix, rythme, gestuelle…).\n\n**Pour donner un retour :** commence par ce qui fonctionne, puis une piste concrète pour progresser. Réponds dans le fil du message pour garder le salon lisible." },
  grandprix: { img: "grand-prix", color: GOLD, title: "Le Grand Prix LEQ", description:
    "Chaque trimestre, un concours d'éloquence et de culture sociétale ouvert à tous les membres, sur un **thème tiré au sort**.\n\nLe gagnant est désigné par **les votes de ses pairs et un jury invité**, différent à chaque édition, et remporte une dotation de **200 €**.\n\nLe thème, le règlement, les dates, les résultats et les archives de chaque édition sont publiés ici." },
  ambassadeurs: { img: "ambassadeurs", color: GOLD, title: "Bienvenue dans l'espace ambassadeurs", description:
    "Merci de porter la voix de LEQ !\n\n**Ici, tu trouveras :**\n• ton **code ambassadeur**, à partager autour de toi : il s'utilise au moment de l'abonnement ;\n• les visuels et les textes à partager sur tes réseaux ;\n• les nouveautés en avant-première.\n\nUne idée, une question ? Écris-la ici, l'équipe te répond." },
};

/** Supprime les anciens messages d'introduction du robot (et ses avis d'épinglage) dans un salon. */
async function nettoyer(salonId, aussiAuteur) {
  const recents = await api("GET", `/channels/${salonId}/messages?limit=100`);
  for (const m of recents) {
    const robot = m.author.id === me.id && (m.type === 6 || m.embeds?.some((e) => e.footer?.text === MARQUE) || m.content?.includes("video-accueil.mp4"));
    if (robot || (aussiAuteur && m.author.username === aussiAuteur)) await api("DELETE", `/channels/${salonId}/messages/${m.id}`);
  }
}
async function publier(salonId, corps, fichier) {
  const msg = await api("POST", `/channels/${salonId}/messages`, { ...corps, attachments: [{ id: 0, filename: fichier }] }, [{ name: fichier, data: await readFile(`/tmp/bannieres/${fichier}`) }]);
  await api("PUT", `/channels/${salonId}/pins/${msg.id}`).catch((e) => console.log("épinglage impossible :", e.message));
  const apres = await api("GET", `/channels/${salonId}/messages?limit=5`);
  for (const m of apres.filter((x) => x.type === 6 && x.author.id === me.id)) await api("DELETE", `/channels/${salonId}/messages/${m.id}`);
}

// #bienvenue : réservé à Welcomer, le message du robot est retiré
await nettoyer(S.bienvenue);
console.log("✓ bienvenue : message du robot retiré");

// #fonctionnement : l'ancien texte de Rebecca (compte __leq) est remplacé par la version mise à jour
await nettoyer(S.fonctionnement, "__leq");
await publier(S.fonctionnement, { embeds: FONCTIONNEMENT.embeds, components: FONCTIONNEMENT.components }, "bienvenue.png");
await api("POST", `/channels/${S.fonctionnement}/messages`, { content: `🎬 **Nouveau membre ? La visite en 18 secondes :**
${SITE}/discord/video-accueil.mp4` });
console.log("✓ fonctionnement : guide complet publié et épinglé, vidéo d'accueil en dessous");

for (const [cle, salonId] of Object.entries({ reglements: S.reglements, presente: S.presente, entraide: S.entraide, grandprix: S.grandprix, ambassadeurs: S.ambassadeurs })) {
  const m = MESSAGES[cle];
  await nettoyer(salonId);
  await publier(salonId, { embeds: [{ title: m.title, description: m.description, color: m.color, image: { url: `attachment://${m.img}.png` }, footer: { text: MARQUE } }], components: m.boutons ? [rangee(...m.boutons)] : [] }, `${m.img}.png`);
  console.log("✓ texte publié et épinglé :", cle);
  await pause(400);
}

// Forum ressources : une fiche épinglée « À lire » en tête
const fils = (await api("GET", `/guilds/${G}/threads/active`)).threads.filter((t) => t.parent_id === S.ressources && t.owner_id === me.id);
for (const t of fils) await api("DELETE", `/channels/${t.id}`);
const etiquettes = (await api("GET", `/channels/${S.ressources}`)).available_tags;
const fiche = await api("POST", `/channels/${S.ressources}/threads`, {
  name: "À lire : comment utiliser ce salon",
  applied_tags: etiquettes.filter((t) => t.name === "Ressource").map((t) => t.id),
  message: { embeds: [{ color: ROYAL, title: "Ressources et opportunités", image: { url: "attachment://ressources.png" }, footer: { text: MARQUE }, description:
    "Ici, chaque publication est une **fiche** : une ressource pour progresser (article, podcast, vidéo, livre, outil) ou une opportunité (organisations internationales, associations, cours, concours).\n\n" +
    "**Pour t'y retrouver**, filtre avec les étiquettes en haut du salon :\n• **Ressource** · pour progresser à l'oral ;\n• **Opportunité internationale** · programmes, appels à candidatures, événements ;\n• **Concours** · concours d'éloquence et de culture générale.\n\n" +
    "Les fiches sont publiées par l'équipe LEQ. Une question ou un avis ? Réponds directement sous la fiche." }],
    attachments: [{ id: 0, filename: "ressources.png" }] },
}, [{ name: "ressources.png", data: await readFile("/tmp/bannieres/ressources.png") }]);
await api("PATCH", `/channels/${fiche.id}`, { flags: 2 }).catch((e) => console.log("épinglage de la fiche impossible :", e.message));
console.log("✓ forum ressources : fiche « À lire » épinglée");

// ---------------------------------------------------------------- serveur : icône, description, accueil
const icone = (await readFile("/tmp/bannieres/icone-serveur.png")).toString("base64");
await api("PATCH", `/guilds/${G}`, {
  icon: `data:image/png;base64,${icone}`,
  description: "La communauté francophone de la prise de parole et de l'éloquence, par Lieben Éloquence.",
  rules_channel_id: S.reglements,
});
console.log("✓ icône et description du serveur");

console.log("TERMINÉ");
