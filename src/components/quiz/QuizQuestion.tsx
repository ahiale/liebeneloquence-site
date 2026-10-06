import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Question } from "@/data/quiz";

const LETTERS = ["A", "B", "C", "D", "E"];

export function QuizQuestion({
  question,
  index,
  total,
  selected,
  onSelect,
  onPrev,
  onNext,
  isLast,
}: {
  question: Question;
  index: number;
  total: number;
  selected: number | null;
  onSelect: (answerIndex: number) => void;
  onPrev: () => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const progress = ((index + 1) / total) * 100;

  return (
    <div className="reveal mx-auto w-full max-w-4xl">
      {/* Progression */}
      <div
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Question ${index + 1} sur ${total}`}
        className="mx-auto h-1 w-full max-w-xl overflow-hidden rounded-full bg-white/12"
      >
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#2f8ce0,#8b4fd0)] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-center text-[0.78rem] text-white/45">
        Question {index + 1} sur {total}
      </p>

      <h2 className="mt-10 text-3xl font-bold leading-[1.12] tracking-[-0.035em] sm:text-[2.6rem]">
        {question.prompt}
      </h2>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {question.answers.map((answer, i) => {
          const active = selected === i;
          return (
            <button
              key={answer.label}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(i)}
              className={`group flex items-center gap-4 rounded-[22px] border p-5 text-left transition-all duration-200 ${
                active
                  ? "border-gold/70 bg-gold/12 shadow-[0_16px_40px_-24px_rgba(255,189,89,0.8)]"
                  : "border-white/12 bg-white/6 hover:-translate-y-0.5 hover:border-white/28 hover:bg-white/10"
              }`}
            >
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-[14px] text-base font-semibold transition-colors ${
                  active
                    ? "bg-[linear-gradient(96deg,var(--color-gold),var(--color-orange))] text-ink"
                    : "bg-white/10 text-white/75 group-hover:bg-white/16"
                }`}
              >
                {active ? <Check size={19} strokeWidth={3} /> : LETTERS[i]}
              </span>
              <span className="text-[0.92rem] leading-snug text-white/90">
                {answer.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <Button
          onClick={onPrev}
          disabled={index === 0}
          variant="ghost"
          size="lg"
          className="!bg-white/5"
        >
          <ArrowLeft size={17} /> Précédent
        </Button>
        <Button
          onClick={onNext}
          variant="primary"
          size="lg"
          disabled={selected === null}
        >
          {isLast ? "Voir mon résultat" : "Suivant"} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
