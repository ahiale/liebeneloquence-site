import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

/** En-tête léger des pages secondaires : logo + retour à l'accueil. */
export function BackHeader({
  href = "/",
  label = "Retour à l'accueil",
  sticky = false,
}: {
  href?: string;
  label?: string;
  sticky?: boolean;
}) {
  return (
    <header
      className={`z-30 w-full ${sticky ? "sticky top-0 border-b border-white/8 bg-ink/70 backdrop-blur-xl" : "absolute inset-x-0 top-0"}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2.5 text-sm font-medium text-white/90 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/14"
        >
          <ArrowLeft size={16} /> {label}
        </Link>
      </div>
    </header>
  );
}
