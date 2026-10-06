import {
  GraduationCap,
  ClipboardList,
  Trophy,
  Briefcase,
  FileText,
  Lightbulb,
  Handshake,
  Mic,
  Presentation,
  Users,
} from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const DOMAINES = [
  { icon: GraduationCap, label: "Grand Oral BAC" },
  { icon: ClipboardList, label: "Oral de BTS" },
  { icon: Trophy, label: "Concours d'éloquence" },
  { icon: Briefcase, label: "Entretien d'embauche" },
  { icon: FileText, label: "Soutenance" },
  { icon: Lightbulb, label: "Pitch d'un projet" },
  { icon: Handshake, label: "Négociation" },
  { icon: Mic, label: "Tout type d'oral" },
  { icon: Presentation, label: "Prise de parole en cours" },
  { icon: Users, label: "Animation d'atelier" },
];

const STATS = [
  { value: "75", unit: "%", label: "des gens craignent de parler en public" },
  { value: "3", unit: "x", label: "plus redoutable que la peur de la mort" },
  { value: "7", unit: "min", label: "suffisent pour convaincre un jury" },
];

export function Constat() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <Reveal className="panel px-5 py-14 sm:px-10 sm:py-16">
          <Eyebrow className="text-center text-gold">Le constat</Eyebrow>

          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-relaxed text-white/80 sm:text-xl">
            La prise de parole, on l&apos;imagine réservée aux grandes scènes et
            aux personnes d&apos;exception. La plupart des gens ne se sentent
            pas légitimes de prendre la parole, même quand ils en ont le droit,
            la compétence et les idées. Pourtant, savoir s&apos;exprimer avec
            clarté et confiance change tout dans la vie. Cette discipline est
            présente dans les domaines suivants, et bien plus encore&nbsp;:
          </p>

          <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2.5">
            {DOMAINES.map((d) => (
              <li
                key={d.label}
                className="inline-flex items-center gap-2 rounded-full border border-ember-600/70 bg-[linear-gradient(180deg,rgba(77,29,9,0.55),rgba(46,17,6,0.35))] px-4 py-2 text-[0.82rem] text-gold-300"
              >
                <d.icon size={14} strokeWidth={2} className="text-orange" />
                {d.label}
              </li>
            ))}
          </ul>

          <dl className="mt-14 grid gap-10 sm:grid-cols-3">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 120} className="text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="font-serif text-6xl italic text-orange sm:text-7xl">
                    {s.value}
                  </span>
                  <span className="font-serif text-3xl italic text-gold sm:text-4xl">
                    {s.unit}
                  </span>
                  <p className="mx-auto mt-3 max-w-[15rem] text-[0.95rem] leading-snug text-white/80">
                    {s.label}
                  </p>
                </dd>
              </Reveal>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
