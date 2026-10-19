import type { MetadataRoute } from "next";
import { getArticles, getEvents } from "@/content";
import { SITE } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/quiz", "/grand-oral", "/autres-services", "/communaute", "/ambassadeurs", "/evenements", "/blog", "/a-propos", "/contact", "/mentions-legales", "/confidentialite", "/cookies", "/cgv"];
  const [events, articles] = await Promise.all([getEvents(), getArticles()]);
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...events.map((e) => ({ url: `${SITE.url}/evenements/${e.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...articles.map((a) => ({ url: `${SITE.url}/blog/${a.slug}`, lastModified: a.date, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
