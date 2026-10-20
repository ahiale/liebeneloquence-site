import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ArrowLeft } from "@/components/ui/Doodles";
import { SectionMellie } from "@/components/mellie/SectionMellie";

export const metadata: Metadata = pageMeta({
  title: "Mellie a le trac, la BD gratuite pour gérer son trac",
  description: "Une BD drôle et utile pour apprendre à parler en public, avec un cahier d'exercices anti-trac. Gratuite en e-book, version papier en précommande. De 9 à 99 ans.",
  path: "/mellie",
  image: "/mellie/couverture.webp",
});

export default function MelliePage() {
  return (
    <div className="bg-hero">
      <Header />
      <div className="wrap pt-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[14px] text-white/80 no-underline hover:text-white">
          <ArrowLeft /> Retour à l&apos;accueil
        </Link>
      </div>
      <main>
        <SectionMellie />
      </main>
    </div>
  );
}
