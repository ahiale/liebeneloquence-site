import "server-only";
import { getPartenaire, getPricing } from "@/content";
import type { Partenaire, Pricing } from "@/content/schema";
import { readAll, record } from "@/lib/store";
import { stripe, stripeMode, type StripeMode } from "@/lib/stripe";

/**
 * Règles de l'abonnement LEQ'FAM :
 * - deux formules : avec engagement (12 mois, puis reconduit) et sans engagement ;
 * - offre de lancement : 1 € le premier mois, pendant 10 jours à partir de l'ouverture, pour les 49 premiers ;
 * - code ambassadeur ou association : 1,99 € par mois pendant 6 mois
 *   (pendant le lancement : 1 € le premier mois, puis 1,99 € pendant 5 mois),
 *   dans la limite du nombre d'adhésions fixé pour chaque code (content/partenaires.json) ;
 * - ensuite, le prix normal de la formule.
 * Tous les montants viennent de content/tarifs.json.
 */
export type Formule = "engagement" | "libre";
const centimes = (euros: number) => Math.round(euros * 100);

// ---------------------------------------------------------------- offre
export async function placesLancementPrises(mode: StripeMode): Promise<number> {
  return (await readAll("membres")).filter((m) => m.evenement === "adhesion" && m.lancement === true && m.mode === mode).length;
}

/** Nombre d'adhésions déjà faites avec un code (dans le mode Stripe en cours). */
export async function utilisationsCode(code: string, mode: StripeMode | null = stripeMode()): Promise<number> {
  return (await readAll("membres")).filter((m) => m.evenement === "adhesion" && m.code === code && m.mode === mode).length;
}

/** Partenaire du code s'il est actif et que sa limite d'adhésions n'est pas atteinte ; sinon la raison du refus. */
export async function partenaireValide(code: string): Promise<{ partenaire: Partenaire } | { refus: "inconnu" | "epuise" }> {
  const partenaire = await getPartenaire(code);
  if (!partenaire) return { refus: "inconnu" };
  if (partenaire.limite != null && (await utilisationsCode(partenaire.code)) >= partenaire.limite) return { refus: "epuise" };
  return { partenaire };
}

/** L'offre de lancement est-elle ouverte ? (en test, LEQFAM_LANCEMENT_TEST=1 l'ouvre pour les essais) */
export async function lancement(pricing: Pricing, mode: StripeMode | null = stripeMode()) {
  const l = pricing.leqfam.lancement;
  const debut = l.debut ? new Date(`${l.debut}T00:00:00+02:00`) : null;
  const fin = debut ? new Date(debut.getTime() + l.jours * 86_400_000) : null;
  const forceTest = mode === "test" && process.env.LEQFAM_LANCEMENT_TEST === "1";
  const dansLaPeriode = forceTest || (debut !== null && fin !== null && Date.now() >= debut.getTime() && Date.now() < fin.getTime());
  const prises = mode ? await placesLancementPrises(mode) : 0;
  const restantes = Math.max(0, l.places - prises);
  return { actif: dansLaPeriode && restantes > 0, restantes, fin, prixPremierMois: l.prixPremierMois };
}

export type Offre = {
  formule: Formule;
  label: string;
  prixNormal: number;
  engagementMois: number;
  lancement: boolean;
  partenaire: Partenaire | null;
  /** Lignes lisibles : « 1 € le premier mois », « 1,99 € par mois pendant 5 mois », « puis 3,99 € par mois ». */
  etapes: { prix: number; mois: number | null }[];
};

export async function calculerOffre(formule: Formule, code?: string | null): Promise<Offre> {
  const pricing = await getPricing();
  const f = pricing.leqfam.formules[formule];
  const l = await lancement(pricing);
  const v = code ? await partenaireValide(code) : null;
  const partenaire = v && "partenaire" in v ? v.partenaire : null;
  const etapes: Offre["etapes"] = [];
  if (l.actif) etapes.push({ prix: l.prixPremierMois, mois: 1 });
  if (partenaire) etapes.push({ prix: pricing.leqfam.partnerMonthlyPrice, mois: pricing.leqfam.partnerDurationMonths - (l.actif ? 1 : 0) });
  etapes.push({ prix: f.monthlyPrice, mois: null });
  return { formule, label: f.label, prixNormal: f.monthlyPrice, engagementMois: f.engagementMonths, lancement: l.actif, partenaire, etapes };
}

