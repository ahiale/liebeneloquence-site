"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";
import { HONEYPOT, type FormState } from "@/lib/forms";

/** Champ invisible : les robots le remplissent, les humains ne le voient pas. */
export function Honeypot() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Ne pas remplir
        <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function SubmitButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`btn btn-p w-full ${className}`} disabled={pending} aria-disabled={pending}>
      {pending ? "Envoi en cours…" : children}
    </button>
  );
}

/** Message d'erreur sous un champ. */
export function FieldError({ state, name }: { state: FormState; name: string }) {
  const msg = state.status === "error" ? state.fields?.[name] : undefined;
  if (!msg) return null;
  return (
    <span id={`${name}-error`} className="mt-1.5 block text-[12.5px] text-[#ffb59a]">
      {msg}
    </span>
  );
}

/** Props d'accessibilité d'un champ selon l'état du formulaire. */
export function fieldProps(state: FormState, name: string) {
  const invalid = state.status === "error" && Boolean(state.fields?.[name]);
  return {
    name,
    "aria-invalid": invalid || undefined,
    "aria-describedby": invalid ? `${name}-error` : undefined,
  };
}

/** Erreur générale du formulaire. */
export function FormError({ state }: { state: FormState }) {
  if (state.status !== "error") return null;
  return (
    <p role="alert" className="m-0 rounded-[14px] border border-[#ffb59a]/40 bg-[#ff5e01]/10 px-4 py-3 text-[13.5px] text-white">
      {state.message}
    </p>
  );
}

/** Confirmation affichée à la place du formulaire après envoi. */
export function FormSuccess({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div role="status" className="pop flex flex-col items-center gap-3 rounded-[18px] border border-gold/30 bg-gold/10 px-6 py-10 text-center">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFBD59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
      <p className="m-0 text-[17px] font-semibold text-white">{title}</p>
      <p className="m-0 max-w-[360px] text-[14px] leading-[1.6] text-white/70">{children}</p>
    </div>
  );
}
