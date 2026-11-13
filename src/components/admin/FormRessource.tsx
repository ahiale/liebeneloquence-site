import { FORMATS, NIVEAUX, THEMES, TYPES_BIBLIO, type BiblioDoc } from "@/lib/eleves";
import { Bouton, Champ, Choix, Zone } from "@/components/admin/ui";

/** Formulaire d'un cours, exercice, fiche ou icebreaker (création ou modification). */
export function FormRessource({ action, b, type }: { action: (data: FormData) => Promise<void>; b?: BiblioDoc; type?: string }) {
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {b && <input type="hidden" name="id" value={b.id} />}
      <Choix label="Type" name="type" defaut={b?.type ?? type ?? "exercice"} options={Object.entries(TYPES_BIBLIO)} />
      <Champ label="Titre" name="titre" defaut={b?.titre} requis className="sm:col-span-1 lg:col-span-3" />
      <Choix label="Format" name="format" defaut={b?.format ?? "Texte"} options={FORMATS} />
      <Choix label="Niveau" name="niveau" defaut={b?.niveau ?? "Tous niveaux"} options={NIVEAUX} />
      <Choix label="Thème" name="theme" defaut={b?.theme ?? ""} options={[["", "Aucun"], ...THEMES.map((x) => [x, x] as const)]} />
      <Champ label="Durée" name="duree" defaut={b?.duree} placeholder="10 min" />
      <Zone label="Contenu" name="contenu" defaut={b?.contenu} lignes={b ? 14 : 6} className="sm:col-span-2 lg:col-span-4" aide="Consignes, déroulé, variantes, ce que l'élève doit rendre…" />
      <div className="sm:col-span-2 lg:col-span-4">
        <Bouton>{b ? "Enregistrer" : "Ajouter à la bibliothèque"}</Bouton>
      </div>
    </form>
  );
}
