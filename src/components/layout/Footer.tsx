import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { FOOTER_LINKS } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-700">
      <div className="wrap flex flex-wrap items-center justify-between gap-6 py-9">
        <Logo size={20} />
        <nav aria-label="Pied de page" className="flex flex-wrap gap-x-8 gap-y-3">
          {FOOTER_LINKS.map((l) =>
            "external" in l ? (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer noopener" className="text-sm text-white/70 no-underline hover:text-white">
                {l.label}
              </a>
            ) : (
              <Link key={l.label} href={l.href} className="text-sm text-white/70 no-underline hover:text-white">
                {l.label}
              </Link>
            ),
          )}
        </nav>
        <p className="m-0 text-xs text-white/45">© 2026 Lieben Éloquence · Tous droits réservés</p>
      </div>
    </footer>
  );
}
