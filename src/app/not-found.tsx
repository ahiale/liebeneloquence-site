import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Heart, MicDoodle, Sparkle } from "@/components/ui/Doodles";

export default function NotFound() {
  return (
    <div className="bg-hero min-h-[80vh]">
      <Header />
      <main className="wrap relative flex flex-col items-center pt-12 pb-28 text-center">
        <Sparkle className="wiggle hide-sm absolute" size={46} style={{ left: "12%", top: 40 }} />
        <Heart className="wiggle hide-sm absolute" size={32} color="#FFBD59" style={{ right: "14%", top: 120 }} />
        <div className="relative">
          <p className="serif m-0 leading-none text-gold" style={{ fontSize: "clamp(110px, 22vw, 180px)" }}>404</p>
          <MicDoodle className="bob absolute" width={56} height={72} style={{ right: -50, top: 10 }} />
        </div>
        <h1 className="mt-4 mb-0 font-bold tracking-[-0.03em] text-white" style={{ fontSize: "clamp(28px, 5vw, 40px)" }}>
          Un silence <span className="serif text-gold">bien placé…</span>
        </h1>
        <p className="mt-4 mb-0 max-w-[480px] text-[16px] leading-[1.7] text-white/85">
          …mais pas ici. Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link className="btn btn-p" href="/">Retour à l&apos;accueil</Link>
          <Link className="btn btn-g" href="/quiz">Faire le quiz</Link>
        </div>
      </main>
    </div>
  );
}
