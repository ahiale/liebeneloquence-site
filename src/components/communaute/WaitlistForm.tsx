"use client";

import { useActionState } from "react";
import { rejoindreListeAttente } from "@/app/actions";
import { IDLE } from "@/lib/forms";
import { FieldError, fieldProps, FormError, FormSuccess, Honeypot, SubmitButton } from "@/components/ui/Form";

/** Liste d'attente LEQ'FAM, affichée tant que la communauté n'est pas ouverte. */
export function WaitlistForm({ className = "mx-auto mt-[30px] max-w-[560px]" }: { className?: string }) {
  const [state, action] = useActionState(rejoindreListeAttente, IDLE);

  return (
    <div className={`${className} rounded-[26px] p-5 text-left sm:p-6`} style={{ background: "rgba(0,22,54,.35)", border: "1px solid rgba(255,255,255,.25)" }}>
      {state.status === "success" ? (
        <FormSuccess title="Vous êtes sur la liste !">Un mail de confirmation vient de vous être envoyé. Vous serez prévenu·e dès l&apos;ouverture.</FormSuccess>
      ) : (
        <form action={action} className="relative grid gap-3" noValidate>
          <Honeypot />
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
          <SubmitButton>Rejoindre la liste d&apos;attente</SubmitButton>
          <p className="m-0 text-center text-[13px] text-white/65">Aucun paiement maintenant. Vous serez prévenu·e en premier à l&apos;ouverture.</p>
        </form>
      )}
    </div>
  );
}
