import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";
import { SITE } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { DrawUnderline, Heart, Sparkle } from "@/components/ui/Doodles";
import { ContactForm } from "@/components/autres-services/ContactForm";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description: "Une question, un projet de discours, une animation ou un partenariat ? Écrivez à Lieben Éloquence, réponse par mail.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <div className="bg-hero">
        <Header />
        <section className="relative pt-10 pb-16 text-center sm:pt-16 sm:pb-20">
          <div className="wrap relative">
            <Sparkle className="wiggle hide-sm absolute" size={46} style={{ left: "16%", top: 0 }} />
            <Heart className="wiggle hide-sm absolute" size={30} color="#FF5E01" style={{ right: "18%", top: 50 }} />
            <p className="eyebrow">Contact</p>
            <h1 className="mt-5 mb-0 leading-[1.02] font-bold tracking-[-0.04em] text-white" style={{ fontSize: "clamp(40px, 8vw, 62px)" }}>
              Parlons de <span className="serif text-gold">votre projet.</span>
            </h1>
            <DrawUnderline className="hide-sm" style={{ margin: "4px auto 0", transform: "translateX(110px)" }} />
          </div>
        </section>
      </div>

      <main className="bg-night py-16 sm:py-24">
        <div className="wrap flex flex-wrap items-start gap-14">
          <div className="min-w-0" style={{ flex: "1 1 340px" }}>
            <p className="mt-0 mb-0 text-[16px] leading-[1.7] text-white/75">
              Discours sur mesure, animation d&apos;événement, coaching pour un concours, formation ou partenariat : décrivez votre besoin, je vous réponds par mail.
            </p>
            <p className="mt-[18px] mb-0 text-[15px] text-white/70">
              Ou écrivez-moi directement :{" "}
              <a href={`mailto:${SITE.email}`} className="font-semibold text-gold">
                {SITE.email}
              </a>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="btn btn-g" href={SITE.instagram} target="_blank" rel="noreferrer noopener">
                Instagram
              </a>
              <a className="btn btn-g" href={SITE.linkedin} target="_blank" rel="noreferrer noopener">
                LinkedIn
              </a>
            </div>
          </div>
          <Suspense>
            <ContactForm />
          </Suspense>
        </div>
      </main>
    </>
  );
}
