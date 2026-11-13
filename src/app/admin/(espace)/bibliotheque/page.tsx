import Link from "next/link";
import { lister } from "@/lib/base";
import { TYPES_BIBLIO, type BiblioDoc, type EleveDoc, type TypeBiblio } from "@/lib/eleves";
import { Badge, Bouton, Carte, Choix, Confirmation, Onglets, Repli, Titre, Vide, Zone } from "@/components/admin/ui";
import { FormRessource } from "@/components/admin/FormRessource";
import { creerRessource, importerRessources } from "./actions";

export default async function AdminBibliotheque({ searchParams }: { searchParams: Promise<{ type?: string; ok?: string }> }) {
  const { type = "tous", ok } = await searchParams;
  const [biblio, eleves] = await Promise.all([lister<BiblioDoc>("bibliotheque"), lister<EleveDoc>("eleves")]);
  const affiches = (type === "tous" ? biblio : biblio.filter((b) => b.type === type)).sort((a, b) => a.titre.localeCompare(b.titre, "fr"));
  const utilisations = (id: string) => eleves.filter((e) => e.ressources.includes(id)).length;

  return (
    <>
      <Titre titre="Bibliothèque" accent="pédagogique" sous="Vos cours, exercices, fiches et icebreakers, préparés à l'avance puis attribués aux élèves depuis leur fiche." />
      <Confirmation message={ok} />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Carte>
          <Repli resume="+ Créer un cours, un exercice, une fiche ou un icebreaker">
            <FormRessource action={creerRessource} type={type in TYPES_BIBLIO ? type : undefined} />
          </Repli>
        </Carte>
        <Carte>
          <Repli resume="Importer en lot (depuis Notion, un document…)">
            <form action={importerRessources} className="grid gap-3">
              <Choix label="Type des éléments importés" name="type" defaut={type in TYPES_BIBLIO ? type : "icebreaker"} options={Object.entries(TYPES_BIBLIO)} />
              <Zone label="Collez votre liste" name="texte" lignes={8} aide="Un élément par bloc, séparés par une ligne vide. Première ligne = le titre, les lignes suivantes = le contenu." />
              <div>
                <Bouton>Importer</Bouton>
              </div>
            </form>
          </Repli>
        </Carte>
      </div>

      <Onglets
        actif={type}
        onglets={[
          { id: "tous", label: "Tout", href: "/admin/bibliotheque", nombre: biblio.length },
          ...(Object.keys(TYPES_BIBLIO) as TypeBiblio[]).map((k) => ({ id: k, label: `${TYPES_BIBLIO[k]}s`, href: `/admin/bibliotheque?type=${k}`, nombre: biblio.filter((b) => b.type === k).length })),
        ]}
      />

      {affiches.length === 0 ? (
        <Vide>Rien ici pour l&apos;instant. Créez un élément ou importez une liste.</Vide>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(300px,100%),1fr))" }}>
          {affiches.map((b) => (
            <Link key={b.id} href={`/admin/bibliotheque/${b.id}`} className="block rounded-[18px] bg-white p-5 text-ink no-underline transition hover:-translate-y-0.5" style={{ boxShadow: "0 20px 40px -32px rgba(0,22,54,.55)" }}>
              <div className="flex flex-wrap gap-1.5">
                <Badge ton="bleu">{TYPES_BIBLIO[b.type]}</Badge>
                {b.theme && <Badge>{b.theme}</Badge>}
                {b.format && <Badge>{b.format}</Badge>}
              </div>
              <p className="mt-3 mb-0 text-[16px] font-bold">{b.titre}</p>
              {b.contenu && <p className="mt-1.5 mb-0 line-clamp-3 text-[14px] text-ink/65">{b.contenu}</p>}
              <p className="mt-3 mb-0 text-[12.5px] text-ink/45">
                {b.niveau}
                {b.duree ? ` · ${b.duree}` : ""} · attribué à {utilisations(b.id)} élève{utilisations(b.id) > 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
