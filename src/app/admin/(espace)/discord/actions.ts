"use server";

import { redirect } from "next/navigation";
import { exigerAdmin } from "@/lib/admin";
import { enregistrer, trouver } from "@/lib/base";
import type { DefiDoc, OpportuniteDoc, Statut } from "@/lib/publications-discord";

const texte = (data: FormData, nom: string) => String(data.get(nom) ?? "").trim();
const STATUTS: Statut[] = ["a-valider", "valide", "ecarte"];

export async function modifierDefi(data: FormData) {
  await exigerAdmin();
  const d = await trouver<DefiDoc>("defis", texte(data, "id"));
  if (d) await enregistrer<DefiDoc>("defis", { ...d, titre: texte(data, "titre"), consigne: texte(data, "consigne"), astuce: texte(data, "astuce") });
  redirect(`/admin/discord?ok=${encodeURIComponent("Défi enregistré")}#${d?.id ?? ""}`);
}

export async function statutDefi(data: FormData) {
  await exigerAdmin();
  const statut = texte(data, "statut") as Statut;
  const d = await trouver<DefiDoc>("defis", texte(data, "id"));
  if (d && STATUTS.includes(statut) && d.statut !== "publie") await enregistrer<DefiDoc>("defis", { ...d, statut });
  redirect(`/admin/discord?ok=${encodeURIComponent(statut === "valide" ? "Défi validé : il partira un lundi, dans l'ordre de la banque" : "Validation retirée")}#${d?.id ?? ""}`);
}

export async function modifierOpportunite(data: FormData) {
  await exigerAdmin();
  const o = await trouver<OpportuniteDoc>("opportunites", texte(data, "id"));
  if (o)
    await enregistrer<OpportuniteDoc>("opportunites", {
      ...o,
      titre: texte(data, "titre"),
      resume: texte(data, "resume"),
      pourQui: texte(data, "pourQui"),
      dateLimite: texte(data, "dateLimite") || null,
      lieu: texte(data, "lieu") || null,
      lien: texte(data, "lien"),
      etiquettes: [texte(data, "etiquette")].filter(Boolean),
    });
  redirect(`/admin/discord?onglet=opportunites&ok=${encodeURIComponent("Fiche enregistrée")}#${o?.id ?? ""}`);
}

export async function statutOpportunite(data: FormData) {
  await exigerAdmin();
  const statut = texte(data, "statut") as Statut;
  const o = await trouver<OpportuniteDoc>("opportunites", texte(data, "id"));
  if (o && STATUTS.includes(statut) && o.statut !== "publie") await enregistrer<OpportuniteDoc>("opportunites", { ...o, statut });
  const message = statut === "valide" ? "Validée : elle part dans le forum dans les 5 minutes" : statut === "ecarte" ? "Fiche écartée" : "Remise à valider";
  redirect(`/admin/discord?onglet=opportunites&ok=${encodeURIComponent(message)}`);
}
