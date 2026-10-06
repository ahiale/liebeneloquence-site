import { School, Building2, Users, Rocket } from "lucide-react";
import { Container, Eyebrow, SectionTitle } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { IconTile } from "@/components/ui/IconTile";

const CONTEXTES = [
  {
    icon: School,
    tone: "royal" as const,
    title: "Vie scolaire & étudiante",
    items: [
      "Exposé oral en classe",
      "Soutenance de mémoire ou de thèse",
      "Présentation devant un jury",
      "Candidature à une école ou une université",
      "Concours d'éloquence",
    ],
  },
  {
    icon: Building2,
    tone: "gold" as const,
    title: "Vie professionnelle",
    items: [
      "Entretien d'embauche",
      "Prise de parole en réunion",
      "Pitcher un projet à sa hiérarchie",
      "Animer une formation ou un atelier",
    ],
  },
  {
    icon: Users,
    tone: "success" as const,
    title: "Vie sociale & personnelle",
    items: [
      "Discours de mariage ou d'anniversaire",
      "Prise de parole en association",
      "Débattre et argumenter au quotidien",
      "Défendre une cause qui vous tient à cœur",
      "Se présenter dans un nouvel environnement",
    ],
  },
  {
    icon: Rocket,
    tone: "orange" as const,
    title: "Vie entrepreneuriale & créative",
    items: [
      "Pitcher devant des investisseurs",
      "Présenter sa marque personnelle",
      "Animer un live ou une vidéo",
      "Prendre la parole en conférence",
    ],
  },
];

export function Vision() {
  return (
    <section id="pour-qui" className="pb-20 sm:pb-24">
      <Container>
        <Reveal className="max-w-3xl">
          <Eyebrow>Pour qui&nbsp;?</Eyebrow>
          <SectionTitle>
            Pas besoin d&apos;être dirigeant pour avoir besoin de{" "}
            <span className="accent">bien parler.</span>
          </SectionTitle>
          <p className="mt-5 leading-relaxed text-white/65">
            La plupart des formations ciblent les cadres et les entreprises.
            Ma conviction est différente&nbsp;: la communication, l&apos;éloquence
            et la structuration du discours sont essentielles pour tout le monde,
            quels que soient l&apos;âge, le profil ou la situation. Tout le monde
            parle. Tout le monde, un jour, a besoin de convaincre, de se
            présenter ou simplement de se faire entendre.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {CONTEXTES.map((c, i) => (
            <Reveal
              key={c.title}
              delay={(i % 2) * 100}
              className="surface surface-hover rounded-card p-7"
            >
              <IconTile icon={c.icon} tone={c.tone} size="md" />
              <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em]">
                {c.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {c.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-[0.88rem] text-white/60"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-gold"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
