import {
  Mic,
  Check,
  CalendarCheck,
  ArrowDown,
  GraduationCap,
  ClipboardList,
  Trophy,
  FileText,
  Lightbulb,
  Brain,
  HeartPulse,
  Presentation,
  MessageCircleQuestion,
  Timer,
  Flame,
  BookOpenCheck,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { BackHeader } from "@/components/layout/BackHeader";
import { Footer } from "@/components/layout/Footer";
import { GRAND_ORAL } from "@/data/packs";
import { SITE } from "@/data/site";

const TAGS: { icon: LucideIcon; label: string }[] = [
  { icon: GraduationCap, label: "Grand Oral BAC" },
  { icon: ClipboardList, label: "Oral de BTS" },
  { icon: Trophy, label: "Concours d'éloquence" },
  { icon: FileText, label: "Soutenance" },
  { icon: Lightbulb, label: "Pitch" },
  { icon: Mic, label: "Tout type d'oral" },
];

const COMPETENCES: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Brain,
    title: "Structuration du discours",
    desc: "Construire un plan clair, logique et mémorable en peu de temps. Aller à l'essentiel sans se perdre.",
  },
  {
    icon: HeartPulse,
    title: "Gestion du trac",
    desc: "Des techniques concrètes pour calmer le stress avant et pendant l'oral, et transformer la pression en énergie positive.",
  },
  {
    icon: Presentation,
    title: "Verbal & non-verbal",
    desc: "Aligner la voix, le corps et les mots. Occuper l'espace avec intention et naturel.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Réponses aux questions",
    desc: "Répondre aux questions du jury avec calme, précision et assurance, même à l'improviste.",
  },
  {
    icon: Timer,
    title: "Gestion du temps",
    desc: "Respecter les contraintes de temps sans se précipiter ni s'embourber. Rythme et fluidité.",
  },
  {
    icon: Flame,
    title: "Présence & impact",
    desc: "Créer une connexion avec le jury dès les premières secondes. Marquer les esprits, pas juste remplir le temps.",
  },
  {
    icon: BookOpenCheck,
    title: "Maîtrise du fond",
    desc: "Consolider le contenu, identifier les angles forts et les faiblesses à corriger avant le jour J.",
  },
  {
    icon: Target,
    title: "Mise en situation réelle",
    desc: "Simulation complète des conditions de l'oral, avec feedback détaillé et axes d'amélioration précis.",
  },
];

const SEANCES = [
  {
    n: 1,
    color: "#d64550",
    title: "Diagnostic & structuration",
    desc: "On commence par un tour complet de votre situation : quel oral, quel niveau, quels blocages. Puis on structure ensemble le fond de votre discours : plan, arguments, accroche, conclusion.",
    tags: ["Grand Oral BAC", "Analyse du sujet", "Construction du plan", "Travail de l'accroche"],
  },
  {
    n: 2,
    color: "#e6a01f",
    title: "Forme, corps & présence",
    desc: "On travaille la livraison : voix, posture, regard, gestes, rythme. Des exercices pratiques pour incarner le discours plutôt que le réciter. Exercices de gestion du trac inclus.",
    tags: ["Travail de la voix", "Langage corporel", "Exercices anti-trac", "Improvisation encadrée"],
  },
  {
    n: 3,
    color: "#25b569",
    title: "Mise en situation & feedback",
    desc: "Simulation complète dans les conditions réelles de l'oral. Feedback détaillé, relecture finale, préparation aux questions du jury et conseils de dernière minute.",
    tags: ["Simulation complète", "Questions du jury", "Feedback personnalisé", "Conseils J-1"],
  },
];

