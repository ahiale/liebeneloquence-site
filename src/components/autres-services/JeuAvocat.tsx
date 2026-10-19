import Image from "next/image";
import { Heart, Sparkle, Star } from "@/components/ui/Doodles";
import { BoiteJeu } from "@/components/autres-services/BoiteJeu";
import { RoueJeu } from "@/components/autres-services/RoueJeu";
import { TirerCarte } from "@/components/autres-services/TirerCarte";
import { PrenomEmailForm } from "@/components/ui/PrenomEmailForm";
import { etrePrevenu } from "@/app/actions";

/* Jeu de cartes Avocat du diable (bientôt), ambiance salle d'audience sous projecteur :
   1. grande boîte en 3D (BoiteJeu), feuilles qui volent, bulles de réaction, formulaire « Être prévenu » ;
   2. les 4 étapes du jeu ;
   3. « Tire une carte ! » (composant TirerCarte) ;
   4. la Banque du diable : boîte ouverte d'où sortent les billets ;
   5. le plateau des points en roue (RoueJeu).
   Visuels dans public/jeu, préparés par communication/jeu/preparer-images.py. */

const ETAPES = [
  { titre: "Une affaire tombe", texte: "On tire une carte Affaire : un joueur est accusé d'un délit absurde, pièces à conviction à l'appui." },
  { titre: "Plaide !", texte: "Accuse ou défends comme un avocat. Le fond et la forme rapportent des points sur le plateau." },
  { titre: "Encaisse les sabotages", texte: "Objection, personnage à jouer, volte-face : tiens bon et tu gagnes des points, craque et tu en perds." },
  { titre: "Le Public parie", texte: "Le Public parie en secret avec les billets de la Banque du diable et choisit à qui donner les Sabotages." },
];

const BULLES = [
  { texte: "OBJECTION !", style: { left: "-2%", top: "8%", animationDelay: "0s", rotate: "-8deg" } },
  { texte: "Ha ha !", style: { right: "0%", top: "2%", animationDelay: "1.6s", rotate: "7deg" } },
  { texte: "Oh !", style: { right: "6%", bottom: "6%", animationDelay: "3.2s", rotate: "-5deg" } },
];

const BILLETS = [
  { src: "/jeu/billet-20.webp", alt: "Billet de 20", r: -16, x: -70, y: -70, d: "0s" },
  { src: "/jeu/billet-10.webp", alt: "Billet de 10", r: 10, x: 60, y: -84, d: ".5s" },
  { src: "/jeu/billet-5.webp", alt: "Billet de 5", r: -4, x: -20, y: -104, d: "1s" },
  { src: "/jeu/billet-1.webp", alt: "Billet de 1", r: 18, x: 30, y: -58, d: "1.5s" },
];

