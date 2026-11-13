"use client";

import { useActionState, useEffect, useRef } from "react";
import { programmer } from "@/app/admin/actions";
import { IDLE } from "@/lib/forms";
import { FieldError, fieldProps, FormError, SubmitButton } from "@/components/ui/Form";

const champ = "mt-1.5 w-full rounded-[12px] border-2 border-ink/12 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-royal";

/** Programmer un message Discord : salon, date et heure (de Paris), texte, image facultative. */
export function ProgrammerForm({ salons }: { salons: string[] }) {
  const [state, action] = useActionState(programmer, IDLE);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.status === "success") form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} noValidate className="grid gap-4 text-[14px] font-semibold">
      <label>
        Salon
        <select className={champ} defaultValue="" {...fieldProps(state, "salon")}>
          <option value="" disabled>
            Choisir un salon
          </option>
          {salons.map((s) => (
            <option key={s} value={s}>
              #{s}
            </option>
          ))}
        </select>
        <FieldError state={state} name="salon" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label>
          Date
          <input type="date" className={champ} {...fieldProps(state, "date")} />
          <FieldError state={state} name="date" />
        </label>
        <label>
          Heure (Paris)
          <input type="time" className={champ} {...fieldProps(state, "heure")} />
          <FieldError state={state} name="heure" />
        </label>
      </div>
      <label>
        Message
        <textarea rows={6} className={champ} style={{ resize: "vertical" }} placeholder="Le texte du message (gras : **texte**)" {...fieldProps(state, "message")} />
        <FieldError state={state} name="message" />
      </label>
      <label>
        Image <span className="font-normal text-ink/50">(lien, facultatif)</span>
        <input type="url" className={champ} placeholder="https://…" {...fieldProps(state, "image")} />
        <FieldError state={state} name="image" />
      </label>
      <FormError state={state} />
      {state.status === "success" && <p className="m-0 rounded-[12px] bg-[#E6F6EC] px-4 py-3 text-[14px] text-[#1C6B3A]">Message programmé.</p>}
      <SubmitButton>Programmer</SubmitButton>
    </form>
  );
}
