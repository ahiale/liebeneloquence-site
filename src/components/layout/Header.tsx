"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { NAV } from "@/data/site";

export function Header({
  cta = { label: "Découvrir les offres", href: "/#offres" },
}: {
  cta?: { label: string; href: string };
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Verrouille le défilement quand le menu mobile est ouvert.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/8 bg-ink/85 py-3 backdrop-blur-xl"
          : "border-b border-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.92rem] text-white/75 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <ButtonLink href={cta.href} variant="primary" size="md">
            {cta.label}
          </ButtonLink>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/6 text-white md:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="mx-4 mt-3 rounded-[22px] border border-white/10 bg-ink-800/95 p-5 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-white/85 transition-colors hover:bg-white/6 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink
              href="/quiz"
              variant="ghost"
              size="md"
              className="mt-3"
              onClick={() => setOpen(false)}
            >
              Faire le quiz
            </ButtonLink>
            <ButtonLink
              href={cta.href}
              variant="primary"
              size="md"
              className="mt-2"
              onClick={() => setOpen(false)}
            >
              {cta.label}
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  );
}
