import "server-only";
import { createHash } from "node:crypto";
import { getOpportunites } from "@/content";
import type { Opportunite } from "@/content/schema";
import { publierFiche, publierMessage, trouverSalon, type MessageDiscord } from "@/lib/discord";
import { readAll, record } from "@/lib/store";

/**
 * Publications automatiques du robot LEQ sur Discord, déclenchées toutes les 5 minutes par le serveur
 * (route /api/discord/publier) :
 * 1. le planning de Rebecca, un tableau Google Sheets publié en CSV (adresse dans DISCORD_PLANNING_CSV),
 *    colonnes : Salon | Date (JJ/MM/AAAA) | Heure (HH:MM, heure de Paris) | Message | Image (lien, facultatif) ;
 * 2. les opportunités et ressources ajoutées par l'agent Claude dans content/opportunites.json,
 *    publiées en fiches dans le forum #ressources-et-opportunités (les brouillons ne sont jamais publiés :
 *    ils s'envoient seulement en aperçu dans #staffchat, voir apercuOpportunites).
 * Chaque publication est notée dans data/discord-publies.jsonl : rien n'est jamais publié deux fois.
 */

/** Au-delà de ce délai, une ligne du planning en retard n'est plus publiée (ex. serveur arrêté). */
const RETARD_MAX_MS = 6 * 3600_000;
const FORUM_OPPORTUNITES = "ressources-et-opportunites";
const SALON_APERCU = "staffchat";

/** Couleur et emoji de la carte selon l'étiquette principale. */
const STYLES: Record<string, { couleur: number; emoji: string }> = {
  Concours: { couleur: 0xff5e01, emoji: "🏆" },
  "Opportunité internationale": { couleur: 0x114da8, emoji: "🌍" },
  Ressource: { couleur: 0xffbd59, emoji: "📚" },
};

/** Carte Discord d'une opportunité : résumé, pour qui, date limite, lieu, bouton vers la source. */
export function ficheOpportunite(o: Opportunite): MessageDiscord {
  const style = STYLES[o.etiquettes[0] ?? ""] ?? STYLES.Ressource;
  const champs = [
    { name: "👥 Pour qui", value: o.pourQui, inline: true },
    ...(o.dateLimite ? [{ name: "⏳ Date limite", value: `**${o.dateLimite}**`, inline: true }] : []),
    ...(o.lieu ? [{ name: "📍 Où et quand", value: o.lieu, inline: true }] : []),
  ];
  return {
    embeds: [{ color: style.couleur, title: `${style.emoji} ${o.titre}`, url: o.lien, description: o.resume, fields: champs, footer: { text: "LEQ'FAM · Opportunités de la semaine" } }],
    components: [{ type: 1, components: [{ type: 2, style: 5, label: "En savoir plus", url: o.lien }] }],
  };
}

type Ligne = { salon: string; date: string; heure: string; message: string; image: string };
export type Bilan = { publies: string[]; erreurs: string[] };

/** Lecture d'un CSV (guillemets, virgules et retours à la ligne dans les cellules). */
function lireCsv(texte: string): string[][] {
  const lignes: string[][] = [];
  let ligne: string[] = [];
  let cellule = "";
  let entreGuillemets = false;
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i];
    if (entreGuillemets) {
      if (c === '"' && texte[i + 1] === '"') (cellule += '"'), i++;
      else if (c === '"') entreGuillemets = false;
      else cellule += c;
    } else if (c === '"') entreGuillemets = true;
    else if (c === ",") ligne.push(cellule), (cellule = "");
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && texte[i + 1] === "\n") i++;
      ligne.push(cellule), lignes.push(ligne), (ligne = []), (cellule = "");
    } else cellule += c;
  }
  if (cellule || ligne.length) ligne.push(cellule), lignes.push(ligne);
  return lignes;
}

