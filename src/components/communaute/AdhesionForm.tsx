"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { demarrerAdhesion } from "@/app/communaute/actions";
import { IDLE } from "@/lib/forms";
import { formatPrice } from "@/lib/format";
import { FieldError, fieldProps, FormError, Honeypot } from "@/components/ui/Form";

type FormuleAffichee = { id: "engagement" | "libre"; label: string; prix: number; engagementMois: number };
type Props = {
  formules: FormuleAffichee[];
  lancement: { actif: boolean; prix: number; restantes: number };
  code: { prix: number; mois: number };
};

/** Choix de la formule, code ambassadeur ou association, CGV, puis connexion Discord. */
export function AdhesionForm({ formules, lancement, code }: Props) {
  const [state, action, envoi] = useActionState(demarrerAdhesion, IDLE);
  const [choix, setChoix] = useState<"engagement" | "libre">("engagement");
  const [saisie, setSaisie] = useState("");
  const f = formules.find((x) => x.id === choix) ?? formules[0];
  const avecCode = saisie.trim().length > 0;

  // Récapitulatif : 1 € le 1er mois (lancement), 1,99 € pendant 5 ou 6 mois (code), puis le prix normal
  const etapes: string[] = [];
  if (lancement.actif) etapes.push(`${formatPrice(lancement.prix)} le premier mois`);
  if (avecCode) etapes.push(`${formatPrice(code.prix)} par mois pendant ${code.mois - (lancement.actif ? 1 : 0)} mois`);
  etapes.push(`${etapes.length ? "puis " : ""}${formatPrice(f.prix)} par mois`);

  return (
    <form action={action} noValidate className="relative grid gap-5 rounded-[26px] bg-white p-6 text-ink sm:p-8" style={{ boxShadow: "0 44px 80px -44px rgba(0,22,54,.85)" }}>
      <Honeypot />
      <fieldset className="m-0 grid gap-3 border-0 p-0">
        <legend className="mb-1 text-[15px] font-bold">Votre formule</legend>
        {formules.map((x) => (
          <label key={x.id} className={`relative flex cursor-pointer items-center gap-4 rounded-[18px] border-2 p-4 transition ${choix === x.id ? "border-orange bg-[#FFF6EF]" : "border-ink/12 hover:border-ink/30"}`}>
            <input type="radio" name="formule" value={x.id} checked={choix === x.id} onChange={() => setChoix(x.id)} className="h-5 w-5 accent-[#FF5E01]" />
            <span className="flex-1">
              <span className="block text-[17px] font-bold">{x.label}</span>
              <span className="block text-[13.5px] text-ink/65">{x.engagementMois ? `Engagement ${x.engagementMois} mois, puis reconduit chaque mois` : "Résiliable à tout moment"}</span>
            </span>
            <span className="text-right">
              <span className="block text-[24px] leading-none font-bold tracking-[-0.03em]">{formatPrice(x.prix)}</span>
              <span className="text-[12.5px] text-ink/60">par mois</span>
            </span>
            {x.id === "engagement" && <span className="absolute -top-3 right-4 rounded-full bg-orange px-3 py-1 text-[11px] font-bold text-white">Le plus avantageux</span>}
          </label>
        ))}
        <FieldError state={state} name="formule" />
      </fieldset>

      {lancement.actif && (
        <p className="m-0 rounded-[14px] bg-gold/25 px-4 py-3 text-[14.5px] font-semibold">
          Offre de lancement : {formatPrice(lancement.prix)} le premier mois · plus que {lancement.restantes} place{lancement.restantes > 1 ? "s" : ""}
        </p>
      )}

      <label className="grid gap-1.5 text-[14.5px] font-bold">
        Code ambassadeur ou association <span className="font-normal text-ink/60">(facultatif)</span>
        <input
          className="h-12 rounded-[12px] border-2 border-ink/15 px-4 text-[16px] font-semibold tracking-[.06em] uppercase outline-none focus:border-royal"
          placeholder="EX. SAM-LEQ"
          autoComplete="off"
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          {...fieldProps(state, "code")}
        />
        <span className="text-[13px] font-normal text-ink/60">Avec un code : {formatPrice(code.prix)} par mois pendant {code.mois} mois{lancement.actif ? ` (dont le premier mois à ${formatPrice(lancement.prix)})` : ""}.</span>
        <FieldError state={state} name="code" />
      </label>

      <div className="rounded-[16px] bg-cloud px-5 py-4">
        <p className="m-0 text-[13px] font-bold tracking-[.12em] text-royal uppercase">Vous paierez</p>
        <p className="mt-1 mb-0 text-[17px] font-semibold">{etapes.join(", ")}.</p>
        {avecCode && <p className="mt-1 mb-0 text-[12.5px] text-ink/60">Sous réserve que le code soit valide.</p>}
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-[1.5]">
        <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#FF5E01]" {...fieldProps(state, "cgv")} />
        <span>
          J&apos;accepte les <Link href="/cgv" target="_blank" className="font-semibold text-royal">conditions générales de vente</Link>, y compris la durée d&apos;engagement de la formule choisie.
        </span>
      </label>
      <FieldError state={state} name="cgv" />

      <FormError state={state} />
      <button type="submit" disabled={envoi} className="btn w-full text-white disabled:opacity-60" style={{ background: "#5865F2", fontSize: 17, padding: "16px 24px" }}>
        {envoi ? "Ouverture de Discord…" : "Continuer avec Discord"}
      </button>
      <p className="m-0 text-center text-[13px] text-ink/60">Discord vous identifie en un clic, puis vous payez sur la page sécurisée Stripe. Vous arrivez ensuite directement sur le serveur.</p>
    </form>
  );
}
