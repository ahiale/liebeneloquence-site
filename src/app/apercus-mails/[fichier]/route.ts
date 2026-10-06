import { readFile } from "node:fs/promises";
import path from "node:path";
import { PREVIEW_DIR } from "@/lib/mail";

/* Affiche un mail d'aperçu (local uniquement). */
export async function GET(_: Request, { params }: { params: Promise<{ fichier: string }> }) {
  if (process.env.NODE_ENV !== "development") return new Response("Introuvable", { status: 404 });
  const name = path.basename(decodeURIComponent((await params).fichier));
  const type = name.endsWith(".html") ? "text/html; charset=utf-8" : name.endsWith(".png") ? "image/png" : null;
  if (!type) return new Response("Introuvable", { status: 404 });
  try {
    const body = await readFile(path.join(PREVIEW_DIR(), name));
    return new Response(body, { headers: { "content-type": type } });
  } catch {
    return new Response("Introuvable", { status: 404 });
  }
}
