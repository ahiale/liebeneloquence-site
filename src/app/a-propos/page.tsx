import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { DrawUnderline, Heart, MicDoodle, Sparkle } from "@/components/ui/Doodles";

export const metadata: Metadata = {
  title: "À propos",
  description: "Rebecca Lieben Ahiale, oratrice, jurée et formatrice en prise de parole depuis 2019 : parcours, distinctions et expériences.",
  alternates: { canonical: "/a-propos" },
};

const CHIFFRES = [
  { value: "2019", label: "premier concours d'éloquence" },
  { value: "6 ans", label: "de scène, de jury et de coaching" },
  { value: "5", label: "distinctions et titres remportés" },
  { value: "100 %", label: "des profils accompagnés, du lycée au doctorat" },
];

const PARCOURS = [
  {
    year: "2019",
    title: "Le début du parcours oratoire",
    intro: "Première fois sur la scène d'un concours d'éloquence. Tout commence là.",
    items: [
      "Double championne d'un concours national d'argumentation poétique",
      "Responsable communication du magazine scolaire",
      "Animatrice des jeux de culture générale au lycée",
      "Paire éducatrice : accompagnement des élèves à la prise de parole",
    ],
  },
  {
    year: "2022",
    title: "Révélation & montée en puissance",
    intro: "Une deuxième compétition qui révèle un potentiel et fédère une vraie communauté.",
    items: [
      "Vice-championne du concours d'art oratoire au féminin",
      "Maîtrise de cérémonie et modération de conférences",
      "Organisation d'événements universitaires",
      "Responsable du club d'éloquence de l'université pendant 2 ans",
    ],
  },
  {
    year: "2023",
    title: "Reconnaissance nationale",
    intro: "Le travail est distingué au-delà du cercle universitaire.",
    items: [
      "Lauréate du Trophée Coup de Cœur de la meilleure compétition d'éloquence du Togo",
      "Distinctions honorifiques et apparitions dans la presse",
      "Début de la création de contenu autour de l'éloquence",
      "Membre de jury dans plusieurs concours d'art oratoire",
    ],
  },
  {
    year: "2024",
    title: "Influence & création de contenu",
    intro: "La parole passe de la scène à l'écran, avec des formats culturels travaillés.",
    items: [
      "Top 3 des créatrices de contenu culture générale du pays",
      "Interviews, vidéos, tournages",
      "Collaboration avec des scénaristes et créateurs de formats culturels",
    ],
  },
  {
    year: "2025",
    title: "Leadership & professionnalisation",
    intro: "Direction d'association, organisation de compétition et premiers accompagnements individuels.",
    items: [
      "Présidente d'Eloquentia Toulon",
      "Organisation d'une compétition d'éloquence de bout en bout : logistique, coaching, jury",
      "Lancement des cours particuliers dans le sud de la France",
      "Accompagnement de profils variés : docteurs, ingénieurs, étudiants, lycéens",
    ],
  },
];

