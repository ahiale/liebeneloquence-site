import type { Pricing } from "@/content/schema";
import { formatAmount } from "@/lib/format";
import { Sparkle, SpeechBubble } from "@/components/ui/Doodles";
import { SeanceForm } from "./SeanceForm";

/** Séance à l'unité : un sujet précis, une ou quelques séances, sans suivi (le suivi, c'est les packs). */
export function SeanceUnique({ pricing }: { pricing: Pricing }) {
  const { price, maxSessions } = pricing.seance;
  return (
    <section id="seance" className="bg-warm relative overflow-hidden py-20 text-ink sm:py-28">
      <div className="wrap flex flex-wrap items-start gap-12">
        <div className="relative min-w-0" style={{ flex: "1 1 400px" }}>
          <SpeechBubble className="hide-sm absolute" style={{ right: 0, top: -64 }} />
          <p className="eyebrow" style={{ color: "#CC4A00" }}>Séance à l&apos;unité</p>
          <h2 className="h2">
            Un sujet précis ? <span className="serif text-royal">Réservez une séance.</span>
          </h2>
          <p className="mt-5 mb-0 max-w-[520px] text-[16px] leading-[1.7] text-ink/75">
            Un oral qui approche, une intervention à préparer, un point qui vous bloque : on travaille ensemble sur le sujet de votre choix. Vous décidez du nombre de séances, jusqu&apos;à {maxSessions}.
          </p>
          <p className="mt-7 mb-0 flex items-baseline text-orange">
            <span className="text-[24px] font-semibold">€</span>
            <span className="text-[52px] leading-none font-bold tracking-[-0.04em]">{formatAmount(price)}</span>
            <span className="ml-2 text-[16px] font-semibold text-ink/60">la séance</span>
          </p>
          <div className="mt-7 max-w-[520px] rounded-[20px] p-5 text-[14.5px] leading-[1.65] text-ink/75" style={{ background: "rgba(255,255,255,.7)", border: "1px solid rgba(0,22,54,.1)" }}>
            <Sparkle className="mr-1 inline-block align-[-3px]" size={18} />
            <strong className="text-ink">Juste la séance :</strong> pas de suivi, pas de ressources ni d&apos;accès. Pour être accompagné·e dans la durée, choisissez plutôt{" "}
            <a href="#offres" className="font-semibold text-royal">un de nos packs</a>.
          </div>
        </div>
        <div className="min-w-0" style={{ flex: "1 1 440px" }}>
          <SeanceForm price={price} maxSessions={maxSessions} />
        </div>
      </div>
    </section>
  );
}
