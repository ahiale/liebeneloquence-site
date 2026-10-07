import "server-only";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Journal des envois de formulaires (une ligne JSON par envoi) dans DATA_DIR.
 * En production, DATA_DIR est un volume persistant du serveur : rien n'est
 * perdu au redéploiement, et le futur SaaS pourra importer ces fichiers.
 *
 *   data/newsletter.jsonl   inscriptions à la newsletter
 *   data/quiz.jsonl         réponses et résultats du quiz
 *   data/demandes.jsonl     devis, réservations Grand Oral, contacts
 *   data/liste-attente.jsonl  liste d'attente de la communauté LEQ'FAM
 *   data/inscriptions.jsonl   inscriptions aux événements gratuits (rendez-vous mensuel…)
 */
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");

export type Collection = "newsletter" | "quiz" | "demandes" | "liste-attente" | "inscriptions";

export async function record(collection: Collection, data: Record<string, unknown>): Promise<void> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    const line = JSON.stringify({ createdAt: new Date().toISOString(), ...data });
    await appendFile(path.join(DATA_DIR, `${collection}.jsonl`), line + "\n", "utf8");
  } catch (e) {
    // L'enregistrement ne doit jamais empêcher l'envoi du mail.
    console.error(`Enregistrement ${collection} impossible`, e);
  }
}

/** Relit toute une collection (les lignes illisibles sont ignorées). */
export async function readAll(collection: Collection): Promise<Record<string, unknown>[]> {
  let raw = "";
  try {
    raw = await readFile(path.join(DATA_DIR, `${collection}.jsonl`), "utf8");
  } catch {
    return [];
  }
  return raw.split("\n").flatMap((line) => {
    try {
      return line.trim() ? [JSON.parse(line)] : [];
    } catch {
      return [];
    }
  });
}

export const sameEmail = (a: unknown, b: unknown) =>
  typeof a === "string" && typeof b === "string" && a.trim().toLowerCase() === b.trim().toLowerCase();

/** Vrai si cet email figure déjà dans la collection (pour éviter les inscriptions en double). */
export async function hasEmail(collection: Collection, email: string): Promise<boolean> {
  return (await readAll(collection)).some((l) => sameEmail(l.email, email));
}
