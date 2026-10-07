"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Heart, MicDoodle, Sparkle } from "@/components/ui/Doodles";
import { SITE } from "@/config/site";

/** Page affichée quand une erreur inattendue survient sur une page (même style que la 404). */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-hero min-h-[80vh]">
      <Header />
      <main className="wrap relative flex flex-col items-center pt-12 pb-28 text-center">
        <Sparkle className="wiggle hide-sm absolute" size={46} style={{ left: "12%", top: 40 }} />
        <Heart className="wiggle hide-sm absolute" size={32} color="#FFBD59" style={{ right: "14%", top: 120 }} />
        <div className="relative">
          <p className="serif m-0 leading-none text-gold" style={{ fontSize: "clamp(110px, 22vw, 180px)" }}>Oups</p>
          <MicDoodle className="bob absolute" width={56} height={72} style={{ right: -50, top: 10 }} />
        </div>
        <h1 className="mt-4 mb-0 font-bold tracking-[-0.03em] text-white" style={{ fontSize: "clamp(28px, 5vw, 40px)" }}>
          Un petit <span className="serif text-gold">trou de mémoire…</span>
        </h1>
        <p className="mt-4 mb-0 max-w-[500px] text-[16px] leading-[1.7] text-white/85">
          Ça arrive aux meilleurs orateurs. Une erreur s&apos;est produite de notre côté : réessayez dans un instant. Si le problème continue, écrivez-nous à{" "}
          <a className="text-gold" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-p" onClick={reset}>Réessayer</button>
          <Link className="btn btn-g" href="/">Retour à l&apos;accueil</Link>
        </div>
      </main>
    </div>
  );
}
