import Link from "next/link";
import type { Pricing } from "@/content/schema";
import { SITE } from "@/config/site";
import { formatAmount } from "@/lib/format";
import { Check, Heart, Sparkle, Squiggle } from "@/components/ui/Doodles";
import { PackIllustration } from "./PackIllustration";

export function Offres({ pricing }: { pricing: Pricing }) {
  const go = pricing.grandOral;
  return (
    <section id="offres" className="bg-light relative overflow-hidden py-20 text-ink sm:py-28">
      <div className="wrap">
        <div className="relative text-center">
          <p className="eyebrow" style={{ color: "#CC4A00" }}>Les offres</p>
          <h2 className="h2">
            Choisissez votre <span className="serif text-royal">pack.</span>
          </h2>
          <Sparkle className="wiggle hide-sm absolute" size={42} style={{ left: "16%", top: -6 }} />
          <Squiggle className="hide-sm absolute" color="#FF5E01" style={{ right: "14%", top: 0 }} />
        </div>

        <div className="mt-14 grid items-stretch gap-8" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))" }}>
          {pricing.packs.map((p) => {
            const dark = p.featured;
            return (
              <article
                key={p.id}
                className={`lift pack relative flex flex-col rounded-[26px] p-[30px] ${dark ? "text-white" : "card-light"}`}
                style={dark ? { background: "linear-gradient(165deg,#04193c,#0e3f8b)", boxShadow: "0 44px 80px -44px rgba(0,22,54,.85)" } : undefined}
              >
                {p.badge && (
                  <span className="pulse2 absolute -top-4 right-6 rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[.1em] text-ink uppercase" style={{ background: "linear-gradient(96deg,#FFBD59,#FF5E01)" }}>
                    {p.badge}
                  </span>
                )}
                <span className="pack-ill">
                  <PackIllustration id={p.id} />
                </span>
                <h3 className="mt-[18px] mb-0 text-[26px] font-bold tracking-[-0.03em]">{p.name}</h3>
                <p className={`mt-1 mb-0 text-[13.5px] ${dark ? "text-white/60" : "text-ink/55"}`}>
                  {p.sessions} séances · {p.level}
                </p>
                <p className={`mt-5 mb-0 flex items-baseline ${dark ? "text-gold" : ""}`}>
                  <span className="text-[24px] font-semibold">€</span>
                  <span className="text-[52px] leading-none font-bold tracking-[-0.04em]">{formatAmount(p.price)}</span>
                </p>
                <p className={`mt-1.5 mb-0 text-[12.5px] ${dark ? "text-white/55" : "text-ink/50"}`}>Paiement en {p.installments}x</p>
                <ul className="mt-6 mb-0 grid flex-1 list-none content-start gap-3 p-0">
                  {p.features.map((f) => (
                    <li key={f} className={`flex gap-2.5 text-[14.5px] ${dark ? "text-white/88" : "text-ink/78"}`}>
                      <Check color={dark ? "#FFBD59" : "#114DA8"} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a className={`btn mt-7 w-full ${dark ? "btn-p" : "btn-royal"}`} href={SITE.calendly} target="_blank" rel="noreferrer noopener">
                  Réserver
                </a>
              </article>
            );
          })}
        </div>

        <div className="relative mt-8 flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-[26px] px-6 py-7 text-white sm:px-8" style={{ background: "linear-gradient(105deg,#114DA8,#0B3070)" }}>
          <Sparkle className="wiggle hide-sm absolute" style={{ right: "30%", top: 14 }} />
          <div className="min-w-0" style={{ flex: "1 1 380px" }}>
            <h3 className="m-0 text-[24px] font-bold tracking-[-0.02em]">Vous hésitez entre deux packs ?</h3>
            <p className="mt-1.5 mb-0 text-[15px] text-white/80">
              Faites le quiz d&apos;orateur en 2 minutes, ou réservez directement votre séance diagnostic offerte.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="btn btn-p" href="/quiz">Faire le quiz</Link>
            <a className="btn btn-g" href={SITE.calendly} target="_blank" rel="noreferrer noopener">Réserver ma séance</a>
          </div>
        </div>

        <div className="lift relative mt-8 flex flex-wrap items-center justify-between gap-7 rounded-[26px] p-6 sm:p-9" style={{ border: "1px solid rgba(255,189,89,.45)", background: "linear-gradient(105deg,#fbe3c6,#f3e8dc 45%,#dfe6f2)" }}>
          <Heart className="wiggle hide-sm absolute" style={{ top: -14, right: 40 }} />
          <div className="min-w-0 max-w-[680px]" style={{ flex: "1 1 520px" }}>
            <span className="inline-block rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[.14em] uppercase" style={{ background: "rgba(255,94,1,.12)", color: "#CC4A00" }}>
              Terminale, BTS, soutenance, pitch
            </span>
            <h3 className="mt-4 mb-0 text-[28px] font-bold tracking-[-0.03em]">
              L&apos;offre <span className="serif text-orange">Grand Oral</span>
            </h3>
            <p className="mt-2.5 mb-0 flex items-baseline text-orange">
              <span className="text-[24px] font-semibold">€</span>
              <span className="text-[48px] leading-none font-bold tracking-[-0.04em]">{formatAmount(go.price)}</span>
            </p>
            <p className="mt-3 mb-0 text-[14.6px] leading-[1.65] text-ink/72">
              <strong className="font-semibold" style={{ color: "#CC4A00" }}>{go.sessions} séances intensives</strong> dédiées aux différentes épreuves orales. Un accompagnement axé sur le fond, la forme et la prise de parole, avec des exercices pratiques et des mises en situation réelles pour gagner en aisance, structurer son discours et se préparer efficacement face au jury.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[240px]">
            <Link className="btn btn-p" href="/grand-oral#reserver" style={{ fontSize: 16, padding: "16px 28px" }}>Je réserve ma place</Link>
            <Link className="btn btn-o" href="/grand-oral">Voir l&apos;offre complète</Link>
          </div>
        </div>
        <p className="mt-6 mb-0 text-center text-[12.8px] text-ink/45">La séance diagnostic de 30 minutes est offerte sur tous les packs.</p>
      </div>
    </section>
  );
}
