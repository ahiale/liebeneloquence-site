"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type State = "idle" | "hidden" | "shown";

/**
 * Révèle son contenu en fondu/translation à l'entrée dans le viewport.
 *
 * Le rendu serveur est **visible** (`idle`) : si le JavaScript ne s'exécute
 * pas, le contenu reste lisible. L'élément n'est masqué que côté client, et
 * uniquement s'il se trouve sous la ligne de flottaison — ce qui évite tout
 * clignotement du contenu déjà à l'écran.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const inView = el.getBoundingClientRect().top < window.innerHeight * 0.92;

    if (reduced || inView || typeof IntersectionObserver === "undefined") {
      setState("shown");
      return;
    }

    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        state === "hidden" ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}
