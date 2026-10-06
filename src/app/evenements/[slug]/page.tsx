import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  Wallet,
  Users,
  Target,
  ArrowLeft,
  ArrowRight,
  Check,
  CalendarCheck,
} from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Header } from "@/components/layout/Header";
import { EVENTS, getEvent } from "@/data/events";
import { SITE } from "@/data/site";

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: "Événement introuvable" };

  return {
    title: event.title,
    description: event.excerpt,
    openGraph: { title: event.title, description: event.excerpt },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const infos = [
    { icon: CalendarDays, label: "Date", value: event.dateLabel, tone: "text-gold" },
    { icon: Clock, label: "Heure", value: event.timeLabel, tone: "text-royal-200" },
    { icon: MapPin, label: "Lieu", value: event.place, tone: "text-orange" },
    { icon: Wallet, label: "Tarif", value: event.priceLabel, tone: "text-success-300" },
    { icon: Users, label: "Capacité", value: event.capacity, tone: "text-royal-200" },
    { icon: Target, label: "Niveau", value: event.level, tone: "text-gold" },
  ];

  const others = EVENTS.filter((e) => e.slug !== event.slug).slice(0, 2);

  return (
    <>
      <Header />

      <main className="bg-night pt-32 pb-24 sm:pt-40">
        <Container>
          <Link
            href="/evenements"
            className="inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} /> Tous les événements
          </Link>

          <Reveal className="panel mt-6 px-6 py-12 sm:px-10 sm:py-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-royal px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white">
              {event.kind}
            </span>

            <h1 className="h-section mt-7 text-4xl sm:text-[3rem]">
              {event.title}
            </h1>
            <p className="mt-6 max-w-3xl leading-relaxed text-white/72">
              {event.description}
            </p>

            <dl className="mt-10 grid gap-4 sm:grid-cols-2">
              {infos.map((info) => (
                <div
                  key={info.label}
                  className="flex items-start gap-4 rounded-[20px] border border-white/10 bg-white/6 p-5"
                >
                  <info.icon
                    size={20}
                    strokeWidth={1.9}
                    className={`mt-0.5 shrink-0 ${info.tone}`}
                  />
                  <div>
                    <dt className="text-[0.75rem] text-white/50">{info.label}</dt>
                    <dd className="mt-0.5 font-semibold leading-snug">
                      {info.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={SITE.calendly} external variant="primary" size="lg">
                <CalendarCheck size={17} /> Réserver ma place
              </ButtonLink>
              <ButtonLink href="/evenements#newsletter" variant="ghost" size="lg">
                Être prévenu des prochaines dates
              </ButtonLink>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <Reveal className="surface rounded-card p-7">
              <Eyebrow>Au programme</Eyebrow>
              <ul className="mt-6 space-y-4">
                {event.program.map((p, i) => (
                  <li key={p} className="flex gap-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold/14 text-[0.75rem] font-bold text-gold">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-[0.92rem] leading-snug text-white/78">
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={110} className="surface rounded-card p-7">
              <Eyebrow>Pour qui&nbsp;?</Eyebrow>
              <ul className="mt-6 space-y-4">
                {event.audience.map((a) => (
                  <li key={a} className="flex gap-3">
                    <Check
                      size={18}
                      strokeWidth={2.6}
                      className="mt-0.5 shrink-0 text-success-300"
                    />
                    <span className="text-[0.92rem] leading-snug text-white/78">
                      {a}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-8 rounded-[16px] border border-white/10 bg-white/5 p-5 text-[0.87rem] leading-relaxed text-white/62">
                Les places sont limitées à {event.capacity.toLowerCase()} pour
                garantir un temps de parole réel à chaque participant et un
                retour individuel.
              </p>
            </Reveal>
          </div>

          {others.length > 0 && (
            <section className="mt-16">
              <h2 className="h-section text-2xl sm:text-3xl">
                Les autres rendez-vous
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/evenements/${o.slug}`}
                    className="surface surface-hover group rounded-card p-6"
                  >
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/45">
                      {o.kind}
                    </p>
                    <h3 className="mt-2 text-lg font-bold tracking-[-0.02em]">
                      {o.title}
                    </h3>
                    <p className="mt-2 text-[0.85rem] text-white/58">
                      {o.dateLabel} · {o.priceLabel}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold">
                      Voir le détail
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </Container>
      </main>

    </>
  );
}
