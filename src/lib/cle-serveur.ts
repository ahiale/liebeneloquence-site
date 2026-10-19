import "server-only";
import { timingSafeEqual } from "node:crypto";

/**
 * Accès réservé aux appels du serveur et des outils : en-tête « X-LEQ-Cle » égal à DATA_API_KEY
 * (ou paramètre « ?cle= » si `parametre` est vrai, pour les tableaux Excel).
 */
export function cleServeurValide(req: Request, { parametre = false } = {}): boolean {
  const cle = process.env.DATA_API_KEY;
  const donnee = req.headers.get("x-leq-cle") ?? (parametre ? new URL(req.url).searchParams.get("cle") : null);
  if (!cle || cle.length < 32 || !donnee) return false;
  const a = Buffer.from(cle);
  const b = Buffer.from(donnee);
  return a.length === b.length && timingSafeEqual(a, b);
}
