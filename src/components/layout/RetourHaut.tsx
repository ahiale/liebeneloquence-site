"use client";

import { useEffect, useState } from "react";

/** Flèche « retour en haut » : apparaît après un écran de défilement, au-dessus de la pastille LEQ'FAM. */
export function RetourHaut() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const remonter = () => {
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: calme ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={remonter}
      aria-label="Revenir en haut de la page"
      tabIndex={visible ? 0 : -1}
      className={`retour-haut fixed right-4 z-50 grid h-12 w-12 cursor-pointer place-items-center rounded-full border-2 border-white/80 text-white ${visible ? "retour-haut--visible" : ""}`}
      style={{ bottom: "calc(76px + env(safe-area-inset-bottom, 0px))", background: "linear-gradient(165deg,#FFBD59,#FF5E01)", boxShadow: "0 14px 30px -12px rgba(0,22,54,.7)" }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#001636" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
