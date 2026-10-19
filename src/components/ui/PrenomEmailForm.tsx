"use client";

import { useActionState } from "react";
import { IDLE, type FormState } from "@/lib/forms";
import { FieldError, fieldProps, FormError, FormSuccess, Honeypot, SubmitButton } from "@/components/ui/Form";

type Props = {
  /** Action serveur appelée à l'envoi (liste d'attente, « Être prévenu »…). */
  action: (state: FormState, data: FormData) => Promise<FormState>;
  /** Champs cachés envoyés avec le formulaire, ex. { sujet: "jeu-avocat" }. */
  champs?: Record<string, string>;
  bouton: string;
  succes: { titre: string; texte: string };
  /** Petite phrase sous le bouton (facultatif). */
  note?: string;
  className?: string;
};

/** Formulaire court prénom + email, sur fond bleu : liste d'attente LEQ'FAM, « Être prévenu du lancement »… */
export function PrenomEmailForm({ action, champs = {}, bouton, succes, note, className = "" }: Props) {
  const [state, envoyer] = useActionState(action, IDLE);

  return (
    <div className={`${className} rounded-[26px] p-5 text-left sm:p-6`} style={{ background: "rgba(0,22,54,.35)", border: "1px solid rgba(255,255,255,.25)" }}>
      {state.status === "success" ? (
        <FormSuccess title={succes.titre}>{succes.texte}</FormSuccess>
      ) : (
        <form action={envoyer} className="relative grid gap-3" noValidate>
          <Honeypot />
          {Object.entries(champs).map(([nom, valeur]) => (
            <input key={nom} type="hidden" name={nom} value={valeur} />
          ))}
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
          <SubmitButton>{bouton}</SubmitButton>
          {note && <p className="m-0 text-center text-[13px] text-white/65">{note}</p>}
        </form>
      )}
    </div>
  );
}
