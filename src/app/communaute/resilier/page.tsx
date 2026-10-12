import type { Metadata } from "next";
import { lire } from "@/lib/leqfam";
import { stripe, type StripeMode } from "@/lib/stripe";
import { Header } from "@/components/layout/Header";
import { ConfirmationResiliation, DemandeResiliation } from "@/components/communaute/ResiliationForms";

export const metadata: Metadata = { title: "Résilier mon abonnement LEQ'FAM", robots: { index: false }, alternates: { canonical: "/communaute/resilier" } };
export const dynamic = "force-dynamic";

type Abonnement = { status: string; cancel_at: number | null; cancel_at_period_end: boolean; items: { data: { current_period_end: number }[] }; metadata: Record<string, string> };
const dateFr = (s: number) => new Date(s * 1000).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/** Résiliation en ligne, accessible à tout moment (lien dans chaque mail d'abonnement et en pied de page des CGV). */
export default async function ResilierPage({ searchParams }: { searchParams: Promise<{ jeton?: string }> }) {
  const { jeton } = await searchParams;
  const j = lire<{ ab: string; mode: StripeMode }>(jeton);
  let contenu: React.ReactNode = <DemandeResiliation />;

  if (jeton && j) {
    try {
      const a = await stripe<Abonnement>("GET", `/subscriptions/${j.ab}`, {}, j.mode);
      const finPeriode = a.items.data[0]?.current_period_end ?? 0;
      const finEngagement = a.metadata.engagement_fin ? Math.floor(new Date(`${a.metadata.engagement_fin}T00:00:00+01:00`).getTime() / 1000) : 0;
      if (a.status !== "active") contenu = <p className="m-0 text-[17px] text-white">Cet abonnement est déjà terminé.</p>;
      else if (a.cancel_at || a.cancel_at_period_end) contenu = <p className="m-0 text-[17px] text-white">Votre résiliation est déjà enregistrée : votre abonnement s&apos;arrête le {dateFr(a.cancel_at ?? finPeriode)}.</p>;
      else {
        const engagement = finEngagement > finPeriode;
        const fin = engagement ? finEngagement : finPeriode;
        const texte = engagement
          ? `Votre formule comprend un engagement jusqu'au ${dateFr(fin)}. Votre abonnement s'arrêtera à cette date ; d'ici là, les mensualités restent dues et votre accès reste ouvert.`
          : `Votre abonnement s'arrêtera le ${dateFr(fin)}, à la fin du mois déjà payé. Votre accès reste ouvert jusqu'à cette date, sans autre prélèvement.`;
        contenu = <ConfirmationResiliation jeton={jeton} finTexte={texte} />;
      }
    } catch {
      contenu = <DemandeResiliation />;
    }
  }

  return (
    <div className="bg-hero min-h-screen">
      <Header />
      <main className="wrap pt-10 pb-24" style={{ maxWidth: 620 }}>
        <h1 className="m-0 font-bold tracking-[-0.03em] text-white" style={{ fontSize: "clamp(32px, 6vw, 46px)" }}>
          Résilier mon <span className="serif text-gold">abonnement</span>
        </h1>
        <p className="mt-4 mb-8 text-[16px] leading-[1.7] text-white/80">
          {jeton && !j ? "Ce lien a expiré. Indiquez votre adresse email pour en recevoir un nouveau." : "Vous pouvez résilier votre abonnement LEQ'FAM à tout moment, en ligne."}
        </p>
        {contenu}
      </main>
    </div>
  );
}
