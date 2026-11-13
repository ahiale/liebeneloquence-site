"use client";

import { useActionState } from "react";
import { demanderConnexion } from "@/app/admin/actions";
import { IDLE } from "@/lib/forms";
import { FieldError, fieldProps, FormError, FormSuccess, SubmitButton } from "@/components/ui/Form";

export function ConnexionForm() {
  const [state, action] = useActionState(demanderConnexion, IDLE);
  if (state.status === "success")
    return <FormSuccess title="Regardez votre boîte mail">Si cette adresse a accès à l&apos;admin, le lien de connexion vient de partir. Il est valable 15 minutes.</FormSuccess>;
  return (
    <form action={action} noValidate className="grid gap-4 rounded-[24px] p-6" style={{ background: "rgba(0,22,54,.35)", border: "1px solid rgba(255,255,255,.25)" }}>
      <label className="flabel">
        Adresse email
        <input className="field" type="email" autoComplete="email" required placeholder="vous@email.com" {...fieldProps(state, "email")} />
        <FieldError state={state} name="email" />
      </label>
      <FormError state={state} />
      <SubmitButton>Recevoir mon lien de connexion</SubmitButton>
    </form>
  );
}
