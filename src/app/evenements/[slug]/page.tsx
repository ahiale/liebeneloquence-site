import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent, getEvents } from "@/content";
import { Header } from "@/components/layout/Header";
import { ArrowLeft, Check, DrawUnderline, Sparkle } from "@/components/ui/Doodles";
import { Icon, type IconName } from "@/components/ui/Icons";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  if (!event) return {};
  return {
    title: event.title ? `${event.title} · ${event.dateLabel}` : `Événement LEQ · ${event.dateLabel}`,
    description: event.summary,
    alternates: { canonical: `/evenements/${event.slug}` },
    openGraph: event.image ? { images: [event.image] } : undefined,
  };
}

export default async function EvenementPage({ params }: Props) {
  const event = await getEvent((await params).slug);
  if (!event) notFound();

  const infos: { icon: IconName; label: string; value: string | null }[] = [
    { icon: "calendar", label: "Date", value: event.dateLabel },
    { icon: "clock", label: "Horaires", value: event.timeLabel },
    { icon: "mapPin", label: "Lieu", value: event.location },
    { icon: "ticket", label: "Tarif", value: event.priceLabel },
  ];

  // Données structurées pour Google (uniquement si la date est connue)
  const jsonLd = event.startsAt
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title ?? `Événement LEQ ${event.dateLabel}`,
        startDate: event.startsAt,
        description: event.summary,
        location: event.location ? { "@type": "Place", name: event.location, address: event.location } : undefined,
        organizer: { "@type": "Organization", name: "Lieben Éloquence", url: "https://liebeneloquence.com" },
      }
    : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <div className="bg-hero">
        <Header />
        <section className="wrap pt-6 pb-20 sm:pt-10 sm:pb-24">
          <Link href="/evenements" className="inline-flex items-center gap-2 text-[14px] text-white/80 no-underline hover:text-white">
            <ArrowLeft /> Tous les événements
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-10">
            <div className="relative min-w-0" style={{ flex: "1.1 1 460px" }}>
              <div className="flex flex-wrap gap-2">
                {event.type && <span className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold tracking-[.16em] text-royal uppercase">{event.type}</span>}
                {event.badge && <span className="rounded-full bg-orange px-3.5 py-1.5 text-[11px] font-bold tracking-[.16em] text-white uppercase">{event.badge}</span>}
              </div>
              <h1 className="mt-5 mb-0 leading-[1.05] font-bold tracking-[-0.035em] text-white" style={{ fontSize: "clamp(38px, 7vw, 58px)" }}>
                {event.title ?? <span className="serif text-gold">{event.dateLabel}</span>}
              </h1>
              <DrawUnderline style={{ marginTop: 4 }} />
              <p className="mt-5 mb-0 max-w-[540px] text-[17px] leading-[1.7] text-white/88">{event.summary}</p>
            </div>
            <div className="relative min-w-0" style={{ flex: ".9 1 320px" }}>
              <Sparkle className="wiggle hide-sm absolute z-[2]" size={44} style={{ top: -22, right: -10 }} />
              <div className="relative overflow-hidden rounded-[26px] border-4 border-white bg-cloud" style={{ aspectRatio: "16 / 10", boxShadow: "0 30px 60px -20px rgba(0,22,54,.6)" }}>
                {event.image ? (
                  <Image src={event.image} alt="" fill priority sizes="(max-width: 760px) 90vw, 460px" style={{ objectFit: "cover" }} />
                ) : (
                  <span className="flex h-full items-center justify-center text-[13px] font-semibold text-ink/50">Photo de l&apos;événement</span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <main className="bg-light py-16 text-ink sm:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="grid gap-4">
              {event.description.map((para) => (
                <p key={para} className="m-0 text-[16px] leading-[1.75] text-ink/80">{para}</p>
              ))}
            </div>
            {event.speakers.length > 0 && (
              <>
                <h2 className="mt-12 mb-0 text-[26px] font-bold tracking-[-0.03em]">
                  {event.speakers.length > 1 ? "Deux voix," : "Avec"} <span className="serif text-royal">{event.speakers.length > 1 ? "deux expertises." : event.speakers[0].name}</span>
                </h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {event.speakers.map((sp, i) => (
                    <article key={sp.name} className="bubble flex flex-col p-6" style={{ transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}>
                      <div className="flex items-center gap-3.5">
                        {sp.image ? (
                          <Image src={sp.image} alt={sp.name} width={56} height={56} className="h-14 w-14 shrink-0 rounded-full object-cover" style={{ objectPosition: "50% 20%" }} />
                        ) : (
                          <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold text-[22px] font-bold text-ink">
                            {sp.name.charAt(0)}
                          </span>
                        )}
                        <div>
                          <p className="m-0 text-[18px] font-bold tracking-[-0.015em]">{sp.name}</p>
                          <p className="serif m-0 text-[20px] text-orange">{sp.role}</p>
                        </div>
                      </div>
                      <ul className="mt-4 mb-0 grid list-none gap-2.5 p-0">
                        {sp.focus.map((f) => (
                          <li key={f} className="flex gap-2.5 text-[14.5px] leading-[1.5] text-ink/78">
                            <Check />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </>
            )}
            {event.includes.length > 0 && (
              <>
                <h2 className="mt-12 mb-0 text-[26px] font-bold tracking-[-0.03em]">
                  Ce que vous <span className="serif text-royal">recevez</span>
                </h2>
                <ul className="mt-5 mb-0 flex list-none flex-wrap gap-2.5 p-0">
                  {event.includes.map((inc) => (
                    <li key={inc} className="rounded-full px-[18px] py-[9px] text-[14px] font-semibold text-ink" style={{ background: "linear-gradient(96deg,#FFBD59,#FF5E01)" }}>
                      {inc}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {event.program.length > 0 && (
              <>
                <h2 className="mt-12 mb-0 text-[26px] font-bold tracking-[-0.03em]">
                  Au <span className="serif text-royal">programme</span>
                </h2>
                <ol className="mt-5 mb-0 grid list-none gap-3 p-0">
                  {event.program.map((step, i) => {
                    // « 18h30 · Accueil » : l'horaire s'affiche dans la pastille
                    const timed = step.match(/^(\d{1,2}h\d{0,2})\s*·\s*(.+)$/);
                    return (
                      <li key={step} className="flex items-start gap-4 rounded-[18px] bg-white p-4" style={{ boxShadow: "0 20px 40px -32px rgba(0,22,54,.6)" }}>
                        <span className={`flex h-9 shrink-0 items-center justify-center rounded-full bg-gold font-bold ${timed ? "min-w-[64px] px-3 text-[14px]" : "w-9 text-[15px]"}`}>{timed ? timed[1] : i + 1}</span>
                        <span className="pt-1.5 text-[15px] text-ink/80">{timed ? timed[2] : step}</span>
                      </li>
                    );
                  })}
                </ol>
              </>
            )}
            {event.audience.length > 0 && (
              <>
                <h2 className="mt-12 mb-0 text-[26px] font-bold tracking-[-0.03em]">
                  Pour <span className="serif text-royal">qui ?</span>
                </h2>
                <ul className="mt-5 mb-0 grid list-none gap-3 p-0">
                  {event.audience.map((a) => (
                    <li key={a} className="flex gap-3 text-[15px] text-ink/80">
                      <Check />
                      {a}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="h-fit rounded-[26px] p-7 text-white lg:sticky lg:top-6" style={{ background: "linear-gradient(165deg,#04193c,#0e3f8b)", boxShadow: "0 44px 80px -44px rgba(0,22,54,.85)" }}>
            <p className="eyebrow">Infos pratiques</p>
            <dl className="mt-5 mb-0 grid gap-4">
              {infos.map((i) => (
                <div key={i.label} className="flex items-start gap-3">
                  <span className="tile h-10 w-10 rounded-full bg-white/10 text-gold">
                    <Icon name={i.icon} size={18} />
                  </span>
                  <div>
                    <dt className="text-[12px] text-white/55">{i.label}</dt>
                    <dd className="m-0 text-[15px] font-semibold">{i.value ?? "Bientôt annoncé"}</dd>
                  </div>
                </div>
              ))}
            </dl>
            {event.registrationUrl ? (
              event.registrationUrl.startsWith("/") ? (
                <Link className="btn btn-p mt-7 w-full" href={event.registrationUrl}>
                  {event.registrationLabel ?? "S'inscrire"}
                </Link>
              ) : (
                <a className="btn btn-p mt-7 w-full" href={event.registrationUrl} target="_blank" rel="noreferrer noopener">
                  {event.registrationLabel ?? "S'inscrire"}
                </a>
              )
            ) : (
              <Link className="btn btn-p mt-7 w-full" href="/evenements#newsletter">
                Être prévenu
              </Link>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
