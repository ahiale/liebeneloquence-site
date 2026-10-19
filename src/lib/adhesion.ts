import "server-only";
import { sendMail, ADMIN_EMAIL } from "@/lib/mail";
import { donnerRoleMembre, lienServeur, retirerRoleMembre, souhaiterBienvenue } from "@/lib/discord";
import { dejaMembre, noterMembre, signer, type Formule } from "@/lib/leqfam";
import { stripe, type StripeMode } from "@/lib/stripe";
import { getPricing } from "@/content";
import * as T from "@/emails/templates";

type Meta = Record<string, string | undefined>;
export type SessionPaiement = { id: string; status: string; payment_status: string; subscription: string | null; customer: string | null; customer_details?: { email?: string | null; name?: string | null }; metadata: Meta };
type Abonnement = { id: string; start_date: number; status: string; cancel_at: number | null; current_period_end?: number; items?: { data: { current_period_end?: number }[] }; metadata: Meta };

const enCours = new Set<string>();
const jour = (s: number) => new Date(s * 1000).toISOString().slice(0, 10);

/** Active l'adhésion après un paiement réussi : rôle Discord, mot de bienvenue, réduction à venir, registre, mail. */
export async function activerAdhesion(session: SessionPaiement, mode: StripeMode): Promise<void> {
  const ab = session.subscription;
  if (!ab || session.status !== "complete" || enCours.has(ab) || (await dejaMembre(ab))) return;
  enCours.add(ab);
  try {
    const m = session.metadata;
    const abonnement = await stripe<Abonnement>("GET", `/subscriptions/${ab}`, {}, mode);
    const engagementMois = Number(m.engagement_mois ?? 0);
    const debut = new Date(abonnement.start_date * 1000);
    const engagementFin = engagementMois ? new Date(debut.getFullYear(), debut.getMonth() + engagementMois, debut.getDate()).toISOString().slice(0, 10) : null;

    // Pendant le lancement avec un code : après le premier mois à 1 €, la réduction du code prend le relais
    if (m.reduction_ensuite) await stripe("POST", `/subscriptions/${ab}`, { discounts: [{ coupon: m.reduction_ensuite }], metadata: { engagement_fin: engagementFin ?? "" } }, mode);
    else if (engagementFin) await stripe("POST", `/subscriptions/${ab}`, { metadata: { engagement_fin: engagementFin } }, mode);

    if (m.discord_id) {
      await donnerRoleMembre(m.discord_id);
      await souhaiterBienvenue(m.discord_id).catch((e) => console.error("Message de bienvenue Discord", e));
    }
    const email = session.customer_details?.email ?? null;
    await noterMembre({
      evenement: "adhesion", mode, abonnement: ab, client: session.customer ?? undefined, discordId: m.discord_id, discordNom: m.discord_nom, email,
      formule: m.formule as Formule, lancement: m.lancement === "oui", code: m.code, partenaire: m.partenaire, partenaireType: m.partenaire_type, groupe: m.groupe || undefined, engagementFin,
    });
    if (email) {
      const { leqfam } = await getPricing();
      const f = leqfam.formules[(m.formule as Formule) ?? "libre"];
      await sendMail({
        to: email,
        replyTo: ADMIN_EMAIL,
        ...T.leqfamBienvenue({ nom: m.discord_nom ?? "", formule: f.label, prix: f.monthlyPrice, engagementFin, lienDiscord: lienServeur(), lienResiliation: `https://liebeneloquence.com/communaute/resilier?jeton=${signer({ ab, mode }, 60 * 24 * 365 * 2)}` }),
      }).catch((e) => console.error("Mail de bienvenue LEQ'FAM", e));
    }
  } finally {
    enCours.delete(ab);
  }
}

/** Fin d'abonnement (résiliation effective ou impayé définitif) : le robot retire le rôle qu'il avait donné. */
export async function terminerAdhesion(abonnement: Abonnement, mode: StripeMode, raison: "fin" | "impaye"): Promise<void> {
  const id = abonnement.metadata.discord_id;
  if (id) await retirerRoleMembre(id);
  await noterMembre({ evenement: raison, mode, abonnement: abonnement.id, discordId: id, discordNom: abonnement.metadata.discord_nom });
}

export { jour };
