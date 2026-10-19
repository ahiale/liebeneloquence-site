import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Check, DrawUnderline, Heart, Sparkle, Star } from "@/components/ui/Doodles";
import { AmbassadeurForm } from "@/components/communaute/AmbassadeurForm";

export const metadata: Metadata = pageMeta({
  title: "Devenir ambassadeur LEQ",
  description: "Candidatez pour devenir ambassadeur LEQ : représentez la communauté, fédérez autour de vous et accédez gratuitement à toutes les solutions LEQ.",
  path: "/ambassadeurs",
});

const PROFIL = [
  "Vous parlez de la communauté autour de vous, avec un ou deux posts par mois",
  "Vous représentez la communauté LEQ",
  "Vous avez déjà un parcours en éloquence",
  "Vous savez fédérer des gens autour de vous",
  "Vous avez envie de voir émerger un projet",
];

const AVANTAGES = [
  "Un accès totalement gratuit à toutes nos solutions dès leur sortie : la communauté LEQ'FAM, l'application mobile et le jeu de cartes Avocat du diable",
  "Des goodies physiques à l'effigie de LEQ, et plein d'autres petites choses",
  "Un code promo personnel pour faire découvrir la LEQ'FAM à votre entourage",
];

export default function AmbassadeursPage() {
  return (
    <>
      <div className="bg-hero">
        <Header />
        <section className="relative pt-10 pb-20 text-center sm:pt-16 sm:pb-24">
          <div className="wrap relative">
            <Sparkle className="wiggle hide-sm absolute" size={46} style={{ left: "14%", top: 0 }} />
            <Heart className="wiggle hide-sm absolute" size={30} color="#FF5E01" style={{ right: "16%", top: 50 }} />
            <p className="eyebrow">La communauté LEQ</p>
            <h1 className="mt-5 mb-0 leading-[1.02] font-bold tracking-[-0.04em] text-white" style={{ fontSize: "clamp(40px, 8vw, 62px)" }}>
              Devenir <span className="serif text-gold">ambassadeur</span>
            </h1>
            <DrawUnderline className="hide-sm" style={{ margin: "4px auto 0", transform: "translateX(90px)" }} />
            <p className="mx-auto mt-[22px] mb-0 max-w-[620px] text-[17px] leading-[1.7] text-white/85">
              Un ambassadeur parle de la communauté autour de lui et la représente. Envie de faire grandir LEQ avec nous ? Candidatez !
            </p>
            <a href="#candidater" className="btn btn-p mt-8">
              Candidater
            </a>
          </div>
        </section>
      </div>

      <main>
        <section className="bg-light py-20 text-ink sm:py-[104px]">
          <div className="wrap relative grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))" }}>
            <Star className="wiggle hide-sm absolute" style={{ right: 0, top: -50 }} />
            <article className="sticker p-[30px]">
              <p className="eyebrow" style={{ color: "#114DA8" }}>Le profil</p>
              <h2 className="mt-3 mb-0 text-[28px] font-bold tracking-[-0.03em]">
                Qui est <span className="serif text-royal">ambassadeur ?</span>
              </h2>
              <ul className="mt-5 mb-0 grid list-none gap-3 p-0">
                {PROFIL.map((it) => (
                  <li key={it} className="flex gap-3 text-[15.5px] leading-[1.55] text-ink/80">
                    <Check />
                    {it}
                  </li>
                ))}
              </ul>
            </article>
            <article className="sticker relative p-[30px]" style={{ background: "linear-gradient(160deg,#FFF6E6,#fff)" }}>
              <span className="absolute -top-3.5 right-[22px] rounded-full bg-orange px-3 py-[5px] text-[11px] font-bold tracking-[.12em] text-white uppercase">Privilèges</span>
              <p className="eyebrow" style={{ color: "#CC4A00" }}>Les avantages</p>
              <h2 className="mt-3 mb-0 text-[28px] font-bold tracking-[-0.03em]">
                Ce que vous <span className="serif text-orange">recevez</span>
              </h2>
              <ul className="mt-5 mb-0 grid list-none gap-3 p-0">
                {AVANTAGES.map((it) => (
                  <li key={it} className="flex gap-3 text-[15.5px] leading-[1.55] text-ink/80">
                    <Check color="#FF5E01" />
                    {it}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section id="candidater" className="bg-night py-20 sm:py-[104px]">
          <div className="wrap" style={{ maxWidth: 760 }}>
            <div className="text-center">
              <p className="eyebrow">Candidature</p>
              <h2 className="h2 text-white">
                Candidater pour être <span className="serif text-gold">ambassadeur</span>
              </h2>
              <p className="mx-auto mt-4 mb-10 max-w-[560px] text-[16px] leading-[1.7] text-white/75">
                Pas besoin de CV : parlez-nous simplement de votre parcours en éloquence et de ce qui vous donne envie de rejoindre l&apos;aventure.
              </p>
            </div>
            <AmbassadeurForm />
          </div>
        </section>
      </main>
    </>
  );
}
