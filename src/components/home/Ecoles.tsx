"use client";

import { useActionState } from "react";
import { demanderDevis } from "@/app/actions";
import { IDLE } from "@/lib/forms";
import { Heart, Sparkle } from "@/components/ui/Doodles";
import { Icon, type IconName } from "@/components/ui/Icons";
import { FieldError, fieldProps, FormError, FormSuccess, Honeypot, SubmitButton } from "@/components/ui/Form";

const ATOUTS: { icon: IconName; title: string; text: string }[] = [
  { icon: "gamepad", title: "Format gamifié & engageant", text: "Quiz en amont, Kahoot pendant la séance, compétition d'éloquence finale. Un format pensé pour capter l'attention." },
  { icon: "fileChart", title: "Support partagé & ressources", text: "Un support pédagogique transmis à l'établissement. Les élèves repartent avec des outils concrets." },
  { icon: "award", title: "Attestations remises", text: "En collaboration avec l'établissement, des attestations sont remises aux participants à l'issue de la séance." },
  { icon: "mapPin", title: "Déplacements possibles", text: "Intervention principalement en région parisienne, avec possibilité de déplacement selon la demande." },
];

export function Ecoles() {
  const [state, action] = useActionState(demanderDevis, IDLE);

  return (
    <section id="ecoles" className="bg-steel py-20 sm:py-28">
      <div className="wrap">
        <div className="relative text-center">
          <Sparkle className="wiggle hide-sm absolute" style={{ left: "18%", top: 0 }} />
          <Heart className="wiggle hide-sm absolute" size={28} style={{ right: "20%", top: 30 }} />
          <p className="eyebrow" style={{ color: "#CC4A00" }}>Établissements</p>
          <h2 className="h2 text-ink">
            Interventions en <span className="serif text-orange">école</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            {ATOUTS.map((a) => (
              <div key={a.title} className="flex items-start gap-4 rounded-[22px] bg-white p-5" style={{ border: "1px solid rgba(255,255,255,.6)", boxShadow: "0 20px 40px -30px rgba(0,22,54,.6)" }}>
                <span className="tile rounded-[14px] bg-royal text-white">
                  <Icon name={a.icon} />
                </span>
                <div>
                  <h3 className="m-0 text-[16px] font-semibold text-ink">{a.title}</h3>
                  <p className="mt-1 mb-0 text-[13.6px] leading-[1.6] text-ink/65">{a.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative flex flex-col gap-4 rounded-[26px] p-6 sm:p-8" style={{ background: "linear-gradient(168deg,#0e3f8b,#01143a)", boxShadow: "0 40px 80px -40px rgba(0,22,54,.9)" }}>
            <h3 className="m-0 text-[24px] font-bold tracking-[-0.03em] text-white">Demander un devis</h3>
            <p className="m-0 text-[14.4px] leading-[1.6] text-white/65">
              Remplissez ce formulaire pour être contacté par notre équipe et recevoir notre document de présentation avec toutes les informations détaillées sur les parcours.
            </p>
            {state.status === "success" ? (
              <FormSuccess title="Demande envoyée">
                Merci ! Vous allez recevoir notre document de présentation par email.
              </FormSuccess>
            ) : (
              <form action={action} className="relative flex flex-col gap-4" noValidate>
                <Honeypot />
                <fieldset className="m-0 border-0 p-0" aria-describedby={state.status === "error" && state.fields?.structure ? "structure-error" : undefined}>
                  <legend className="flabel mb-2">Vous êtes</legend>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "scolaire", label: "Établissement scolaire / université" },
                      { value: "culturelle", label: "Structure culturelle / association" },
                    ].map((o) => (
                      <label key={o.value} className="cursor-pointer">
                        <input type="radio" name="structure" value={o.value} required className="sr-only" defaultChecked={o.value === "scolaire"} />
                        <span className="chip">{o.label}</span>
                      </label>
                    ))}
                  </div>
                  <FieldError state={state} name="structure" />
                </fieldset>
                <label className="flabel">
                  Votre nom &amp; établissement
                  <input className="field" placeholder="Ex : Marie Dupont, Lycée Victor Hugo" required autoComplete="organization" {...fieldProps(state, "nom")} />
                  <FieldError state={state} name="nom" />
                </label>
                <label className="flabel">
                  Votre email
                  <input className="field" type="email" placeholder="contact@etablissement.fr" required autoComplete="email" {...fieldProps(state, "email")} />
                  <FieldError state={state} name="email" />
                </label>
                <label className="flabel">
                  Votre message
                  <textarea className="field" rows={4} placeholder="Nombre d'élèves, niveau, objectifs pédagogiques…" style={{ resize: "vertical" }} {...fieldProps(state, "message")} />
                </label>
                <FormError state={state} />
                <SubmitButton>Envoyer ma demande</SubmitButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
