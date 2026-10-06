import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EvenementsPage } from "@/components/pages/Evenements";

export const metadata: Metadata = {
  title: "Événements & actualités",
  description:
    "Ateliers en groupe, concours d'éloquence et formations collectives LEQ. Les prochaines dates, les tarifs et la newsletter pour ne rien manquer.",
};

export default function Page() {
  return (
    <>
      <Header cta={{ label: "Faire le quiz", href: "/quiz" }} />
      <main>
        <EvenementsPage />
      </main>
      <Footer />
    </>
  );
}
