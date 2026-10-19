import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { getArticles } from "@/content";
import { formatDate } from "@/lib/format";
import { Header } from "@/components/layout/Header";
import { DrawUnderline, Sparkle } from "@/components/ui/Doodles";

export const metadata: Metadata = pageMeta({
  title: "Blog éloquence et prise de parole",
  description: "Conseils, exercices et méthodes pour progresser en prise de parole en public et en éloquence, par Lieben Éloquence.",
  path: "/blog",
});

export default async function BlogPage() {
  const articles = await getArticles();
  return (
    <>
      <div className="bg-hero">
        <Header />
        <section className="relative pt-10 pb-16 text-center sm:pt-16 sm:pb-20">
          <div className="wrap relative">
            <Sparkle className="wiggle hide-sm absolute" size={46} style={{ left: "16%", top: 0 }} />
            <p className="eyebrow">Le blog</p>
            <h1 className="mt-5 mb-0 leading-[1.02] font-bold tracking-[-0.04em] text-white" style={{ fontSize: "clamp(40px, 8vw, 62px)" }}>
              Bien parler, <span className="serif text-gold">ça s&apos;apprend.</span>
            </h1>
            <DrawUnderline className="hide-sm" style={{ margin: "4px auto 0", transform: "translateX(110px)" }} />
            <p className="mx-auto mt-[22px] mb-0 max-w-[560px] text-[17px] leading-[1.7] text-white/85">Conseils, exercices et méthodes pour progresser à l&apos;oral.</p>
          </div>
        </section>
      </div>

      <main className="bg-light py-16 text-ink sm:py-24">
        <div className="wrap grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(320px,100%),1fr))" }}>
          {articles.map((a) => (
            <article key={a.slug} className="sticker relative flex flex-col overflow-hidden p-0">
              {a.image && (
                <div className="relative" style={{ aspectRatio: "16 / 10" }}>
                  <Image src={a.image} alt="" fill sizes="380px" style={{ objectFit: "cover" }} />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <p className="m-0 text-[12px] font-bold tracking-[.14em] text-royal uppercase">
                  {formatDate(a.date)} · {a.readingMinutes} min de lecture
                </p>
                <h2 className="mt-2 mb-0 text-[22px] leading-[1.25] font-bold tracking-[-0.02em]">
                  <Link href={`/blog/${a.slug}`} className="no-underline after:absolute after:inset-0 after:content-['']">
                    {a.title}
                  </Link>
                </h2>
                <p className="mt-3 mb-0 flex-1 text-[15px] leading-[1.6] text-ink/70">{a.description}</p>
                <span className="mt-5 text-[15px] font-semibold text-orange" aria-hidden="true">
                  Lire l&apos;article →
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
