import Link from "next/link";
import type { ReactNode } from "react";

/* Briques d'interface de l'admin : titres, cartes, badges, champs de formulaire, onglets. */

export function Titre({ titre, accent, sous, action }: { titre: string; accent?: string; sous?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="m-0 text-[30px] font-bold tracking-[-0.03em]">
          {titre} {accent && <span className="serif font-normal text-royal">{accent}</span>}
        </h1>
        {sous && <p className="mt-1.5 mb-0 text-[15px] text-ink/60">{sous}</p>}
      </div>
      {action}
    </div>
  );
}

export function Carte({ titre, action, children, className = "" }: { titre?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[20px] bg-white p-6 ${className}`} style={{ boxShadow: "0 20px 40px -32px rgba(0,22,54,.55)" }}>
      {(titre || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {titre && <h2 className="m-0 text-[17px] font-bold">{titre}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const TONS = {
  vert: "bg-[#E6F6EC] text-[#1C8A4A]",
  bleu: "bg-[#E3EDFB] text-royal",
  or: "bg-[#FFF2D6] text-[#9A6400]",
  orange: "bg-[#FFE6D8] text-[#C24600]",
  gris: "bg-[#ECEFF4] text-ink/60",
} as const;
export type Ton = keyof typeof TONS;

export function Badge({ ton = "gris", children }: { ton?: Ton; children: ReactNode }) {
  return <span className={`inline-block rounded-full px-2.5 py-1 text-[12px] font-bold whitespace-nowrap ${TONS[ton]}`}>{children}</span>;
}

export function Chiffre({ valeur, libelle, href, ton }: { valeur: ReactNode; libelle: string; href?: string; ton?: Ton }) {
  const contenu = (
    <>
      <p className={`m-0 text-[30px] font-extrabold tabular-nums ${ton === "orange" ? "text-[#C24600]" : ""}`}>{valeur}</p>
      <p className="mt-1 mb-0 text-[13.5px] text-ink/60">{libelle}</p>
    </>
  );
  const cls = "block rounded-[18px] bg-white p-5 text-ink no-underline";
  const style = { boxShadow: "0 20px 40px -32px rgba(0,22,54,.55)" };
  return href ? (
    <Link href={href} className={`${cls} transition hover:-translate-y-0.5`} style={style}>
      {contenu}
    </Link>
  ) : (
    <div className={cls} style={style}>
      {contenu}
    </div>
  );
}

const CHAMP = "mt-1.5 w-full rounded-[12px] border-2 border-ink/10 bg-white px-3 py-2.5 text-[15px] font-normal text-ink outline-none focus:border-royal";

type ChampProps = { label: string; name: string; defaut?: string | number; type?: string; aide?: string; requis?: boolean; className?: string; placeholder?: string };

export function Champ({ label, name, defaut, type = "text", aide, requis, className = "", placeholder }: ChampProps) {
  return (
    <label className={`block text-[13.5px] font-semibold text-ink/80 ${className}`}>
      {label}
      <input name={name} type={type} defaultValue={defaut} required={requis} placeholder={placeholder} className={CHAMP} />
      {aide && <span className="mt-1 block text-[12.5px] font-normal text-ink/50">{aide}</span>}
    </label>
  );
}

export function Zone({ label, name, defaut, lignes = 4, aide, className = "", placeholder }: ChampProps & { lignes?: number }) {
  return (
    <label className={`block text-[13.5px] font-semibold text-ink/80 ${className}`}>
      {label}
      <textarea name={name} defaultValue={defaut} rows={lignes} placeholder={placeholder} className={CHAMP} style={{ resize: "vertical" }} />
      {aide && <span className="mt-1 block text-[12.5px] font-normal text-ink/50">{aide}</span>}
    </label>
  );
}

export function Choix({ label, name, defaut, options, className = "" }: { label: string; name: string; defaut?: string; options: readonly (string | readonly [string, string])[]; className?: string }) {
  return (
    <label className={`block text-[13.5px] font-semibold text-ink/80 ${className}`}>
      {label}
      <select name={name} defaultValue={defaut} className={CHAMP}>
        {options.map((o) => {
          const [valeur, texte] = typeof o === "string" ? [o, o] : o;
          return (
            <option key={valeur} value={valeur}>
              {texte}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export function Bouton({ children, ton = "plein", name, value, formAction }: { children: ReactNode; ton?: "plein" | "orange" | "doux" | "danger"; name?: string; value?: string; formAction?: (data: FormData) => Promise<void> }) {
  const cls = {
    plein: "bg-royal text-white",
    orange: "text-ink [background:linear-gradient(90deg,#FFBD59,#FF5E01)]",
    doux: "bg-[#EEF3FB] text-royal",
    danger: "bg-[#FFE6D8] text-[#C24600]",
  }[ton];
  return (
    <button name={name} value={value} formAction={formAction} className={`cursor-pointer rounded-full border-0 px-4 py-2 text-[13.5px] font-bold transition hover:brightness-105 ${cls}`}>
      {children}
    </button>
  );
}

export function Onglets({ actif, onglets }: { actif: string; onglets: { id: string; label: string; href: string; nombre?: number }[] }) {
  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {onglets.map((o) => (
        <Link
          key={o.id}
          href={o.href}
          className={`rounded-full px-4 py-2 text-[14px] font-semibold no-underline ${o.id === actif ? "bg-ink text-white" : "bg-white text-ink/70 hover:text-ink"}`}
        >
          {o.label}
          {o.nombre !== undefined && <span className={`ml-2 ${o.id === actif ? "text-white/60" : "text-ink/40"}`}>{o.nombre}</span>}
        </Link>
      ))}
    </nav>
  );
}

export function Vide({ children }: { children: ReactNode }) {
  return <p className="m-0 rounded-[14px] border-2 border-dashed border-ink/10 p-6 text-center text-[14.5px] text-ink/50">{children}</p>;
}

/** Message de confirmation en haut de page (après un enregistrement : ?ok=…). */
export function Confirmation({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mb-6 rounded-[14px] bg-[#E6F6EC] px-5 py-3 text-[14.5px] font-semibold text-[#1C6B3A]">✓ {message}</p>;
}

/** Bloc repliable : un résumé cliquable, le formulaire de modification dessous. */
export function Repli({ resume, children, ouvert }: { resume: ReactNode; children: ReactNode; ouvert?: boolean }) {
  return (
    <details open={ouvert} className="group">
      <summary className="cursor-pointer list-none text-[13.5px] font-bold text-royal">{resume}</summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export const dateFr = (iso: string, avecHeure = false) =>
  iso
    ? new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "short", year: "numeric", ...(avecHeure ? { hour: "2-digit", minute: "2-digit" } : {}) }).format(new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso))
    : "";
