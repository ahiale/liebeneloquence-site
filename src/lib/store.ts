import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
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
 */
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");

export type Collection = "newsletter" | "quiz" | "demandes" | "liste-attente";

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
