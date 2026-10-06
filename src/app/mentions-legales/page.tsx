import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/Section";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales, éditeur, hébergement et traitement des données personnelles du site Lieben Éloquence.",
  robots: { index: false, follow: true },
};

const SECTIONS = [
  {
    title: "Éditeur du site",
    body: `Le site ${SITE.name} (${SITE.shortName}) est édité par Rebecca Lieben Ahiale, formatrice indépendante en prise de parole en public. Contact : ${SITE.email}.`,
  },
  {
    title: "Hébergement",
    body: "Le site est hébergé sur une infrastructure européenne. Les coordonnées complètes de l'hébergeur sont communiquées sur simple demande à l'adresse de contact ci-dessus.",
  },
  {
    title: "Propriété intellectuelle",
    body: "L'ensemble des contenus présents sur ce site — textes, supports pédagogiques, méthodes, identité visuelle — est protégé par le droit d'auteur. Toute reproduction ou réutilisation, totale ou partielle, sans autorisation écrite préalable est interdite.",
  },
  {
    title: "Données personnelles",
    body: "Les informations transmises via les formulaires (demande de devis, réservation de séance, newsletter) servent uniquement à répondre à votre demande et à vous adresser les communications que vous avez sollicitées. Elles ne sont ni vendues ni cédées à des tiers. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données, exerçable à l'adresse de contact.",
  },
  {
    title: "Cookies",
    body: "Ce site ne dépose aucun cookie publicitaire ni traceur tiers à des fins de profilage.",
  },
  {
    title: "Prestations et tarifs",
    body: "Les tarifs indiqués sur ce site s'entendent en euros, toutes taxes comprises. Le tarif étudiant est accessible sur présentation d'un justificatif de scolarité en cours de validité. La séance diagnostic de 30 minutes est offerte et sans engagement, hors offre Grand Oral.",
  },
];

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="bg-night pt-32 pb-24 sm:pt-40">
        <Container className="max-w-3xl">
          <Eyebrow>Informations légales</Eyebrow>
          <h1 className="h-section mt-4 text-4xl sm:text-5xl">
            Mentions légales
          </h1>

          <div className="mt-12 space-y-8">
            {SECTIONS.map((s) => (
              <section key={s.title} className="surface rounded-card p-7">
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-gold">
                  {s.title}
                </h2>
                <p className="mt-3 leading-relaxed text-white/70">{s.body}</p>
              </section>
            ))}
          </div>

          <p className="mt-10 text-[0.8rem] text-white/40">
            Dernière mise à jour : août 2026.
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
