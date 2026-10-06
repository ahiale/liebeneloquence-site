import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ArrowLeft } from "@/components/ui/Doodles";

/** En-tête des pages « tunnel » (quiz, Grand Oral) : logo + retour à l'accueil. */
export function SimpleHeader({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <header>
      <div className="wrap flex flex-wrap items-center justify-between gap-6 py-5">
        <Logo tone={light ? "dark" : "light"} />
        <Link href="/" className={`btn btn-sm ${light ? "btn-o" : "btn-g"}`}>
          {light && <ArrowLeft />} Retour à l&apos;accueil
        </Link>
      </div>
    </header>
  );
}
