"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { enregistrerQuiz, recevoirResultatQuiz } from "@/app/actions";
import { SITE } from "@/config/site";
import { IDLE } from "@/lib/forms";
import { QUESTIONS, computeResult, isAnswered, type Answer } from "@/lib/quiz";
import { Check, Sparkle } from "@/components/ui/Doodles";
import { FieldError, fieldProps, FormError, FormSuccess, Honeypot, SubmitButton } from "@/components/ui/Form";

type Step = "intro" | "q" | "result";

export function Quiz() {
  const [step, setStep] = useState<Step>("intro");
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const q = QUESTIONS[qi];
  const current = answers[qi];
  const answered = isAnswered(q, current);

  // Place le focus sur le titre à chaque changement d'écran (clavier, lecteur d'écran).
  useEffect(() => {
    if (step !== "intro") titleRef.current?.focus();
  }, [step, qi]);

  const start = () => {
    setAnswers([]);
    setQi(0);
    setStep("q");
  };
  const pick = (tag: string | number) => {
    const next = answers.slice();
    if (q.multiple) {
      // Choix multiples : on coche / décoche
      const list = Array.isArray(current) ? current : [];
      const t = String(tag);
      next[qi] = list.includes(t) ? list.filter((x) => x !== t) : [...list, t];
    } else next[qi] = tag;
    setAnswers(next);
  };
  const isOn = (tag: string | number) => (Array.isArray(current) ? current.includes(String(tag)) : current === tag);
  const next = () => {
    if (!answered) return;
    if (qi >= QUESTIONS.length - 1) {
      setStep("result");
      void enregistrerQuiz(answers);
    } else setQi(qi + 1);
  };
  const back = () => (qi === 0 ? setStep("intro") : setQi(qi - 1));

  return (
    <main className="wrap relative pt-8 pb-24 sm:pt-12" style={{ maxWidth: 1040 }}>
      {step === "intro" && (
        <section className="pop mx-auto max-w-[780px] text-center">
          <p className="eyebrow" style={{ color: "rgba(255,255,255,.8)" }}>Quiz d&apos;orateur</p>
          <h1 className="mt-7 mb-0 leading-[1.02] font-bold tracking-[-0.04em]" style={{ fontSize: "clamp(44px, 9vw, 66px)" }}>
            Quel type
            <br />
            <span className="serif text-gold" style={{ fontSize: "1.15em" }}>d&apos;orateur</span>
            <br />
            êtes-vous ?
          </h1>
          <p className="mx-auto mt-7 max-w-[576px] text-[16px] leading-[1.7] text-white/85">
            6 questions, 2 minutes : on identifie votre profil, vos forces, vos axes de travail et la formation qui vous correspond vraiment.
          </p>
          <div className="mt-9">
            <button type="button" className="btn btn-p" onClick={start}>
              Commencer le quiz
            </button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-14">
            {[
              ["6", "", "questions"],
              ["5", "", "profils possibles"],
              ["2", "min", "en moyenne"],
            ].map(([n, unit, label]) => (
              <div key={label}>
                <p className="m-0 text-[40px] leading-none font-bold">
                  {n}
                  {unit && <span className="text-[18px]">{unit}</span>}
                </p>
                <p className="mt-1.5 mb-0 text-[13px] text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {step === "q" && (
        <section key={qi} className="pop" aria-labelledby="quiz-question">
          <p className="m-0 text-center text-[12px] font-semibold tracking-[.2em] text-white/85">
            QUESTION {qi + 1} / {QUESTIONS.length} · <span className="text-gold">{q.axis}</span>
          </p>
          <div className="mx-auto mt-3.5 h-2.5 max-w-[520px] overflow-hidden rounded-full bg-white/18" role="progressbar" aria-valuemin={1} aria-valuemax={6} aria-valuenow={qi + 1} aria-label="Progression du quiz">
            <div className="h-full rounded-full bg-gold transition-[width] duration-500" style={{ width: `${Math.round(((qi + 1) / QUESTIONS.length) * 100)}%` }} />
          </div>
          <h2 id="quiz-question" ref={titleRef} tabIndex={-1} className="mx-auto mt-8 mb-0 max-w-[820px] text-center leading-[1.15] font-bold tracking-[-0.03em] outline-none" style={{ fontSize: "clamp(26px, 5vw, 40px)" }}>
            {q.text}
          </h2>
          {q.multiple && <p className="mt-3 mb-0 text-center text-[14px] font-semibold text-gold">Plusieurs réponses possibles</p>}
          <div role={q.multiple ? "group" : "radiogroup"} aria-labelledby="quiz-question" className="mt-8 grid gap-3.5 sm:mt-10 sm:gap-[22px]" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(150px,40%),1fr))" }}>
            {q.options.map((o) => {
              const on = isOn(o.tag);
              return (
                <button key={o.label} type="button" role={q.multiple ? "checkbox" : "radio"} aria-checked={on} onClick={() => pick(o.tag)} className={`quiz-opt ${on ? "quiz-opt-on" : ""}`}>
                  <span className="relative flex items-center justify-center overflow-hidden bg-cloud" style={{ aspectRatio: "4 / 3" }}>
                    <span className="halo absolute rounded-full" style={{ inset: "10%", background: "radial-gradient(circle,rgba(255,189,89,.85),transparent 70%)" }} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={o.img} alt="" className="relative h-auto w-[46%]" />
                  </span>
                  <span className="px-3.5 pt-3 pb-4 text-left text-[14px] leading-[1.4] font-semibold sm:px-[18px] sm:pt-4 sm:pb-5 sm:text-[16px]">{o.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-11 flex items-center justify-between gap-4">
            <button type="button" className="btn btn-g" onClick={back}>
              Précédent
            </button>
            <button type="button" className="btn btn-p" onClick={next} disabled={!answered}>
              {qi >= QUESTIONS.length - 1 ? "Voir mon résultat" : "Suivant"}
            </button>
          </div>
        </section>
      )}

      {step === "result" && <Result answers={answers} titleRef={titleRef} />}

      {step === "result" && (
        <p className="mt-7 mb-0 text-center">
          <button type="button" onClick={start} className="cursor-pointer border-0 bg-transparent text-[14px] text-white/75 underline">
            Refaire le quiz
          </button>
        </p>
      )}
    </main>
  );
}

function Result({ answers, titleRef }: { answers: Answer[]; titleRef: React.RefObject<HTMLHeadingElement | null> }) {
  const r = computeResult(answers);
  const [state, action] = useActionState(recevoirResultatQuiz, IDLE);

  return (
    <section className="pop">
      <p className="eyebrow text-center" style={{ color: "rgba(255,255,255,.85)" }}>Votre profil d&apos;orateur</p>
      <h1 ref={titleRef} tabIndex={-1} className="mt-3.5 mb-0 text-center leading-[1.05] outline-none" style={{ fontSize: "clamp(44px, 9vw, 64px)" }}>
        <span className="serif text-gold">{r.profile.name}</span>
      </h1>

      <div className="mt-10 flex flex-wrap items-stretch gap-[26px]">
        <div className="sticker flex min-w-0 flex-col items-center justify-center p-[30px] text-center" style={{ flex: "1 1 320px", transform: "rotate(-1.5deg)" }}>
          <div className="relative h-[120px] w-[120px]">
            <span className="halo absolute rounded-full" style={{ inset: "-18%", background: "radial-gradient(circle,rgba(255,189,89,.7),transparent 70%)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.profile.img} alt="" className="relative h-[120px] w-[120px]" />
          </div>
          <p className="mt-5 mb-0 text-[15px] leading-[1.65] text-ink/75">{r.profile.desc}</p>
        </div>

        <div className="flex min-w-0 flex-col gap-5" style={{ flex: "1 1 420px" }}>
          <div className="sticker p-6" style={{ transform: "rotate(1deg)" }}>
            <p className="m-0 text-[20px] font-bold tracking-[-0.02em] text-ink">
              Votre <span className="serif text-orange">niveau</span>
            </p>
            <p className="mt-2 mb-0 text-[24px] font-bold">{r.level.name}</p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-cloud">
              <div className="grow h-full bg-gold" style={{ width: r.level.width }} />
            </div>
            <p className="mt-2.5 mb-0 text-[14.5px] text-ink/70">{r.level.desc}</p>
          </div>
          <div className="sticker p-6" style={{ transform: "rotate(-.8deg)" }}>
            <p className="m-0 text-[20px] font-bold tracking-[-0.02em] text-ink">
              Vos points <span className="serif text-orange">à travailler</span>
            </p>
            <ul className="mt-3.5 mb-0 grid list-none gap-2.5 p-0">
              {r.points.map((p) => (
                <li key={p.title} className="flex items-start gap-3">
                  <Sparkle size={22} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>
                    <strong>{p.title}</strong>
                    <span className="block text-[14px] text-ink/68">{p.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fiche orateur par mail : apporte ce que la page n'affiche pas */}
          <div className="relative rounded-[24px] p-6 text-white" style={{ background: "linear-gradient(165deg,#04193c,#0e3f8b)", boxShadow: "0 30px 60px -30px rgba(0,22,54,.9)", transform: "rotate(.6deg)" }}>
            {state.status === "success" ? (
              <FormSuccess title="C'est envoyé !">Votre fiche orateur vous attend dans votre boîte mail.</FormSuccess>
            ) : (
              <form action={action} className="relative grid gap-3" noValidate>
                <Honeypot />
                <input type="hidden" name="answers" value={JSON.stringify(answers)} />
                <p className="m-0 text-[20px] font-bold tracking-[-0.02em]">
                  Recevez votre <span className="serif text-gold">fiche orateur</span>
                </p>
                <ul className="m-0 grid list-none gap-1.5 p-0 text-[14px] text-white/85">
                  <li className="flex gap-2"><Check color="#FFBD59" />Un exercice concret pour chaque point à travailler</li>
                  <li className="flex gap-2"><Check color="#FFBD59" />Le pack que je vous conseille, selon votre profil</li>
                </ul>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flabel">
                    Prénom
                    <input className="field" placeholder="Marie" autoComplete="given-name" required {...fieldProps(state, "prenom")} />
                    <FieldError state={state} name="prenom" />
                  </label>
                  <label className="flabel">
                    Email
                    <input className="field" type="email" placeholder="vous@email.com" autoComplete="email" required {...fieldProps(state, "email")} />
                    <FieldError state={state} name="email" />
                  </label>
                </div>
                <FormError state={state} />
                <SubmitButton>Recevoir ma fiche</SubmitButton>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="mt-9 text-center">
        <h2 className="m-0 font-bold tracking-[-0.03em]" style={{ fontSize: "clamp(26px, 5vw, 34px)" }}>
          Réservez votre séance <span className="serif text-gold">pour aller plus loin.</span>
        </h2>
        <p className="mt-2.5 mb-0 text-[16px] text-white/85">Quel type de séance souhaitez-vous ?</p>
        <div className="mx-auto mt-7 grid max-w-[760px] gap-[22px] text-left" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))" }}>
          <a href={SITE.calendly} target="_blank" rel="noreferrer noopener" className="sticker block p-[26px] no-underline" style={{ transform: "rotate(-1deg)" }}>
            <span className="flex items-center justify-between">
              <span className="text-[20px] font-bold text-ink">Séance classique</span>
              <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-bold text-ink">→</span>
            </span>
            <span className="mt-2 block text-[14.5px] leading-[1.55] text-ink/70">Je choisis un créneau dans l&apos;agenda de Rebecca.</span>
          </a>
          <Link href="/grand-oral" className="sticker block p-[26px] no-underline" style={{ background: "linear-gradient(160deg,#FFF1E3,#fff)", transform: "rotate(1deg)" }}>
            <span className="flex items-center justify-between">
              <span className="text-[20px] font-bold text-ink">Séance spéciale Grand Oral</span>
              <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-orange font-bold text-white">→</span>
            </span>
            <span className="mt-2 block text-[14.5px] leading-[1.55] text-ink/70">Bac, BTS, soutenance, pitch : je découvre l&apos;offre dédiée.</span>
          </Link>
        </div>
      </div>

    </section>
  );
}
