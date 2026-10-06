"use client";

import Link from "next/link";
import { useActionState } from "react";
import { inscrireNewsletter } from "@/app/actions";
import { IDLE } from "@/lib/forms";
import { PROFILS_NEWSLETTER, THEMATIQUES } from "@/lib/options";
import { FieldError, fieldProps, FormError, FormSuccess, Honeypot, SubmitButton } from "@/components/ui/Form";

export function NewsletterForm() {
  const [state, action] = useActionState(inscrireNewsletter, IDLE);

  return (
    <div className="flex flex-col gap-4 rounded-[26px] p-6 sm:p-8" style={{ background: "linear-gradient(168deg,#114DA8,#01143a)", boxShadow: "0 44px 90px -45px rgba(0,22,54,.9)" }}>
      <h3 className="m-0 text-[24px] font-bold tracking-[-0.03em] text-white">S&apos;inscrire à la newsletter</h3>
      <p className="m-0 text-[14.4px] leading-[1.6] text-white/65">Quelques secondes suffisent. Garantie zéro spam, que du contenu utile.</p>
      {state.status === "success" ? (
        <FormSuccess title="Inscription confirmée">Bienvenue ! Un mail de confirmation vient de vous être envoyé.</FormSuccess>
      ) : (
        <form action={action} className="relative flex flex-col gap-4" noValidate>
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
          <label className="flabel">
            Votre profil (optionnel)
            <select className="field" name="profil" defaultValue="">
              <option value="">Sélectionner</option>
              {PROFILS_NEWSLETTER.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className="flabel">
            Thématiques qui vous intéressent (optionnel)
            <select className="field" name="thematique" defaultValue="">
              <option value="">Sélectionner</option>
              {THEMATIQUES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <FormError state={state} />
          <SubmitButton>Je m&apos;inscris</SubmitButton>
          <p className="m-0 text-center text-[12.5px] text-white/55">
            Vos données restent confidentielles. Désinscription à tout moment.{" "}
            <Link href="/confidentialite" className="underline">En savoir plus</Link>
          </p>
        </form>
      )}
    </div>
  );
}
