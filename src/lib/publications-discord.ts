import "server-only";
import { getDefis, getOpportunites } from "@/content";
import { enregistrer, lister, semer, type Doc } from "@/lib/base";
import { publierFiche, publierMessage, trouverSalon, type MessageDiscord } from "@/lib/discord";
import { readAll } from "@/lib/store";

/**
 * Publications automatiques du robot LEQ sur Discord, vérifiées toutes les 5 minutes par le serveur
 * (route /api/discord/publier). Rien ne part sans validation de Rebecca dans l'admin (/admin/discord) :
 * 1. le défi de la semaine : le lundi à partir de 9 h (heure de Paris), le prochain défi VALIDÉ de la banque ;
 * 2. les opportunités et ressources : dès qu'une fiche est validée, elle part dans le forum.
 * La banque de défis (content/defis.json) et les opportunités de l'agent (content/opportunites.json) sont recopiées
 * dans la base de l'admin à leur arrivée, puis modifiées et validées là.
 */

const FORUM_OPPORTUNITES = "ressources-et-opportunites";
const SALON_DEFIS = "discussion-generale";
/** Heure de publication du défi, le lundi (heure de Paris). */
const HEURE_DEFI = 9;

export type Statut = "a-valider" | "valide" | "publie" | "ecarte";
export type DefiDoc = Doc & { ordre: number; titre: string; consigne: string; astuce: string; statut: Statut; publieLe?: string };
export type OpportuniteDoc = Doc & {
  titre: string;
  resume: string;
  pourQui: string;
  dateLimite: string | null;
  lieu?: string | null;
  lien: string;
  etiquettes: string[];
  ajout: string;
  statut: Statut;
  publieLe?: string;
};
export type Bilan = { publies: string[]; erreurs: string[] };

/** Banque de défis, dans l'ordre (complétée par les nouveaux défis du fichier). */
export async function defis(): Promise<DefiDoc[]> {
  const depart = await getDefis();
  await semer<DefiDoc>("defis", depart.map((d, i) => ({ ...d, id: `defi-${String(i + 1).padStart(2, "0")}`, ordre: i + 1, statut: "a-valider" as Statut })));
  return (await lister<DefiDoc>("defis")).sort((a, b) => a.ordre - b.ordre);
}

/** Opportunités, les plus récentes d'abord (complétées par celles que l'agent a ajoutées au fichier). */
export async function opportunites(): Promise<OpportuniteDoc[]> {
  // Celles déjà parties avant l'admin (journal du robot) arrivent directement « publiées ».
  const parties = new Set((await readAll("discord-publies")).map((l) => String(l.cle)));
  const depart = await getOpportunites();
  await semer<OpportuniteDoc>(
    "opportunites",
    depart.map((o) => ({ ...o, statut: (parties.has(`opportunite-${o.id}`) ? "publie" : "a-valider") as Statut })),
  );
  return (await lister<OpportuniteDoc>("opportunites")).sort((a, b) => b.ajout.localeCompare(a.ajout));
}

/** Couleur et emoji de la carte selon l'étiquette principale. */
const STYLES: Record<string, { couleur: number; emoji: string }> = {
  Concours: { couleur: 0xff5e01, emoji: "🏆" },
  "Opportunité internationale": { couleur: 0x114da8, emoji: "🌍" },
  Ressource: { couleur: 0xffbd59, emoji: "📚" },
};

/** Carte Discord d'une opportunité : résumé, pour qui, date limite, lieu, bouton vers la source. */
export function ficheOpportunite(o: OpportuniteDoc): MessageDiscord {
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

/** Jour (AAAA-MM-JJ) et heure à Paris d'un instant, et s'il s'agit d'un lundi. */
function aParis(instant: number) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", weekday: "short", hourCycle: "h23" })
      .formatToParts(new Date(instant))
      .map((x) => [x.type, x.value]),
  );
  return { jour: `${p.year}-${p.month}-${p.day}`, heure: +p.hour, lundi: p.weekday === "Mon" };
}

/** Prochain défi qui partira (le premier validé de la banque), ou undefined si aucun n'est validé. */
export const prochainDefi = (banque: DefiDoc[]) => banque.find((d) => d.statut === "valide");

export async function publierPlanifies(): Promise<Bilan> {
  const bilan: Bilan = { publies: [], erreurs: [] };
  const maintenant = Date.now();

  // 1. Défi de la semaine : le lundi à partir de 9 h, une seule fois par lundi, seulement s'il est validé
  try {
    const paris = aParis(maintenant);
    const banque = await defis();
    const dejaCeLundi = banque.some((d) => d.publieLe?.startsWith(paris.jour));
    const defi = prochainDefi(banque);
    if (paris.lundi && paris.heure >= HEURE_DEFI && !dejaCeLundi && defi) {
      const salon = await trouverSalon(SALON_DEFIS);
      if (!salon) bilan.erreurs.push(`Salon #${SALON_DEFIS} introuvable`);
      else {
        await publierMessage(salon, ficheDefi(defi));
        await enregistrer<DefiDoc>("defis", { ...defi, statut: "publie", publieLe: paris.jour });
        bilan.publies.push(`Défi : ${defi.titre}`);
      }
    }
  } catch (e) {
    bilan.erreurs.push(e instanceof Error ? e.message : String(e));
  }

  // 2. Opportunités validées
  try {
    const aPublier = (await opportunites()).filter((o) => o.statut === "valide");
    const forum = aPublier.length ? await trouverSalon(FORUM_OPPORTUNITES) : undefined;
    if (aPublier.length && !forum) bilan.erreurs.push("Forum #ressources-et-opportunités introuvable");
    for (const o of forum ? aPublier : []) {
      await publierFiche(forum!, { titre: o.titre, etiquettes: o.etiquettes, message: ficheOpportunite(o) });
      await enregistrer<OpportuniteDoc>("opportunites", { ...o, statut: "publie", publieLe: new Date().toISOString() });
      bilan.publies.push(`Fiche : ${o.titre}`);
    }
  } catch (e) {
    bilan.erreurs.push(e instanceof Error ? e.message : String(e));
  }
  return bilan;
}
