import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { DrawUnderline, Heart, Sparkle } from "@/components/ui/Doodles";
import { AvisForm } from "@/components/avis/AvisForm";

export const metadata: Metadata = { title: "Donner mon avis", robots: { index: false }, alternates: { canonical: "/avis" } };

/** Page ouverte par le QR code « Donnez votre avis » à la fin des ateliers. */
export default function AvisPage() {
  return (
    <div className="bg-hero min-h-screen">
      <Header />
      <main className="wrap relative pt-8 pb-24" style={{ maxWidth: 680 }}>
        <Sparkle className="wiggle hide-sm absolute" size={44} style={{ right: 0, top: 0 }} />
        <Heart className="wiggle hide-sm absolute" size={30} color="#FF5E01" style={{ right: 60, top: 90 }} />
        <p className="eyebrow">Merci d&apos;avoir participé</p>
        <h1 className="mt-4 mb-0 font-bold tracking-[-0.035em] text-white" style={{ fontSize: "clamp(36px, 7vw, 52px)" }}>
          Votre <span className="serif text-gold">avis compte.</span>
        </h1>
        <DrawUnderline style={{ marginTop: 4 }} />
        <p className="mt-5 mb-8 text-[16px] leading-[1.7] text-white/85">Une minute pour dire ce que vous avez retenu : cela m&apos;aide à améliorer chaque atelier.</p>
        <AvisForm />
      </main>
    </div>
  );
}
