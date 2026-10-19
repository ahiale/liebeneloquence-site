// Corrections du serveur Discord (19/10/2026), validées par Rebecca :
// 1. Welcomer et Dyno perdent le droit « Administrateur » mais gardent tous leurs autres droits ;
//    Dyno reçoit l'accès explicite aux salons fermés (journal, salons membres, ambassadeurs) pour continuer ses journaux et sa modération.
// 2. Faute corrigée dans l'événement « Live hebdomadaire ».
// 3. Séance d'accueil hebdomadaire ajoutée dans #fonctionnement (« Ce qu'on fait ensemble ») et annoncée dans #annonces.
// 4. Texte de présentation épinglé dans les salons qui n'en avaient pas.
// Exécution :  ssh root@169.58.187.153 "cd /opt/leq && docker compose exec -T site node --input-type=module -" < communication/discord/corrections-2026-10-19.mjs
const T = process.env.DISCORD_BOT_TOKEN;
const G = "1547666371704520825";
const api = async (methode, p, corps) => {
  const r = await fetch("https://discord.com/api/v10" + p, { method: methode, headers: { Authorization: "Bot " + T, "Content-Type": "application/json" }, body: corps ? JSON.stringify(corps) : undefined });
  if (r.status === 204) return {};
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${methode} ${p} : ${r.status} ${JSON.stringify(d).slice(0, 200)}`);
  return d;
};
const BIT = (n) => 1n << BigInt(n);
const VIEW = BIT(10), SEND = BIT(11), MANAGE_MSG = BIT(13), EMBED = BIT(14), HISTORY = BIT(16), ADMIN = BIT(3);
const ROYAL = 1133992, GOLD = 16760153, ORANGE = 16735745;

const roles = await api("GET", `/guilds/${G}/roles`);
const ch = await api("GET", `/guilds/${G}/channels`);
const salon = (morceau) => ch.find((c) => c.name.includes(morceau));

// 1. Dyno : accès explicite aux salons fermés à @everyone, puis retrait du droit Administrateur (Welcomer et Dyno)
const dyno = roles.find((r) => r.name === "Dyno");
const welcomer = roles.find((r) => r.name === "Welcomer");
const fermes = ch.filter((c) => c.permission_overwrites.some((o) => o.id === G && BigInt(o.deny) & VIEW));
for (const c of fermes) {
  await api("PUT", `/channels/${c.id}/permissions/${dyno.id}`, { type: 0, allow: String(VIEW | SEND | EMBED | HISTORY | MANAGE_MSG), deny: "0" });
  console.log(`Dyno : accès à #${c.name}`);
}
for (const r of [welcomer, dyno]) {
  if (!(BigInt(r.permissions) & ADMIN)) { console.log(`${r.name} : déjà sans droit Administrateur`); continue; }
  await api("PATCH", `/guilds/${G}/roles/${r.id}`, { permissions: String(BigInt(r.permissions) & ~ADMIN) });
  console.log(`${r.name} : droit Administrateur retiré, autres droits conservés`);
}

// 2. Événement
for (const e of await api("GET", `/guilds/${G}/scheduled-events`)) {
  if (e.name.includes("hebdomaire")) {
    await api("PATCH", `/guilds/${G}/scheduled-events/${e.id}`, { name: e.name.replace("hebdomaire", "hebdomadaire") });
    console.log("Événement renommé :", e.name.replace("hebdomaire", "hebdomadaire"));
  }
}

// 3. Séance d'accueil dans #fonctionnement
const SEANCE = "**La séance d'accueil** · chaque semaine, un soir, une séance d'onboarding de 15 minutes pour tous les nouveaux arrivants : on te montre les salons et on te présente tout ce qu'il faut savoir pour bien démarrer.";
const fonct = salon("fonctionnement");
const epingle = (await api("GET", `/channels/${fonct.id}/messages?limit=10`)).find((m) => m.pinned && m.embeds?.some((e) => e.title === "Ce qu'on fait ensemble"));
if (epingle && !JSON.stringify(epingle.embeds).includes("séance d'accueil")) {
  const embeds = epingle.embeds.map(({ type, content_scan_version, ...e }) => (e.title === "Ce qu'on fait ensemble" ? { ...e, description: `${e.description}\n\n${SEANCE}` } : e));
  await api("PATCH", `/channels/${fonct.id}/messages/${epingle.id}`, { embeds });
  console.log("#fonctionnement : séance d'accueil ajoutée");
}

// 4. Textes de présentation (publiés une seule fois, puis épinglés)
const INTROS = [
  { salon: "annonces", embed: { title: "Une séance d'accueil chaque semaine", description: "Chaque semaine, un soir, nous organisons une **séance d'onboarding de 15 minutes** pour tous les nouveaux arrivants : on te montre les salons et on te présente tout ce qu'il faut savoir pour bien démarrer dans la LEQ'FAM.\n\nLa date de la prochaine séance est annoncée ici.", color: ORANGE } },
  { salon: "discussion-générale", embed: { title: "On discute de tout ici", description: "Éloquence, communication, culture générale et tout ce qui gravite autour : partage un discours qui t'a marqué, une question, une actu ou un débat.\n\nReste bienveillant : les règles de #📜règlements s'appliquent ici aussi.", color: ROYAL } },
  { salon: "témoignages", embed: { title: "Raconte tes progrès", description: "Une prise de parole réussie, un oral passé, un déclic ? Partage-le ici pour inspirer la communauté. Chaque petite victoire compte.", color: GOLD } },
  { salon: "Live conseils", embed: { title: "Les ateliers en direct", description: "Les lives se déroulent ici. Les dates sont dans les **Événements** du serveur, tout en haut de la liste des salons : clique sur « Intéressé » pour recevoir un rappel.", color: ROYAL } },
  { salon: "Discours et débats", embed: { title: "S'entraîner à voix haute", description: "Le salon pour s'entraîner librement, avec un admin : discours, débats, improvisation.", color: GOLD } },
];
const moi = await api("GET", "/users/@me");
for (const i of INTROS) {
  const c = salon(i.salon);
  if (!c) { console.log(`Salon introuvable : ${i.salon}`); continue; }
  const deja = (await api("GET", `/channels/${c.id}/messages?limit=50`)).some((m) => m.author.id === moi.id && m.embeds?.[0]?.title === i.embed.title);
  if (deja) { console.log(`#${c.name} : texte déjà présent`); continue; }
  const m = await api("POST", `/channels/${c.id}/messages`, { embeds: [{ ...i.embed, footer: { text: "LEQ'FAM · Lieben Éloquence" } }] });
  await api("PUT", `/channels/${c.id}/pins/${m.id}`).catch((e) => console.log("épinglage impossible", e.message));
  console.log(`#${c.name} : texte publié et épinglé`);
}
