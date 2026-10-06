"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { NAV } from "@/config/site";

/**
 * En-tête principal, posé dans le hero de chaque page (non fixe, comme la maquette).
 * Sous 1280 px, la navigation passe dans un menu déroulant.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => !href.startsWith("/#") && pathname.startsWith(href);

  return (
    <header className="relative z-40">
      <div className="wrap flex items-center justify-between gap-6 py-5">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden items-center gap-[26px] xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`py-2 text-[15px] no-underline transition-colors ${
                isActive(item.href) ? "text-gold" : "text-white/85 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/#offres" className="btn btn-p btn-sm hidden xl:inline-flex">
          Découvrir les offres
        </Link>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/12 text-white xl:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div id="menu-mobile" className="wrap absolute inset-x-0 top-full xl:hidden">
          <nav
            aria-label="Navigation principale"
            className="flex flex-col gap-1 rounded-[22px] border border-white/10 bg-ink-800/97 p-4 shadow-2xl backdrop-blur-xl"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-xl px-3 py-3 no-underline hover:bg-white/8 ${
                  isActive(item.href) ? "text-gold" : "text-white/90"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/#offres" onClick={() => setOpen(false)} className="btn btn-p mt-3">
              Découvrir les offres
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
