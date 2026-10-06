import Image from "next/image";
import { Trophy, ArrowRight } from "lucide-react";
import { Container, Eyebrow, SectionTitle } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { SITE } from "@/data/site";
import { MILESTONES } from "@/data/parcours";

/* Trois jalons marquants, repris de la page « À propos ». */
const HIGHLIGHTS = MILESTONES.filter((m) =>
  ["2022", "2023", "2025"].includes(m.year),
);

export function QuiSuisJe() {
  return (
    <section id="a-propos" className="bg-night py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="relative mx-auto w-full max-w-sm">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] ring-1 ring-white/12">
              <Image
                src="/formatrice.jpg"
                alt="Rebecca Lieben Ahiale, formatrice en prise de parole"
                fill
                sizes="(max-width: 1024px) 88vw, 384px"
                className="object-cover"
                priority
              />
            </div>
            <div
              aria-hidden
              className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-[28px] border border-gold/25"
            />
          </Reveal>

          <Reveal delay={120}>
            <Eyebrow className="text-royal-200">La formatrice</Eyebrow>
            <SectionTitle>
              Qui suis-je&nbsp;?
            </SectionTitle>

            <p className="mt-5 max-w-xl leading-relaxed text-white/70">
              Je suis Rebecca Lieben Ahiale, passionnée de la scène, du public
              et du micro. Togolaise, installée en France, je travaille dans la
              tech — la preuve que l&apos;art oratoire ne rime pas seulement
              avec droit et littérature. Depuis 2019, je pratique, je concoure,
              je juge et j&apos;accompagne&nbsp;: aujourd&apos;hui, je transmets
              cette maîtrise de la parole à celles et ceux qui veulent oser et
              convaincre.
            </p>

            <div className="mt-8 overflow-hidden rounded-card border border-white/10">
              <div className="flex items-center gap-2.5 bg-[linear-gradient(96deg,rgba(17,77,168,0.55),rgba(17,77,168,0.15))] px-5 py-3.5">
                <Trophy size={18} className="text-gold" />
                <h3 className="text-[0.95rem] font-semibold">
                  Distinctions &amp; expériences
                </h3>
              </div>
              <ul className="divide-y divide-white/8 bg-white/4">
                {HIGHLIGHTS.map((m) => (
                  <li key={m.year} className="flex gap-4 px-5 py-3.5">
                    <span className="w-12 shrink-0 pt-0.5 font-serif text-base italic text-gold">
                      {m.year}
                    </span>
                    <span className="text-[0.88rem] leading-snug text-white/75">
                      {m.items[0]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/a-propos" variant="primary" size="lg">
                Mon parcours complet <ArrowRight size={17} />
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
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
