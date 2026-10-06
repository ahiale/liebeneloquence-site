import {
  Target,
  HeartPulse,
  BadgeCheck,
  Gamepad2,
  HandHeart,
  Zap,
} from "lucide-react";
import { Container, Eyebrow, SectionTitle } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { IconTile } from "@/components/ui/IconTile";

const APPORTS = [
  {
    icon: Target,
    tone: "orange" as const,
    bar: "#c0392b",
    title: "Accompagnement sur mesure",
    desc: "Chaque parcours est construit pour vous et avec vous, afin de répondre au mieux à vos problématiques.",
  },
  {
    icon: HeartPulse,
    tone: "royal" as const,
    bar: "#2f6ccb",
    title: "Gestion du trac",
    desc: "Des techniques concrètes pour transformer le trac en force et arriver à le dompter sans se sentir exposé.",
  },
  {
    icon: BadgeCheck,
    tone: "gold" as const,
    bar: "#d8b478",
    title: "Certification en fin de parcours",
    desc: "Une attestation de fin de formation est remise à l'issue du parcours, pour attester de votre progression et faire valoir vos acquis.",
  },
  {
    icon: Gamepad2,
    tone: "success" as const,
    bar: "#1e7d4b",
    title: "Méthodes ludiques & concrètes",
    desc: "Icebreakers, jeux de rôle, mises en situation, Kahoot. On apprend en pratiquant et en sortant de sa zone de confort.",
  },
  {
    icon: HandHeart,
    tone: "gold" as const,
    bar: "#e7b93c",
    title: "Suivi bienveillant",
    desc: "Une formatrice disponible et à l'écoute, qui adapte le rythme et le contenu à chaque séance selon vos avancées réelles.",
  },
  {
    icon: Zap,
    tone: "orange" as const,
    bar: "#b4442f",
    title: "Résultats rapides & mesurables",
    desc: "Dès la première séance, vous repartez avec des outils applicables immédiatement. Pas de parcours inutilement long.",
  },
];

export function Apports() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal className="text-center">
          <Eyebrow>Pourquoi LEQ&nbsp;?</Eyebrow>
          <SectionTitle>
            Ce que j&apos;apporte <span className="text-orange">réellement.</span>
          </SectionTitle>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {APPORTS.map((a, i) => (
            <Reveal
              key={a.title}
              delay={(i % 3) * 90}
              className="surface surface-hover overflow-hidden rounded-card"
            >
              <div className="h-1.5 w-full" style={{ background: a.bar }} />
              <div className="p-6">
                <IconTile icon={a.icon} tone={a.tone} size="md" />
                <h3 className="mt-4 text-lg font-semibold leading-snug tracking-[-0.015em]">
                  {a.title}
                </h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-white/60">
                  {a.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
