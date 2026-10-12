import { activerAdhesion, terminerAdhesion, type SessionPaiement } from "@/lib/adhesion";
import { verifierWebhook } from "@/lib/stripe";

/**
 * Notifications de Stripe (test et réel) :
 * - paiement d'adhésion réussi → rôle membre, bienvenue, registre ;
 * - abonnement terminé (résiliation effective) ou impayé définitif → rôle retiré.
 * Stripe réessaie tant que la réponse n'est pas 200.
 */
export const dynamic = "force-dynamic";

type Evenement = { type: string; data: { object: Record<string, unknown> } };
type Abonnement = Parameters<typeof terminerAdhesion>[0];

export async function POST(req: Request) {
  const corps = await req.text();
  const mode = verifierWebhook(corps, req.headers.get("stripe-signature"));
  if (!mode) return new Response("Signature invalide", { status: 400 });
  const e = JSON.parse(corps) as Evenement;
  try {
    if (e.type === "checkout.session.completed") {
      const s = e.data.object as unknown as SessionPaiement & { mode: string };
      if (s.mode === "subscription" && s.metadata?.formule) await activerAdhesion(s, mode);
    } else if (e.type === "customer.subscription.deleted") {
      const a = e.data.object as unknown as Abonnement;
      if (a.metadata?.formule) await terminerAdhesion(a, mode, "fin");
    } else if (e.type === "customer.subscription.updated") {
      const a = e.data.object as unknown as Abonnement;
      if (a.metadata?.formule && (a.status === "unpaid" || a.status === "incomplete_expired")) await terminerAdhesion(a, mode, "impaye");
    }
  } catch (err) {
    console.error(`Webhook Stripe ${e.type}`, err);
    return new Response("Erreur", { status: 500 });
  }
  return new Response("ok");
}
