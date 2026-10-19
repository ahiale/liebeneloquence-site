import type { MetadataRoute } from "next";
import { getEvents } from "@/content";
import { SITE } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/quiz", "/grand-oral", "/autres-services", "/communaute", "/ambassadeurs", "/evenements", "/a-propos", "/contact", "/mentions-legales", "/confidentialite", "/cookies", "/cgv"];
  const events = await getEvents();
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...events.map((e) => ({ url: `${SITE.url}/evenements/${e.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
