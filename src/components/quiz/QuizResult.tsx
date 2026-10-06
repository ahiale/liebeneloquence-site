"use client";

import { useState } from "react";
import {
  Sprout,
  Blocks,
  TrendingUp,
  Flame,
  Crown,
  CheckCircle2,
  Target,
  Sparkles,
  Lightbulb,
  RotateCcw,
  Send,
  Gift,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { Profile } from "@/data/quiz";
import { MAX_SCORE } from "@/data/quiz";
import { getPack, PACKS, GRAND_ORAL } from "@/data/packs";

const PROFILE_ICONS: Record<string, LucideIcon> = {
  silencieux: Sprout,
  construction: Blocks,
  affirmatif: TrendingUp,
  inspire: Flame,
  accompli: Crown,
};

const COLUMNS = [
  { key: "strengths", title: "Vos forces", icon: CheckCircle2 },
  { key: "axes", title: "Vos axes de travail", icon: Target },
  { key: "change", title: "Ce que LEQ va changer", icon: Sparkles },
] as const;

const DIAGNOSTIC_POINTS = [
  "Identification de vos vrais blocages",
  "Plan de travail personnalisé envoyé par mail",
  "Aucun paiement requis pour cette étape",
  "Disponible pour tous les profils (hors offre Grand Oral)",
];

export function QuizResult({
  profile,
  score,
  onRestart,
}: {
  profile: Profile;
  score: number;
  onRestart: () => void;
}) {
  const pack = getPack(profile.packId);
  const Icon = PROFILE_ICONS[profile.id] ?? Sprout;
  const [sent, setSent] = useState(false);
  const clamped = Math.min(score, MAX_SCORE);

  return (
    <div className="reveal mx-auto w-full max-w-5xl">
      {/* ------------------------------------------------ En-tête du profil */}
      <header className="text-center">
        <p className="eyebrow text-gold">Quiz d&apos;orateur</p>

        <span
          className="mx-auto mt-8 grid h-20 w-20 place-items-center rounded-[24px] ring-1"
          style={{
            background: `${profile.color}22`,
            color: profile.color,
            boxShadow: `inset 0 0 0 1px ${profile.color}55, 0 24px 60px -30px ${profile.color}`,
          }}
        >
          <Icon size={38} strokeWidth={1.7} />
        </span>

        <p
          className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.24em]"
          style={{ color: profile.color }}
        >
          {profile.level} · {profile.reference}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-white/72">
          {profile.description}
        </p>

        {/* Score : une pastille par point */}
        <div
          className="mt-9 flex flex-wrap justify-center gap-2"
          role="img"
          aria-label={`Score : ${clamped} points sur ${MAX_SCORE}`}
        >
          {Array.from({ length: MAX_SCORE }).map((_, i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full transition-colors"
              style={{
                background: i < clamped ? profile.color : "rgba(255,255,255,0.14)",
              }}
            />
          ))}
        </div>
        <p className="mt-3 text-[0.8rem] text-white/45">
          {clamped} / {MAX_SCORE} points · cette recommandation est donnée à
          titre indicatif
        </p>
      </header>

      {/* ------------------------------------------------------ Trois cartes */}
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {COLUMNS.map((col, i) => (
          <Reveal
            key={col.key}
            delay={i * 100}
            className="surface flex flex-col rounded-card p-6"
          >
            <span
              className="inline-grid h-11 w-11 place-items-center rounded-[13px]"
              style={{ background: `${profile.color}22`, color: profile.color }}
            >
              <col.icon size={20} strokeWidth={1.9} />
            </span>
            <h2 className="mt-4 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-white/85">
              {col.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {profile[col.key].map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-[0.88rem] leading-snug text-white/68"
                >
                  <span
                    aria-hidden
                    className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: profile.color }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      {/* ------------------------------------------------------ Le conseil */}
      <Reveal className="mt-5 flex gap-4 rounded-card border border-gold/25 bg-gold/8 p-6">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] bg-gold/16 text-gold">
          <Lightbulb size={20} strokeWidth={1.9} />
        </span>
        <div>
          <h2 className="text-[0.78rem] font-bold uppercase tracking-[0.16em] text-gold">
            Le conseil de LEQ
          </h2>
          <p className="mt-2 leading-relaxed text-white/78">{profile.advice}</p>
        </div>
      </Reveal>

      {/* ------------------------------------------- Formation recommandée */}
      {pack && (
        <Reveal className="mt-5 overflow-hidden rounded-card border border-success/25 bg-[linear-gradient(105deg,rgba(47,189,110,0.16),rgba(17,77,168,0.16))] p-7 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-success-300">
                Formation recommandée · point de départ
              </p>
              <h2 className="mt-2.5 text-3xl font-bold tracking-[-0.035em]">
                Pack {pack.name}
              </h2>
              <p className="mt-2 max-w-md leading-relaxed text-white/70">
                {profile.packPitch}
              </p>
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <p className="flex items-baseline gap-0.5 text-success-300 sm:justify-end">
                <span className="text-5xl font-bold tracking-[-0.04em]">
                  {pack.priceStandard}
                </span>
                <span className="text-2xl font-semibold">€</span>
              </p>
              <p className="mt-1 text-[0.8rem] text-white/55">
                {pack.meta} · {pack.installment}
              </p>
            </div>
          </div>
        </Reveal>
      )}

      {/* --------------------------------- Réservation + diagnostic offert */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Reveal className="surface rounded-card p-7">
          <h2 className="text-2xl font-bold tracking-[-0.03em]">
            Réserver ma séance
          </h2>
          <p className="mt-2 text-[0.88rem] leading-relaxed text-white/62">
            Complétez ce formulaire. Je vous recontacte sous 24&nbsp;h pour
            confirmer votre créneau.
          </p>

          {sent ? (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-[18px] border border-success/30 bg-success/10 px-6 py-12 text-center">
              <CheckCircle2 size={38} className="text-success-300" />
              <p className="font-semibold">Demande envoyée</p>
              <p className="text-sm text-white/65">
                Merci. Je reviens vers vous sous 24&nbsp;h.
              </p>
            </div>
          ) : (
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div>
                <label className="field-label" htmlFor="q-nom">
                  Votre prénom &amp; nom
                </label>
                <input
                  id="q-nom"
                  name="nom"
                  className="field"
                  placeholder="Ex : Marie Dupont"
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="q-email">
                  Votre email
                </label>
                <input
                  id="q-email"
                  name="email"
                  type="email"
                  className="field"
                  placeholder="vous@email.com"
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="q-profil">
                  Votre profil
                </label>
                <select id="q-profil" name="profil" className="field" required>
                  <option value="">Sélectionner</option>
                  <option>Lycéen(ne) · Terminale</option>
                  <option>Étudiant(e)</option>
                  <option>Professionnel(le)</option>
                  <option>Entrepreneur(e)</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="q-formation">
                  La formation qui vous intéresse
                </label>
                <select
                  id="q-formation"
                  name="formation"
                  className="field"
                  defaultValue={pack?.name ?? ""}
                >
                  {PACKS.map((p) => (
                    <option key={p.id} value={p.name}>
                      Pack {p.name} · {p.meta}
                    </option>
                  ))}
                  <option value={GRAND_ORAL.name}>
                    {GRAND_ORAL.name} · {GRAND_ORAL.sessions}
                  </option>
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="q-objectif">
                  Un mot sur votre objectif (optionnel)
                </label>
                <textarea
                  id="q-objectif"
                  name="objectif"
                  className="field min-h-28 resize-y"
                  placeholder="Soutenance dans 2 semaines, prise de parole en réunion…"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                <Send size={17} /> Envoyer ma demande
              </Button>
            </form>
          )}
        </Reveal>

        <Reveal
          delay={110}
          className="flex flex-col rounded-card border border-success/25 bg-[linear-gradient(168deg,rgba(47,189,110,0.14),rgba(17,77,168,0.16))] p-7"
        >
          <span className="grid h-12 w-12 place-items-center rounded-[15px] bg-success/16 text-success-300">
            <Gift size={22} strokeWidth={1.9} />
          </span>
          <h2 className="mt-5 text-2xl font-bold leading-snug tracking-[-0.03em]">
            La séance diagnostic est offerte.
          </h2>
          <p className="mt-3 leading-relaxed text-white/72">
            Avant de démarrer, on se retrouve 30 minutes en visio pour faire le
            point ensemble. Aucun engagement, aucune pression.
          </p>

          <ul className="mt-7 flex-1 space-y-3.5">
            {DIAGNOSTIC_POINTS.map((p) => (
              <li key={p} className="flex gap-3 text-[0.9rem] text-white/82">
                <CheckCircle2
                  size={19}
                  strokeWidth={2}
                  className="mt-px shrink-0 text-success-300"
                />
                {p}
              </li>
            ))}
          </ul>

          <p className="mt-8 rounded-full border border-success/35 bg-success/10 px-5 py-3 text-center text-[0.9rem] font-semibold text-success-300">
            Offerte · 30 minutes · en visio
          </p>
        </Reveal>
      </div>

      <div className="mt-10 text-center">
        <Button onClick={onRestart} variant="ghost" size="md">
          <RotateCcw size={16} /> Refaire le quiz
        </Button>
      </div>
    </div>
  );
}
