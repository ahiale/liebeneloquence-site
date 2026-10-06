"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Heart, Sparkle } from "@/components/ui/Doodles";
import { WaitlistForm } from "./WaitlistForm";

/* Pop-up « Rejoindre la communauté », affiché une fois par visiteur
   quelques secondes après son arrivée. Mémorisé dans le navigateur 30 jours. */

const STORAGE_KEY = "leq-popup-communaute";
const DELAY_MS = 6000;
const REMEMBER_DAYS = 30;
/** Pages où le pop-up gênerait (parcours d'achat, page communauté elle-même, pages légales). */
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
  const dialog = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  const excluded = EXCLUDED.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (excluded || alreadySeen()) return;
    const t = window.setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => dialog.current?.showModal());
      remember();
    }, DELAY_MS);
    return () => window.clearTimeout(t);
  }, [excluded]);

  if (!mounted) return null;

  const close = () => dialog.current?.close();

  return (
    <dialog
      ref={dialog}
      aria-labelledby="popup-communaute-titre"
      className="community-popup m-auto w-[min(560px,calc(100vw-32px))] overflow-visible border-0 bg-transparent p-0 text-white"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="bg-hero relative rounded-[28px] p-6 sm:p-8" style={{ boxShadow: "0 50px 100px -30px rgba(0,0,0,.8)", border: "1px solid rgba(255,255,255,.2)" }}>
        <Sparkle className="wiggle absolute" size={40} style={{ top: -18, left: -10 }} />
        <Heart className="wiggle absolute" size={30} style={{ bottom: -12, right: 24 }} />
        <button type="button" onClick={close} aria-label="Fermer" className="absolute top-4 right-4 grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-white/25 bg-white/12 text-white hover:bg-white/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {availability && (
          <span className="inline-flex items-center rounded-full bg-white px-3.5 py-1.5 text-[10.5px] font-bold tracking-[.16em] text-orange uppercase">{availability}</span>
        )}
        <h2 id="popup-communaute-titre" className="mt-4 mb-0 pr-10 leading-[1.05] font-bold tracking-[-0.035em]" style={{ fontSize: "clamp(30px, 6vw, 40px)" }}>
          Rejoignez la communauté <span className="serif text-gold">LEQ&apos;FAM</span>
        </h2>
        <p className="mt-3 mb-0 text-[15.5px] leading-[1.65] text-white/88">
          La communauté dédiée à l&apos;éloquence, aux soft skills et à la prise de parole. Des lives chaque semaine, des défis, de l&apos;entraide et le Grand Prix LEQ, pour {price} par mois.
        </p>

        {availability ? (
          <WaitlistForm className="mt-5" />
        ) : (
          <Link href="/communaute" onClick={close} className="btn btn-p mt-6 w-full">
            Rejoindre la LEQ&apos;FAM
          </Link>
        )}

        <p className="mt-4 mb-0 text-center text-[13.5px]">
          <Link href="/communaute" onClick={close} className="text-white/80 underline hover:text-white">
            Découvrir la communauté
          </Link>
          <span className="text-white/40"> · </span>
          <button type="button" onClick={close} className="cursor-pointer border-0 bg-transparent text-[13.5px] text-white/60 underline hover:text-white">
            Plus tard
          </button>
        </p>
      </div>
    </dialog>
  );
}