export function GrandOralPage() {
  return (
    <>
      <div className="bg-ember relative">
        <BackHeader />

        <Container className="relative grid items-center gap-10 pt-32 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-40 lg:pb-28">
          <div className="reveal">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange/35 bg-orange/10 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gold">
              <Mic size={14} /> Offre exclusive LEQ
            </span>

            <h1 className="mt-7 text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
              L&apos;offre
              <br />
              <span className="font-serif text-[1.12em] font-normal italic tracking-normal text-orange">
                GRAND ORAL
              </span>
            </h1>

            <p className="mt-7 max-w-lg leading-relaxed text-white/70">
              Découvrez les méthodes et les outils qui vous permettront de
              réussir n&apos;importe quelle présentation orale face à un jury,
              en travaillant à la fois le fond de votre discours et la qualité
              de votre prestation.
            </p>

            <ul className="mt-7 flex flex-wrap gap-2.5">
              {TAGS.map((t) => (
                <li
                  key={t.label}
                  className="inline-flex items-center gap-2 rounded-full border border-ember-600 bg-ember/60 px-3.5 py-1.5 text-[0.8rem] text-gold-300"
                >
                  <t.icon size={13} className="text-orange" />
                  {t.label}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={SITE.calendly} external variant="primary" size="lg">
                <CalendarCheck size={17} /> Réserver ma séance
              </ButtonLink>
              <ButtonLink href="#deroule" variant="ghost" size="lg">
                Voir le déroulé <ArrowDown size={17} />
              </ButtonLink>
            </div>
          </div>

          {/* Carte tarifaire */}
          <Reveal className="overflow-hidden rounded-[26px] border border-orange/25 bg-[linear-gradient(170deg,rgba(46,17,6,0.92),rgba(20,7,4,0.92))] shadow-[0_44px_90px_-45px_rgba(0,0,0,0.95)]">
            <div className="h-1 w-full bg-[linear-gradient(90deg,var(--color-gold),var(--color-orange))]" />
            <div className="p-7 sm:p-8">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-orange">
                Offre Grand Oral
              </p>
              <h2 className="mt-2.5 text-3xl font-bold tracking-[-0.035em]">
                {GRAND_ORAL.sessions}
              </h2>
              <p className="mt-1.5 text-[0.85rem] text-white/55">
                {GRAND_ORAL.duration}
              </p>

              <p className="mt-6 flex items-baseline text-orange">
                <span className="text-2xl font-semibold">€</span>
                <span className="text-6xl font-bold tracking-[-0.045em]">
                  {GRAND_ORAL.price}
                </span>
              </p>
              <p className="mt-1.5 text-[0.8rem] text-white/50">
                {GRAND_ORAL.installment}
              </p>

              <hr className="my-7 border-white/10" />

              <ul className="space-y-3.5">
                {GRAND_ORAL.includes.map((f) => (
                  <li key={f} className="flex gap-3 text-[0.9rem] text-white/85">
                    <Check
                      size={17}
                      strokeWidth={2.6}
                      className="mt-0.5 shrink-0 text-success-300"
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <ButtonLink
                href={SITE.calendly}
                external
                variant="primary"
                size="lg"
                className="mt-8 w-full"
              >
                Je réserve sur Calendly
              </ButtonLink>
            </div>
          </Reveal>
        </Container>

        {/* Compétences travaillées */}
        <Container className="relative pb-24">
          <Reveal>
            <Eyebrow className="text-success-300">
              Ce que vous allez développer
            </Eyebrow>
            <h2 className="h-section mt-4 text-4xl sm:text-[2.9rem]">
              Les compétences travaillées.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {COMPETENCES.map((c, i) => (
              <Reveal
                key={c.title}
                delay={(i % 2) * 90}
                className="flex items-start gap-4 rounded-[22px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-success/14 text-success-300 ring-1 ring-success/30">
                  <c.icon size={20} strokeWidth={1.9} />
                </span>
                <div>
                  <h3 className="font-semibold tracking-[-0.02em]">{c.title}</h3>
                  <p className="mt-1 text-[0.85rem] leading-relaxed text-white/60">
                    {c.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </div>

      {/* Déroulé des séances */}
      <section id="deroule" className="bg-light py-20 text-ink sm:py-28">
        <Container>
          <Reveal>
            <Eyebrow className="text-royal">Comment ça se passe&nbsp;?</Eyebrow>
            <h2 className="h-section mt-4 text-4xl sm:text-[2.9rem]">
              Le déroulé des <span className="text-orange">3 séances.</span>
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-ink/65">
              Trois temps forts, répétés et approfondis sur les cinq séances de
              l&apos;offre, pour couvrir le fond, la forme et la mise en
              situation réelle.
            </p>
          </Reveal>

          <ol className="mt-14 space-y-10">
            {SEANCES.map((s, i) => (
              <Reveal
                key={s.n}
                delay={i * 110}
                as="li"
                className="relative flex gap-6 sm:gap-8"
              >
                <div className="flex flex-col items-center">
                  <span
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 bg-white text-2xl font-bold"
                    style={{ borderColor: s.color, color: s.color }}
                  >
                    {s.n}
                  </span>
                  {i < SEANCES.length - 1 && (
                    <span
                      aria-hidden
                      className="mt-2 w-px flex-1 bg-ink/12"
                    />
                  )}
                </div>

                <div className="pb-4">
                  <h3
                    className="text-xl font-bold tracking-[-0.025em]"
                    style={{ color: s.color }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-2xl leading-relaxed text-ink/70">
                    {s.desc}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full px-3.5 py-1.5 text-[0.78rem] font-medium"
                        style={{ background: `${s.color}1f`, color: s.color }}
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* CTA final */}
      <section className="bg-night py-20 sm:py-24">
        <Container>
          <Reveal className="panel px-6 py-16 text-center sm:px-10">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-[20px] bg-gold/14 text-gold ring-1 ring-gold/30">
              <Mic size={30} strokeWidth={1.8} />
            </span>
            <h2 className="h-section mt-8 text-4xl sm:text-[2.9rem]">
              Votre oral approche.
              <br />
              <span className="text-warm">On démarre&nbsp;?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg leading-relaxed text-white/65">
              {GRAND_ORAL.sessions}, sans diagnostic préalable&nbsp;: on rentre
              directement dans le vif du sujet.
            </p>
            <ButtonLink
              href={SITE.calendly}
              external
              variant="primary"
              size="lg"
              className="mt-9"
            >
              <CalendarCheck size={18} /> Réserver ma séance
            </ButtonLink>
          </Reveal>
        </Container>
      </section>

      <Footer />
    </>
  );
}
