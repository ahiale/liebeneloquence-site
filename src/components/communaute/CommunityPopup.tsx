"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MicDoodle } from "@/components/ui/Doodles";

/* Invitation à la communauté : une petite pastille « Rejoindre la LEQ'FAM » en bas à droite.
   Elle apparaît quand le visiteur fait défiler la page ou au bout de 15 s (jamais dès l'arrivée),
   mène à la page Communauté, et disparaît pour la visite si on clique sur sa croix ou sur elle.
   État mémorisé le temps de la visite (stockage de session), puis tout recommence à la visite suivante.
   Pour la revoir : ajouter « ?invitation » à l'adresse, ex. liebeneloquence.com/?invitation */

const STORAGE_KEY = "leq-popup-communaute";
const DELAY_MS = 15000;
/** Défilement (en part de la hauteur d'écran) qui fait apparaître la pastille. */
const SCROLL_RATIO = 0.6;
/** Pages où l'invitation gênerait (parcours d'achat, page communauté elle-même, pages légales). */
const EXCLUDED = ["/communaute", "/quiz", "/grand-oral", "/mentions-legales", "/confidentialite", "/cookies", "/apercus-mails"];

/** "mini" = pastille déjà apparue pendant la visite ; "done" = masquée pour la visite. */
type Saved = "mini" | "done" | null;

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

// Les props sont conservées pour le layout (prix, disponibilité) même si la pastille ne les affiche pas.
export function CommunityPopup(_: { price: string; availability: string | null }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const excluded = EXCLUDED.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (excluded) return;
    const force = new URLSearchParams(window.location.search).has("invitation");
    const saved = force ? null : readSaved();
    if (saved === "done") return;
    if (saved === "mini") {
      setVisible(true);
      return;
    }
    const show = () => {
      cleanup();
      setVisible(true);
      save("mini"); // déjà apparue : visible directement sur les pages suivantes
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

  if (excluded || !visible) return null;

  const finish = () => {
    save("done");
    setVisible(false);
  };

  return (
    <div className="community-pill fixed right-4 z-50 flex items-center" style={{ bottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}>
      <Link
        href="/communaute"
        onClick={finish}
        className="flex items-center gap-2 rounded-full py-2 pr-4 pl-2.5 text-[14px] font-bold text-white no-underline"
        style={{ background: "linear-gradient(165deg,#0B3070,#114DA8)", boxShadow: "0 14px 30px -12px rgba(0,22,54,.7)" }}
      >
        <MicDoodle width={22} height={28} body="#FF5E01" stand="#FF5E01" />
        Rejoindre la <span className="serif font-normal text-orange">LEQ&apos;FAM</span>
      </Link>
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
}
