"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MicDoodle, Sparkle } from "@/components/ui/Doodles";

/* Invitation à la communauté : petite carte qui glisse en bas de l'écran,
   une fois par visiteur (mémorisé 30 jours dans le navigateur). Ne bloque pas la page. */

const STORAGE_KEY = "leq-popup-communaute";
const DELAY_MS = 2500;
const REMEMBER_DAYS = 30;
/** Pages où l'invitation gênerait (parcours d'achat, page communauté elle-même, pages légales). */
const EXCLUDED = ["/communaute", "/quiz", "/grand-oral", "/mentions-legales", "/confidentialite", "/cookies", "/apercus-mails"];

function alreadySeen(): boolean {
  try {
    const at = Number(localStorage.getItem(STORAGE_KEY));
    return Boolean(at) && Date.now() - at < REMEMBER_DAYS * 86_400_000;
  } catch {
    return true; // stockage indisponible : on ne dérange pas
  }
}

function remember() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* rien */
  }
}

export function CommunityPopup({ price, availability }: { price: string; availability: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const excluded = EXCLUDED.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (excluded || alreadySeen()) return;
    const t = window.setTimeout(() => {
      setOpen(true);
      remember();
    }, DELAY_MS);
    return () => window.clearTimeout(t);
  }, [excluded]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open || excluded) return null;

  return (
    <aside role="dialog" aria-labelledby="invitation-communaute" className="community-toast fixed right-4 bottom-4 left-4 z-50 sm:left-auto sm:w-[380px]" style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="relative rounded-[24px] bg-white p-5 pr-12 text-ink" style={{ boxShadow: "6px 6px 0 #FFBD59, 0 30px 60px -20px rgba(0,22,54,.55)", border: "2px solid #001636" }}>
        <MicDoodle className="bob absolute" width={48} height={62} stand="#FF5E01" style={{ top: -40, left: 14 }} />
        <Sparkle className="wiggle absolute" size={30} style={{ top: -16, right: 44 }} />
        <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="absolute top-3 right-3 grid h-9 w-9 cursor-pointer place-items-center rounded-full border-0 bg-cloud text-ink hover:bg-ink hover:text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <p id="invitation-communaute" className="mt-3 mb-0 text-[21px] leading-[1.15] font-bold tracking-[-0.02em]">
          Rejoignez la <span className="serif font-normal text-orange">LEQ&apos;FAM</span> !
        </p>
        <p className="mt-1.5 mb-0 text-[14px] leading-[1.5] text-ink/70">
          La communauté pour s&apos;entraîner à l&apos;oral ensemble, pour {price} par mois.
          {availability && <span className="mt-1 block text-[12px] font-semibold tracking-[.08em] text-orange uppercase">{availability}</span>}
        </p>
        <Link href={availability ? "/communaute#rejoindre" : "/communaute"} onClick={() => setOpen(false)} className="btn btn-p btn-sm mt-3.5">
          {availability ? "Je m'inscris sur la liste" : "Je découvre"}
        </Link>
      </div>
    </aside>
  );
}
