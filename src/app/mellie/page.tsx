import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
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
      <main>
        <SectionMellie />
      </main>
    </div>
  );
}
