import { timingSafeEqual } from "node:crypto";
import { readAll, type Collection } from "@/lib/store";
import { computeResult, describeAnswers, PROFILES, type Answer, type ProfileId } from "@/lib/quiz";

/**
 * Données des formulaires pour le tableau de bord Excel (LEQ-donnees.xlsx).
 * Accès réservé : paramètre « ?cle= » (ou en-tête « X-LEQ-Cle ») égal à DATA_API_KEY sur le serveur.
 * Feuilles : liste-attente, newsletter, demandes, quiz (quiz réalisés), fiches (fiches orateur demandées),
 * inscriptions (événements gratuits), membres (abonnements LEQ'FAM).
 * Réponse : CSV (séparateur « ; », UTF-8), colonnes fixes par feuille, la première est toujours la date.
 */
export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;
type Table = { columns: string[]; rows: (string | null)[][] };

const str = (v: unknown) => (v === undefined || v === null || v === "" ? null : String(v));

/** Date au format ISO, heure de Paris, sans fuseau (lisible directement par Excel). */
function paris(iso: unknown): string | null {
  if (typeof iso !== "string") return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("sv-SE", { timeZone: "Europe/Paris" });
}

/** Réponses lisibles, niveau et nom du profil à partir d'une ligne du quiz. */
function quizDetails(l: Row) {
  const answers = Array.isArray(l.answers) ? (l.answers as Answer[]) : [];
  let level = typeof l.level === "string" ? l.level : undefined;
  let readable: string | null = null;
  try {
    level ??= computeResult(answers).level.name;
    readable = describeAnswers(answers).map(([, a]) => a).join(" | ");
  } catch {}
  return { profile: str(PROFILES[l.profile as ProfileId]?.name ?? l.profile), level: str(level), pack: str(l.pack), readable };
}