/** « 25/10/2026 » + « 18:30 », heure de Paris → instant précis (heure d'été comprise). */
function instantParis(date: string, heure: string): number | null {
  const d = date.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const h = heure.trim().match(/^(\d{1,2})[:h](\d{2})$/);
  if (!d || !h) return null;
  const utc = Date.UTC(+d[3], +d[2] - 1, +d[1], +h[1], +h[2]);
  // Décalage de Paris à cet instant : on compare l'heure affichée à Paris avec l'heure UTC
  const parties = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date(utc))
      .map((p) => [p.type, p.value]),
  );
  const vuAParis = Date.UTC(+parties.year, +parties.month - 1, +parties.day, +parties.hour, +parties.minute);
  return utc - (vuAParis - utc);
}

async function lirePlanning(): Promise<Ligne[]> {
  const url = process.env.DISCORD_PLANNING_CSV;
  if (!url) return [];
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`Planning Google Sheets illisible : ${r.status}`);
  const [, ...lignes] = lireCsv(await r.text()); // la première ligne contient les titres des colonnes
  return lignes
    .map(([salon = "", date = "", heure = "", message = "", image = ""]) => ({ salon: salon.trim(), date, heure, message: message.trim(), image: image.trim() }))
    .filter((l) => l.salon && l.message);
}

const empreinte = (...parties: string[]) => createHash("sha256").update(parties.join("|")).digest("hex").slice(0, 24);

export async function publierPlanifies(): Promise<Bilan> {
  const bilan: Bilan = { publies: [], erreurs: [] };
  const deja = new Set((await readAll("discord-publies")).map((l) => String(l.cle)));
  const maintenant = Date.now();

  // 1. Planning Google Sheets
  try {
    for (const l of await lirePlanning()) {
      const quand = instantParis(l.date, l.heure);
      if (quand === null) {
        bilan.erreurs.push(`Date ou heure illisible : « ${l.date} ${l.heure} » (attendu JJ/MM/AAAA et HH:MM)`);
        continue;
      }
      const cle = `planning-${empreinte(l.salon, l.date, l.heure, l.message)}`;
      if (deja.has(cle) || quand > maintenant || maintenant - quand > RETARD_MAX_MS) continue;
      const salon = await trouverSalon(l.salon);
      if (!salon) {
        bilan.erreurs.push(`Salon introuvable : « ${l.salon} »`);
        continue;
      }
      await publierMessage(salon, { content: l.message, ...(l.image ? { embeds: [{ image: { url: l.image } }] } : {}) });
      await record("discord-publies", { cle, origine: "planning", salon: salon.name, apercu: l.message.slice(0, 120) });
      bilan.publies.push(`#${salon.name} : ${l.message.slice(0, 60)}`);
    }
  } catch (e) {
    bilan.erreurs.push(e instanceof Error ? e.message : String(e));
  }

  // 2. Opportunités et ressources (agent Claude)
  try {
    const nouvelles = (await getOpportunites()).filter((o) => !o.brouillon && !deja.has(`opportunite-${o.id}`));
    const forum = nouvelles.length ? await trouverSalon(FORUM_OPPORTUNITES) : undefined;
    if (nouvelles.length && !forum) bilan.erreurs.push("Forum #ressources-et-opportunités introuvable");
    for (const o of forum ? nouvelles : []) {
      await publierFiche(forum!, { titre: o.titre, etiquettes: o.etiquettes, message: ficheOpportunite(o) });
      await record("discord-publies", { cle: `opportunite-${o.id}`, origine: "opportunités", salon: forum!.name, apercu: o.titre });
      bilan.publies.push(`Fiche : ${o.titre}`);
    }
  } catch (e) {
    bilan.erreurs.push(e instanceof Error ? e.message : String(e));
  }
  return bilan;
}

/** Aperçu des brouillons dans #staffchat (visible par l'équipe seulement), avant validation. */
export async function apercuOpportunites(): Promise<Bilan> {
  const brouillons = (await getOpportunites()).filter((o) => o.brouillon);
  const salon = await trouverSalon(SALON_APERCU);
  if (!salon) return { publies: [], erreurs: [`Salon #${SALON_APERCU} introuvable`] };
  await publierMessage(salon, { content: `👀 **Aperçu des opportunités de la semaine** (${brouillons.length}) : rien n'est encore publié dans le forum.` });
  for (const o of brouillons) await publierMessage(salon, ficheOpportunite(o));
  return { publies: brouillons.map((o) => `Aperçu : ${o.titre}`), erreurs: [] };
}