export default function AProposPage() {
  return (
    <>
      <div className="bg-hero">
        <Header />
        <section className="pt-10 pb-20 sm:pt-[72px] sm:pb-[88px]">
          <div className="wrap flex flex-wrap items-center gap-12">
            <div className="min-w-0" style={{ flex: "1.15 1 520px" }}>
              <p className="eyebrow">La formatrice</p>
              <h1 className="mt-4 mb-0 leading-[1.02] font-bold tracking-[-0.035em] text-white" style={{ fontSize: "clamp(38px, 7vw, 50px)" }}>
                On ne naît pas orateur,
                <br />
                <span className="serif text-gold">on le devient.</span>
              </h1>
              <DrawUnderline width={220} style={{ marginTop: 4 }} />
              <div className="mt-7 grid max-w-[600px] gap-[18px] text-[16px] leading-[1.7] text-white/85">
                <p className="m-0">
                  C&apos;est ce qu&apos;écrivait Cicéron. Au vu de mon parcours, je crois plutôt être née oratrice, comme la majorité d&apos;entre nous. Une personne qui parle et qui s&apos;exprime est déjà un orateur. Mais le fossé entre un orateur et un <strong className="font-semibold text-gold">bon</strong> orateur est immense. Ce fossé, j&apos;ai pris le temps de le combler ces dernières années.
                </p>
                <p className="m-0">
                  De la jeune fille qui jouait à l&apos;animatrice télé devant son miroir à l&apos;oratrice d&apos;aujourd&apos;hui, le chemin a été long. Moi, c&apos;est Rebecca Lieben Ahiale, togolaise d&apos;origine et résidant en France.
                </p>
                <p className="m-0">
                  À côté de l&apos;art oratoire, je travaille dans la tech. Un profil qu&apos;on n&apos;a pas l&apos;habitude de voir, parce que pour beaucoup, l&apos;art oratoire rime avec droit et littérature. La preuve que non.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link className="btn btn-p" href="/#offres">Voir les formations</Link>
                <a className="btn btn-g" href={SITE.instagram} target="_blank" rel="noreferrer noopener">Instagram</a>
                <a className="btn btn-g" href={SITE.linkedin} target="_blank" rel="noreferrer noopener">LinkedIn</a>
              </div>
            </div>
            <div className="flex min-w-0 justify-center" style={{ flex: ".85 1 300px" }}>
              <div className="relative w-full max-w-[384px]">
                <div aria-hidden="true" className="absolute inset-0 rounded-[28px]" style={{ transform: "translate(-16px,16px)", border: "1px solid rgba(255,189,89,.25)" }} />
                <Image src="/formatrice.jpg" alt="Portrait de Rebecca Lieben Ahiale" width={900} height={1199} priority sizes="(max-width: 760px) 90vw, 384px" className="relative block h-auto w-full rounded-[28px] object-cover" style={{ aspectRatio: "4 / 5" }} />
                <div className="bob absolute z-[2] rounded-[20px] bg-white px-4 py-2.5 text-[15px] font-bold text-ink" style={{ left: -20, top: "16%", boxShadow: "4px 4px 0 #FF5E01" }}>
                  Togo <span className="serif text-orange">→</span> France
                </div>
                <div className="bob absolute z-[2] rounded-[20px] bg-gold px-4 py-2.5 text-[15px] font-bold text-ink" style={{ right: -16, bottom: "20%", boxShadow: "4px 4px 0 #001636" }}>
                  Scène &amp; tech
                </div>
                <Heart className="wiggle absolute z-[2]" size={34} style={{ left: -10, bottom: "6%" }} />
                <MicDoodle className="floaty absolute z-[2]" width={62} height={80} stand="#FFBD59" style={{ right: "8%", top: -40 }} />
                <Sparkle className="wiggle absolute z-[2]" size={44} style={{ top: -18, left: -14 }} />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-white/4 py-12">
          <div className="wrap grid gap-8 text-center" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(200px,100%),1fr))" }}>
            {CHIFFRES.map((c) => (
              <div key={c.value}>
                <p className="serif m-0 text-[46px] leading-[1.1] text-gold">{c.value}</p>
                <p className="mx-auto mt-2 mb-0 max-w-[208px] text-[13.6px] leading-[1.4] text-white/60">{c.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <main>
        <section className="bg-light py-20 text-ink sm:py-28">
          <div className="wrap">
            <p className="eyebrow" style={{ color: "#CC4A00" }}>Distinctions &amp; prix</p>
            <div className="relative">
              <h2 className="h2">
                Le <span className="serif text-orange">parcours</span>, année après année.
              </h2>
              <Sparkle className="wiggle hide-sm absolute" style={{ right: "12%", top: -10 }} />
            </div>
            <ol className="mt-14 mb-0 grid list-none gap-8 p-0">
              {PARCOURS.map((y, i) => (
                <li key={y.year} className="grid gap-2 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6">
                  <div>
                    <span className="relative inline-block px-3.5 py-1.5">
                      <svg viewBox="0 0 140 70" preserveAspectRatio="none" fill="none" aria-hidden="true" className="absolute" style={{ inset: "-4px -10px", width: "calc(100% + 20px)", height: "calc(100% + 8px)" }}>
                        <path d="M20 38C22 12 110 6 128 26s-20 38-64 38S6 52 10 34 70 8 112 12" stroke="#FF5E01" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      <span className="serif relative text-[40px] text-orange">{y.year}</span>
                    </span>
                    <div className="hide-sm mt-2.5 h-px w-14" style={{ background: "linear-gradient(90deg,#FF5E01,transparent)" }} />
                  </div>
                  <div className="card-light yearcard rounded-[24px] p-7" style={{ transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)` }}>
                    <h3 className="m-0 text-[20px] font-bold tracking-[-0.025em]">{y.title}</h3>
                    <p className="mt-2 mb-0 text-[14.4px] leading-[1.6] text-ink/60">{y.intro}</p>
                    <ul className="mt-5 mb-0 grid list-none gap-2.5 p-0">
                      {y.items.map((it) => (
                        <li key={it} className="flex gap-2.5 text-[14px] text-ink/78">
                          <span className="mt-2.5 h-0.5 w-3 shrink-0 rounded-sm bg-orange" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-night py-20 sm:py-[104px]">
          <div className="wrap">
            <div className="panel grid items-center gap-10 overflow-hidden p-5 sm:p-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:p-10">
              {/* Sur scène au Mondial de la Parole */}
              <figure className="relative m-0">
                <div className="relative overflow-hidden rounded-[26px]" style={{ aspectRatio: "4 / 3", boxShadow: "0 40px 80px -40px rgba(0,0,0,.9)" }}>
                  <Image src="/images/mondial-de-la-parole.jpg" alt="Rebecca Lieben Ahiale sur scène au Mondial de la Parole, devant le Pont du Gard" fill sizes="(max-width: 1024px) 90vw, 520px" style={{ objectFit: "cover", objectPosition: "45% 30%" }} />
                </div>
                <figcaption className="bob absolute -bottom-4 left-5 rounded-[16px] bg-white px-3.5 py-2 text-[13px] font-bold text-ink" style={{ boxShadow: "4px 4px 0 #FF5E01" }}>
                  Mondial de la Parole · <span className="serif text-orange">Pont du Gard</span>
                </figcaption>
                <Sparkle className="wiggle absolute" size={40} style={{ top: -16, right: -12 }} />
              </figure>
              <div className="py-4 text-center lg:py-6 lg:text-left">
              <blockquote className="serif mx-auto mt-0 mb-0 max-w-[768px] leading-[1.3] text-gold lg:mx-0" style={{ fontSize: "clamp(24px, 3.6vw, 32px)" }}>
                « Avant d&apos;être des êtres rationnels, nous sommes des êtres d&apos;émotion. »
              </blockquote>
              <p className="mx-auto mt-5 mb-0 max-w-[560px] text-[16.5px] leading-[1.7] text-white/85 lg:mx-0">
                Et moi, j&apos;ai appris à travailler sur ma rationalité et ma gestion des émotions en prise de parole. Et aujourd&apos;hui, je suis prête à partager tout ce que j&apos;ai appris avec vous.
              </p>
              <p className="mt-6 mb-0 text-[13.6px] text-white/50">Rebecca Lieben Ahiale · Fondatrice de Lieben Éloquence</p>
              <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Link className="btn btn-p" href="/quiz">Découvrir mon profil d&apos;orateur</Link>
                <Link className="btn btn-g" href="/#offres">Voir les formations</Link>
              </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
