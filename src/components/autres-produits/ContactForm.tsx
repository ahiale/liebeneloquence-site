"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { envoyerContact } from "@/app/actions";
import { IDLE } from "@/lib/forms";
import { DEMANDES } from "@/lib/options";
import { FieldError, fieldProps, FormError, FormSuccess, Honeypot, SubmitButton } from "@/components/ui/Form";

export function ContactForm() {
  const [state, action] = useActionState(envoyerContact, IDLE);
  // Pré-sélection depuis un lien : /autres-produits?demande=Partenariat%20LEQ'FAM#contact
  const preset = useSearchParams().get("demande");
  const initial = DEMANDES.find((d) => d === preset) ?? DEMANDES[0];

  if (state.status === "success")
    return (
      <div className="min-w-0 rounded-[26px] p-6 sm:p-8" style={{ flex: "1.2 1 440px", background: "linear-gradient(168deg,#0e3f8b,#01143a)" }}>
        <FormSuccess title="Message envoyé">Merci ! Je vous réponds par mail dans les meilleurs délais.</FormSuccess>
      </div>
    );

  return (
    <form
      action={action}
      noValidate
      className="relative grid min-w-0 gap-4 rounded-[26px] p-6 sm:p-8"
      style={{ flex: "1.2 1 440px", gridTemplateColumns: "repeat(auto-fit,minmax(min(200px,100%),1fr))", background: "linear-gradient(168deg,#0e3f8b,#01143a)", boxShadow: "0 40px 80px -40px rgba(0,0,0,.9)" }}
    >
      <Honeypot />
      <label className="flabel">
        Votre prénom &amp; nom
        <input className="field" placeholder="Ex : Marie Dupont" autoComplete="name" required {...fieldProps(state, "nom")} />
        <FieldError state={state} name="nom" />
      </label>
      <label className="flabel">
        Votre email
        <input className="field" type="email" placeholder="vous@email.com" autoComplete="email" required {...fieldProps(state, "email")} />
        <FieldError state={state} name="email" />
      </label>
      <label className="flabel col-span-full">
        Votre demande
        <select key={initial} className="field" defaultValue={initial} {...fieldProps(state, "demande")}>
          {DEMANDES.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </label>
      <label className="flabel col-span-full">
        Votre message
        <textarea className="field" rows={4} placeholder="La date, le contexte, ce que vous imaginez…" style={{ resize: "vertical" }} required {...fieldProps(state, "message")} />
        <FieldError state={state} name="message" />
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
