import type { Metadata } from "next";
import Image from "next/image";
import { Quote, ArrowRight, Sparkles } from "lucide-react";
import { Container, Eyebrow, SectionTitle } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Header } from "@/components/layout/Header";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { MILESTONES, EXPERTISES, FACTS } from "@/data/parcours";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "À propos — Rebecca Lieben Ahiale",
  description:
    "Du concours d'éloquence à la présidence d'Eloquentia Toulon : le parcours, les distinctions et les expériences de Rebecca Lieben Ahiale, fondatrice de Lieben Éloquence.",
};

export default function AProposPage() {
  return (
    <>
      <Header />

      <main>
        {/* Séquence sombre continue : hero, chiffres clés et parcours. */}
        <div className="bg-night">
          {/* -------------------------------------------------------- Hero */}
          <section className="pt-32 pb-20 sm:pt-40 sm:pb-24">
            <Container className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="reveal">
                <Eyebrow>La formatrice</Eyebrow>
                <h1 className="h-section mt-4 text-4xl sm:text-[3.1rem]">
                  On ne naît pas orateur,
                  <br />
                  <span className="accent">on le devient.</span>
                </h1>

                <div className="mt-8 space-y-5 leading-relaxed text-white/70">
                  <p>
                    C&apos;est ce qu&apos;écrivait Cicéron. Au vu de mon
                    parcours, je crois plutôt être née oratrice — comme la
                    majorité d&apos;entre nous. Une personne qui parle et qui
                    s&apos;exprime est déjà un orateur. Mais le fossé entre un
                    orateur et un{" "}
                    <em className="not-italic font-semibold text-gold">bon</em>{" "}
                    orateur est immense. Ce fossé, j&apos;ai pris le temps de le
                    combler ces dernières années.
                  </p>
                  <p>
                    De la jeune fille qui jouait à l&apos;animatrice télé devant
                    son miroir à l&apos;oratrice d&apos;aujourd&apos;hui, le
                    chemin a été long. Moi, c&apos;est Rebecca Lieben Ahiale,
                    togolaise d&apos;origine et résidant en France.
                  </p>
                  <p>
                    À côté de l&apos;art oratoire, je travaille dans la tech. Un
                    profil qu&apos;on n&apos;a pas l&apos;habitude de voir,
                    parce que pour beaucoup, l&apos;art oratoire rime avec droit
                    et littérature. La preuve que non.
                  </p>
                </div>

                <div className="mt-9 flex flex-wrap gap-3">
                  <ButtonLink href="/#offres" variant="primary" size="lg">
                    Voir les formations <ArrowRight size={17} />
                  </ButtonLink>
                  <ButtonLink
                    href={SITE.instagram}
                    external
                    variant="ghost"
                    size="lg"
                  >
                    <InstagramIcon size={17} /> Instagram
                  </ButtonLink>
                  <ButtonLink
                    href={SITE.linkedin}
                    external
                    variant="ghost"
                    size="lg"
                  >
                    <LinkedinIcon size={16} /> LinkedIn
                  </ButtonLink>
                </div>
              </div>

              <Reveal className="relative mx-auto w-full max-w-sm">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] ring-1 ring-white/12">
                  <Image
                    src="/formatrice.jpg"
                    alt="Portrait de Rebecca Lieben Ahiale"
                    fill
                    sizes="(max-width: 1024px) 88vw, 384px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div
                  aria-hidden
                  className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-[28px] border border-gold/25"
                />
              </Reveal>
            </Container>
          </section>

          {/* -------------------------------------------------- Chiffres clés */}
          <section className="border-y border-white/8 bg-white/4 py-12">
            <Container>
              <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {FACTS.map((f, i) => (
                  <Reveal key={f.label} delay={i * 90} className="text-center">
                    <dd className="font-serif text-4xl italic text-gold sm:text-5xl">
                      {f.value}
                    </dd>
                    <dt className="mx-auto mt-2 max-w-[13rem] text-[0.85rem] leading-snug text-white/60">
                      {f.label}
                    </dt>
                  </Reveal>
                ))}
              </dl>
            </Container>
          </section>

          {/* ------------------------------------------------- Le parcours */}
          <section className="py-20 sm:py-28">
            <Container>
              <Reveal>
                <Eyebrow>Distinctions &amp; prix</Eyebrow>
                <SectionTitle>
                  Le <span className="accent">parcours</span>, année après
                  année.
                </SectionTitle>
              </Reveal>

              <ol className="mt-14 space-y-8">
                {MILESTONES.map((m, i) => (
                  <Reveal
                    key={m.year}
                    delay={i * 80}
                    as="li"
                    className="grid gap-6 md:grid-cols-[auto_1fr]"
                  >
                    <div className="flex items-start gap-5 md:w-40 md:flex-col md:gap-3">
                      <span className="font-serif text-4xl italic text-orange">
                        {m.year}
                      </span>
                      <span
                        aria-hidden
                        className="mt-3 hidden h-px w-14 bg-[linear-gradient(90deg,var(--color-orange),transparent)] md:block"
                      />
                    </div>

                    <div className="surface rounded-card p-7">
                      <h3 className="text-xl font-bold tracking-[-0.025em]">
                        {m.title}
                      </h3>
                      <p className="mt-2 text-[0.9rem] leading-relaxed text-white/60">
                        {m.summary}
                      </p>
                      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                        {m.items.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2.5 text-[0.88rem] leading-snug text-white/78"
                          >
                            <span
                              aria-hidden
                              className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </Container>
          </section>
        </div>

        {/* ------------------------------------------------------ Expertise */}
        <section className="bg-night-violet py-20 sm:py-24">
          <Container>
            <Reveal>
              <Eyebrow className="text-royal-200">
                Expériences professionnelles
              </Eyebrow>
              <SectionTitle>Un profil hybride.</SectionTitle>
              <p className="mt-5 max-w-2xl leading-relaxed text-white/65">
                L&apos;éloquence n&apos;est réservée ni au droit ni à la
                littérature. Mon parcours mêle la scène, la tech et les médias —
                et c&apos;est précisément ce croisement qui nourrit ma façon
                d&apos;accompagner.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {EXPERTISES.map((e, i) => (
                <Reveal
                  key={e.title}
                  delay={i * 110}
                  className="surface rounded-card p-7"
                >
                  <span className="inline-grid h-11 w-11 place-items-center rounded-[13px] bg-gold/14 text-gold ring-1 ring-gold/25">
                    <Sparkles size={20} strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em]">
                    {e.title}
                  </h3>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-white/62">
                    {e.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* --------------------------------------------------- Citation CTA */}
        <section className="bg-night py-20 sm:py-24">
          <Container>
            <Reveal className="panel px-6 py-16 text-center sm:px-12">
              <Quote size={34} className="mx-auto text-gold" />
              <p className="mx-auto mt-7 max-w-3xl font-serif text-2xl italic leading-snug text-white/88 sm:text-3xl">
                Aujourd&apos;hui, j&apos;ai les clés pour accompagner les gens
                dans leur prise de parole. J&apos;ai toujours quelque chose à
                dire sur le discours des autres — et les techniques pour le
                rendre meilleur.
              </p>
              <p className="mt-6 text-[0.85rem] text-white/50">
                Rebecca Lieben Ahiale · Fondatrice de Lieben Éloquence
              </p>

              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href="/quiz" variant="primary" size="lg">
                  Découvrir mon profil d&apos;orateur <ArrowRight size={17} />
                </ButtonLink>
                <ButtonLink href="/#offres" variant="ghost" size="lg">
                  Voir les formations
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>

    </>
  );
}
