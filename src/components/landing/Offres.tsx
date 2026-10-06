"use client";

import { useState } from "react";
import {
  Check,
  Sparkles,
  Landmark,
  GraduationCap,
  BookOpenCheck,
  ArrowRight,
  CalendarCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container, Eyebrow, SectionTitle } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PACKS, GRAND_ORAL } from "@/data/packs";
import { SITE } from "@/data/site";

const PACK_ICONS: Record<string, LucideIcon> = {
  senghor: GraduationCap,
  ciceron: Landmark,
  socrate: Sparkles,
};

export function Offres() {
  const [student, setStudent] = useState(false);

  return (
    <section id="offres" className="bg-light py-20 text-ink sm:py-28">
      <Container>
        <Reveal>
          <Eyebrow className="text-orange">Les offres</Eyebrow>
          <SectionTitle>
            Choisissez votre <span className="text-royal">pack.</span>
          </SectionTitle>

          {/* Bascule tarifaire */}
          <div
            role="group"
            aria-label="Choix du tarif"
            className="mt-8 inline-flex rounded-full bg-ink/8 p-1.5 text-sm font-medium"
          >
            {[
              { label: "Tarif standard", value: false },
              { label: "Tarif étudiant", value: true },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                aria-pressed={student === opt.value}
                onClick={() => setStudent(opt.value)}
                className={`rounded-full px-6 py-2.5 transition-all ${
                  student === opt.value
                    ? "bg-white text-ink shadow-[0_6px_16px_-8px_rgba(0,22,54,0.5)]"
                    : "text-ink/50 hover:text-ink/75"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
          {PACKS.map((pack, i) => {
            const Icon = PACK_ICONS[pack.id] ?? GraduationCap;
            const price = student ? pack.priceStudent : pack.priceStandard;

            return (
              <Reveal
                key={pack.id}
                delay={i * 110}
                className={`relative flex flex-col rounded-[26px] p-7 ${
                  pack.featured
                    ? "bg-[linear-gradient(165deg,#04193c,#0e3f8b)] text-white shadow-[0_44px_80px_-44px_rgba(0,22,54,0.85)]"
                    : "card-light"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-[15px] ring-1 ${
                      pack.featured
                        ? "bg-gold/16 text-gold ring-gold/30"
                        : "bg-royal/8 text-royal ring-royal/15"
                    }`}
                  >
                    <Icon size={23} strokeWidth={1.9} />
                  </span>

                  {pack.featured && (
                    <span className="inline-flex items-center rounded-full bg-[linear-gradient(96deg,var(--color-gold),var(--color-orange))] px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-ink">
                      Le plus complet
                    </span>
                  )}
                </div>

                <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em]">
                  {pack.name}
                </h3>
                <p
                  className={`mt-1 text-[0.82rem] ${
                    pack.featured ? "text-white/55" : "text-ink/50"
                  }`}
                >
                  {pack.meta}
                </p>

                <p className="mt-6 flex items-baseline">
                  <span
                    className={`text-2xl font-semibold ${pack.featured ? "text-gold" : "text-ink"}`}
                  >
                    €
                  </span>
                  <span
                    className={`text-5xl font-bold tracking-[-0.04em] ${
                      pack.featured ? "text-gold" : "text-ink"
                    }`}
                  >
                    {price}
                  </span>
                </p>
                <p
                  className={`mt-1.5 text-[0.78rem] ${
                    pack.featured ? "text-white/50" : "text-ink/45"
                  }`}
                >
                  {student ? "Tarif étudiant" : "Tarif standard"} ·{" "}
                  {pack.installment}
                </p>

                <ul className="mt-7 flex-1 space-y-3.5">
                  {pack.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[0.88rem]">
                      <Check
                        size={17}
                        strokeWidth={2.6}
                        className={`mt-0.5 shrink-0 ${
                          pack.featured ? "text-success-300" : "text-success"
                        }`}
                      />
                      <span
                        className={pack.featured ? "text-white/85" : "text-ink/75"}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href={SITE.calendly}
                  external
                  variant={pack.featured ? "primary" : "light"}
                  size="lg"
                  className="mt-8 w-full"
                >
                  Réserver
                </ButtonLink>
              </Reveal>
            );
          })}
        </div>

        {/* Offre Grand Oral */}
        <Reveal
          delay={120}
          className="mt-6 overflow-hidden rounded-[26px] border border-gold/35 bg-[linear-gradient(105deg,#fbe3c6,#f3e8dc_45%,#dfe6f2)] p-7 text-ink sm:p-9"
        >
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="grid h-12 w-12 place-items-center rounded-[15px] bg-orange/12 text-orange-700 ring-1 ring-orange/25">
                <BookOpenCheck size={23} strokeWidth={1.9} />
              </span>
              <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em]">
                {GRAND_ORAL.name} · {GRAND_ORAL.subtitle}
              </h3>
              <p className="mt-4 flex items-baseline text-orange">
                <span className="text-2xl font-semibold">€</span>
                <span className="text-5xl font-bold tracking-[-0.04em]">
                  {GRAND_ORAL.price}
                </span>
              </p>
              <p className="mt-4 text-[0.9rem] leading-relaxed text-ink/70">
                <strong className="font-semibold text-orange-700">
                  {GRAND_ORAL.sessions}
                </strong>{" "}
                {GRAND_ORAL.summary}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:shrink-0">
              <ButtonLink href="/grand-oral" variant="primary" size="lg">
                Voir l&apos;offre complète <ArrowRight size={17} />
              </ButtonLink>
              <ButtonLink
                href={SITE.calendly}
                external
                variant="light"
                size="lg"
              >
                <CalendarCheck size={17} /> Réserver sur Calendly
              </ButtonLink>
            </div>
          </div>
        </Reveal>

        <p className="mt-6 text-center text-[0.8rem] text-ink/45">
          Le tarif étudiant est accessible sur présentation d&apos;un
          justificatif de scolarité. La séance diagnostic de 30 minutes est
          offerte sur tous les packs.
        </p>
      </Container>
    </section>
  );
}
