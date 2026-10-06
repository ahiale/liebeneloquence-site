import { Heart, Sparkle, SpeechBubble, Squiggle } from "@/components/ui/Doodles";

const DOMAINES = [
  "Grand Oral BAC",
  "Oral de BTS",
  "Concours d'éloquence",
  "Entretien d'embauche",
  "Soutenance",
  "Pitch d'un projet",
  "Négociation",
  "Tout type d'oral",
  "Prise de parole en cours",
  "Animation d'atelier",
];

const CHIFFRES = [
  { value: "75", unit: "%", text: "des gens craignent de parler en public", circle: "#FFBD59" },
  { value: "3", unit: "x", text: "plus redoutable que la peur de la mort", circle: "#FF5E01" },
  { value: "7", unit: "min", text: "suffisent pour convaincre un jury", circle: "#fff" },
];

export function Constat() {
  return (
    <section className="bg-sky pt-6 pb-20 sm:pb-[104px]">
      <div className="wrap">
        <div
          className="relative rounded-[34px] px-5 py-14 sm:px-10 sm:py-16"
          style={{ background: "linear-gradient(170deg,rgba(0,22,54,.55),rgba(11,48,112,.45))", border: "1px solid rgba(255,189,89,.35)", boxShadow: "0 50px 100px -60px rgba(0,22,54,.8)" }}
        >
          <Sparkle className="wiggle hide-sm absolute" size={42} style={{ top: 26, right: 34 }} />
          <Heart className="wiggle hide-sm absolute" style={{ bottom: 34, left: 36 }} />
          <SpeechBubble className="bob hide-sm absolute" style={{ left: 30, top: -24 }} />
          <Squiggle className="hide-sm absolute" style={{ right: 60, bottom: 40 }} />

          <p className="eyebrow text-center">Le constat</p>
          <p className="mx-auto mt-6 max-w-[768px] text-center text-[17px] leading-[1.65] text-white sm:text-[20px]">
            La prise de parole, on l&apos;imagine réservée aux grandes scènes et aux personnes d&apos;exception. La plupart des gens ne se sentent pas légitimes de prendre la parole, même quand ils en ont le droit, la compétence et les idées. Pourtant, savoir s&apos;exprimer avec clarté et confiance change tout dans la vie. Cette discipline est présente dans les domaines suivants, et bien plus encore :
          </p>
          <ul className="mx-auto mt-10 flex max-w-[896px] list-none flex-wrap justify-center gap-3 p-0">
            {DOMAINES.map((d) => (
              <li
                key={d}
                className="rounded-full px-[18px] py-[9px] text-[13.5px] font-semibold text-ink"
                style={{ background: "linear-gradient(96deg,#FFBD59,#FF5E01)", boxShadow: "0 10px 24px -14px rgba(0,0,0,.6)" }}
              >
                {d}
              </li>
            ))}
          </ul>
          <div className="mt-16 grid gap-10 text-center" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
            {CHIFFRES.map((c) => (
              <div key={c.value} className="relative pt-1.5">
                <svg viewBox="0 0 200 110" preserveAspectRatio="none" fill="none" aria-hidden="true" className="absolute" style={{ left: "50%", top: -6, width: 190, height: 104, marginLeft: -95 }}>
                  <path d="M30 58C34 22 150 12 178 40s-30 60-96 60S10 86 16 56 96 14 150 22" stroke={c.circle} strokeWidth="3" strokeLinecap="round" />
                </svg>
                <p className="relative m-0">
                  <span className="serif text-gold" style={{ fontSize: 76, lineHeight: 1 }}>{c.value}</span>
                  <span className="serif text-white" style={{ fontSize: 38 }}>{c.unit}</span>
                </p>
                <p className="mx-auto mt-[22px] max-w-[240px] text-[15.5px] leading-[1.4] text-white">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
