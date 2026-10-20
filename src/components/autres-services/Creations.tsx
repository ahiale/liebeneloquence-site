import Image from "next/image";
import Link from "next/link";

/** Page Autres services : les créations LEQ en bref, chacune avec sa page (/mellie, /avocat-du-diable). */
const CREATIONS = [
  {
    href: "/mellie",
    image: "/mellie/couverture.webp",
    alt: "Couverture de la BD Mellie a le trac",
    cadrage: "50% 4%",
    badge: "Nouveau · gratuit",
    titre: "Mellie",
    accent: "a le trac",
    texte: "La BD gratuite pour apprivoiser son trac, avec un cahier d'exercices. De 9 à 99 ans.",
    bouton: "Découvrir Mellie",
  },
  {
    href: "/avocat-du-diable",
    image: "/jeu/couverture.webp",
    alt: "Couverture du jeu de cartes Avocat du diable",
    cadrage: "50% 25%",
    badge: "Bientôt",
    titre: "Avocat",
    accent: "du diable",
    texte: "Le jeu de cartes qui transforme vos soirées en procès hilarants. Plaide, bluffe, convaincs.",
    bouton: "Découvrir le jeu",
  },
];

export function Creations() {
  return (
    <section id="creations" className="bg-night py-20 sm:py-[104px]">
      <div className="wrap">
        <div className="reveal text-center">
          <p className="eyebrow">Les créations LEQ</p>
          <h2 className="h2 text-white">
            Apprendre à parler, <span className="serif text-gold">en s&apos;amusant.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))" }}>
          {CREATIONS.map((c) => (
            <article key={c.href} className="reveal lift relative flex flex-col overflow-hidden rounded-[26px] bg-white text-ink" style={{ boxShadow: "0 44px 80px -44px rgba(0,0,0,.85)" }}>
              <div className="relative bg-cloud" style={{ aspectRatio: "16 / 10" }}>
                <Image src={c.image} alt={c.alt} fill sizes="(max-width: 760px) 95vw, 560px" style={{ objectFit: "cover", objectPosition: c.cadrage }} />
                <span className="absolute top-3.5 left-3.5 rounded-full bg-orange px-3 py-1 text-[11px] font-bold tracking-[.12em] text-white uppercase">{c.badge}</span>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="m-0 text-[30px] font-bold tracking-[-0.03em]">
                  {/* Lien étendu : rend toute la carte cliquable */}
                  <Link href={c.href} className="no-underline after:absolute after:inset-0 after:content-['']">
                    {c.titre} <span className="serif font-normal text-orange">{c.accent}</span>
                  </Link>
                </h3>
                <p className="mt-2 mb-0 flex-1 text-[15.5px] leading-[1.6] text-ink/70">{c.texte}</p>
                <span className="btn btn-p pointer-events-none mt-6 self-start" aria-hidden="true">
                  {c.bouton}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
