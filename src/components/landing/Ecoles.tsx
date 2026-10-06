"use client";

import { useState } from "react";
import {
  Gamepad2,
  FileBarChart,
  Award,
  MapPin,
  Send,
  CheckCircle2,
} from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const FEATURES = [
  {
    icon: Gamepad2,
    tone: "text-royal ring-royal/20 bg-royal/8",
    title: "Format gamifié & engageant",
    desc: "Quiz en amont, Kahoot pendant la séance, compétition d'éloquence finale. Un format pensé pour capter l'attention.",
  },
  {
    icon: FileBarChart,
    tone: "text-success ring-success/25 bg-success/10",
    title: "Support partagé & ressources",
    desc: "Un support pédagogique transmis à l'établissement. Les élèves repartent avec des outils concrets.",
  },
  {
    icon: Award,
    tone: "text-orange-700 ring-gold/40 bg-gold/18",
    title: "Attestations remises",
    desc: "En collaboration avec l'établissement, des attestations sont remises aux participants à l'issue de la séance.",
  },
  {
    icon: MapPin,
    tone: "text-orange ring-orange/25 bg-orange/10",
    title: "Déplacements possibles",
    desc: "Intervention principalement en région parisienne, avec possibilité de déplacement selon la demande.",
  },
];

export function Ecoles() {
  const [sent, setSent] = useState(false);

  return (
    <section id="ecoles" className="bg-steel py-20 sm:py-28">
      <Container>
        <Reveal className="text-center">
          <Eyebrow className="text-ember-600">Établissements</Eyebrow>
          <h2 className="h-section mt-4 text-4xl text-white sm:text-[2.9rem] lg:text-[3.25rem]">
            Interventions en{" "}
            <span className="font-serif font-normal italic text-orange-700">
              école
            </span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            {FEATURES.map((f, i) => (
              <Reveal
                key={f.title}
                delay={i * 90}
                className="flex items-start gap-4 rounded-[22px] border border-white/60 bg-white/70 p-5 shadow-[0_20px_40px_-30px_rgba(0,22,54,0.6)] backdrop-blur-sm"
              >
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-[14px] ring-1 ${f.tone}`}
                >
                  <f.icon size={20} strokeWidth={1.9} />
                </span>
                <div>
                  <h3 className="font-semibold tracking-[-0.02em] text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-[0.85rem] leading-relaxed text-ink/65">
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal
            delay={120}
            className="rounded-[26px] bg-[linear-gradient(168deg,#0e3f8b,#01143a)] p-7 shadow-[0_40px_80px_-40px_rgba(0,22,54,0.9)] sm:p-8"
          >
            <h3 className="text-2xl font-bold tracking-[-0.03em] text-white">
              Demander un devis
            </h3>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-white/65">
              Remplissez ce formulaire pour être contacté par notre équipe et
              recevoir notre document de présentation avec toutes les
              informations détaillées sur les parcours.
            </p>

            {sent ? (
              <div className="mt-8 flex flex-col items-center gap-3 rounded-[18px] border border-gold/30 bg-gold/10 px-6 py-10 text-center">
                <CheckCircle2 size={38} className="text-gold" />
                <p className="font-semibold text-white">Demande envoyée</p>
                <p className="text-sm text-white/65">
                  Merci. Nous revenons vers vous sous 48&nbsp;h ouvrées.
                </p>
              </div>
            ) : (
              <form
                className="mt-7 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div>
                  <label className="field-label" htmlFor="ecole-nom">
                    Votre nom &amp; établissement
                  </label>
                  <input
                    id="ecole-nom"
                    name="nom"
                    className="field"
                    placeholder="Ex : Marie Dupont, Lycée Victor Hugo"
                    required
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="ecole-email">
                    Votre email
                  </label>
                  <input
                    id="ecole-email"
                    name="email"
                    type="email"
                    className="field"
                    placeholder="contact@etablissement.fr"
                    required
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="ecole-message">
                    Votre message
                  </label>
                  <textarea
                    id="ecole-message"
                    name="message"
                    className="field min-h-32 resize-y"
                    placeholder="Nombre d'élèves, niveau, objectifs pédagogiques…"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <Send size={17} /> Envoyer ma demande
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
