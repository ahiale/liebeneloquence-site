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
S.bienvenue = await salon({ nom: "👋bienvenue", parent: ACCUEIL, droits: PUBLIC, position: 0, sujet: "Les nouveaux arrivants sont accueillis ici. Commence par lire #📜règlements." });
S.reglements = await salon({ nom: "📜règlements", parent: ACCUEIL, droits: PUBLIC, position: 1, sujet: "Les règles de la LEQ'FAM. En restant sur le serveur, tu les acceptes." });
S.fonctionnement = await salon({ nom: "⚙️fonctionnement", parent: ACCUEIL, droits: PUBLIC, position: 2, sujet: "Comment fonctionne le serveur, salon par salon." });
S.rejoindre = await salon({ nom: "🎟️rejoindre-la-leqfam", parent: ACCUEIL, droits: PUBLIC, position: 3, sujet: `Les formules et l'offre de lancement. Rejoindre : ${SITE}/communaute` });
S.liens = await salon({ nom: "🔗liens-utiles", parent: ACCUEIL, droits: PUBLIC, position: 4, sujet: "Tous les liens Lieben Éloquence : site, quiz, formations, événements, réseaux." });
S.annonces = await salon({ nom: "🔈annonces", parent: ACCUEIL, droits: PUBLIC, position: 5, sujet: "Les annonces officielles de LEQ : nouveautés, événements, lives." });

S.presente = await salon({ nom: "👀présente-toi", parent: LEQFAM, droits: MEMBRES_ECRIRE, position: 0, sujet: "Présente-toi à la communauté avec le modèle épinglé." });
S.discussion = await salon({ nom: "💬discussion-générale", anciens: ["💬discussion-génerale"], parent: LEQFAM, droits: MEMBRES_ECRIRE, position: 1, sujet: "Parle de tout, avec bienveillance." });
S.entraide = await salon({ nom: "🤝entraide", parent: LEQFAM, droits: MEMBRES_ECRIRE, position: 2, sujet: "Une question sur un oral, un discours, le trac ? La communauté t'aide." });
S.entrainements = await salon({ nom: "🏋️entraînements", parent: LEQFAM, droits: MEMBRES_ECRIRE, position: 3, sujet: "Publie tes entraînements (texte, audio, vidéo) et reçois des retours bienveillants." });
S.defis = await salon({ nom: "🎯défis-de-la-semaine", parent: LEQFAM, droits: MEMBRES_LIRE, position: 4, sujet: "Un nouveau défi chaque semaine. Réponds dans le fil sous le défi." });
S.feed = await salon({ nom: "⭐feed", type: 15, parent: LEQFAM, droits: MEMBRES_ECRIRE, position: 5, sujet: "Partage tes discours et tes vidéos : un sujet par prise de parole, les retours en réponse." });
S.quiz = await salon({ nom: "🗳️quiz", anciens: ["🗳️quizz"], parent: LEQFAM, droits: MEMBRES_ECRIRE, position: 6, sujet: "Quiz et sondages pour tester ta culture oratoire." });
S.ressources = await salon({ nom: "📚ressources", parent: LEQFAM, droits: MEMBRES_LIRE, position: 7, sujet: "Fiches, méthodes, livres et vidéos sélectionnés par l'équipe LEQ." });
S.organisations = await salon({ nom: "🌍organisations-internationales", parent: LEQFAM, droits: MEMBRES_LIRE, position: 8, sujet: "Veille : concours d'éloquence, programmes et opportunités des organisations internationales." });
S.temoignages = await salon({ nom: "🗣️témoignages", parent: LEQFAM, droits: MEMBRES_ECRIRE, position: 9, sujet: "Partage tes réussites : un oral réussi, un trac vaincu, un discours qui a marqué." });
S.grandprix = await salon({ nom: "🏆grand-prix-leq", parent: LEQFAM, droits: MEMBRES_LIRE, position: 10, sujet: "Le Grand Prix LEQ, chaque trimestre : thème, règlement, participants et résultats." });

S.programme = await salon({ nom: "🗓️programme-des-lives", parent: ATELIERS, droits: MEMBRES_LIRE, position: 0, sujet: "Le calendrier des lives et des ateliers. Les lives ont lieu dans les salons vocaux ci-dessous." });
await salon({ nom: "Live conseils prise de parole", type: 2, parent: ATELIERS, droits: MEMBRES_ECRIRE, position: 1 });
await salon({ nom: "🎙️Discours et débats", type: 2, parent: ATELIERS, droits: MEMBRES_ECRIRE, position: 2 });

S.ambassadeurs = await salon({ nom: "🌟espace-ambassadeurs", parent: CAT_AMB, droits: AMBASSADEURS, position: 0, sujet: "L'espace des ambassadeurs LEQ : ton code, tes visuels à partager, les nouveautés." });
console.log("= catégories et salons prêts");

