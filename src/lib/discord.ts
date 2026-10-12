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

/** Message d'accueil du robot dans #présente-toi. */
export async function souhaiterBienvenue(idDiscord: string): Promise<void> {
  if (!DISCORD.salonArrivee) return;
  await robot("POST", `/channels/${DISCORD.salonArrivee}/messages`, {
    content: `Bienvenue <@${idDiscord}> dans la LEQ'FAM ! Ton accès membre est activé. Présente-toi avec le modèle épinglé juste au-dessus.`,
    allowed_mentions: { users: [idDiscord] },
  });
}

/** Lien qui ouvre directement le serveur (application ou navigateur). */
export const lienServeur = (salon = DISCORD.salonArrivee) => `https://discord.com/channels/${DISCORD.serveur}${salon ? `/${salon}` : ""}`;
