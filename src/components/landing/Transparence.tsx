import { Type, AudioLines, Brain } from "lucide-react";
import { Container, Eyebrow, SectionTitle } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const ITEMS = [
  {
    icon: Type,
    accent: "#5a8ae0",
    title: "Diction & phonétique",
    desc: "La correction phonétique et les troubles de la diction relèvent du domaine de l'orthophoniste. Ce n'est pas mon périmètre.",
  },
  {
    icon: AudioLines,
    accent: "#a978d8",
    title: "Travail technique de la voix",
    desc: "Le coaching vocal en profondeur — placement, projection, résonance — nécessite un professionnel dédié.",
  },
  {
    icon: Brain,
    accent: "#e0748f",
    title: "Gestion profonde du stress",
    desc: "La gestion de l'anxiété et des troubles liés au stress dépasse le cadre de la prise de parole. Je travaille sur la confiance à l'oral, pas en thérapie.",
  },
];

export function Transparence() {
  return (
    <section className="bg-night-violet py-20 sm:py-28">
      <Container>
        <Reveal>
          <Eyebrow className="text-[#e0748f]">Transparence</Eyebrow>
          <SectionTitle>
            Ce que je ne fais <span className="text-[#ff4d4d]">pas</span>
          </SectionTitle>
          <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-white/60">
            Être clair sur les limites de mon accompagnement, c&apos;est la
            meilleure façon de vous garantir un travail utile. Voici ce qui
            relève d&apos;autres professionnels.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 110}
              className="surface rounded-card p-7"
            >
              <span
                className="inline-grid h-12 w-12 place-items-center rounded-[15px] ring-1"
                style={{
                  background: `${item.accent}1f`,
                  color: item.accent,
                  boxShadow: `inset 0 0 0 1px ${item.accent}40`,
                }}
              >
                <item.icon size={22} strokeWidth={1.9} />
              </span>
              <h3
                className="mt-5 text-lg font-semibold tracking-[-0.02em]"
                style={{ color: item.accent }}
              >
                {item.title}
              </h3>
              <p className="mt-2.5 text-[0.88rem] leading-relaxed text-white/65">
                {item.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
