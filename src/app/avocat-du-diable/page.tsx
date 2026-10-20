import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ArrowLeft } from "@/components/ui/Doodles";
import { JeuAvocat } from "@/components/jeu/JeuAvocat";

export const metadata: Metadata = pageMeta({
  title: "Avocat du diable, le jeu de cartes pour s'entraîner à l'oral",
  description: "Le jeu de cartes LEQ qui transforme vos soirées en procès hilarants : affaires absurdes, rôles, sabotages et Banque LEQ. Bientôt disponible.",
  path: "/avocat-du-diable",
  image: "/jeu/couverture.webp",
});

export default function AvocatDuDiablePage() {
  return (
    <>
      <div className="bg-night">
        <Header />
        <div className="wrap pt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-[14px] text-white/80 no-underline hover:text-white">
            <ArrowLeft /> Retour à l&apos;accueil
          </Link>
        </div>
      </div>
      <main>
        <JeuAvocat />
      </main>
    </>
  );
}
