"use client";

import { useState } from "react";
import {
  CalendarDays,
  MapPin,
  Users,
  ArrowRight,
  Check,
  Send,
  Lock,
  BellRing,
} from "lucide-react";
import { Container, Eyebrow, SectionTitle } from "@/components/ui/Section";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { EVENTS, FEATURED_EVENT, type EventCategory } from "@/data/events";

const FILTERS: { label: string; value: EventCategory | "tous" }[] = [
  { label: "Tous", value: "tous" },
  { label: "Ateliers", value: "atelier" },
  { label: "Concours", value: "concours" },
];

const NEWSLETTER_POINTS = [
  "Accès prioritaire aux événements",
  "Conseils & exercices oratoires exclusifs",
  "Ressources gratuites en avant-première",
  "Actualités et coulisses du projet LEQ",
  "Pas de spam, désinscription possible en un clic",
];

export function EvenementsPage() {
  const [filter, setFilter] = useState<EventCategory | "tous">("tous");
  const [subscribed, setSubscribed] = useState(false);

  const visible =
    filter === "tous" ? EVENTS : EVENTS.filter((e) => e.category === filter);

  return (
    <>
      {/* Séquence sombre continue : un seul dégradé pour hero + événements. */}
      <div className="bg-night">
        {/* ------------------------------------------------------------ Hero */}
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-20">
          <Container className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="reveal">
              <h1 className="h-section text-5xl sm:text-6xl">
                Événements &amp;
                <br />
                <span className="text-warm">Actualités</span>
              </h1>
              <p className="mt-6 max-w-lg leading-relaxed text-white/65">
                Progressez à chaque prise de parole en participant à nos
                ateliers, conférences et formations collectives. Profitez de
                l&apos;expertise de professionnels pour gagner en confiance à
                l&apos;oral.
              </p>
            </div>

            <div className="reveal flex justify-center lg:justify-end">
              <CalendarEmblem />
            </div>
          </Container>
        </section>

        {/* --------------------------------------------- Événement à la une */}
        <section className="pb-20">
          <Container>
            <Reveal className="panel px-6 py-12 text-center sm:px-12 sm:py-14">
              <span className="inline-flex items-center gap-2 rounded-full bg-royal px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white">
                <BellRing size={13} /> Prochain événement
              </span>

              <h2 className="h-section mx-auto mt-7 max-w-3xl text-3xl sm:text-[2.6rem]">
                {FEATURED_EVENT.title}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/70">
                {FEATURED_EVENT.excerpt}
              </p>
              <p className="mt-7 text-3xl font-bold tracking-[-0.035em] text-orange sm:text-4xl">
                {FEATURED_EVENT.dateLabel}
              </p>

              <ButtonLink
                href={`/evenements/${FEATURED_EVENT.slug}`}
                variant="primary"
                size="lg"
                className="mt-9"
              >
                Voir plus de détails <ArrowRight size={17} />
              </ButtonLink>
            </Reveal>
          </Container>
        </section>

        {/* ------------------------------------------------ Liste + filtres */}
        <section className="pb-24">
          <Container>
            <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow>Prochainement</Eyebrow>
                <SectionTitle>Événements à venir</SectionTitle>
              </div>

              <div
                role="group"
                aria-label="Filtrer les événements"
                className="flex gap-2.5"
              >
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    aria-pressed={filter === f.value}
                    onClick={() => setFilter(f.value)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                      filter === f.value
                        ? "border-white/25 bg-white/14 text-white"
                        : "border-white/12 bg-white/5 text-white/55 hover:bg-white/10 hover:text-white/85"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </Reveal>

            {visible.length === 0 ? (
              <p className="mt-12 rounded-card border border-white/10 bg-white/4 p-10 text-center text-white/55">
                Aucun événement dans cette catégorie pour le moment.
                Inscrivez-vous à la newsletter pour être prévenu en premier.
              </p>
            ) : (
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visible.map((e, i) => (
                  <Reveal
                    key={e.slug}
                    delay={(i % 3) * 100}
                    as="article"
                    className="surface surface-hover flex flex-col overflow-hidden rounded-card"
                  >
                    <div className="relative grid h-36 place-items-center bg-[radial-gradient(420px_180px_at_50%_120%,rgba(17,77,168,0.75),rgba(4,25,60,0.2))]">
                      <span className="absolute right-4 top-4 rounded-full border border-white/18 bg-ink/60 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/75">
                        À venir
                      </span>
                      <CardMark />
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/45">
                        {e.kind}
                      </p>
                      <h3 className="mt-2 text-xl font-bold leading-snug tracking-[-0.025em]">
                        {e.title}
                      </h3>
                      <p className="mt-3 text-[0.85rem] leading-relaxed text-white/60">
                        {e.excerpt}
                      </p>

                      <ul className="mt-5 space-y-2.5 text-[0.83rem] text-white/72">
                        <li className="flex items-center gap-2.5">
                          <CalendarDays
                            size={15}
                            className="shrink-0 text-gold"
                          />
                          {e.dateLabel}
                        </li>
                        <li className="flex items-center gap-2.5">
                          <MapPin size={15} className="shrink-0 text-orange" />
                          {e.place}
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Users
                            size={15}
                            className="shrink-0 text-royal-200"
                          />
                          {e.timeLabel}
                        </li>
                      </ul>

                      {/* `mt-auto` aligne prix et bouton en bas de carte, quelle que
                          soit la longueur du texte au-dessus. */}
                      <p className="mt-auto pt-6 text-2xl font-bold tracking-[-0.03em] text-royal-200">
                        {e.priceLabel}
                      </p>

                      <ButtonLink
                        href={`/evenements/${e.slug}`}
                        variant="royal"
                        size="lg"
                        className="mt-5 w-full"
                      >
                        Voir plus
                      </ButtonLink>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </Container>
        </section>
      </div>

      {/* ------------------------------------------------------ Newsletter */}
      <section id="newsletter" className="bg-light py-20 text-ink sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <Eyebrow className="text-royal">Restez informés</Eyebrow>
            <SectionTitle>
              La newsletter
              <br />
              <span className="text-royal">LEQ.</span>
            </SectionTitle>
            <p className="mt-6 max-w-md leading-relaxed text-ink/70">
              Les dates d&apos;ateliers en avant-première, les ressources
              gratuites, les conseils oratoires et les annonces importantes,
              directement dans votre boîte mail.
            </p>

            <ul className="mt-8 space-y-3">
              {NEWSLETTER_POINTS.map((p) => (
                <li key={p} className="flex gap-3 text-[0.92rem] text-ink/78">
                  <Check
                    size={18}
                    strokeWidth={2.6}
                    className="mt-0.5 shrink-0 text-success"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={120}
            className="rounded-[26px] bg-[linear-gradient(168deg,#114da8,#01143a)] p-7 shadow-[0_44px_90px_-45px_rgba(0,22,54,0.9)] sm:p-8"
          >
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-white">
              S&apos;inscrire à la newsletter
            </h2>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-white/65">
              Quelques secondes suffisent. Garantie zéro spam, que du contenu
              utile.
            </p>

            {subscribed ? (
              <div className="mt-8 flex flex-col items-center gap-3 rounded-[18px] border border-gold/30 bg-gold/10 px-6 py-14 text-center">
                <Check size={38} className="text-gold" />
                <p className="font-semibold text-white">
                  Inscription confirmée
                </p>
                <p className="text-sm text-white/65">
                  Vous recevrez les prochaines dates en avant-première.
                </p>
              </div>
            ) : (
              <form
                className="mt-7 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
              >
                <div>
                  <label className="field-label" htmlFor="nl-nom">
                    Votre prénom &amp; nom
                  </label>
                  <input
                    id="nl-nom"
                    name="nom"
                    className="field"
                    placeholder="Ex : Marie Dupont"
                    required
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="nl-email">
                    Votre email
                  </label>
                  <input
                    id="nl-email"
                    name="email"
                    type="email"
                    className="field"
                    placeholder="vous@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="nl-profil">
                    Votre profil (optionnel)
                  </label>
                  <select id="nl-profil" name="profil" className="field">
                    <option value="">Sélectionner</option>
                    <option>Lycéen(ne) · Terminale</option>
                    <option>Étudiant(e)</option>
                    <option>Professionnel(le)</option>
                    <option>Établissement scolaire</option>
                  </select>
                </div>

                <div>
                  <label className="field-label" htmlFor="nl-theme">
                    Thématiques qui vous intéressent (optionnel)
                  </label>
                  <select id="nl-theme" name="theme" className="field">
                    <option value="">Sélectionner</option>
                    <option>Gestion du trac</option>
                    <option>Structuration du discours</option>
                    <option>Voix & non-verbal</option>
                    <option>Improvisation</option>
                    <option>Concours d&apos;éloquence</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <Send size={17} /> Je m&apos;inscris
                </Button>

                <p className="flex items-center justify-center gap-2 text-center text-[0.78rem] text-white/55">
                  <Lock size={13} /> Vos données restent confidentielles.
                  Désinscription à tout moment.
                </p>
              </form>
            )}
          </Reveal>
        </Container>
      </section>
    </>
  );
}

/* ------------------------------------------------------- Illustrations */

/** Calendrier vectoriel du hero — remplace l'illustration emoji. */
function CalendarEmblem() {
  return (
    <div className="relative w-full max-w-[340px]">
      <div
        aria-hidden
        className="absolute inset-6 rounded-full bg-royal/45 blur-[70px]"
      />
      <svg
        viewBox="0 0 320 300"
        fill="none"
        role="img"
        aria-label="Calendrier des événements LEQ"
        className="relative w-full floaty"
      >
        <defs>
          <linearGradient id="ev-body" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#EEF2FB" />
            <stop offset="100%" stopColor="#B9C6DE" />
          </linearGradient>
          <linearGradient id="ev-head" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3D74CD" />
            <stop offset="100%" stopColor="#114DA8" />
          </linearGradient>
          <linearGradient id="ev-bell" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFD08A" />
            <stop offset="100%" stopColor="#FF5E01" />
          </linearGradient>
        </defs>

        <rect
          x="34"
          y="40"
          width="210"
          height="196"
          rx="26"
          fill="url(#ev-body)"
        />
        <path
          d="M34 66a26 26 0 0 1 26-26h158a26 26 0 0 1 26 26v26H34V66Z"
          fill="url(#ev-head)"
        />
        <rect x="76" y="20" width="15" height="42" rx="7.5" fill="#8D9CB6" />
        <rect x="187" y="20" width="15" height="42" rx="7.5" fill="#8D9CB6" />

        {/* grille de jours */}
        <g fill="#8FA1C0">
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3, 4].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={58 + c * 34}
                y={114 + r * 30}
                width="22"
                height="18"
                rx="5"
                opacity={r === 2 && c === 2 ? 0 : 0.55}
              />
            )),
          )}
        </g>
        <rect x="126" y="174" width="22" height="18" rx="5" fill="#FF5E01" />

        {/* cloche */}
        <g transform="translate(196 148)">
          <path
            d="M40 62c0-6-4-8-4-20 0-16-10-28-24-28S-12 26-12 42c0 12-4 14-4 20 0 4 3 6 8 6h40c5 0 8-2 8-6Z"
            fill="url(#ev-bell)"
          />
          <path d="M4 74c1 7 6 12 12 12s11-5 12-12H4Z" fill="#E8A21A" />
        </g>
      </svg>
    </div>
  );
}

/** Marque décorative des cartes d'événement. */
function CardMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" aria-hidden>
      <defs>
        <linearGradient id="ev-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD08A" />
          <stop offset="100%" stopColor="#FF5E01" />
        </linearGradient>
      </defs>
      <path
        d="M32 10 58 22 32 34 6 22 32 10Z"
        fill="#8FA1C0"
        fillOpacity="0.55"
      />
      <path
        d="M18 28v10c0 5 6 9 14 9s14-4 14-9V28l-14 6-14-6Z"
        fill="#5C6E90"
        fillOpacity="0.75"
      />
      <path
        d="M54 24v14"
        stroke="url(#ev-mark)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <circle cx="54" cy="42" r="4.6" fill="url(#ev-mark)" />
    </svg>
  );
}
