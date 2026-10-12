import "server-only";

/**
 * Discord : connexion des membres (OAuth2) et gestion du rôle LEQ'FAM par le robot LEQ.
 * Le robot ne retire jamais un rôle qu'il n'a pas donné lui-même (partenaires et ambassadeurs sont gérés à la main).
 */
export const DISCORD = {
  serveur: "1547666371704520825",
  roleMembre: process.env.DISCORD_ROLE_MEMBRE || "", // id du rôle LeqOra, renseigné sur le serveur
  salonArrivee: process.env.DISCORD_SALON_ARRIVEE || "", // id de #présente-toi
  redirection: "https://liebeneloquence.com/communaute/discord",
};

const API = "https://discord.com/api/v10";

async function robot(method: string, chemin: string, corps?: unknown): Promise<Response> {
  for (let essai = 0; essai < 4; essai++) {
    const r = await fetch(`${API}${chemin}`, {
      method,
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`, ...(corps ? { "Content-Type": "application/json" } : {}) },
      body: corps ? JSON.stringify(corps) : undefined,
      cache: "no-store",
    });
    if (r.status !== 429) return r;
    const attente = ((await r.json()) as { retry_after?: number }).retry_after ?? 1;
    await new Promise((ok) => setTimeout(ok, attente * 1000 + 100));
  }
  throw new Error(`Discord ${method} ${chemin} : trop de tentatives`);
}

/** Lien d'autorisation Discord (identification + ajout au serveur). */
export function lienAutorisation(etat: string): string {
  const p = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID ?? "",
    response_type: "code",
    redirect_uri: DISCORD.redirection,
    scope: "identify email guilds.join",
    state: etat,
    prompt: "none",
  });
  return `https://discord.com/oauth2/authorize?${p}`;
}

export type CompteDiscord = { id: string; username: string; global_name: string | null; email: string | null };

/** Échange le code renvoyé par Discord, lit le compte et ajoute la personne au serveur (sans rôle). */
export async function connecterEtRejoindre(code: string): Promise<CompteDiscord> {
  const jeton = await fetch(`${API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID ?? "",
      client_secret: process.env.DISCORD_CLIENT_SECRET ?? "",
      grant_type: "authorization_code",
      code,
      redirect_uri: DISCORD.redirection,
    }),
  }).then((r) => r.json() as Promise<{ access_token?: string; error?: string }>);
  if (!jeton.access_token) throw new Error(`Connexion Discord refusée : ${jeton.error ?? "inconnue"}`);
  const compte = (await fetch(`${API}/users/@me`, { headers: { Authorization: `Bearer ${jeton.access_token}` } }).then((r) => r.json())) as CompteDiscord;
  // Ajout au serveur (sans effet si la personne y est déjà)
  const r = await robot("PUT", `/guilds/${DISCORD.serveur}/members/${compte.id}`, { access_token: jeton.access_token });
  if (!r.ok && r.status !== 204) console.error("Ajout au serveur Discord impossible", r.status, await r.text());
  return compte;
}

export async function donnerRoleMembre(idDiscord: string): Promise<boolean> {
  const r = await robot("PUT", `/guilds/${DISCORD.serveur}/members/${idDiscord}/roles/${DISCORD.roleMembre}`);
  if (!r.ok) console.error("Rôle membre non donné", idDiscord, r.status, await r.text());
  return r.ok;
}

export async function retirerRoleMembre(idDiscord: string): Promise<boolean> {
  const r = await robot("DELETE", `/guilds/${DISCORD.serveur}/members/${idDiscord}/roles/${DISCORD.roleMembre}`);
  if (!r.ok) console.error("Rôle membre non retiré", idDiscord, r.status, await r.text());
  return r.ok;
}

/** Identifiants des salons utiles à l'accueil, retrouvés par leur nom (mis en cache). */
let salonsAccueil: Record<string, string> | null = null;
async function salons(): Promise<Record<string, string>> {
  if (salonsAccueil) return salonsAccueil;
  const liste = (await (await robot("GET", `/guilds/${DISCORD.serveur}/channels`)).json()) as { id: string; name: string }[];
  const trouver = (mot: string) => liste.find((c) => c.name.normalize("NFD").replace(/[̀-ͯ]/g, "").includes(mot))?.id ?? "";
  salonsAccueil = { reglements: trouver("reglements"), fonctionnement: trouver("fonctionnement"), presente: trouver("presente-toi"), entraide: trouver("entraide"), ressources: trouver("ressources") };
  return salonsAccueil;
}
const lienSalon = (id: string) => `https://discord.com/channels/${DISCORD.serveur}/${id}`;

/** Accueil automatique d'un nouveau membre : message dans #présente-toi, puis guide « Commence ici » en message privé. */
export async function souhaiterBienvenue(idDiscord: string): Promise<void> {
  const s = await salons();
  const salonArrivee = DISCORD.salonArrivee || s.presente;
  if (salonArrivee) {
    await robot("POST", `/channels/${salonArrivee}/messages`, {
      content:
        `Bienvenue <@${idDiscord}> dans la LEQ'FAM ! 🎉 Ton accès membre est activé, tous les salons de la communauté sont ouverts.\n\n` +
        "**Première étape : présente-toi ici même.** Copie ce modèle, complète-le et envoie-le :\n" +
        "```\nPrénom :\nCe que je fais (études, métier…) :\nMon objectif à l'oral :\nMon plus grand défi quand je prends la parole :\nUne phrase ou une personne qui m'inspire :\n```" +
        "Je t'ai aussi envoyé un message privé avec tout ce qu'il faut savoir pour bien démarrer.",
      allowed_mentions: { users: [idDiscord] },
    });
  }
  // Guide en message privé (peut échouer si la personne a fermé ses messages privés : sans conséquence)
  try {
    const dm = (await (await robot("POST", "/users/@me/channels", { recipient_id: idDiscord })).json()) as { id?: string };
    if (!dm.id) return;
    const bouton = (label: string, id: string) => (id ? [{ type: 2, style: 5, label, url: lienSalon(id) }] : []);
    await robot("POST", `/channels/${dm.id}/messages`, {
      embeds: [{
        color: 0xff5e01,
        title: "Bienvenue dans la LEQ'FAM ! Commence ici 👇",
        description:
          "Ton abonnement est actif et tous les salons membres sont ouverts. Voici tes premiers pas :\n\n" +
          "**1. Lis les règles** · respect, bienveillance, confidentialité : c'est ce qui fait la qualité de la famille.\n\n" +
          "**2. Présente-toi** dans #présente-toi avec le modèle : la communauté va t'accueillir.\n\n" +
          "**3. Note les prochains lives** · ils sont dans les **Événements** du serveur, tout en haut de la liste des salons. Clique sur « Intéressé » pour recevoir un rappel.\n\n" +
          "**4. Une question, un oral à préparer ?** Pose-la dans #entraide, ou partage ton texte, ton audio ou ta vidéo pour recevoir des retours.\n\n" +
          "**5. Explore les ressources et les opportunités** · une fiche par ressource, à filtrer par étiquette.\n\n" +
          "Ton reçu et le lien pour gérer ton abonnement sont dans le mail de bienvenue. À très vite en live !\n**Rebecca**",
        footer: { text: "LEQ'FAM · Lieben Éloquence" },
      }],
      components: [{ type: 1, components: [...bouton("Les règles", s.reglements), ...bouton("Me présenter", s.presente), ...bouton("Entraide", s.entraide), ...bouton("Ressources", s.ressources), ...bouton("Le fonctionnement", s.fonctionnement)].slice(0, 5) }],
    });
  } catch (e) {
    console.error("Message privé d'accueil", e);
  }
}

/** Lien qui ouvre directement le serveur (application ou navigateur). */
export const lienServeur = (salon = DISCORD.salonArrivee) => `https://discord.com/channels/${DISCORD.serveur}${salon ? `/${salon}` : ""}`;
