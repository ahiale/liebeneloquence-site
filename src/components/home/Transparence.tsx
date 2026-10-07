import { Sparkle } from "@/components/ui/Doodles";

const LIMITES = [
  { title: "Diction & phonétique", text: "La correction phonétique et les troubles de la diction relèvent du domaine de l'orthophoniste. Ce n'est pas mon périmètre.", bg: "#FFF6D6", rotate: -2 },
  { title: "Travail technique de la voix", text: "Le coaching vocal en profondeur (placement, projection, résonance) nécessite un professionnel dédié.", bg: "#FFFFFF", rotate: 1.5 },
  { title: "Gestion profonde du stress", text: "La gestion de l'anxiété et des troubles liés au stress dépasse le cadre de la prise de parole. Je travaille sur la confiance à l'oral, pas en thérapie.", bg: "#FFF6D6", rotate: -1 },
];

export function Transparence() {
  return (
    <section className="bg-sky relative overflow-hidden py-20 sm:py-28">
      <div className="wrap relative">
        <Sparkle className="wiggle hide-sm absolute" style={{ right: "4%", top: 0 }} />
        <p className="eyebrow">Transparence</p>
        <h2 className="h2 text-white">
          Ce que je ne fais <span className="serif text-gold">pas</span>
        </h2>
        <p className="mt-5 mb-0 max-w-[672px] text-[15.5px] leading-[1.65] text-white/85">
          Être claire sur les limites de mon accompagnement, c&apos;est la meilleure façon de vous garantir un travail utile. Voici ce qui relève d&apos;autres professionnels.
        </p>
        <div className="mt-14 grid gap-9" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))" }}>
          {LIMITES.map((l) => (
            <div key={l.title} className="postit" style={{ background: l.bg, transform: `rotate(${l.rotate}deg)` }}>
              <span aria-hidden="true" className="absolute left-1/2 h-6 w-[90px]" style={{ top: -12, marginLeft: -45, background: "rgba(255,255,255,.65)", transform: "rotate(-3deg)", borderRadius: 3 }} />
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="absolute" style={{ top: 14, right: 16 }}>
                <path d="M10 10c7 6 14 13 20 20M30 9c-6 8-13 14-20 21" stroke="#e0748f" strokeWidth="3.2" strokeLinecap="round" />
              </svg>
              <h3 className="m-0 pr-11 text-[19px] font-bold tracking-[-0.02em] text-ink">{l.title}</h3>
              <p className="mt-3 mb-0 text-[14.5px] leading-[1.65] text-ink/75">{l.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
