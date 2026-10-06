import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QUESTIONS, PROFILES } from "@/data/quiz";

const STATS = [
  { value: String(QUESTIONS.length), unit: "", label: "questions" },
  { value: String(PROFILES.length), unit: "", label: "profils possibles" },
  { value: "2", unit: "min", label: "en moyenne" },
];

export function QuizIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="reveal mx-auto max-w-3xl text-center">
      <p className="eyebrow text-white/55">Quiz d&apos;orateur</p>

      <h1 className="mt-7 text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[4.2rem]">
        Quel type
        <br />
        <span className="font-serif text-[1.15em] font-normal italic tracking-normal text-orange">
          d&apos;orateur
        </span>
        <br />
        êtes-vous&nbsp;?
      </h1>

      <p className="mx-auto mt-7 max-w-xl leading-relaxed text-white/70">
        {QUESTIONS.length}&nbsp;questions, 2 minutes&nbsp;: on identifie votre profil,
        vos forces, vos axes de travail et la formation qui vous correspond
        vraiment.
      </p>

      <Button onClick={onStart} variant="primary" size="lg" className="mt-10">
        Commencer le quiz <ArrowRight size={18} />
      </Button>

      <dl className="mt-14 flex items-start justify-center gap-10 sm:gap-16">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <dd className="text-4xl font-bold tracking-[-0.04em]">
              {s.value}
              {s.unit && (
                <span className="text-lg font-semibold text-white/70">
                  {s.unit}
                </span>
              )}
            </dd>
            <dt className="mt-1 text-[0.82rem] text-white/60">{s.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
