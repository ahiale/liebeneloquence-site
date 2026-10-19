"use client";

import { useActionState } from "react";
import { candidaterAmbassadeur } from "@/app/actions";
import { IDLE } from "@/lib/forms";
import { FieldError, fieldProps, FormError, FormSuccess, Honeypot, SubmitButton } from "@/components/ui/Form";

/** Candidature pour devenir ambassadeur LEQ : identité, parcours en éloquence, motivation. */
export function AmbassadeurForm() {
  const [state, action] = useActionState(candidaterAmbassadeur, IDLE);
  const fond = { background: "linear-gradient(168deg,#0e3f8b,#01143a)" };

  if (state.status === "success")
    return (
      <div className="rounded-[26px] p-6 sm:p-8" style={fond}>
        <FormSuccess title="Candidature envoyée !">Merci ! Vous allez recevoir un mail de confirmation, et je reviens vers vous très vite.</FormSuccess>
      </div>
    );

  return (
    <form
      action={action}
      noValidate
      className="relative grid gap-4 rounded-[26px] p-6 sm:p-8"
      style={{ ...fond, gridTemplateColumns: "repeat(auto-fit,minmax(min(220px,100%),1fr))", boxShadow: "0 40px 80px -40px rgba(0,0,0,.9)" }}
    >
      <Honeypot />
      <label className="flabel">
        Prénom
        <input className="field" placeholder="Marie" autoComplete="given-name" required {...fieldProps(state, "prenom")} />
        <FieldError state={state} name="prenom" />
      </label>
      <label className="flabel">
        Nom
        <input className="field" placeholder="Dupont" autoComplete="family-name" required {...fieldProps(state, "nom")} />
        <FieldError state={state} name="nom" />
      </label>
      <label className="flabel col-span-full">
        Email
        <input className="field" type="email" placeholder="vous@email.com" autoComplete="email" required {...fieldProps(state, "email")} />
        <FieldError state={state} name="email" />
      </label>
      <label className="flabel">
        Vos réseaux sociaux <span className="font-normal opacity-70">(facultatif)</span>
        <input className="field" placeholder="Instagram, LinkedIn, TikTok…" {...fieldProps(state, "reseaux")} />
      </label>
      <label className="flabel">
        Association ou groupe <span className="font-normal opacity-70">(facultatif)</span>
        <input className="field" placeholder="Association, école, club…" {...fieldProps(state, "association")} />
      </label>
      <fieldset className="col-span-full m-0 border-0 p-0">
        <legend className="flabel mb-2">Avez-vous déjà participé à un concours d&apos;éloquence ?</legend>
        <div className="flex gap-6 text-[15px] text-white">
          {[
            ["oui", "Oui"],
            ["non", "Non"],
          ].map(([v, l]) => (
            <label key={v} className="flex cursor-pointer items-center gap-2">
              <input type="radio" name="concours" value={v} className="h-5 w-5 accent-[#FF5E01]" />
              {l}
            </label>
          ))}
        </div>
        <FieldError state={state} name="concours" />
      </fieldset>
      <label className="flabel col-span-full">
        Votre parcours en éloquence
        <textarea className="field" rows={4} placeholder="Concours, prix, associations, expériences de prise de parole…" style={{ resize: "vertical" }} required {...fieldProps(state, "parcours")} />
        <FieldError state={state} name="parcours" />
      </label>
      <label className="flabel col-span-full">
        Pourquoi souhaitez-vous devenir ambassadeur LEQ ?
        <textarea className="field" rows={4} placeholder="Quelques lignes sur votre motivation" style={{ resize: "vertical" }} required {...fieldProps(state, "motivation")} />
        <FieldError state={state} name="motivation" />
      </label>
      <div className="col-span-full">
        <FormError state={state} />
      </div>
      <div className="col-span-full">
        <SubmitButton>Envoyer ma candidature</SubmitButton>
      </div>
    </form>
  );
}
