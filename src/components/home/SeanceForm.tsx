"use client";

import { useActionState, useState } from "react";
import { reserverSeance } from "@/app/actions";
import { IDLE } from "@/lib/forms";
import { formatAmount } from "@/lib/format";
import { FieldError, fieldProps, FormError, FormSuccess, Honeypot, SubmitButton } from "@/components/ui/Form";

/** Réservation d'une séance à l'unité : le lien de paiement part par mail, comme pour le Grand Oral. */
export function SeanceForm({ price, maxSessions }: { price: number; maxSessions: number }) {
  const [state, action] = useActionState(reserverSeance, IDLE);
  const [n, setN] = useState(1);

  if (state.status === "success")
    return (
      <div className="rounded-[26px] p-6 sm:p-8" style={{ background: "linear-gradient(165deg,#04193c,#0e3f8b)" }}>
        <FormSuccess title="Demande envoyée">Vous allez recevoir par mail le lien de paiement pour confirmer votre séance.</FormSuccess>
      </div>
    );

  return (
    <form
      action={action}
      noValidate
      className="relative grid gap-4 rounded-[26px] p-6 text-white sm:p-8"
      style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(200px,100%),1fr))", background: "linear-gradient(165deg,#04193c,#0e3f8b)", boxShadow: "0 44px 80px -44px rgba(0,22,54,.85)" }}
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
        <legend className="flabel mb-2">Nombre de séances</legend>
        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: maxSessions }, (_, i) => i + 1).map((k) => (
            <label key={k} className="cursor-pointer">
              <input type="radio" name="seances" value={k} checked={n === k} onChange={() => setN(k)} className="sr-only" />
              <span className="chip">{k} séance{k > 1 ? "s" : ""}</span>
            </label>
          ))}
          <span className="ml-auto text-[15px] text-white/80" aria-live="polite">
            Total : <strong className="text-[20px] text-gold">{formatAmount(Math.round(price * n * 100) / 100)} €</strong>
          </span>
        </div>
        <FieldError state={state} name="seances" />
      </fieldset>
      <label className="flabel col-span-full">
        Le sujet que vous voulez travailler
        <textarea className="field" rows={3} placeholder="Un oral qui approche, une prise de parole à préparer, un point qui vous bloque…" style={{ resize: "vertical" }} required {...fieldProps(state, "sujet")} />
        <FieldError state={state} name="sujet" />
      </label>
      <div className="col-span-full">
        <FormError state={state} />
      </div>
      <div className="col-span-full">
        <SubmitButton>Je réserve</SubmitButton>
        <p className="mt-3 mb-0 text-center text-[13px] text-white/65">Vous recevez par mail le lien de paiement sécurisé.</p>
      </div>
    </form>
  );
}
