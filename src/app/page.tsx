import { getPricing, getReviews } from "@/content";
import { Hero } from "@/components/home/Hero";
import { Constat } from "@/components/home/Constat";
import { Apports } from "@/components/home/Apports";
import { Methode } from "@/components/home/Methode";
import { Offres } from "@/components/home/Offres";
import { Ecoles } from "@/components/home/Ecoles";
import { Transparence } from "@/components/home/Transparence";
import { Temoignages } from "@/components/home/Temoignages";
import { QuiSuisJe } from "@/components/home/QuiSuisJe";

export const metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const [pricing, reviews] = await Promise.all([getPricing(), getReviews()]);

  return (
    <>
      <Hero />
      <main>
        <Constat />
        <Apports />
        <Methode />
        <Offres pricing={pricing} />
        <Ecoles />
        <Transparence />
        <Temoignages reviews={reviews} />
        <QuiSuisJe />
      </main>
    </>
  );
}
