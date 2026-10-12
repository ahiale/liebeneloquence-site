import "server-only";

/**
 * Discord : connexion des membres (OAuth2) et gestion du rôle LEQ'FAM par le robot LEQ.
 * Le robot ne retire jamais un rôle qu'il n'a pas donné lui-même (partenaires et ambassadeurs sont gérés à la main).
 */
export const DISCORD = {
  serveur: "1547666371704520825",
  roleMembre: process.env.DISCORD_ROLE_MEMBRE || "", // id du rôle LeqOra, renseigné sur le serveur
  salonArrivee: process.env.DISCORD_SALON_ARRIVEE || "", // id du salon d'arrivée après le paiement : #fonctionnement
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
  salonsAccueil = { reglements: trouver("reglements"), fonctionnement: trouver("fonctionnement"), presente: trouver("presente-toi"), entraide: trouver("entraide"), ressources: trouver("ressources"), grandprix: trouver("grand-prix") };
  return salonsAccueil;
}
const lienSalon = (id: string) => `https://discord.com/channels/${DISCORD.serveur}/${id}`;

/** Accueil automatique d'un nouveau membre : visite guidée en message privé, puis mot d'accueil dans #présente-toi. */
export async function souhaiterBienvenue(idDiscord: string): Promise<void> {
  const s = await salons();
  const bouton = (label: string, id: string) => (id ? [{ type: 2, style: 5, label, url: lienSalon(id) }] : []);

  // 1. Message privé : la visite en 3 étapes, dans l'ordre (peut échouer si la personne a fermé ses messages privés)
  try {
    const dm = (await (await robot("POST", "/users/@me/channels", { recipient_id: idDiscord })).json()) as { id?: string };
    if (dm.id) {
      await robot("POST", `/channels/${dm.id}/messages`, {
        embeds: [{
          color: 0xff5e01,
          title: "Bienvenue dans la LEQ'FAM ! 🎉",
          description:
            "Ton accès membre est activé. Pour bien démarrer, suis la visite en **3 étapes** :\n\n" +
            "**1. Le fonctionnement** · à quoi sert chaque salon.\n**2. Les règles** · ce qui fait la qualité de la famille.\n**3. Ta présentation** · pour que la communauté t'accueille.\n\n" +
            "Ensuite, à toi d'explorer ! À très vite en live,\n**Rebecca**",
          footer: { text: "LEQ'FAM · Lieben Éloquence" },
        }],
        components: [{ type: 1, components: [...bouton("1. Le fonctionnement", s.fonctionnement), ...bouton("2. Les règles", s.reglements), ...bouton("3. Me présenter", s.presente)] }],
      });
    }
  } catch (e) {
    console.error("Message privé d'accueil", e);
  }

  // 2. Mot d'accueil public dans #présente-toi, avec le modèle et la suite de la visite
  if (s.presente) {
    await robot("POST", `/channels/${s.presente}/messages`, {
      content:
        `Bienvenue <@${idDiscord}> dans la LEQ'FAM ! 🎉\n\n` +
        "**Présente-toi ici même** en copiant ce modèle :\n" +
        "```\nPrénom :\nCe que je fais (études, métier…) :\nMon objectif à l'oral :\nMon plus grand défi quand je prends la parole :\nUne phrase ou une personne qui m'inspire :\n```" +
        "Ensuite, à toi d'explorer :",
      components: [{ type: 1, components: [...bouton("Entraide", s.entraide), ...bouton("Ressources et opportunités", s.ressources), ...bouton("Grand Prix LEQ", s.grandprix)] }],
      allowed_mentions: { users: [idDiscord] },
    });
  }
}

/** Lien qui ouvre directement le serveur (application ou navigateur). */
export const lienServeur = (salon = DISCORD.salonArrivee) => `https://discord.com/channels/${DISCORD.serveur}${salon ? `/${salon}` : ""}`;
