import type { Metadata } from "next";
import Link from "next/link";
import { activerAdhesion, type SessionPaiement } from "@/lib/adhesion";
import { lienServeur } from "@/lib/discord";
import { stripe, stripeMode } from "@/lib/stripe";
import { Header } from "@/components/layout/Header";
import { Heart, Sparkle } from "@/components/ui/Doodles";

export const metadata: Metadata = { title: "Bienvenue dans la LEQ'FAM", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Retour de Stripe après le paiement : l'accès est activé ici (et par le webhook, au cas où cette page ne s'ouvre pas). */
export default async function BienvenuePage({ searchParams }: { searchParams: Promise<{ session?: string }> }) {
  const { session: id } = await searchParams;
  const mode = stripeMode();
  let ok = false;
  if (id && mode && /^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) {
    try {
      const s = await stripe<SessionPaiement>("GET", `/checkout/sessions/${id}`, {}, mode);
      ok = s.status === "complete";
      if (ok) await activerAdhesion(s, mode);
    } catch (e) {
      console.error("Page de bienvenue LEQ'FAM", e);
    }
  }

  return (
    <div className="bg-hero min-h-screen">
      <Header />
      <main className="wrap relative flex flex-col items-center pt-12 pb-28 text-center text-white">
        <Sparkle className="wiggle hide-sm absolute" size={46} style={{ left: "12%", top: 30 }} />
        <Heart className="wiggle hide-sm absolute" size={32} color="#FF5E01" style={{ right: "14%", top: 110 }} />
        {ok ? (
          <>
            <span className="grid h-24 w-24 place-items-center rounded-full border-4 border-gold bg-white/10 text-[48px] font-bold text-gold">✓</span>
            <h1 className="mt-8 mb-0 font-bold tracking-[-0.03em]" style={{ fontSize: "clamp(34px, 6vw, 52px)" }}>
              Bienvenue <span className="serif text-gold">dans la LEQ&apos;FAM !</span>
            </h1>
            <p className="mt-5 mb-0 max-w-[520px] text-[17px] leading-[1.7] text-white/85">
              Votre paiement est confirmé et votre accès membre est activé : tous les salons de la communauté sont ouverts sur Discord. Un mail de bienvenue vient de vous être envoyé.
            </p>
            <a className="btn mt-9 text-white" href={lienServeur()} style={{ background: "#5865F2", fontSize: 18, padding: "16px 32px" }}>
              Ouvrir la LEQ&apos;FAM sur Discord
            </a>
            <p className="mt-4 mb-0 text-[14px] text-white/65">Vous arrivez dans #fonctionnement : suivez la visite en 3 étapes, puis présentez-vous !</p>
          </>
        ) : (
          <>
            <h1 className="mt-4 mb-0 font-bold tracking-[-0.03em]" style={{ fontSize: "clamp(30px, 5vw, 44px)" }}>
              Paiement <span className="serif text-gold">en cours de validation…</span>
            </h1>
            <p className="mt-5 mb-0 max-w-[520px] text-[16px] leading-[1.7] text-white/85">
              Votre accès sera activé automatiquement dans quelques instants, et un mail de bienvenue vous sera envoyé. Si rien ne se passe d&apos;ici quelques minutes, écrivez-nous à formationn@liebeneloquence.com.
            </p>
            <Link className="btn btn-g mt-8" href="/communaute">Retour à la communauté</Link>
          </>
        )}
      </main>
    </div>
  );
}
