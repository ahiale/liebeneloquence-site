import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkle, Star } from "@/components/ui/Doodles";

/* Jeu de cartes Avocat du diable (bientôt) : boîte en 3D construite en CSS à partir de la couverture,
   puis le contenu de la boîte (cartes et plateau). Visuels dans public/jeu, préparés par
   communication/jeu/preparer-images.py à partir de communication/jeu/sources. */

const CONTENU = [
  { src: "/jeu/carte-role.webp", alt: "Carte Rôle « Le Public » du jeu Avocat du diable", legende: "Les cartes Rôle", w: 600, h: 840 },
  { src: "/jeu/carte-sabotage.webp", alt: "Carte Sabotage « Volte-face » du jeu Avocat du diable", legende: "Les cartes Sabotage", w: 600, h: 840 },
];

export function JeuAvocat() {
  return (
    <section id="jeu" className="bg-light overflow-hidden py-20 text-ink sm:py-[104px]">
      <div className="wrap">
        <div className="flex flex-wrap items-center gap-14">
          {/* Boîte en 3D */}
          <div className="relative flex min-w-0 justify-center py-6" style={{ flex: "1 1 360px" }}>
            <Star className="wiggle absolute" style={{ right: "4%", top: 0 }} />
            <Heart className="wiggle absolute" size={26} style={{ left: "6%", bottom: 0 }} />
            <div className="jeu-scene" aria-hidden="true">
              <div className="jeu-boite">
                <div className="jeu-face jeu-dessus">
                  <Image src="/jeu/couverture.webp" alt="" fill sizes="(max-width: 640px) 260px, 380px" style={{ objectFit: "cover" }} priority={false} />
                </div>
                <div className="jeu-face jeu-cote">
                  <span>
                    AVOCAT DU DIABLE <span className="text-orange">·</span> LEQ<span className="text-orange">.</span>
                  </span>
                </div>
                <div className="jeu-face jeu-tranche">
                  <span>
                    PLAIDE · BLUFFE · CONVAINCS
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0" style={{ flex: "1.1 1 420px" }}>
            <span className="inline-flex items-center rounded-full bg-royal px-4 py-2 text-[11px] font-bold tracking-[.16em] text-white uppercase">Bientôt</span>
            <h2 className="h2 mt-[22px]">
              Le jeu de cartes <span className="serif text-royal">Avocat du diable</span>
            </h2>
            <p className="serif mt-3 mb-0 text-[26px] text-orange">Plaide, bluffe, convaincs.</p>
            <p className="mt-[14px] mb-0 max-w-[540px] text-[16px] leading-[1.7] text-ink/75">
              Un jeu de cartes fun pour s&apos;entraîner à l&apos;oral entre amis : des cartes, des rôles et des gages.
            </p>
            <Link className="btn btn-p mt-7" href="/evenements#newsletter">
              Être prévenu du lancement
            </Link>
          </div>
        </div>

        {/* Dans la boîte */}
        <div className="relative mt-20 text-center">
          <p className="eyebrow" style={{ color: "#114DA8" }}>Dans la boîte</p>
          <Sparkle className="wiggle hide-sm absolute" size={40} style={{ left: "20%", top: -10 }} />
        </div>
        <div className="mt-10 grid items-end gap-10" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))" }}>
          <figure className="m-0 text-center">
            <div className="relative mx-auto flex justify-center" style={{ height: 330 }}>
              {CONTENU.map((c, i) => (
                <Image
                  key={c.src}
                  src={c.src}
                  alt={c.alt}
                  width={c.w}
                  height={c.h}
                  sizes="220px"
                  className="jeu-carte absolute w-[200px] sm:w-[220px]"
                  style={{ height: "auto", top: i ? 18 : 0, transform: `translateX(${i ? 62 : -62}px) rotate(${i ? 7 : -7}deg)`, zIndex: i ? 2 : 1 }}
                />
              ))}
            </div>
            <figcaption className="mt-6 text-[15px] font-semibold text-ink/75">Les cartes Rôle et Sabotage</figcaption>
          </figure>
          <figure className="m-0 text-center">
            <Image src="/jeu/plateau.webp" alt="Plateau des points du jeu Avocat du diable" width={900} height={900} sizes="330px" className="jeu-plateau mx-auto block w-[290px] sm:w-[330px]" style={{ height: "auto" }} />
            <figcaption className="mt-6 text-[15px] font-semibold text-ink/75">Le plateau des points</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