export function JeuAvocat() {
  return (
    <section id="jeu" className="jeu-section relative overflow-hidden py-20 text-white sm:py-[110px]">
      <div className="jeu-projecteur" aria-hidden="true" />
      <div className="wrap relative">
        {/* 1. La boîte */}
        <div className="flex flex-wrap items-center gap-12">
          <div className="relative flex min-w-0 justify-center" style={{ flex: "1.2 1 440px" }}>
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              {[...Array(7)].map((_, i) => (
                <span key={i} className="jeu-feuille" style={{ left: `${8 + i * 13}%`, animationDelay: `${i * 1.1}s`, animationDuration: `${6 + (i % 3)}s` }} />
              ))}
            </div>
            {BULLES.map((b) => (
              <span key={b.texte} className="jeu-bulle" aria-hidden="true" style={b.style}>
                {b.texte}
              </span>
            ))}
            <BoiteJeu />
          </div>

          <div className="min-w-0" style={{ flex: "1 1 380px" }}>
            <span className="inline-flex items-center rounded-full bg-orange px-4 py-2 text-[11px] font-bold tracking-[.16em] text-white uppercase">Bientôt</span>
            <p className="mt-6 mb-0 text-[13px] font-bold tracking-[.2em] text-gold uppercase">Le jeu de cartes LEQ</p>
            <h2 className="mt-2 mb-0 leading-[.95] font-black tracking-[-0.04em]" style={{ fontSize: "clamp(46px, 7vw, 76px)" }}>
              Avocat <span className="serif font-normal text-orange">du diable</span>
            </h2>
            <p className="serif mt-4 mb-0 text-[28px] text-gold">Plaide, bluffe, convaincs.</p>
            <p className="mt-4 mb-0 max-w-[480px] text-[16.5px] leading-[1.7] text-white/80">
              Le jeu de cartes qui transforme vos soirées en procès hilarants : des affaires absurdes, des rôles, des sabotages et une banque pour parier. Fous rires garantis, et on progresse à l&apos;oral sans s&apos;en rendre compte.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Affaires", "Rôles", "Sabotages", "Banque du diable"].map((t) => (
                <span key={t} className="rounded-full border border-white/25 bg-white/8 px-3.5 py-1.5 text-[13px] font-semibold">
                  {t}
                </span>
              ))}
            </div>
            <PrenomEmailForm
              action={etrePrevenu}
              champs={{ sujet: "jeu-avocat" }}
              bouton="Être prévenu du lancement"
              succes={{ titre: "C'est noté !", texte: "Un mail de confirmation vient de vous être envoyé. Vous serez prévenu·e dès le lancement du jeu." }}
              className="mt-8 max-w-[520px]"
            />
          </div>
        </div>

        {/* 2. Comment on joue */}
        <div className="reveal relative mt-24 text-center">
          <h3 className="h2 text-white">
            Les 4 étapes <span className="serif text-gold">du jeu</span>
          </h3>
          <Sparkle className="wiggle hide-sm absolute" size={40} style={{ right: "16%", top: 0 }} />
        </div>
        <ol className="mt-12 grid list-none gap-5 p-0" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(230px,100%),1fr))" }}>
          {ETAPES.map((e, i) => (
            <li key={e.titre} className="jeu-etape reveal relative rounded-[22px] p-6" style={{ rotate: `${i % 2 ? 1 : -1}deg` }}>
              <span className="jeu-etape-num">{i + 1}</span>
              <p className="mt-3 mb-0 text-[20px] font-bold tracking-[-0.02em]">{e.titre}</p>
              <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-white/75">{e.texte}</p>
            </li>
          ))}
        </ol>

        {/* 3. Tire une carte */}
        <div className="reveal relative mt-24 text-center">
          <p className="eyebrow">À toi de jouer</p>
          <h3 className="h2 text-white">
            Tire une <span className="serif text-orange">carte !</span>
          </h3>
          <p className="mx-auto mt-3 mb-12 max-w-[460px] text-[15.5px] text-white/70">Affaire, rôle ou sabotage : qu&apos;est-ce que le diable te réserve ?</p>
          <Heart className="wiggle hide-sm absolute" size={28} style={{ left: "18%", top: 10 }} />
        </div>
        <div className="reveal">
          <TirerCarte />
        </div>

        {/* 4. La Banque du diable */}
        <div className="mt-28 flex flex-wrap-reverse items-center gap-14">
          <div className="reveal min-w-0" style={{ flex: "1 1 360px" }}>
            <p className="eyebrow">La Banque du diable</p>
            <h3 className="h2 text-white">
              Mise, parie, <span className="serif text-gold">fais sauter la banque.</span>
            </h3>
            <p className="mt-4 mb-0 max-w-[480px] text-[16px] leading-[1.7] text-white/80">
              Chaque joueur commence avec <strong className="text-gold">15 billets</strong>. Les mises perdues et les billets à rendre retournent à la banque : à toi de convaincre pour remplir tes poches.
            </p>
            <div className="mt-6 flex items-center gap-3 text-[14px] text-white/70">
              {["1", "5", "10", "20"].map((v) => (
                <span key={v} className="grid h-11 w-11 place-items-center rounded-full border-2 border-gold font-black text-gold">
                  {v}
                </span>
              ))}
              <span>les billets LEQ</span>
            </div>
            <Image src="/jeu/banque-carte.webp" alt="Carte Banque du diable : chaque joueur commence avec 15 billets" width={420} height={688} sizes="140px" className="jeu-banque-carte mt-8 w-[120px] sm:w-[140px]" style={{ height: "auto" }} />
          </div>
          <div className="relative flex min-w-0 justify-center" style={{ flex: "1.1 1 380px", minHeight: 420 }}>
            <div className="banque-scene" aria-hidden="true">
              <div className="banque-boite">
                <div className="banque-couvercle" />
                <div className="banque-face banque-fond" />
                <div className="banque-face banque-gauche" />
                <div className="banque-face banque-droite" />
                <div className="banque-face banque-sol" />
                {BILLETS.map((b) => (
                  <div key={b.src} className="banque-billet" style={{ ["--r" as string]: `${b.r}deg`, ["--x" as string]: `${b.x}px`, ["--y" as string]: `${b.y}px`, animationDelay: b.d }}>
                    <Image src={b.src} alt="" width={520} height={264} sizes="200px" style={{ width: "100%", height: "auto" }} />
                  </div>
                ))}
                <div className="banque-face banque-devant">
                  <span className="banque-etiquette">
                    BANQUE <span className="text-orange">DU DIABLE</span>
                  </span>
                </div>
              </div>
            </div>
            <Star className="wiggle absolute" style={{ right: "6%", top: "4%" }} />
          </div>
        </div>

        {/* Le plateau, en roue */}
        <div className="reveal mt-24 flex flex-col items-center text-center">
          <p className="eyebrow">Le plateau des points</p>
          <div className="mt-8">
            <RoueJeu />
          </div>
        </div>
      </div>
    </section>
  );
}
