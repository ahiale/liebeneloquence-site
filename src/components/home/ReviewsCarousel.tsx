"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** Carrousel d'avis que le visiteur fait défiler lui-même (flèches, glisser au doigt, clavier). */
export function ReviewsCarousel({ children, count }: { children: ReactNode; count: number }) {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const move = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("figure");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const arrow = (dir: 1 | -1, disabled: boolean) => (
    <button
      type="button"
      onClick={() => move(dir)}
      disabled={disabled}
      aria-label={dir === 1 ? "Avis suivants" : "Avis précédents"}
      className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border-2 border-ink bg-white text-ink transition hover:bg-ink hover:text-white disabled:cursor-default disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-ink"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir === 1 ? "M5 12h14M12 5l7 7-7 7" : "M19 12H5M12 19l-7-7 7-7"} />
      </svg>
    </button>
  );

  return (
    <div className="mt-12">
      <div className="wrap">
        <div
          ref={track}
          onScroll={update}
          tabIndex={0}
          role="region"
          aria-label={`${count} avis, faites défiler pour les lire`}
          className="reviews-track flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 py-4"
        >
          {children}
        </div>
      </div>
      <div className="wrap mt-6 flex items-center justify-center gap-3">
        {arrow(-1, atStart)}
        {arrow(1, atEnd)}
      </div>
    </div>
  );
}