// ---------------------------------------------------------------- textes et bannières
const lien = (id) => `<#${id}>`;
const bouton = (label, url) => ({ type: 2, style: 5, label, url });
const MESSAGES = {
  bienvenue: { img: "bienvenue", color: ORANGE, title: "Bienvenue dans la LEQ'FAM !", description:
    `Ici, on apprend à prendre la parole, à convaincre et à s'exprimer avec assurance, **ensemble**.\n\n**Par où commencer ?**\n1. Lis les règles dans ${lien(S.reglements)}.\n2. Découvre le serveur dans ${lien(S.fonctionnement)}.\n3. Rejoins la LEQ'FAM dans ${lien(S.rejoindre)} pour ouvrir tout l'espace membres.\n\nUne question ? Écris-nous à formationn@liebeneloquence.com.`,
    boutons: [bouton("Découvrir Lieben Éloquence", SITE)] },
  reglements: { img: "reglements", color: GOLD, title: "Les règles de la maison", description:
    "**1. Le respect avant tout.** Traitez tout le monde avec respect. Aucun harcèlement, chasse aux sorcières, sexisme, racisme ou discours de haine ne sera toléré.\n\n" +
    "**2. Des retours bienveillants.** On commente une prise de parole, jamais une personne. Un retour utile dit ce qui marche, puis ce qui peut progresser.\n\n" +
    "**3. Ce qui se dit ici reste ici.** Les vidéos, enregistrements et témoignages partagés dans la LEQ'FAM ne sortent pas du serveur sans l'accord de leur auteur.\n\n" +
    "**4. Pas de spam ni de publicité** sans l'accord de l'équipe.\n\n" +
    "**5. Attention aux plus jeunes.** Certains membres sont mineurs : les échanges se font dans les salons du serveur, pas en message privé.\n\n" +
    "**6. Signale ce qui ne va pas.** Si tu remarques quelque chose de contraire aux règles ou qui te met mal à l'aise, informe-en l'équipe. Nous voulons que ce serveur soit accueillant pour tout le monde !\n\n" +
    "En cas de manquement, l'équipe peut retirer l'accès au serveur." },
  rejoindre: { img: "rejoindre", color: ORANGE, title: "Rejoindre la LEQ'FAM", description:
    `La LEQ'FAM, c'est **l'espace membres** du serveur : entraînements, défis chaque semaine, lives, ressources, entraide et le **Grand Prix LEQ** chaque trimestre.\n\n**Les formules**\n• Avec engagement : **3,99 € par mois**\n• Sans engagement : **4,99 € par mois**\n\n**Offre de lancement : 1 € le premier mois.**\n\n**Comment rejoindre ?**\nInscris-toi sur le site : dès que ton abonnement est validé, ton accès s'ouvre automatiquement ici.\nTu as un code ambassadeur ? Tu pourras l'utiliser au moment du paiement.`,
    boutons: [bouton("Rejoindre la LEQ'FAM", `${SITE}/communaute`)] },
  liens: { img: "liens", color: ROYAL, title: "Tous nos liens utiles", description:
    `**Le site** · ${SITE}\n**Le quiz d'orateur** (gratuit, 2 minutes) · ${SITE}/quiz\n**Les formations** · ${SITE}/#offres\n**L'offre Grand Oral** · ${SITE}/grand-oral\n**Une séance à l'unité** · ${SITE}/#seance\n**Les événements** · ${SITE}/evenements\n**La séance découverte offerte** · https://calendly.com/formationn-liebeneloquence/30min\n\n**Instagram** · https://www.instagram.com/becca_lieben/\n**LinkedIn** · https://www.linkedin.com/in/rebecca-lieben-ahiale/\n**Contact** · formationn@liebeneloquence.com`,
    boutons: [bouton("Le site", SITE), bouton("Faire le quiz", `${SITE}/quiz`), bouton("Les événements", `${SITE}/evenements`), bouton("Instagram", "https://www.instagram.com/becca_lieben/")] },
  presente: { img: "presente-toi", color: ORANGE, title: "Présente-toi, on t'écoute !", description:
    "Copie ce modèle, complète-le et publie-le ici :\n\n```\nPrénom :\nCe que je fais (études, métier…) :\nMon objectif à l'oral :\nMon plus grand défi quand je prends la parole :\nUne phrase ou une personne qui m'inspire :\n```\nPrends le temps de lire et d'accueillir les autres présentations : c'est comme ça que la famille s'agrandit." },
  entraide: { img: "entraide", color: ROYAL, title: "Une question ? On s'entraide.", description:
    "Un oral qui approche, un discours qui coince, le trac qui monte ? Pose ta question ici, la communauté et l'équipe te répondent.\n\n**Pour une réponse utile, précise :**\n• le contexte (examen, entretien, soutenance, discours…) ;\n• la date ;\n• ce qui te bloque.\n\nPense à répondre dans le fil de la question pour garder le salon lisible." },
  entrainements: { img: "entrainements", color: ORANGE, title: "On s'entraîne ensemble", description:
    "Publie ici tes entraînements : un texte, un audio ou une vidéo de quelques minutes.\n\n**Pour recevoir de bons retours, indique :**\n• le contexte et le public visé ;\n• ce sur quoi tu veux un avis (voix, rythme, structure, gestuelle…).\n\n**Pour donner un retour :** commence par ce qui fonctionne, puis une piste concrète pour progresser. Toujours dans le fil du message." },
  defis: { img: "defis", color: GOLD, title: "Le défi de la semaine", description:
    "Chaque semaine, un nouveau défi de prise de parole est publié ici : improvisation, argumentation, storytelling, voix…\n\n**Comment participer ?** Réponds dans le **fil** ouvert sous le défi, en texte, en audio ou en vidéo. Les meilleures participations peuvent être mises en avant dans la communauté." },
  ressources: { img: "ressources", color: ROYAL, title: "Les ressources pour progresser", description:
    "Fiches pratiques, méthodes, livres, vidéos et exercices sélectionnés par l'équipe LEQ.\n\nChaque ressource est publiée ici avec une courte explication. Pour en discuter ou poser une question, ouvre un fil sous la ressource." },
  organisations: { img: "organisations", color: ROYAL, title: "Organisations internationales", description:
    "La veille LEQ des opportunités à l'international : concours d'éloquence, programmes jeunesse, appels à candidatures, événements des organisations internationales et de la Francophonie.\n\nLes informations sont publiées ici au fil de l'eau, avec les dates limites et les liens officiels. Une question sur une opportunité ? Ouvre un fil sous la publication." },
  grandprix: { img: "grand-prix", color: GOLD, title: "Le Grand Prix LEQ", description:
    "Chaque trimestre, la LEQ'FAM organise le **Grand Prix LEQ**, avec une dotation de **200 €**.\n\nLe thème, le règlement, les dates et les résultats de chaque édition sont publiés ici. Prépare-toi : chaque entraînement compte !" },
  programme: { img: "lives", color: ORANGE, title: "Le programme des lives", description:
    "Le calendrier des lives et des ateliers est publié ici.\n\nLes lives ont lieu dans les salons vocaux de cette catégorie :\n• **Live conseils prise de parole** : méthodes et réponses à vos questions ;\n• **Discours et débats** : on s'exerce, on débat, on se donne des retours.\n\nActive les notifications de ce salon pour ne rater aucun live." },
  ambassadeurs: { img: "ambassadeurs", color: GOLD, title: "Bienvenue dans l'espace ambassadeurs", description:
    "Merci de porter la voix de LEQ !\n\n**Ici, tu trouveras :**\n• ton **code ambassadeur**, à partager autour de toi : il est utilisable au moment de l'abonnement sur le site ;\n• les visuels et les textes à partager sur tes réseaux ;\n• les nouveautés en avant-première.\n\nUne idée, une question ? Écris-la ici, l'équipe te répond." },
};
const QUELS = { bienvenue: S.bienvenue, reglements: S.reglements, rejoindre: S.rejoindre, liens: S.liens, presente: S.presente, entraide: S.entraide, entrainements: S.entrainements, defis: S.defis, ressources: S.ressources, organisations: S.organisations, grandprix: S.grandprix, programme: S.programme, ambassadeurs: S.ambassadeurs };