// ---------------------------------------------------------------- objets Stripe (créés au besoin, identiques en test et en réel)
async function prixStripe(formule: Formule, montant: number): Promise<string> {
  const lookup = `leqfam_${formule}_${centimes(montant)}`;
  const trouves = await stripe<{ data: { id: string }[] }>("GET", "/prices", { lookup_keys: [lookup], active: true });
  if (trouves.data[0]) return trouves.data[0].id;
  // Prix existant créé à la main dans Stripe (même montant, mensuel) : on lui donne la clé de recherche
  const tous = await stripe<{ data: { id: string; unit_amount: number; recurring: { interval: string } | null; product: { name: string } }[] }>("GET", "/prices", { active: true, type: "recurring", limit: 100, expand: ["data.product"] });
  const existant = tous.data.find((p) => p.unit_amount === centimes(montant) && p.recurring?.interval === "month" && /leq.?fam/i.test(p.product.name));
  if (existant) {
    await stripe("POST", `/prices/${existant.id}`, { lookup_key: lookup });
    return existant.id;
  }
  const nom = formule === "engagement" ? "Abonnement LEQ'FAM - Avec engagement" : "Abonnement LEQ'FAM - Sans engagement";
  const produit = await stripe<{ id: string }>("POST", "/products", { name: nom });
  const prix = await stripe<{ id: string }>("POST", "/prices", { product: produit.id, currency: "eur", unit_amount: centimes(montant), recurring: { interval: "month" }, lookup_key: lookup });
  return prix.id;
}

async function coupon(id: string, montantDeduit: number, nom: string, mois: number | "once"): Promise<string> {
  try {
    await stripe("GET", `/coupons/${id}`);
  } catch {
    await stripe("POST", "/coupons", { id, name: nom, currency: "eur", amount_off: centimes(montantDeduit), ...(mois === "once" ? { duration: "once" } : { duration: "repeating", duration_in_months: mois }) });
  }
  return id;
}

/** Crée la session de paiement Stripe pour un compte Discord déjà connecté. */
export async function creerPaiement(p: { formule: Formule; code: string | null; groupe?: string | null; cgv: string; discord: { id: string; nom: string; email: string | null } }): Promise<string> {
  const mode = stripeMode();
  if (!mode) throw new Error("Adhésion fermée");
  const offre = await calculerOffre(p.formule, p.code);
  const prix = await prixStripe(p.formule, offre.prixNormal);
  const k = (n: number) => centimes(n);

  let reductionImmediate: string | undefined;
  let reductionEnsuite: string | undefined;
  const [premiere, deuxieme] = offre.etapes;
  if (offre.lancement) {
    reductionImmediate = await coupon(`leqfam-lancement-${p.formule}-${k(premiere.prix)}`, offre.prixNormal - premiere.prix, `Lancement : ${premiere.prix} € le premier mois`, "once");
    if (offre.partenaire && deuxieme.mois) reductionEnsuite = await coupon(`leqfam-code-${p.formule}-${k(deuxieme.prix)}-${deuxieme.mois}m`, offre.prixNormal - deuxieme.prix, `Code : ${deuxieme.prix} € par mois pendant ${deuxieme.mois} mois`, deuxieme.mois);
  } else if (offre.partenaire) {
    reductionImmediate = await coupon(`leqfam-code-${p.formule}-${k(premiere.prix)}-${premiere.mois}m`, offre.prixNormal - premiere.prix, `Code : ${premiere.prix} € par mois pendant ${premiere.mois} mois`, premiere.mois ?? 1);
  }

  const metadata = {
    discord_id: p.discord.id,
    discord_nom: p.discord.nom,
    formule: p.formule,
    lancement: offre.lancement ? "oui" : "non",
    code: offre.partenaire?.code ?? "",
    partenaire: offre.partenaire?.nom ?? "",
    partenaire_type: offre.partenaire?.type ?? "",
    groupe: (offre.partenaire && p.groupe) || "",
    reduction_ensuite: reductionEnsuite ?? "",
    engagement_mois: String(offre.engagementMois),
    cgv_acceptees: p.cgv,
  };
  const session = await stripe<{ url: string }>("POST", "/checkout/sessions", {
    mode: "subscription",
    locale: "fr",
    line_items: [{ price: prix, quantity: 1 }],
    ...(reductionImmediate ? { discounts: [{ coupon: reductionImmediate }] } : {}),
    ...(p.discord.email ? { customer_email: p.discord.email } : {}),
    client_reference_id: p.discord.id,
    metadata,
    subscription_data: { metadata, description: `LEQ'FAM · ${offre.label}` },
    success_url: "https://liebeneloquence.com/communaute/bienvenue?session={CHECKOUT_SESSION_ID}",
    cancel_url: "https://liebeneloquence.com/communaute/rejoindre?annule=1",
  });
  return session.url;
}

// ---------------------------------------------------------------- registre des membres (data/membres.jsonl)
export type EvenementMembre = {
  evenement: "adhesion" | "resiliation_demandee" | "fin" | "impaye";
  mode: StripeMode;
  abonnement: string;
  client?: string;
  discordId?: string;
  discordNom?: string;
  email?: string | null;
  formule?: Formule;
  lancement?: boolean;
  code?: string;
  partenaire?: string;
  partenaireType?: string;
  groupe?: string;
  engagementFin?: string | null;
  finPrevue?: string | null;
};

export async function noterMembre(e: EvenementMembre) {
  await record("membres", e as unknown as Record<string, unknown>);
}

/** L'adhésion de cet abonnement a-t-elle déjà été traitée ? (le webhook et la page de bienvenue peuvent arriver en même temps) */
export async function dejaMembre(abonnement: string): Promise<boolean> {
  return (await readAll("membres")).some((m) => m.evenement === "adhesion" && m.abonnement === abonnement);
}
