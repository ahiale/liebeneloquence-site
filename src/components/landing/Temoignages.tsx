import { Star } from "lucide-react";
import { Container, Eyebrow, SectionTitle } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const REVIEWS = [
  {
    quote:
      "J'avais une soutenance de master en 10 jours. En 3 heures, j'ai complètement restructuré mon discours et gagné une confiance que je n'avais pas.",
    name: "Amina L.",
    role: "Étudiante en master, Paris",
    initials: "AL",
    tone: "bg-[#f6c6c6] text-[#8a3030]",
  },
  {
    quote:
      "Mon Grand Oral se passait dans 2 semaines. La séance m'a appris à structurer, à gérer le silence, et surtout à croire en ce que je disais.",
    name: "Kévin D.",
    role: "Lycéen terminale, Lyon",
    initials: "KD",
    tone: "bg-[#f7cf94] text-[#7a4a08]",
  },
  {
    quote:
      "J'avais besoin de pitcher mon projet devant des investisseurs. La méthode est efficace, directe et vraiment adaptée à mon niveau.",
    name: "Marc R.",
    role: "Entrepreneur, Bordeaux",
    initials: "MR",
    tone: "bg-[#9fdcb6] text-[#1c5c37]",
  },
];

export function Temoignages() {
  return (
    <section className="bg-light py-20 text-ink sm:py-28">
      <Container>
        <Reveal className="text-center">
          <Eyebrow className="text-orange">Ils ont travaillé avec moi</Eyebrow>
          <SectionTitle>
            Ce qu&apos;ils en <span className="text-orange">disent</span>
          </SectionTitle>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal
              key={r.name}
              delay={i * 110}
              as="figure"
              className="card-light flex flex-col rounded-[26px] p-7"
            >
              <div className="flex gap-1 text-gold" aria-label="5 étoiles sur 5">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} size={17} className="fill-gold stroke-gold" />
                ))}
              </div>

              <blockquote className="mt-5 flex-1 text-[0.92rem] leading-relaxed text-ink/78">
                «&nbsp;{r.quote}&nbsp;»
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-3">
                <span
                  className={`grid h-11 w-11 place-items-center rounded-full text-sm font-bold ${r.tone}`}
                >
                  {r.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{r.name}</span>
                  <span className="block text-xs text-ink/55">{r.role}</span>
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
