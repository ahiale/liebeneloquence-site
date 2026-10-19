"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MicDoodle } from "@/components/ui/Doodles";

/* Invitation à la communauté, une fois par visite :
   1. petite carte en bas de l'écran (en bas à droite sur ordinateur), sans fond flouté, qui apparaît
      quand le visiteur fait défiler la page ou au bout de 15 s : jamais dès l'arrivée ;
   2. une fois fermée, elle laisse une petite pastille en bas à droite qui permet de la rouvrir ;
   3. la pastille disparaît si on clique sur sa croix ou si on rejoint la liste.
   État mémorisé le temps de la visite (stockage de session), puis tout recommence à la visite suivante.
   Pour la revoir : ajouter « ?invitation » à l'adresse, ex. liebeneloquence.com/?invitation */

const STORAGE_KEY = "leq-popup-communaute";
const DELAY_MS = 15000;
/** Défilement (en part de la hauteur d'écran) qui fait apparaître la carte. */
const SCROLL_RATIO = 0.6;
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
    const show = () => {
      cleanup();
      setView("open");
      save("mini"); // déjà vue pour cette visite : la prochaine page affichera la pastille
    };
    const onScroll = () => window.scrollY > window.innerHeight * SCROLL_RATIO && show();
    const t = window.setTimeout(show, DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    const cleanup = () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
    return cleanup;
  }, [excluded]);

  useEffect(() => {
    if (view !== "open") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      save("mini");
      setView("mini");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
  const href = "/communaute";

  if (view === "mini")
    return (
      <div className="community-pill fixed right-4 z-50 flex items-center" style={{ bottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}>
        <button
          type="button"
          onClick={() => setView("open")}
          className="flex cursor-pointer items-center gap-2 rounded-full border-0 py-2 pr-4 pl-2.5 text-[14px] font-bold text-white"
          style={{ background: "linear-gradient(165deg,#0B3070,#114DA8)", boxShadow: "0 14px 30px -12px rgba(0,22,54,.7)" }}
        >
          <MicDoodle width={22} height={28} body="#FF5E01" stand="#FF5E01" />
          Rejoindre la <span className="serif font-normal text-orange">LEQ&apos;FAM</span>
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
    <aside
      role="dialog"
      aria-labelledby="invitation-communaute"
      className="community-card fixed right-4 left-4 z-50 sm:left-auto sm:w-[360px]"
      style={{ bottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="relative rounded-[24px] px-6 pt-6 pb-5 text-white" style={{ background: "linear-gradient(165deg,#0B3070 0%,#114DA8 100%)", boxShadow: "0 30px 60px -24px rgba(0,22,54,.7)", border: "1px solid rgba(255,255,255,.18)" }}>
        <MicDoodle className="absolute" width={40} height={52} body="#FF5E01" stand="#FF5E01" style={{ top: -30, left: 22 }} />
        <button type="button" onClick={minimize} aria-label="Fermer" className="absolute top-3 right-3 grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-white/12 text-white hover:bg-white/25 focus-visible:outline-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {availability && (
          <span className="inline-block rounded-full bg-white/12 px-3 py-1 text-[10px] font-bold tracking-[.14em] text-white uppercase">{availability}</span>
        )}
        <p id="invitation-communaute" className="mt-2.5 mb-0 pr-8 text-[22px] leading-[1.15] font-bold tracking-[-0.03em]">
          Rejoignez la <span className="serif font-normal text-orange">LEQ&apos;FAM</span> !
        </p>
        <p className="mt-2 mb-0 text-[14px] leading-[1.5] text-white/80">
          La communauté pour s&apos;entraîner à l&apos;oral ensemble, pour {price} par mois.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <Link href={href} onClick={finish} className="btn flex-1 bg-orange text-white hover:brightness-110">
            Découvrir la communauté
          </Link>
          <button type="button" onClick={minimize} className="cursor-pointer border-0 bg-transparent text-[13px] text-white/60 underline hover:text-white">
            Plus tard
          </button>
        </div>
      </div>
    </aside>
  );
}