for (const [cle, salonId] of Object.entries(QUELS)) {
  const m = MESSAGES[cle];
  // Remplace l'éventuel message d'introduction déjà posté par le robot
  const recents = await api("GET", `/channels/${salonId}/messages?limit=50`);
  for (const old of recents.filter((x) => x.author.id === me.id && x.embeds?.[0]?.footer?.text === MARQUE)) await api("DELETE", `/channels/${salonId}/messages/${old.id}`);
  const fichier = `${m.img}.png`;
  const corps = {
    embeds: [{ title: m.title, description: m.description, color: m.color, image: { url: `attachment://${fichier}` }, footer: { text: MARQUE } }],
    components: m.boutons ? [{ type: 1, components: m.boutons }] : [],
    attachments: [{ id: 0, filename: fichier }],
  };
  const msg = await api("POST", `/channels/${salonId}/messages`, corps, [{ name: fichier, data: await readFile(`/tmp/bannieres/${fichier}`) }]);
  await api("PUT", `/channels/${salonId}/pins/${msg.id}`).catch((e) => console.log("épinglage impossible :", e.message));
  console.log("✓ texte publié et épinglé :", cle);
  await pause(400);
}

// ---------------------------------------------------------------- serveur : icône, description, accueil
const icone = (await readFile("/tmp/bannieres/icone-serveur.png")).toString("base64");
await api("PATCH", `/guilds/${G}`, {
  icon: `data:image/png;base64,${icone}`,
  description: "La communauté francophone de la prise de parole et de l'éloquence, par Lieben Éloquence.",
  rules_channel_id: S.reglements,
});
console.log("✓ icône et description du serveur");

console.log("TERMINÉ");
