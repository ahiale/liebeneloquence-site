import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPricing } from "@/content";
import { lancement } from "@/lib/leqfam";
import { stripeMode } from "@/lib/stripe";
import { Header } from "@/components/layout/Header";
import { DrawUnderline, Sparkle } from "@/components/ui/Doodles";
import { AdhesionForm } from "@/components/communaute/AdhesionForm";

export const metadata: Metadata = { title: "Rejoindre la LEQ'FAM", robots: { index: false }, alternates: { canonical: "/communaute/rejoindre" } };
export const dynamic = "force-dynamic";

export default async function RejoindrePage({ searchParams }: { searchParams: Promise<{ annule?: string; erreur?: string }> }) {
  const mode = stripeMode();
  if (!mode) redirect("/communaute#rejoindre");
  const { annule, erreur } = await searchParams;
  const pricing = await getPricing();
  const { leqfam } = pricing;
  const l = await lancement(pricing, mode);

  return (
    <div className="bg-hero min-h-screen">
      <Header />
      {mode === "test" && (
        <p className="wrap m-0">
          <span className="block rounded-[14px] bg-orange px-4 py-3 text-center text-[14px] font-semibold text-white">
            Mode test : aucun paiement réel. Carte de test : 4242 4242 4242 4242, date future, code 123.
          </span>
        </p>
      )}
      <section className="pt-8 pb-20 sm:pt-12 sm:pb-24">
        <div className="wrap flex flex-wrap items-start gap-12">
          <div className="relative min-w-0" style={{ flex: "1 1 380px" }}>
            <Sparkle className="wiggle hide-sm absolute" size={44} style={{ right: 10, top: -10 }} />
            <p className="eyebrow">La communauté</p>
            <h1 className="mt-4 mb-0 leading-[1.02] font-bold tracking-[-0.04em] text-white" style={{ fontSize: "clamp(40px, 7vw, 58px)" }}>
              Rejoindre la
              <br />
              <span className="serif text-gold">LEQ&apos;FAM</span>
            </h1>
            <DrawUnderline style={{ marginTop: 4 }} />
            <ol className="mt-8 mb-0 grid list-none gap-4 p-0">
              {[
                ["Choisissez votre formule", "Avec ou sans engagement, et votre code si vous en avez un."],
                ["Connectez-vous avec Discord", "Un clic : Discord vous identifie et vous ajoute au serveur."],
                ["Payez en toute sécurité", "Sur la page de paiement Stripe."],
                ["Bienvenue dans la famille", "Les salons membres s'ouvrent aussitôt sur Discord."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4 text-white">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-[15px] font-bold text-ink">{i + 1}</span>
                  <span>
                    <span className="block text-[17px] font-bold">{t}</span>
                    <span className="block text-[14.5px] text-white/75">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="min-w-0" style={{ flex: "1 1 440px" }}>
            {annule && <p className="mt-0 mb-4 rounded-[14px] bg-white/12 px-4 py-3 text-[14.5px] text-white">Le paiement a été annulé : rien n&apos;a été prélevé. Vous pouvez reprendre quand vous voulez.</p>}
            {erreur && <p className="mt-0 mb-4 rounded-[14px] bg-[#ff5e01]/20 px-4 py-3 text-[14.5px] text-white">La connexion Discord n&apos;a pas abouti. Réessayez, ou écrivez à formationn@liebeneloquence.com.</p>}
            <AdhesionForm
              formules={(["engagement", "libre"] as const).map((id) => ({ id, label: leqfam.formules[id].label, prix: leqfam.formules[id].monthlyPrice, engagementMois: leqfam.formules[id].engagementMonths }))}
              lancement={{ actif: l.actif, prix: l.prixPremierMois, restantes: l.restantes }}
              code={{ prix: leqfam.partnerMonthlyPrice, mois: leqfam.partnerDurationMonths }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
