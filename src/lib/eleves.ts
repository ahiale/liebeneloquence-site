import "server-only";
import type { Doc } from "@/lib/base";

/**
 * LEQ TALENTS et bibliothèque pédagogique (module « Élèves » de l'admin).
 * La fiche reprend le modèle de Rebecca (Notion « modèles de fiches ») : informations générales, profil initial
 * (séance diagnostic), suivi des séances, bilan final.
 */

export const PACKS = ["Senghor", "Cicéron", "Socrate", "Grand Oral", "Séance à l'unité", "Autre"] as const;
export const STATUTS_ELEVE = { decouverte: "Séance découverte", parcours: "En parcours", termine: "Terminé" } as const;
export type StatutEleve = keyof typeof STATUTS_ELEVE;

export type Seance = {
  id: string;
  date: string;
  theme: string;
  /** Avant la séance */
  objectif: string;
  humeur: string;
  /** Après la séance */
  bienFonctionne: string;
  aTravailler: string;
  exercice: string;
  note: string;
};

export type EleveDoc = Doc & {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  statut: StatutEleve;
  pack: string;
  seancesPrevues: number;
  debut: string;
  canal: string;
  // Profil initial (séance diagnostic)
  objectif: string;
  echeance: string;
  histoire: string;
  profilOrateur: string;
  noteOral: string;
  qualites: string;
  pointsForts: string;
  pointsFaibles: string;
  blocages: string;
  packRecommande: string;
  /** Mot personnel inclus dans le mail de diagnostic */
  motDiagnostic: string;
  /** Note privée de Rebecca (jamais envoyée) */
  commentaire: string;
  // Suivi
  seances: Seance[];
  /** Cours, exercices, fiches et icebreakers attribués (ids de la bibliothèque) */
  ressources: string[];
  diagnosticEnvoyeLe?: string;
  // Bilan final
  bilan: string;
  messageFinal: string;
};

export const TYPES_BIBLIO = { cours: "Cours", exercice: "Exercice", fiche: "Fiche", icebreaker: "Icebreaker" } as const;
export type TypeBiblio = keyof typeof TYPES_BIBLIO;
export const FORMATS = ["Texte", "Audio", "Vidéo", "Jeu de mots", "À l'oral"] as const;
export const NIVEAUX = ["Tous niveaux", "Débutant", "Intermédiaire", "Confirmé"] as const;
export const THEMES = ["Fond", "Forme", "Voix", "Trac", "Improvisation", "Structure", "Argumentation", "Storytelling"] as const;

export type BiblioDoc = Doc & {
  type: TypeBiblio;
  titre: string;
  contenu: string;
  format: string;
  niveau: string;
  theme: string;
  duree: string;
};

/** Valeurs d'un nouvel élève. */
export const eleveVide = (): Omit<EleveDoc, keyof Doc> => ({
  prenom: "", nom: "", email: "", telephone: "", statut: "decouverte", pack: "", seancesPrevues: 0, debut: new Date().toISOString().slice(0, 10), canal: "Visio",
  objectif: "", echeance: "", histoire: "", profilOrateur: "", noteOral: "", qualites: "", pointsForts: "", pointsFaibles: "", blocages: "", packRecommande: "", motDiagnostic: "", commentaire: "",
  seances: [], ressources: [], bilan: "", messageFinal: "",
});

/** Progression du parcours, en pourcentage des séances prévues. */
export const progression = (e: EleveDoc) => (e.seancesPrevues ? Math.min(100, Math.round((e.seances.length / e.seancesPrevues) * 100)) : 0);
