import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleLd, JsonLd, pageMeta } from "@/lib/seo";
import { getArticle, getArticles } from "@/content";
import type { Article } from "@/content/schema";
import { formatDate } from "@/lib/format";
import { SITE } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { ArrowLeft, Check, DrawUnderline } from "@/components/ui/Doodles";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getArticle((await params).slug);
  if (!a) return {};
  return { ...pageMeta({ title: a.title, description: a.description, path: `/blog/${a.slug}`, image: a.image }), keywords: a.keywords };
}

/** Un bloc de l'article (voir ArticleSchema). */
function Bloc({ bloc }: { bloc: Article["blocks"][number] }) {
  switch (bloc.type) {
    case "h2":
      return <h2 className="mt-12 mb-0 text-[28px] leading-[1.2] font-bold tracking-[-0.03em]">{bloc.text}</h2>;
    case "p":
      return <p className="mt-5 mb-0 text-[17px] leading-[1.8] text-ink/80">{bloc.text}</p>;
    case "list": {
      const Liste = bloc.numbered ? "ol" : "ul";
      return (
        <Liste className="mt-6 mb-0 grid list-none gap-4 p-0">
          {bloc.items.map((it, i) => (
            <li key={it.title} className="flex gap-4 rounded-[18px] bg-white p-5" style={{ boxShadow: "0 20px 40px -32px rgba(0,22,54,.6)" }}>
              {bloc.numbered ? (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-[15px] font-bold">{i + 1}</span>
              ) : (
                <span className="mt-1">
                  <Check />
                </span>
              )}
              <span className="text-[16px] leading-[1.7] text-ink/80">
                <strong className="text-ink">{it.title}</strong> {it.text}
              </span>
            </li>
          ))}
        </Liste>
      );
    }
    case "links":
      return (
        <div className="mt-8 flex flex-wrap gap-3">
          {bloc.links.map((l, i) => (
            <Link key={l.href} href={l.href} className={`btn ${i === 0 ? "btn-p" : "btn-o"}`}>
              {l.label}
            </Link>
          ))}
        </div>
      );
  }
}

export default async function ArticlePage({ params }: Props) {
  const a = await getArticle((await params).slug);
  if (!a) notFound();

  return (
    <>
      <JsonLd data={articleLd(a)} />
      <div className="bg-hero">
        <Header />
        <section className="wrap pt-6 pb-16 sm:pt-10 sm:pb-20" style={{ maxWidth: 860 }}>
          <Link href="/blog" className="inline-flex items-center gap-2 text-[14px] text-white/80 no-underline hover:text-white">
            <ArrowLeft /> Tous les articles
          </Link>
          <p className="mt-8 mb-0 text-[13px] font-bold tracking-[.14em] text-gold uppercase">
            {formatDate(a.date)} · {a.readingMinutes} min de lecture
          </p>
          <h1 className="mt-4 mb-0 leading-[1.08] font-bold tracking-[-0.035em] text-white" style={{ fontSize: "clamp(32px, 6vw, 50px)" }}>
            {a.title}
          </h1>
          <DrawUnderline style={{ marginTop: 6 }} />
          <p className="mt-5 mb-0 text-[18px] leading-[1.7] text-white/85">{a.description}</p>
        </section>
      </div>

      <main className="bg-light pb-20 text-ink sm:pb-28">
        <article className="wrap" style={{ maxWidth: 760 }}>
          {a.image && (
            <div className="relative -mt-8 overflow-hidden rounded-[22px] border-4 border-white" style={{ aspectRatio: "3 / 2", boxShadow: "0 30px 60px -30px rgba(0,22,54,.6)" }}>
              <Image src={a.image} alt="" fill priority sizes="(max-width: 800px) 95vw, 760px" style={{ objectFit: "cover" }} />
            </div>
          )}
          <div className="pt-6">
            {a.blocks.map((b, i) => (
              <Bloc key={i} bloc={b} />
            ))}
          </div>
          <p className="mt-14 mb-0 border-t border-ink/10 pt-6 text-[15px] text-ink/60">
            Article écrit par <strong className="text-ink">{SITE.founder}</strong>, coach en éloquence et prise de parole.
          </p>
        </article>
      </main>
    </>
  );
}
