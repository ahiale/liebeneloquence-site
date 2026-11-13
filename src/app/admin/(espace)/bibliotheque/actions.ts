"use server";

import { redirect } from "next/navigation";
import { exigerAdmin } from "@/lib/admin";
import { enregistrer, supprimer, trouver } from "@/lib/base";
import { TYPES_BIBLIO, type BiblioDoc, type TypeBiblio } from "@/lib/eleves";

const t = (data: FormData, nom: string) => String(data.get(nom) ?? "").trim();
const typeValide = (v: string): TypeBiblio => (v in TYPES_BIBLIO ? (v as TypeBiblio) : "exercice");

function lire(data: FormData) {
  return { type: typeValide(t(data, "type")), titre: t(data, "titre"), contenu: t(data, "contenu"), format: t(data, "format"), niveau: t(data, "niveau"), theme: t(data, "theme"), duree: t(data, "duree") };
}

export async function creerRessource(data: FormData) {
  await exigerAdmin();
  const b = await enregistrer<BiblioDoc>("bibliotheque", lire(data));
  redirect(`/admin/bibliotheque?type=${b.type}&ok=${encodeURIComponent(`« ${b.titre} » ajouté`)}`);
}

export async function modifierRessource(data: FormData) {
  await exigerAdmin();
  const b = await trouver<BiblioDoc>("bibliotheque", t(data, "id"));
  if (!b) redirect("/admin/bibliotheque");
  await enregistrer<BiblioDoc>("bibliotheque", { ...b, ...lire(data) });
  redirect(`/admin/bibliotheque/${b.id}?ok=${encodeURIComponent("Enregistré")}`);
}

export async function supprimerRessource(data: FormData) {
  await exigerAdmin();
  await supprimer("bibliotheque", t(data, "id"));
  redirect(`/admin/bibliotheque?ok=${encodeURIComponent("Supprimé")}`);
}

/**
 * Import en lot : un élément par bloc séparé d'une ligne vide ; la première ligne du bloc = le titre, le reste = le contenu.
 * Pratique pour coller une liste d'icebreakers ou d'exercices depuis Notion.
 */
export async function importerRessources(data: FormData) {
  await exigerAdmin();
  const type = typeValide(t(data, "type"));
  const blocs = t(data, "texte")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  for (const bloc of blocs) {
    const [titre, ...reste] = bloc.split("\n");
    await enregistrer<BiblioDoc>("bibliotheque", { type, titre: titre.replace(/^[-•*#\d.)\s]+/, "").trim(), contenu: reste.join("\n").trim(), format: "", niveau: "Tous niveaux", theme: "", duree: "" });
  }
  redirect(`/admin/bibliotheque?type=${type}&ok=${encodeURIComponent(`${blocs.length} élément${blocs.length > 1 ? "s" : ""} importé${blocs.length > 1 ? "s" : ""}`)}`);
}
