import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Base de l'admin : des documents modifiables (élèves, bibliothèque, défis, opportunités…), une collection
 * par fichier JSON dans data/base/. Écriture atomique (fichier temporaire puis renommage) et une écriture
 * à la fois par collection, pour ne jamais perdre une modification.
 * Les journaux qui ne font que s'ajouter (inscriptions, mails envoyés…) restent dans lib/store.ts.
 */
const DOSSIER = path.join(process.env.DATA_DIR || path.join(process.cwd(), "data"), "base");

export type CollectionBase = "eleves" | "bibliotheque" | "defis" | "opportunites";
export type Doc = { id: string; creeLe: string; modifieLe: string };

const files = new Map<string, Promise<unknown>>();
/** Enchaîne les écritures d'une collection l'une après l'autre. */
function aLaSuite<T>(nom: string, tache: () => Promise<T>): Promise<T> {
  const suite = (files.get(nom) ?? Promise.resolve()).then(tache, tache);
  files.set(nom, suite.catch(() => undefined));
  return suite;
}

export async function lister<T extends Doc>(nom: CollectionBase): Promise<T[]> {
  try {
    return JSON.parse(await readFile(path.join(DOSSIER, `${nom}.json`), "utf8")) as T[];
  } catch {
    return [];
  }
}

async function ecrireTout(nom: CollectionBase, docs: Doc[]): Promise<void> {
  await mkdir(DOSSIER, { recursive: true });
  const fichier = path.join(DOSSIER, `${nom}.json`);
  await writeFile(`${fichier}.tmp`, JSON.stringify(docs, null, 1), "utf8");
  await rename(`${fichier}.tmp`, fichier);
}

export async function trouver<T extends Doc>(nom: CollectionBase, id: string): Promise<T | undefined> {
  return (await lister<T>(nom)).find((d) => d.id === id);
}

/** Crée (sans id) ou met à jour (avec id) un document ; renvoie le document enregistré. */
export function enregistrer<T extends Doc>(nom: CollectionBase, doc: Omit<T, keyof Doc> & Partial<Doc>): Promise<T> {
  return aLaSuite(nom, async () => {
    const docs = await lister<T>(nom);
    const maintenant = new Date().toISOString();
    const i = doc.id ? docs.findIndex((d) => d.id === doc.id) : -1;
    const complet = { ...(i >= 0 ? docs.at(i) : {}), ...doc, id: doc.id ?? randomUUID(), creeLe: i >= 0 ? docs.at(i)!.creeLe : maintenant, modifieLe: maintenant } as T;
    if (i >= 0) docs.splice(i, 1, complet);
    else docs.push(complet);
    await ecrireTout(nom, docs);
    return complet;
  });
}

export function supprimer(nom: CollectionBase, id: string): Promise<void> {
  return aLaSuite(nom, async () => ecrireTout(nom, (await lister(nom)).filter((d) => d.id !== id)));
}

/**
 * Ajoute à une collection les documents de départ qui n'y sont pas encore (par id), sans toucher aux autres :
 * la banque de défis et les opportunités de l'agent arrivent par des fichiers du projet, puis vivent ici.
 */
export function semer<T extends Doc>(nom: CollectionBase, depart: (Omit<T, keyof Doc> & { id: string })[]): Promise<void> {
  return aLaSuite(nom, async () => {
    const docs = await lister<T>(nom);
    const connus = new Set(docs.map((d) => d.id));
    const nouveaux = depart.filter((d) => !connus.has(d.id));
    if (!nouveaux.length) return;
    const maintenant = new Date().toISOString();
    await ecrireTout(nom, [...docs, ...nouveaux.map((d) => ({ ...d, creeLe: maintenant, modifieLe: maintenant }) as unknown as T)]);
  });
}
