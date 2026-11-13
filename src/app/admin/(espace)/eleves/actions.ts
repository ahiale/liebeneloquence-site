"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { exigerAdmin } from "@/lib/admin";
import { enregistrer, supprimer, trouver } from "@/lib/base";
import { eleveVide, STATUTS_ELEVE, type EleveDoc, type Seance, type StatutEleve } from "@/lib/eleves";
import { ADMIN_EMAIL, sendMail } from "@/lib/mail";
import * as T from "@/emails/templates";

const t = (data: FormData, nom: string) => String(data.get(nom) ?? "").trim();
const fiche = (id: string, ok: string) => redirect(`/admin/eleves/${id}?ok=${encodeURIComponent(ok)}`);

/** Champs de la fiche modifiables depuis le formulaire (texte simple). */
const CHAMPS_TEXTE = ["prenom", "nom", "email", "telephone", "pack", "debut", "canal", "objectif", "echeance", "histoire", "profilOrateur", "noteOral", "qualites", "pointsForts", "pointsFaibles", "blocages", "packRecommande", "motDiagnostic", "commentaire", "bilan", "messageFinal"] as const;

function lireFiche(data: FormData) {
  const champs = Object.fromEntries(CHAMPS_TEXTE.filter((c) => data.has(c)).map((c) => [c, t(data, c)]));
  const statut = t(data, "statut") as StatutEleve;
  return {
    ...champs,
    ...(statut in STATUTS_ELEVE ? { statut } : {}),
    ...(data.has("seancesPrevues") ? { seancesPrevues: Math.max(0, Number(t(data, "seancesPrevues")) || 0) } : {}),
  };
}

export async function creerEleve(data: FormData) {
  await exigerAdmin();
  const e = await enregistrer<EleveDoc>("eleves", { ...eleveVide(), ...lireFiche(data) });
  fiche(e.id, "Élève créé : complétez sa fiche");
}

export async function modifierEleve(data: FormData) {
  await exigerAdmin();
  const e = await trouver<EleveDoc>("eleves", t(data, "id"));
  if (!e) redirect("/admin/eleves");
  await enregistrer<EleveDoc>("eleves", { ...e, ...lireFiche(data) });
  fiche(e.id, "Fiche enregistrée");
}

export async function supprimerEleve(data: FormData) {
  await exigerAdmin();
  await supprimer("eleves", t(data, "id"));
  redirect(`/admin/eleves?ok=${encodeURIComponent("Élève supprimé")}`);
}

/** Mail de diagnostic, construit depuis la fiche (points forts, qualités, à travailler, blocages, pack, mot personnel). */
export async function envoyerDiagnostic(data: FormData) {
  await exigerAdmin();
  const e = await trouver<EleveDoc>("eleves", t(data, "id"));
  if (!e) redirect("/admin/eleves");
  if (!e.email) fiche(e.id, "Ajoutez d'abord l'email de l'élève");
  await sendMail({
    to: e.email,
    replyTo: ADMIN_EMAIL,
    ...T.diagnosticEleve({ prenom: e.prenom, objectif: e.objectif, qualites: e.qualites, pointsForts: e.pointsForts, pointsFaibles: e.pointsFaibles, blocages: e.blocages, pack: e.packRecommande, message: e.motDiagnostic }),
  });
  await enregistrer<EleveDoc>("eleves", { ...e, diagnosticEnvoyeLe: new Date().toISOString() });
  fiche(e.id, `Diagnostic envoyé à ${e.email}`);
}

const SEANCE = ["date", "theme", "objectif", "humeur", "bienFonctionne", "aTravailler", "exercice", "note"] as const;

export async function enregistrerSeance(data: FormData) {
  await exigerAdmin();
  const e = await trouver<EleveDoc>("eleves", t(data, "id"));
  if (!e) redirect("/admin/eleves");
  const valeurs = Object.fromEntries(SEANCE.map((c) => [c, t(data, c)])) as Omit<Seance, "id">;
  const sid = t(data, "seance");
  const seances = sid ? e.seances.map((s) => (s.id === sid ? { ...s, ...valeurs } : s)) : [...e.seances, { id: randomUUID(), ...valeurs }];
  await enregistrer<EleveDoc>("eleves", { ...e, seances: seances.sort((a, b) => a.date.localeCompare(b.date)), statut: e.statut === "decouverte" ? "parcours" : e.statut });
  fiche(e.id, sid ? "Séance enregistrée" : "Séance ajoutée");
}

export async function supprimerSeance(data: FormData) {
  await exigerAdmin();
  const e = await trouver<EleveDoc>("eleves", t(data, "id"));
  if (!e) redirect("/admin/eleves");
  await enregistrer<EleveDoc>("eleves", { ...e, seances: e.seances.filter((s) => s.id !== t(data, "seance")) });
  fiche(e.id, "Séance supprimée");
}

export async function envoyerCompteRendu(data: FormData) {
  await exigerAdmin();
  const e = await trouver<EleveDoc>("eleves", t(data, "id"));
  if (!e) redirect("/admin/eleves");
  const i = e.seances.findIndex((s) => s.id === t(data, "seance"));
  const s = e.seances.at(i);
  if (!s || !e.email) fiche(e.id, "Ajoutez d'abord l'email de l'élève");
  await sendMail({ to: e.email, replyTo: ADMIN_EMAIL, ...T.compteRenduSeance({ prenom: e.prenom, numero: i + 1, theme: s!.theme, bienFonctionne: s!.bienFonctionne, aTravailler: s!.aTravailler, exercice: s!.exercice }) });
  fiche(e.id, `Compte-rendu de la séance ${i + 1} envoyé`);
}

export async function attribuerRessource(data: FormData) {
  await exigerAdmin();
  const e = await trouver<EleveDoc>("eleves", t(data, "id"));
  if (!e) redirect("/admin/eleves");
  const r = t(data, "ressource");
  if (r && !e.ressources.includes(r)) await enregistrer<EleveDoc>("eleves", { ...e, ressources: [...e.ressources, r] });
  fiche(e.id, "Ressource attribuée");
}

export async function retirerRessource(data: FormData) {
  await exigerAdmin();
  const e = await trouver<EleveDoc>("eleves", t(data, "id"));
  if (!e) redirect("/admin/eleves");
  await enregistrer<EleveDoc>("eleves", { ...e, ressources: e.ressources.filter((r) => r !== t(data, "ressource")) });
  fiche(e.id, "Ressource retirée");
}
