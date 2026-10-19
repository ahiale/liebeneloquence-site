import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/content/schema";
import { formatDate } from "@/lib/format";

/** Carte d'un article (page Blog et accueil) : toute la carte mène à l'article. */
export function ArticleCard({ article: a }: { article: Article }) {
  return (
    <article className="sticker relative flex flex-col overflow-hidden p-0">
      {a.image && (
        <div className="relative" style={{ aspectRatio: "16 / 10" }}>
          <Image src={a.image} alt="" fill sizes="380px" style={{ objectFit: "cover" }} />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="m-0 text-[12px] font-bold tracking-[.14em] text-royal uppercase">
          {formatDate(a.date)} · {a.readingMinutes} min de lecture
        </p>
        <h3 className="mt-2 mb-0 text-[22px] leading-[1.25] font-bold tracking-[-0.02em] text-ink">
          {/* Lien étendu : rend toute la carte cliquable */}
          <Link href={`/blog/${a.slug}`} className="no-underline after:absolute after:inset-0 after:content-['']">
            {a.title}
          </Link>
        </h3>
        <p className="mt-3 mb-0 flex-1 text-[15px] leading-[1.6] text-ink/70">{a.description}</p>
        <span className="mt-5 text-[15px] font-semibold text-orange" aria-hidden="true">
          Lire l&apos;article →
        </span>
      </div>
    </article>
  );
}
