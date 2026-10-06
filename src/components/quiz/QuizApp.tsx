"use client";

import { useCallback, useMemo, useState } from "react";
import { BackHeader } from "@/components/layout/BackHeader";
import { QuizIntro } from "./QuizIntro";
import { QuizQuestion } from "./QuizQuestion";
import { QuizResult } from "./QuizResult";
import { QUESTIONS, getProfile } from "@/data/quiz";

type Phase = "intro" | "quiz" | "result";

const emptyAnswers = () => Array<number | null>(QUESTIONS.length).fill(null);

export function QuizApp() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(emptyAnswers);

  const score = useMemo(
    () =>
      answers.reduce<number>((sum, answerIndex, qIndex) => {
        if (answerIndex === null) return sum;
        return sum + QUESTIONS[qIndex].answers[answerIndex].points;
      }, 0),
    [answers],
  );

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const select = (answerIndex: number) =>
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = answerIndex;
      return next;
    });

  const next = () => {
    if (current < QUESTIONS.length - 1) setCurrent((c) => c + 1);
    else setPhase("result");
    scrollTop();
  };

  const prev = () => {
    setCurrent((c) => Math.max(0, c - 1));
    scrollTop();
  };

  const restart = () => {
    setAnswers(emptyAnswers());
    setCurrent(0);
    setPhase("intro");
    scrollTop();
  };

  return (
    <div className="bg-quiz relative flex min-h-screen flex-col overflow-hidden">
      <BackHeader />

      {/* `my-auto` centre verticalement les écrans courts (intro, question)
          sans jamais rogner le haut des écrans longs (résultat) — contrairement
          à `items-center`, dont le débordement est inaccessible. */}
      <main className="flex flex-1 flex-col px-5 pt-32 pb-20 sm:px-8">
        <div className="mx-auto my-auto w-full max-w-5xl">
          {phase === "intro" && <QuizIntro onStart={() => setPhase("quiz")} />}

          {phase === "quiz" && (
            <QuizQuestion
              key={current}
              question={QUESTIONS[current]}
              index={current}
              total={QUESTIONS.length}
              selected={answers[current]}
              onSelect={select}
              onPrev={prev}
              onNext={next}
              isLast={current === QUESTIONS.length - 1}
            />
          )}

          {phase === "result" && (
            <QuizResult
              profile={getProfile(score)}
              score={score}
              onRestart={restart}
            />
          )}
        </div>
      </main>

    </div>
  );
}
