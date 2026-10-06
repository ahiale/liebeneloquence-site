"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Heart, MicDoodle, Sparkle } from "@/components/ui/Doodles";

/* Invitation à la communauté : carte au centre de l'écran, fond flouté,
   une fois par visite (mémorisé le temps de la visite, puis réaffiché à la visite suivante).
   Fermeture : croix, Échap, clic à côté.
   Pour la revoir : ajouter « ?invitation » à l'adresse, ex. liebeneloquence.com/?invitation */

const STORAGE_KEY = "leq-popup-communaute";
const DELAY_MS = 2500;
/** Pages où l'invitation gênerait (parcours d'achat, page communauté elle-même, pages légales). */
const EXCLUDED = ["/communaute", "/quiz", "/grand-oral", "/mentions-legales", "/confidentialite", "/cookies", "/apercus-mails"];

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true; // stockage indisponible : on ne dérange pas
  }
}

function remember() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* rien */
  }
}

export function CommunityPopup({ price, availability }: { price: string; availability: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const excluded = EXCLUDED.some((p) => pathname.startsWith(p));

  useEffect(() => {
    // « ?invitation » dans l'adresse : affiche la carte même si elle a déjà été vue (pour tester)
    const force = new URLSearchParams(window.location.search).has("invitation");
    if (excluded || (!force && alreadySeen())) return;
    const t = window.setTimeout(() => {
      setOpen(true);
      remember();
    }, DELAY_MS);
    return () => window.clearTimeout(t);
  }, [excluded]);

  useEffect(() => {
    if (open) dialog.current?.showModal();
  }, [open]);

  if (!open || excluded) return null;

  const close = () => setOpen(false);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="invitation-communaute"
      onClose={close}
      onClick={(e) => e.target === e.currentTarget && close()}
      className="community-popup m-auto w-[min(420px,calc(100vw-40px))] overflow-visible border-0 bg-transparent p-0"
    >
      <div className="relative rounded-[28px] bg-white px-7 pt-9 pb-7 text-center text-ink" style={{ boxShadow: "8px 8px 0 #FFBD59, 0 40px 80px -30px rgba(0,0,0,.6)", border: "2px solid #001636" }}>
        <MicDoodle className="bob absolute" width={62} height={80} stand="#FF5E01" style={{ top: -52, left: "50%", marginLeft: -31 }} />
        <Sparkle className="wiggle absolute" size={36} style={{ top: -14, left: 24 }} />
        <Heart className="wiggle absolute" size={28} style={{ bottom: -10, right: 30 }} />
        <button type="button" onClick={close} aria-label="Fermer" className="absolute top-3.5 right-3.5 grid h-9 w-9 cursor-pointer place-items-center rounded-full border-0 bg-cloud text-ink hover:bg-ink hover:text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {availability && (
          <span className="inline-block rounded-full bg-orange px-3 py-1 text-[10.5px] font-bold tracking-[.14em] text-white uppercase">{availability}</span>
        )}
        <p id="invitation-communaute" className="mt-3 mb-0 text-[28px] leading-[1.1] font-bold tracking-[-0.03em]">
          Rejoignez la <span className="serif font-normal text-orange">LEQ&apos;FAM</span> !
        </p>
        <p className="mx-auto mt-2.5 mb-0 max-w-[300px] text-[15px] leading-[1.55] text-ink/70">
          La communauté pour s&apos;entraîner à l&apos;oral ensemble, pour {price} par mois.
        </p>
        <Link href={availability ? "/communaute#rejoindre" : "/communaute"} onClick={close} className="btn btn-p mt-5 w-full">
          {availability ? "Je m'inscris sur la liste" : "Je découvre"}
        </Link>
        <button type="button" onClick={close} className="mt-3 cursor-pointer border-0 bg-transparent text-[13.5px] text-ink/55 underline hover:text-ink">
          Plus tard
        </button>
      </div>
    </dialog>
  );
}
