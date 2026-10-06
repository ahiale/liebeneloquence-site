import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { Constat } from "@/components/landing/Constat";
import { Vision } from "@/components/landing/Vision";
import { Apports } from "@/components/landing/Apports";
import { Methode } from "@/components/landing/Methode";
import { Offres } from "@/components/landing/Offres";
import { Ecoles } from "@/components/landing/Ecoles";
import { Transparence } from "@/components/landing/Transparence";
import { Temoignages } from "@/components/landing/Temoignages";
import { QuiSuisJe } from "@/components/landing/QuiSuisJe";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Un seul dégradé « nuit » sur toute la séquence sombre : évite les
            raccords visibles entre sections. */}
        <div className="bg-night">
          <Hero />
          <Constat />
          <Vision />
          <Apports />
          <Methode />
        </div>

        <Offres />
        <Ecoles />
        <Transparence />
        <Temoignages />
        <QuiSuisJe />
      </main>
      <Footer />
    </>
  );
}
