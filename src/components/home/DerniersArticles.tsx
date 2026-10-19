import Link from "next/link";
import type { Article } from "@/content/schema";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Star } from "@/components/ui/Doodles";

/** Accueil : les 3 derniers articles du blog. */
export function DerniersArticles({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return (
    <section className="bg-light py-20 text-ink sm:py-28">
      <div className="wrap">
        <div className="reveal relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow" style={{ color: "#114DA8" }}>Le blog</p>
            <h2 className="h2">
              Conseils et exercices <span className="serif text-royal">pour bien parler</span>
            </h2>
          </div>
          <Link href="/blog" className="btn btn-o">
            Tous les articles
          </Link>
          <Star className="wiggle hide-sm absolute" style={{ right: "30%", top: -10 }} />
        </div>
        <div className="mt-12 grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(320px,100%),1fr))" }}>
          {articles.slice(0, 3).map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
