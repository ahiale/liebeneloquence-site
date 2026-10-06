import Image from "next/image";
import Link from "next/link";
import type { LeqEvent } from "@/content/schema";

/** Carte d'un événement : toute la carte mène à la page détail. */
export function EventCard({ event }: { event: LeqEvent }) {
  const href = `/evenements/${event.slug}`;
  return (
    <article className="sticker relative flex flex-col overflow-hidden p-0">
      <div className="relative flex items-center justify-center bg-cloud text-[13px] font-semibold text-ink/50" style={{ aspectRatio: "16 / 10" }}>
        {event.image ? <Image src={event.image} alt="" fill sizes="380px" style={{ objectFit: "cover" }} /> : "Photo de l'événement"}
        {event.badge && (
          <span className="absolute top-3.5 left-3.5 rounded-full bg-orange px-3 py-1 text-[11px] font-bold tracking-[.12em] text-white uppercase">{event.badge}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {event.type && <p className="m-0 text-[11px] font-bold tracking-[.18em] text-royal uppercase">{event.type}</p>}
        <h3 className="m-0 text-[28px] font-bold tracking-[-0.03em] text-royal">
          {/* Lien étendu : rend toute la carte cliquable */}
          <Link href={href} className="no-underline after:absolute after:inset-0 after:content-['']">
            {event.title ?? event.dateLabel}
          </Link>
        </h3>
        {event.title && <p className="mt-1 mb-0 text-[15px] font-semibold text-ink/70">{event.dateLabel}</p>}
        <p className="mt-2 mb-0 flex-1 text-[15px] leading-[1.6] text-ink/70">{event.summary}</p>
        <span className="btn btn-p mt-5" aria-hidden="true">
          {event.registrationUrl ? (event.registrationLabel ?? "S'inscrire") : "En savoir plus"}
        </span>
      </div>
    </article>
  );
}
