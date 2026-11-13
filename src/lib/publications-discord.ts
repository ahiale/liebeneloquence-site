import "server-only";
import { randomUUID } from "node:crypto";
import { getDefis, getOpportunites } from "@/content";
import type { Opportunite } from "@/content/schema";
import { publierFiche, publierMessage, trouverSalon, type MessageDiscord } from "@/lib/discord";
import { readAll, record } from "@/lib/store";

/**
 * Publications automatiques du robot LEQ sur Discord, déclenchées toutes les 5 minutes par le serveur
 * (route /api/discord/publier) :
 * 1. le planning, programmé depuis l'admin (/admin/discord) : data/planning.jsonl, un événement par ligne
 *    (ajout ou suppression d'un message), l'état courant se reconstruit en relisant le journal ;
 * 2. le défi de la semaine, chaque lundi à 9 h (heure de Paris), tiré dans l'ordre de content/defis.json ;
 * 3. les opportunités et ressources ajoutées par l'agent Claude dans content/opportunites.json,
 *    publiées en fiches dans le forum #ressources-et-opportunités (un brouillon n'est publié qu'une fois validé
 *    dans l'admin ; il peut être envoyé avant en aperçu dans #staffchat, voir apercuOpportunites).
 * Chaque publication est notée dans data/discord-publies.jsonl : rien n'est jamais publié deux fois.
 */

/** Au-delà de ce délai, une ligne du planning en retard n'est plus publiée (ex. serveur arrêté). */
const RETARD_MAX_MS = 6 * 3600_000;
const FORUM_OPPORTUNITES = "ressources-et-opportunites";
const SALON_APERCU = "staffchat";
const SALON_DEFIS = "discussion-generale";
/** Heure de publication du défi, le lundi (heure de Paris). */
const HEURE_DEFI = 9;
/** Défi du lundi : désactivé tant que Rebecca ne l'a pas validé (DISCORD_DEFIS=1 dans /opt/leq/.env pour l'activer). */
export const DEFIS_ACTIFS = process.env.DISCORD_DEFIS === "1";

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

export type Bilan = { publies: string[]; erreurs: string[] };

/** Message programmé depuis l'admin. `quand` : instant ISO de publication. */
export type MessageProgramme = { id: string; salon: string; quand: string; message: string; image?: string };

/** Messages programmés encore actifs (ajoutés et non supprimés), du plus proche au plus lointain. */
export async function lirePlanning(): Promise<MessageProgramme[]> {
  const actifs = new Map<string, MessageProgramme>();
  for (const l of await readAll("planning")) {
    if (l.action === "ajout") actifs.set(String(l.id), { id: String(l.id), salon: String(l.salon), quand: String(l.quand), message: String(l.message), image: l.image ? String(l.image) : undefined });
    if (l.action === "suppression") actifs.delete(String(l.id));
  }
  return [...actifs.values()].sort((a, b) => a.quand.localeCompare(b.quand));
}

export async function programmerMessage(m: Omit<MessageProgramme, "id">): Promise<void> {
  await record("planning", { action: "ajout", id: randomUUID(), ...m });
}

export async function supprimerMessage(id: string): Promise<void> {
  await record("planning", { action: "suppression", id });
}

/** « 2026-11-17 » + « 18:30 », heure de Paris → instant précis (heure d'été comprise). */
export function instantParis(jour: string, heure: string): Date {
  const [a, m, j] = jour.split("-").map(Number);
  const [h, min] = heure.split(":").map(Number);
  const utc = Date.UTC(a, m - 1, j, h, min);
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date(utc))
      .map((x) => [x.type, x.value]),
  );
  const vuAParis = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
  return new Date(utc - (vuAParis - utc));
}

/** Jour (AAAA-MM-JJ) et heure à Paris d'un instant, et s'il s'agit d'un lundi. */
function aParis(instant: number) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", weekday: "short", hourCycle: "h23" })
      .formatToParts(new Date(instant))
      .map((x) => [x.type, x.value]),
  );
  return { jour: `${p.year}-${p.month}-${p.day}`, heure: +p.hour, lundi: p.weekday === "Mon" };
}

/** Carte Discord du défi de la semaine. */
export function ficheDefi(d: { titre: string; consigne: string; astuce: string }): MessageDiscord {
  return {
    embeds: [{
      color: 0xff5e01,
      title: `🎯 Défi de la semaine : ${d.titre}`,
      description: `${d.consigne}\n\nRéponds ici avec ton audio, ta vidéo ou ton texte. 💪`,
      fields: [{ name: "💡 L'astuce", value: d.astuce }],
      footer: { text: "LEQ'FAM · Un nouveau défi chaque lundi" },
    }],
  };
}

export async function publierPlanifies(): Promise<Bilan> {
  const bilan: Bilan = { publies: [], erreurs: [] };
  const deja = new Set((await readAll("discord-publies")).map((l) => String(l.cle)));
  const maintenant = Date.now();

  // 1. Planning (admin)
  try {
    for (const m of await lirePlanning()) {
      const quand = Date.parse(m.quand);
      const cle = `planning-${m.id}`;
      if (deja.has(cle) || quand > maintenant || maintenant - quand > RETARD_MAX_MS) continue;
      const salon = await trouverSalon(m.salon);
      if (!salon) {
        bilan.erreurs.push(`Salon introuvable : « ${m.salon} »`);
        continue;
      }
      await publierMessage(salon, { content: m.message, ...(m.image ? { embeds: [{ image: { url: m.image } }] } : {}) });
      await record("discord-publies", { cle, origine: "planning", salon: salon.name, apercu: m.message.slice(0, 120) });
      bilan.publies.push(`#${salon.name} : ${m.message.slice(0, 60)}`);
    }
  } catch (e) {
    bilan.erreurs.push(e instanceof Error ? e.message : String(e));
  }

  // 2. Défi de la semaine : le lundi à partir de 9 h, une seule fois par lundi
  try {
    const paris = aParis(maintenant);
    const cle = `defi-${paris.jour}`;
    if (DEFIS_ACTIFS && paris.lundi && paris.heure >= HEURE_DEFI && !deja.has(cle)) {
      const defis = await getDefis();
      const dejaTires = [...deja].filter((c) => c.startsWith("defi-")).length;
      const defi = defis[dejaTires % defis.length];
      const salon = await trouverSalon(SALON_DEFIS);
      if (!salon) bilan.erreurs.push(`Salon #${SALON_DEFIS} introuvable`);
      else {
        await publierMessage(salon, ficheDefi(defi));
        await record("discord-publies", { cle, origine: "défi", salon: salon.name, apercu: defi.titre });
        bilan.publies.push(`Défi : ${defi.titre}`);
      }
    }
  } catch (e) {
    bilan.erreurs.push(e instanceof Error ? e.message : String(e));
  }

  // 3. Opportunités et ressources (agent Claude)
  try {
    const validees = new Set((await readAll("opportunites-validees")).map((l) => String(l.id)));
    const nouvelles = (await getOpportunites()).filter((o) => (!o.brouillon || validees.has(o.id)) && !deja.has(`opportunite-${o.id}`));
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
