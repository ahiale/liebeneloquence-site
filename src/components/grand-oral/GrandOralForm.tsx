"use client";

import { useActionState } from "react";
import { reserverGrandOral } from "@/app/actions";
import { IDLE } from "@/lib/forms";
import { ORAUX, PROFILS_GRAND_ORAL } from "@/lib/options";
import { FieldError, fieldProps, FormError, FormSuccess, Honeypot, SubmitButton } from "@/components/ui/Form";

export function GrandOralForm() {
  const [state, action] = useActionState(reserverGrandOral, IDLE);

  if (state.status === "success")
    return (
      <div className="rounded-[26px] p-6 sm:p-8" style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,94,1,.45)" }}>
        <FormSuccess title="Demande envoyée">Vous allez recevoir par mail le lien de paiement pour confirmer votre place.</FormSuccess>
      </div>
    );

  return (
    <form
      action={action}
      noValidate
      className="relative grid gap-4 rounded-[26px] p-6 sm:p-8 min-[900px]:rotate-[.8deg]"
      style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(200px,100%),1fr))", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,94,1,.45)", boxShadow: "0 40px 80px -40px rgba(0,0,0,.8)" }}
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
      <fieldset className="col-span-full m-0 border-0 p-0">
        <legend className="flabel mb-2">Vous êtes</legend>
        <div className="flex flex-wrap gap-2">
          {PROFILS_GRAND_ORAL.map((p, i) => (
            <label key={p} className="cursor-pointer">
              <input type="radio" name="profil" value={p} defaultChecked={i === 0} className="sr-only" />
              <span className="chip">{p}</span>
            </label>
          ))}
        </div>
        <FieldError state={state} name="profil" />
      </fieldset>
      <label className="flabel">
        Votre oral
        <select className="field" defaultValue={ORAUX[0]} {...fieldProps(state, "oral")}>
          {ORAUX.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <label className="flabel">
        Date de l&apos;oral
        <input className="field" type="date" {...fieldProps(state, "date")} style={{ colorScheme: "dark" }} />
        <FieldError state={state} name="date" />
      </label>
      <label className="flabel col-span-full">
        Ce que vous attendez de l&apos;accompagnement
        <textarea className="field" rows={3} placeholder="Votre sujet, vos difficultés, vos objectifs…" style={{ resize: "vertical" }} {...fieldProps(state, "attentes")} />
      </label>
      <div className="col-span-full">
        <FormError state={state} />
      </div>
      <div className="col-span-full">
        <SubmitButton>Envoyer ma demande</SubmitButton>
      </div>
    </form>
  );
}