/** Garde la première ligne de chaque email (les anciennes inscriptions en double). */
function firstPerEmail(lines: Row[]): Row[] {
  const seen = new Set<string>();
  return lines.filter((l) => {
    const k = String(l.email ?? "").trim().toLowerCase();
    if (!k) return true;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const TYPES: Record<string, string> = { devis: "Devis", "grand-oral": "Grand Oral", seance: "Séance", contact: "Contact" };

type Sheet = Collection | "fiches";

const BUILDERS: Record<Sheet, (lines: Row[]) => Table> = {
  "liste-attente": (lines) => ({
    columns: ["Date", "Prénom", "Email"],
    rows: firstPerEmail(lines).map((l) => [paris(l.createdAt), str(l.prenom), str(l.email)]),
  }),
  newsletter: (lines) => ({
    columns: ["Date", "Nom", "Email", "Profil", "Thématique"],
    rows: firstPerEmail(lines).map((l) => [paris(l.createdAt), str(l.nom), str(l.email), str(l.profil), str(l.thematique)]),
  }),
  demandes: (lines) => ({
    columns: ["Date", "Type", "Prénom", "Nom", "Email", "Structure", "Demande", "Profil", "Oral", "Date de l'oral", "Message", "Séances"],
    rows: lines.map((l) => [
      paris(l.createdAt),
      str(TYPES[String(l.type)] ?? l.type),
      str(l.prenom),
      str(l.nom),
      str(l.email),
      str(l.structure),
      str(l.demande),
      str(l.profil),
      str(l.oral),
      str(l.date),
      str(l.message ?? l.attentes),
      str(l.seances),
    ]),
  }),
  // Un abonnement = une ligne : l'adhésion, puis son dernier état (résiliation demandée, fin, impayé)
  membres: (lines) => {
    const parAbo = new Map<string, Row[]>();
    for (const l of lines) parAbo.set(String(l.abonnement), [...(parAbo.get(String(l.abonnement)) ?? []), l]);
    const rows: (string | null)[][] = [];
    for (const evts of parAbo.values()) {
      const a = evts.find((e) => e.evenement === "adhesion");
      if (!a) continue;
      const dernier = evts[evts.length - 1];
      const statut =
        dernier.evenement === "fin" ? "Terminé" :
        dernier.evenement === "impaye" ? "Impayé (accès coupé)" :
        dernier.evenement === "resiliation_demandee" ? `Résiliation demandée (fin le ${String(dernier.finPrevue ?? "")})` : "Actif";
      rows.push([
        paris(a.createdAt), str(a.discordNom), str(a.email),
        a.formule === "engagement" ? "Avec engagement" : "Sans engagement",
        a.lancement ? "Oui" : "Non", str(a.code), str(a.partenaire), str(a.partenaireType), str(a.groupe),
        statut, str(a.engagementFin), a.mode === "live" ? "Réel" : "Test",
      ]);
    }
    return { columns: ["Date", "Membre (Discord)", "Email", "Formule", "Offre 1 €", "Code", "Ambassadeur ou association", "Type", "Association ou groupe", "Statut", "Fin d'engagement", "Mode"], rows };
  },
  "candidatures-ambassadeur": (lines) => ({
    columns: ["Date", "Prénom", "Nom", "Email", "Réseaux sociaux", "Association ou groupe", "Concours d'éloquence", "Parcours", "Motivation"],
    rows: lines.map((l) => [paris(l.createdAt), str(l.prenom), str(l.nom), str(l.email), str(l.reseaux), str(l.association), l.concours === "oui" ? "Oui" : "Non", str(l.parcours), str(l.motivation)]),
  }),
  "avis-recus": (lines) => ({
    columns: ["Date", "Prénom", "Contexte", "Note", "Avis", "Publication acceptée"],
    rows: lines.map((l) => [paris(l.createdAt), str(l.prenom), str(l.contexte), str(l.note), str(l.texte), l.publication ? "Oui" : "Non"]),
  }),
  invitations: (lines) => ({
    columns: ["Date", "Événement", "Email"],
    rows: lines.map((l) => [paris(l.createdAt), str(l.event), str(l.email)]),
  }),
  inscriptions: (lines) => ({
    columns: ["Date", "Événement", "Prénom", "Nom", "Email", "Comment nous a connus"],
    rows: lines.map((l) => [paris(l.createdAt), str(l.eventTitle ?? l.event), str(l.prenom), str(l.nom), str(l.email), str(l.source)]),
  }),
  // Chaque quiz terminé écrit une ligne sans email : ce sont les quiz réalisés.
  quiz: (lines) => ({
    columns: ["Date", "Profil", "Niveau", "Pack conseillé", "Réponses"],
    rows: lines
      .filter((l) => !l.email)
      .map((l) => {
        const q = quizDetails(l);
        return [paris(l.createdAt), q.profile, q.level, q.pack, q.readable];
      }),
  }),
  // La demande de fiche orateur écrit une seconde ligne, avec prénom et email.
  fiches: (lines) => ({
    columns: ["Date", "Prénom", "Email", "Profil", "Niveau", "Pack conseillé", "Réponses"],
    rows: firstPerEmail(lines.filter((l) => l.email)).map((l) => {
      const q = quizDetails(l);
      return [paris(l.createdAt), str(l.prenom), str(l.email), q.profile, q.level, q.pack, q.readable];
    }),
  }),
};

/** CSV lisible par Excel : retours à la ligne remplacés, guillemets doublés. */
function toCsv({ columns, rows }: Table): string {
  const cell = (v: string | null) => {
    const t = (v ?? "").replace(/\s*[\r\n]+\s*/g, " / ");
    return /[;"]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
  };
  return [columns, ...rows].map((r) => r.map(cell).join(";")).join("\r\n") + "\r\n";
}

function authorized(req: Request): boolean {
  const key = process.env.DATA_API_KEY;
  const given = req.headers.get("x-leq-cle") ?? new URL(req.url).searchParams.get("cle");
  if (!key || key.length < 32 || !given) return false;
  const a = Buffer.from(key);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  if (!authorized(req)) return new Response("Not found", { status: 404 });
  const { collection } = await params;
  const build = Object.hasOwn(BUILDERS, collection) ? BUILDERS[collection as Sheet] : undefined;
  if (!build) return new Response("Not found", { status: 404 });
  const table = build(await readAll(collection === "fiches" ? "quiz" : (collection as Collection)));
  return new Response(toCsv(table), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
