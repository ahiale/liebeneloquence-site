"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MicDoodle } from "@/components/ui/Doodles";

/* Invitation à la communauté, une fois par visite :
   1. carte au centre de l'écran, fond flouté (2,5 s après l'arrivée) ;
   2. une fois fermée, elle laisse une petite pastille en bas à droite qui permet de la rouvrir ;
   3. la pastille disparaît si on clique sur sa croix ou si on rejoint la liste.
   État mémorisé le temps de la visite (stockage de session), puis tout recommence à la visite suivante.
   Pour la revoir : ajouter « ?invitation » à l'adresse, ex. liebeneloquence.com/?invitation */

const STORAGE_KEY = "leq-popup-communaute";
const DELAY_MS = 2500;
/** Pages où l'invitation gênerait (parcours d'achat, page communauté elle-même, pages légales). */
const EXCLUDED = ["/communaute", "/quiz", "/grand-oral", "/mentions-legales", "/confidentialite", "/cookies", "/apercus-mails"];

/** "mini" = fermée, pastille visible ; "done" = plus rien pendant cette visite. */
type Saved = "mini" | "done" | null;
type View = "hidden" | "open" | "mini";

function readSaved(): Saved {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    return v === "mini" || v === "done" ? v : null;
  } catch {
    return "done"; // stockage indisponible : on ne dérange pas
  }
}

function save(v: Exclude<Saved, null>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, v);
  } catch {
    /* rien */
  }
}

export function CommunityPopup({ price, availability }: { price: string; availability: string | null }) {
  const pathname = usePathname();
  const [view, setView] = useState<View>("hidden");
  const dialog = useRef<HTMLDialogElement>(null);
  const excluded = EXCLUDED.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (excluded) return;
    const force = new URLSearchParams(window.location.search).has("invitation");
    const saved = force ? null : readSaved();
    if (saved === "done") return;
    if (saved === "mini") {
      setView("mini");
      return;
    }
    const t = window.setTimeout(() => {
      setView("open");
      save("mini"); // déjà vue pour cette visite : la prochaine page affichera la pastille
    }, DELAY_MS);
    return () => window.clearTimeout(t);
  }, [excluded]);

  useEffect(() => {
    if (view === "open" && !dialog.current?.open) dialog.current?.showModal();
  }, [view]);

  if (excluded || view === "hidden") return null;

  const minimize = () => {
    save("mini");
    setView("mini");
  };
  const finish = () => {
    save("done");
    setView("hidden");
  };
  const href = availability ? "/communaute#rejoindre" : "/communaute";

  if (view === "mini")
    return (
      <div className="community-pill fixed right-4 z-50 flex items-center" style={{ bottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}>
        <button
          type="button"
          onClick={() => setView("open")}
          className="flex cursor-pointer items-center gap-2 rounded-full border-0 py-2 pr-4 pl-2.5 text-[14px] font-bold text-white"
          style={{ background: "linear-gradient(165deg,rgba(255,138,60,.9),rgba(255,94,1,.86))", backdropFilter: "blur(14px) saturate(140%)", WebkitBackdropFilter: "blur(14px) saturate(140%)", border: "1px solid rgba(255,255,255,.4)", boxShadow: "0 14px 30px -12px rgba(0,22,54,.6)" }}
        >
          <MicDoodle width={22} height={28} body="#fff" stand="#001636" />
          Rejoindre la <span className="serif font-normal text-ink">LEQ&apos;FAM</span>
        </button>
        <button
          type="button"
          onClick={finish}
          aria-label="Masquer l'invitation"
          className="-ml-2 grid h-7 w-7 -translate-y-4 cursor-pointer place-items-center rounded-full border-2 border-white bg-ink text-white"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    );

  return (
    <dialog
      ref={dialog}
      aria-labelledby="invitation-communaute"
      onClose={minimize}
      onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      className="community-popup m-auto w-[min(420px,calc(100vw-40px))] overflow-visible border-0 bg-transparent p-0"
    >
      <div className="relative rounded-[28px] px-7 pt-10 pb-7 text-center text-white" style={{ background: "linear-gradient(165deg,rgba(255,138,60,.86) 0%,rgba(255,94,1,.82) 100%)", backdropFilter: "blur(18px) saturate(140%)", WebkitBackdropFilter: "blur(18px) saturate(140%)", boxShadow: "0 40px 80px -30px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.35)", border: "1px solid rgba(255,255,255,.4)" }}>
        <MicDoodle className="absolute" width={58} height={74} body="#fff" stand="#001636" style={{ top: -46, left: "50%", marginLeft: -29 }} />
        <button type="button" onClick={() => dialog.current?.close()} aria-label="Fermer" className="absolute top-3.5 right-3.5 grid h-9 w-9 cursor-pointer place-items-center rounded-full border-0 bg-white/20 text-white hover:bg-white/35 focus-visible:outline-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {availability && (
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10.5px] font-bold tracking-[.14em] text-white uppercase">{availability}</span>
        )}
        <p id="invitation-communaute" className="mt-3 mb-0 text-[28px] leading-[1.1] font-bold tracking-[-0.03em]">
          Rejoignez la <span className="serif font-normal text-ink">LEQ&apos;FAM</span> !
        </p>
        <p className="mx-auto mt-2.5 mb-0 max-w-[300px] text-[15px] leading-[1.55] text-white/90">
          La communauté pour s&apos;entraîner à l&apos;oral ensemble, pour {price} par mois.
        </p>
        <Link href={href} onClick={finish} className="btn mt-5 w-full bg-white text-ink hover:-translate-y-0.5">
          {availability ? "Je m'inscris sur la liste" : "Je découvre"}
        </Link>
        <button type="button" onClick={() => dialog.current?.close()} className="mt-3 cursor-pointer border-0 bg-transparent text-[13.5px] text-white/75 underline hover:text-white">
          Plus tard
        </button>
      </div>
    </dialog>
  );
}
