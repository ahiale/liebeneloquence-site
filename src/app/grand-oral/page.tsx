import type { Metadata } from "next";
import { getPricing } from "@/content";
import { formatAmount } from "@/lib/format";
import { SimpleHeader } from "@/components/layout/SimpleHeader";
import { Sparkle, SpeechBubble } from "@/components/ui/Doodles";
import { GrandOralForm } from "@/components/grand-oral/GrandOralForm";

export const metadata: Metadata = {
  title: "Offre Grand Oral",
  description: "5 séances intensives pour réussir le Grand Oral du bac, un oral de BTS, une soutenance ou un pitch face à un jury.",
  alternates: { canonical: "/grand-oral" },
};

const ORAUX_CIBLES = ["Grand Oral BAC", "Oral de BTS", "Concours d'éloquence", "Soutenance", "Pitch", "Tout type d'oral"];

const COMPETENCES = [
  { title: "Structuration du discours", text: "Construire un plan clair, logique et mémorable en peu de temps. Aller à l'essentiel sans se perdre.", rotate: -2 },
  { title: "Gestion du trac", text: "Des techniques concrètes pour calmer le stress avant et pendant l'oral, et transformer la pression en énergie positive.", rotate: 1.5 },
  { title: "Verbal & non-verbal", text: "Aligner la voix, le corps et les mots. Occuper l'espace avec intention et naturel.", rotate: -1 },
  { title: "Réponses aux questions", text: "Répondre aux questions du jury avec calme, précision et assurance, même à l'improviste.", rotate: 2 },
  { title: "Gestion du temps", text: "Respecter les contraintes de temps sans se précipiter ni s'embourber. Rythme et fluidité.", rotate: 1 },
  { title: "Présence & impact", text: "Créer une connexion avec le jury dès les premières secondes. Marquer les esprits, pas juste remplir le temps.", rotate: -1.5 },
  { title: "Maîtrise du fond", text: "Consolider le contenu, identifier les angles forts et les faiblesses à corriger avant le jour J.", rotate: 2 },
  { title: "Mise en situation réelle", text: "Simulation complète des conditions de l'oral, avec feedback détaillé et axes d'amélioration précis.", rotate: -1 },
];

function CalendarCheck() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
    </svg>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <svg width="96" height="104" viewBox="0 0 96 104" aria-hidden="true" style={{ display: "block", margin: "0 auto" }}>
      <path d="M48 4l38 22v44L48 92 10 70V26z" fill="#114DA8" stroke="#FFBD59" strokeWidth="4" strokeLinejoin="round" />
      <path d="M48 16l28 16v32L48 80 20 64V32z" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.5" strokeDasharray="3 5" />
      <text x="48" y="60" textAnchor="middle" fontFamily="var(--font-melodrame), Georgia, serif" fontStyle="italic" fontSize="34" fill="#FFBD59">
        {String(n).padStart(2, "0")}
      </text>
      <path d="M30 92l-6 10 10-2 4 6 4-12M66 92l6 10-10-2-4 6-4-12" fill="#FFBD59" />
    </svg>
  );
}

