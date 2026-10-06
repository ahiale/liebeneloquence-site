import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { FOOTER_LINKS } from "@/data/site";

export function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`border-t border-white/10 bg-ink-700/60 backdrop-blur-sm ${className}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-9 sm:px-8 lg:flex-row lg:justify-between">
        <Logo size="sm" />

        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {FOOTER_LINKS.map((l) =>
            "external" in l && l.external ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ),
          )}
        </nav>

        <p className="text-xs text-white/45">
          © 2026 Lieben Éloquence · Tous droits réservés
        </p>
      </div>
    </footer>
  );
}

/** Pied de page minimal des pages « tunnel » (quiz, offre Grand Oral). */
export function FooterMinimal() {
  return (
    <footer className="border-t border-white/10 bg-royal/25 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 sm:flex-row sm:px-8">
        <Logo size="sm" />
        <p className="text-xs text-white/55">
          © 2026 Lieben Éloquence · Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
