import { readFile } from "node:fs/promises";
import path from "node:path";
import { PREVIEW_DIR } from "@/lib/mail";

/* Affiche un mail d'aperçu (local uniquement). */
export async function GET(_: Request, { params }: { params: Promise<{ fichier: string }> }) {
  if (process.env.NODE_ENV !== "development") return new Response("Introuvable", { status: 404 });
  const name = path.basename(decodeURIComponent((await params).fichier));
  if (!name.endsWith(".html")) return new Response("Introuvable", { status: 404 });
  try {
    const html = await readFile(path.join(PREVIEW_DIR(), name), "utf8");
    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
  } catch {
    return new Response("Introuvable", { status: 404 });
  }
}
