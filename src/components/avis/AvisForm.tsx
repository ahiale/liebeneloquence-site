"use client";

import { useActionState, useState } from "react";
import { laisserAvis } from "@/app/actions";
import { IDLE } from "@/lib/forms";
import { FieldError, fieldProps, FormError, FormSuccess, Honeypot, SubmitButton } from "@/components/ui/Form";

/** Avis après un atelier ou un accompagnement : note, texte, accord de publication. */
export function AvisForm() {
  const [state, action] = useActionState(laisserAvis, IDLE);
  const [note, setNote] = useState(0);

  if (state.status === "success")
    return (
      <div className="rounded-[26px] p-6 sm:p-8" style={{ background: "rgba(0,22,54,.35)", border: "1px solid rgba(255,255,255,.25)" }}>
        <FormSuccess title="Merci pour votre avis !">Il compte beaucoup pour faire grandir Lieben Éloquence.</FormSuccess>
      </div>
    );

  return (
    <form action={action} noValidate className="grid gap-4 rounded-[26px] p-6 text-white sm:p-8" style={{ background: "rgba(0,22,54,.35)", border: "1px solid rgba(255,255,255,.25)" }}>
      <Honeypot />
      <fieldset className="m-0 border-0 p-0">
        <legend className="flabel mb-2">Votre note</legend>
        <input type="hidden" name="note" value={note || ""} />
        <div className="flex gap-1.5" role="radiogroup" aria-label="Note sur 5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={note === n}
              aria-label={`${n} sur 5`}
              onClick={() => setNote(n)}
              className="cursor-pointer border-0 bg-transparent p-0 text-[40px] leading-none transition hover:scale-110"
              style={{ color: n <= note ? "#FFBD59" : "rgba(255,255,255,.3)" }}
            >
              ★
            </button>
          ))}
        </div>
        <FieldError state={state} name="note" />
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flabel">
          Prénom
          <input className="field" placeholder="Marie" autoComplete="given-name" required {...fieldProps(state, "prenom")} />
          <FieldError state={state} name="prenom" />
        </label>
        <label className="flabel">
          Contexte <span className="font-normal opacity-70">(facultatif)</span>
          <input className="field" placeholder="Atelier, Grand Oral, soutenance…" {...fieldProps(state, "contexte")} />
        </label>
      </div>
      <label className="flabel">
        Votre avis
        <textarea className="field" rows={4} placeholder="Ce que vous avez retenu, ce qui vous a aidé, ce qui pourrait être amélioré…" style={{ resize: "vertical" }} required {...fieldProps(state, "texte")} />
        <FieldError state={state} name="texte" />
      </label>
      <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-[1.5] text-white/85">
        <input type="checkbox" name="publication" defaultChecked className="mt-0.5 h-5 w-5 shrink-0 accent-[#FF5E01]" />
        J&apos;accepte que mon avis (avec mon prénom) soit publié sur le site de Lieben Éloquence.
      </label>
      <FormError state={state} />
      <SubmitButton>Envoyer mon avis</SubmitButton>
    </form>
  );
}
