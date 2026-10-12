"use client";

import { useActionState } from "react";
import { confirmerResiliation, demanderResiliation } from "@/app/communaute/actions";
import { IDLE } from "@/lib/forms";
import { FieldError, fieldProps, FormError, FormSuccess, Honeypot, SubmitButton } from "@/components/ui/Form";

const carte = "rounded-[26px] p-6 sm:p-8";
const fond = { background: "rgba(0,22,54,.35)", border: "1px solid rgba(255,255,255,.25)" };

/** Étape 1 : recevoir le lien de résiliation par mail. */
export function DemandeResiliation() {
  const [state, action] = useActionState(demanderResiliation, IDLE);
  if (state.status === "success")
    return (
      <div className={carte} style={fond}>
        <FormSuccess title="Vérifiez votre boîte mail">Si un abonnement LEQ&apos;FAM est associé à cette adresse, vous venez de recevoir le lien pour le résilier.</FormSuccess>
      </div>
    );
  return (
    <form action={action} noValidate className={`${carte} grid gap-4`} style={fond}>
      <Honeypot />
      <label className="flabel">
        L&apos;adresse email de votre abonnement
        <input className="field" type="email" placeholder="vous@email.com" autoComplete="email" required {...fieldProps(state, "email")} />
        <FieldError state={state} name="email" />
      </label>
      <FormError state={state} />
      <SubmitButton>Recevoir le lien de résiliation</SubmitButton>
    </form>
  );
}

/** Étape 2 : confirmer la résiliation (date de fin affichée par la page). */
export function ConfirmationResiliation({ jeton, finTexte }: { jeton: string; finTexte: string }) {
  const [state, action] = useActionState(confirmerResiliation, IDLE);
  if (state.status === "success")
    return (
      <div className={carte} style={fond}>
        <FormSuccess title="Résiliation enregistrée">{finTexte} Un mail de confirmation vient de vous être envoyé.</FormSuccess>
      </div>
    );
  return (
    <form action={action} className={`${carte} grid gap-4 text-white`} style={fond}>
      <input type="hidden" name="jeton" value={jeton} />
      <p className="m-0 text-[16px] leading-[1.7]">{finTexte}</p>
      <FormError state={state} />
      <SubmitButton>Confirmer la résiliation</SubmitButton>
    </form>
  );
}
