import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { DrawUnderline } from "@/components/ui/Doodles";

/** Gabarit des pages légales (mentions, confidentialité, cookies). */
export function LegalPage({ title, accent, updated, children }: { title: string; accent: string; updated: string; children: ReactNode }) {
  return (
    <>
      <div className="bg-hero">
        <Header />
        <section className="wrap pt-8 pb-16 sm:pt-12 sm:pb-20">
          <p className="eyebrow">Informations légales</p>
          <h1 className="mt-4 mb-0 leading-[1.05] font-bold tracking-[-0.035em] text-white" style={{ fontSize: "clamp(36px, 7vw, 54px)" }}>
            {title} <span className="serif text-gold">{accent}</span>
          </h1>
          <DrawUnderline style={{ marginTop: 4 }} />
          <p className="mt-4 mb-0 text-[14px] text-white/65">Dernière mise à jour : {updated}</p>
        </section>
      </div>
      <main className="bg-light py-16 text-ink sm:py-20">
        <div className="wrap legal" style={{ maxWidth: 820 }}>
          {children}
        </div>
      </main>
    </>
  );
}
