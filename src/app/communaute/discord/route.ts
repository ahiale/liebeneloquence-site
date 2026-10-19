import { NextResponse } from "next/server";
import { connecterEtRejoindre } from "@/lib/discord";
import { creerPaiement, lire, type Formule } from "@/lib/leqfam";

/**
 * Retour de Discord après « Continuer avec Discord » : la personne est identifiée et ajoutée au serveur,
 * puis envoyée directement sur la page de paiement Stripe.
 */
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const retour = (q: string) => NextResponse.redirect(`https://liebeneloquence.com/communaute/rejoindre?${q}`, 303);
  const etat = lire<{ formule: Formule; code: string | null; groupe?: string | null; cgv: string }>(url.searchParams.get("state"));
  const code = url.searchParams.get("code");
  if (url.searchParams.get("error") === "access_denied") return retour("annule=1");
  if (!etat || !code) return retour("erreur=1");
  try {
    const compte = await connecterEtRejoindre(code);
    const paiement = await creerPaiement({
      formule: etat.formule,
      code: etat.code,
      groupe: etat.groupe ?? null,
      cgv: etat.cgv,
      discord: { id: compte.id, nom: compte.global_name ?? compte.username, email: compte.email },
    });
    return NextResponse.redirect(paiement, 303);
  } catch (e) {
    console.error("Adhésion LEQ'FAM (retour Discord)", e);
    return retour("erreur=1");
  }
}
