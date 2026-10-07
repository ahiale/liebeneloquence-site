import type { Review } from "@/content/schema";
import { ReviewsCarousel } from "./ReviewsCarousel";

const AVATARS = [
  { bg: "#f6c6c6", fg: "#8a3030" },
  { bg: "#f7cf94", fg: "#7a4a08" },
  { bg: "#9fdcb6", fg: "#1c5c37" },
  { bg: "#c9d6ec", fg: "#0b3070" },
];

const initials = (author: string) =>
  author
    .replace(/\./g, "")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const c = AVATARS[index % AVATARS.length];
  return (
    <figure className="card-light m-0 flex w-[min(360px,82vw)] shrink-0 snap-start flex-col rounded-[26px] p-7">
      <p className="m-0 text-[17px] tracking-[3px] text-gold" aria-label={`${review.rating} étoiles sur 5`}>
        {"★".repeat(review.rating)}
      </p>
      <blockquote className="mx-0 mt-[18px] mb-0 flex-1 text-[14.7px] leading-[1.65] text-ink/78">« {review.text} »</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full text-[14px] font-bold" style={{ background: c.bg, color: c.fg }}>
          {initials(review.author)}
        </span>
        <span>
          <span className="block text-[14px] font-semibold">{review.author}</span>
          <span className="block text-[12px] text-ink/55">{review.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Carrousel des avis, que le visiteur fait défiler lui-même. La section n'apparaît que s'il y a des avis publiés. */
export function Temoignages({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-light overflow-hidden py-20 text-ink sm:py-28">
      <div className="wrap">
        <div className="relative text-center">
          <p className="eyebrow" style={{ color: "#CC4A00" }}>Ils ont travaillé avec moi</p>
          <h2 className="h2">
            Ce qu&apos;ils en <span className="text-orange">disent</span>
          </h2>
          <svg className="wiggle hide-sm absolute" width="62" height="50" viewBox="0 0 70 56" fill="none" aria-hidden="true" style={{ right: "20%", top: -6 }}>
            <path d="M10 6h50a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H32l-12 12V38H10a8 8 0 0 1-8-8V14a8 8 0 0 1 8-8z" stroke="#114DA8" strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M20 20h30M20 27h20" stroke="#FF5E01" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <ReviewsCarousel count={reviews.length}>
        {reviews.map((r, i) => (
          <ReviewCard key={r.id} review={r} index={i} />
        ))}
      </ReviewsCarousel>
    </section>
  );
}