export default async function GrandOralPage() {
  const { grandOral: go } = await getPricing();

  return (
    <div className="text-ink" style={{ background: "#FFF6EC" }}>
      {/* HERO */}
      <div className="bg-warm">
        <SimpleHeader tone="light" />
        <section className="wrap flex flex-wrap items-center gap-10 pt-10 pb-20 sm:pt-16 sm:pb-[104px]">
          <div className="relative min-w-0" style={{ flex: "1.05 1 500px" }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11.5px] font-semibold tracking-[.18em] text-royal uppercase" style={{ boxShadow: "0 8px 20px -14px rgba(0,22,54,.5)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
              </svg>
              Offre exclusive LEQ
            </span>
            <h1 className="mt-7 mb-0 leading-[1.02] font-bold tracking-[-0.04em]" style={{ fontSize: "clamp(44px, 8vw, 60px)" }}>
              L&apos;offre
              <br />
              <span className="relative inline-block" style={{ padding: "4px 18px 8px 10px" }}>
                <span className="serif text-royal" style={{ fontSize: "1.12em" }}>GRAND ORAL</span>
                <svg className="draw absolute" viewBox="0 0 400 110" preserveAspectRatio="none" fill="none" aria-hidden="true" style={{ inset: "-14px -22px -10px -18px", width: "calc(100% + 40px)", height: "calc(100% + 24px)" }}>
                  <path d="M30 60C40 20 160 8 260 12s130 22 128 46-90 44-200 44S10 92 14 62 120 14 230 16" stroke="#FF5E01" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <Sparkle className="wiggle hide-sm absolute" style={{ left: 380, top: 96 }} />
            <p className="mt-7 mb-0 max-w-[512px] text-[16px] leading-[1.7] text-ink/72">
              Découvrez les méthodes et les outils qui vous permettront de réussir n&apos;importe quelle présentation orale face à un jury, en travaillant à la fois le fond de votre discours et la qualité de votre prestation.
            </p>
            <ul className="mt-7 mb-0 flex list-none flex-wrap gap-2.5 p-0">
              {ORAUX_CIBLES.map((o) => (
                <li key={o} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-medium" style={{ boxShadow: "0 8px 20px -14px rgba(0,22,54,.5)" }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-royal" />
                  {o}
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <a className="btn btn-p" href="#reserver">
                <CalendarCheck /> Je réserve ma place
              </a>
            </div>
          </div>

          <div className="relative min-w-0" style={{ flex: ".95 1 360px" }}>
            <svg className="hide-sm absolute" width="80" height="60" viewBox="0 0 90 60" fill="none" aria-hidden="true" style={{ left: -60, top: -20 }}>
              <path d="M6 40c16-22 34-26 46-14 7 8-1 16-8 10s4-22 24-22c6 0 12 2 16 6" stroke="#114DA8" strokeWidth="2.6" strokeLinecap="round" />
              <path d="m80 14 6 8-10 1" stroke="#114DA8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="overflow-hidden rounded-[26px]" style={{ background: "linear-gradient(165deg,#3a1508 0%,#2E1106 35%,#0b1d3f 75%,#001636 100%)", border: "1.5px solid rgba(255,94,1,.55)", boxShadow: "0 44px 90px -45px rgba(255,94,1,.55)" }}>
              <div className="h-1" style={{ background: "linear-gradient(90deg,#FFBD59,#FF5E01)" }} />
              <div className="p-6 text-white sm:p-8">
                <p className="eyebrow" style={{ fontSize: 11.5, letterSpacing: ".18em", color: "#FF5E01" }}>Offre Grand Oral</p>
                <h2 className="mt-2.5 mb-0 text-[30px] font-bold tracking-[-0.035em]">{go.sessions} séances intensives</h2>
                <p className="mt-1.5 mb-0 text-[13.6px] text-white/60">{go.sessionDuration} par séance · Sans diagnostic préalable</p>
                <p className="mt-6 mb-0 flex items-baseline text-orange">
                  <span className="text-[24px] font-semibold">€</span>
                  <span className="text-[60px] leading-none font-bold tracking-[-0.045em]">{formatAmount(go.price)}</span>
                </p>
                <p className="mt-1.5 mb-0 text-[12.8px] text-white/55">Paiement en {go.installments} fois possible</p>
                <hr className="my-7 border-0 border-t border-white/12" />
                <ul className="m-0 grid list-none gap-3.5 p-0">
                  {go.features.map((f) => (
                    <li key={f} className="flex gap-3 text-[14.4px] text-white/88">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a className="btn btn-p mt-8 w-full" href="#reserver">Je réserve ma place</a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* COMPÉTENCES */}
      <section className="bg-light py-20 sm:py-[104px]">
        <div className="wrap">
          <div className="text-center">
            <p className="eyebrow" style={{ color: "#114DA8" }}>Ce que vous allez développer</p>
            <h2 className="mt-4 mb-0 leading-[1.02] font-bold tracking-[-0.035em]" style={{ fontSize: "clamp(34px, 6vw, 46px)" }}>
              Les compétences <span className="serif text-royal">travaillées.</span>
            </h2>
          </div>
          <div className="mt-14 grid gap-x-7 gap-y-12" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(230px,100%),1fr))" }}>
            {COMPETENCES.map((c, i) => (
              <div key={c.title} className="badge text-center" style={{ transform: `rotate(${c.rotate}deg)` }}>
                <Badge n={i + 1} />
                <h3 className="mt-3.5 mb-0 text-[17px] font-bold tracking-[-0.02em]">{c.title}</h3>
                <p className="mx-auto mt-1.5 mb-0 max-w-[250px] text-[13.6px] leading-[1.6] text-ink/65">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RÉSERVER */}
      <section id="reserver" className="bg-ember relative overflow-hidden py-20 text-white sm:py-[104px]">
        <div className="wrap relative flex flex-wrap items-center gap-14">
          <Sparkle className="wiggle hide-sm absolute" size={42} style={{ left: "2%", top: -40 }} />
          <SpeechBubble className="bob hide-sm absolute z-[2]" width={74} height={60} fill="#FF5E01" stroke={null} lines="#fff" style={{ right: -6, top: -50 }} />
          <div className="min-w-0" style={{ flex: "1 1 380px" }}>
            <p className="eyebrow" style={{ color: "#FF5E01" }}>Je réserve ma place</p>
            <h2 className="mt-4 mb-0 leading-[1.05] font-bold tracking-[-0.035em]" style={{ fontSize: "clamp(34px, 6vw, 46px)" }}>
              Parlez-moi de <span className="serif text-orange">votre oral.</span>
            </h2>
            <ol className="mt-8 mb-0 grid list-none gap-[18px] p-0">
              {["Vous remplissez ce formulaire.", "Vous recevez par mail le lien de paiement.", "Une fois le paiement effectué, je vous contacte pour planifier vos séances."].map((t, i) => (
                <li key={t} className="flex items-start gap-4">
                  <span className="serif w-11 shrink-0 text-[44px] leading-[.9] text-white">{i + 1}</span>
                  <span className="text-[15.5px] leading-[1.55] text-white/85">{t}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative min-w-0" style={{ flex: "1.2 1 440px" }}>
            <GrandOralForm />
          </div>
        </div>
      </section>
    </div>
  );
}
