import type { MetadataRoute } from "next";
import { EVENTS } from "@/data/events";

const BASE = "https://lieben-eloquence.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    { path: "/quiz", priority: 0.9 },
    { path: "/grand-oral", priority: 0.9 },
    { path: "/evenements", priority: 0.8 },
    { path: "/a-propos", priority: 0.7 },
    { path: "/mentions-legales", priority: 0.2 },
  ];

  return [
    ...pages.map((p) => ({
      url: `${BASE}${p.path}`,
      lastModified: new Date(),
      priority: p.priority,
    })),
    ...EVENTS.map((e) => ({
      url: `${BASE}/evenements/${e.slug}`,
      lastModified: new Date(),
      priority: 0.6,
    })),
  ];
}
