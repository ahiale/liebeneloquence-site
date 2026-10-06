import { Container, Eyebrow, SectionTitle } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
  {
    n: 1,
    badge: "Gratuit",
    label: "Diagnostic",
    color: "#e2564f",
    desc: "30 minutes en visio, offertes. On identifie vos besoins, vos objectifs et un plan clair est mis en place.",
  },
  {
    n: 2,
    badge: "Votre pack",
    label: "Parcours",
    color: "#f0a92a",
    desc: "Chaque séance est composée d'un icebreaker, d'une mise en contexte, d'une théorie courte, d'une pratique longue et d'un exercice final.",
  },
  {
    n: 3,
    badge: "Après",
    label: "Suivi",
    color: "#2fbd6e",
    desc: "Fiche de synthèse et diagnostic de fin, suivi post-formation. On vous accompagne jusqu'à 3 mois après la formation.",
  },
];

export function Methode() {
  return (
    <section id="methode" className="pb-20 sm:pb-28">
      <Container>
        <Reveal className="panel px-5 py-14 sm:px-10 sm:py-16">
          <div className="text-center">
            <Eyebrow>La méthode LEQ</Eyebrow>
            <SectionTitle>
              Un chemin, <span className="text-warm">trois étapes.</span>
            </SectionTitle>
          </div>

          <div className="relative mt-16">
            {/* ligne de liaison entre les trois jalons */}
            <div
              aria-hidden
              className="absolute left-[16%] right-[16%] top-[52px] hidden h-px bg-[linear-gradient(90deg,#e2564f,#f0a92a,#2fbd6e)] md:block"
            />

            <ol className="grid gap-12 md:grid-cols-3 md:gap-6">
              {STEPS.map((s, i) => (
                <Reveal
                  key={s.n}
                  delay={i * 140}
                  as="li"
                  className="relative text-center"
                >
                  <span
                    className="relative mx-auto grid h-[104px] w-[104px] place-items-center rounded-full border-[3px] bg-ink-800 text-5xl font-bold"
                    style={{ borderColor: s.color, color: s.color }}
                  >
                    {s.n}
                  </span>

                  <span
                    className="mt-6 inline-block rounded-full px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em]"
                    style={{
                      background: `${s.color}26`,
                      color: s.color,
                    }}
                  >
                    {s.badge}
                  </span>

                  <h3 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">
                    {s.label}
                  </h3>
                  <p className="mx-auto mt-3 max-w-[19rem] text-[0.9rem] leading-relaxed text-white/60">
                    {s.desc}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
