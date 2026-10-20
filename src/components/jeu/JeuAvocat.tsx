import Image from "next/image";
import { Heart, Sparkle, Star } from "@/components/ui/Doodles";
import { BoiteJeu } from "@/components/jeu/BoiteJeu";
import { RoueJeu } from "@/components/jeu/RoueJeu";
import { TirerCarte } from "@/components/jeu/TirerCarte";
import { PrenomEmailForm } from "@/components/ui/PrenomEmailForm";
import { etrePrevenu } from "@/app/actions";

/* Jeu de cartes Avocat du diable (bientôt), ambiance salle d'audience sous projecteur :
   1. grande boîte en 3D (BoiteJeu), marteau de juge qui frappe, bulles de réaction, formulaire « Être prévenu » ;
   2. les 4 étapes du jeu ;
   3. « Tire une carte ! » (composant TirerCarte) ;
   4. la Banque LEQ : boîte ouverte d'où sortent les billets ;
   5. le tableau d'audience en roue (RoueJeu).
   Visuels dans public/jeu, préparés par communication/jeu/preparer-images.py. */

const ETAPES = [
  { titre: "Une affaire tombe", texte: "On tire une carte Affaire : un joueur est accusé d'un délit absurde, pièces à conviction à l'appui." },
  { titre: "Plaide !", texte: "Accuse ou défends comme un avocat. Le fond et la forme rapportent des points sur le tableau d'audience." },
  { titre: "Encaisse les sabotages", texte: "Objection, personnage à jouer, volte-face : tiens bon et tu gagnes des points, craque et tu en perds." },
  { titre: "Le Public parie", texte: "Le Public parie en secret avec les billets de la Banque LEQ et choisit à qui donner les Sabotages." },
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
            <Marteau />
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
              {["Affaires", "Rôles", "Sabotages", "Banque LEQ"].map((t) => (
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

        {/* 4. La Banque LEQ */}
        <div className="mt-28 flex flex-wrap-reverse items-center gap-14">
          <div className="reveal min-w-0" style={{ flex: "1 1 360px" }}>
            <p className="eyebrow">La Banque LEQ</p>
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
                    BANQUE <span className="text-orange">LEQ</span>
                  </span>
                </div>
              </div>
            </div>
            <Star className="wiggle absolute" style={{ right: "6%", top: "4%" }} />
          </div>
        </div>

        {/* Le tableau d'audience, en roue */}
        <div className="reveal mt-24 flex flex-col items-center text-center">
          <p className="eyebrow">Le tableau d&apos;audience</p>
          <div className="mt-8">
            <RoueJeu />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Marteau de juge qui frappe son socle, avec un éclat au moment de l'impact. */
function Marteau() {
  return (
    <svg className="jeu-marteau" viewBox="0 0 140 120" width="180" height="154" aria-hidden="true">
      <ellipse cx="44" cy="104" rx="38" ry="9" fill="#5a3416" stroke="#001636" strokeWidth="3" />
      <g className="jeu-marteau-eclat" stroke="#ffbd59" strokeWidth="4" strokeLinecap="round">
        <path d="M6 82l-6-8M20 76l-2-11M74 78l6-9M86 88l10-3" />
      </g>
      <g className="jeu-marteau-bras">
        <rect x="58" y="20" width="12" height="80" rx="5" fill="#a0692f" stroke="#001636" strokeWidth="3" transform="rotate(-50 64 60)" />
        <g transform="rotate(-50 64 60)">
          <rect x="34" y="6" width="60" height="30" rx="7" fill="#8b5a2b" stroke="#001636" strokeWidth="3" />
          <rect x="42" y="6" width="7" height="30" fill="#ffbd59" stroke="#001636" strokeWidth="2" />
          <rect x="79" y="6" width="7" height="30" fill="#ffbd59" stroke="#001636" strokeWidth="2" />
        </g>
      </g>
    </svg>
  );
}

