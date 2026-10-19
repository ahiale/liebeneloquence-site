"use client";

import { useActionState } from "react";
import { inscrireEvenement } from "@/app/actions";
import { IDLE } from "@/lib/forms";
import { SOURCES } from "@/lib/options";
import { FieldError, fieldProps, FormError, FormSuccess, Honeypot, SubmitButton } from "@/components/ui/Form";

/** Inscription gratuite à un événement : le lien de la visio part par mail (jamais affiché ici). */
export function EventSignupForm({ slug, label }: { slug: string; label: string }) {
  const [state, action] = useActionState(inscrireEvenement, IDLE);

  if (state.status === "success") {
    return (
      <div className="mt-7">
        <FormSuccess title="Vous êtes inscrit·e !">Le lien Google Meet vient de vous être envoyé par mail.</FormSuccess>
      </div>
    );
  }

  return (
    <form id="inscription" action={action} className="relative mt-7 grid gap-3 scroll-mt-24" noValidate>
      <Honeypot />
      <input type="hidden" name="slug" value={slug} />
      <p className="m-0 text-[15px] font-semibold text-white">Inscription gratuite</p>
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
      <label className="flabel">
        Email
        <input className="field" type="email" placeholder="vous@email.com" autoComplete="email" required {...fieldProps(state, "email")} />
        <FieldError state={state} name="email" />
      </label>
      <label className="flabel">
        Comment nous avez-vous connus ?
        <select className="field" defaultValue="" required {...fieldProps(state, "source")}>
          <option value="" disabled>
            Sélectionner
          </option>
          {SOURCES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <FieldError state={state} name="source" />
      </label>
      <FormError state={state} />
      <SubmitButton>{label}</SubmitButton>
      <p className="m-0 text-center text-[12.5px] leading-[1.5] text-white/70">Vous recevez aussitôt le lien Google Meet par mail.</p>
    </form>
  );
}
