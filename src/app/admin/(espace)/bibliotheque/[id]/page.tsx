import Link from "next/link";
import { notFound } from "next/navigation";
import { lister, trouver } from "@/lib/base";
import type { BiblioDoc, EleveDoc } from "@/lib/eleves";
import { Bouton, Carte, Confirmation, Titre } from "@/components/admin/ui";
import { FormRessource } from "@/components/admin/FormRessource";
import { Icon } from "@/components/ui/Icons";
import { modifierRessource, supprimerRessource } from "../actions";

export default async function RessourcePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string }> }) {
  const [{ id }, { ok }] = await Promise.all([params, searchParams]);
  const [b, eleves] = await Promise.all([trouver<BiblioDoc>("bibliotheque", id), lister<EleveDoc>("eleves")]);
  if (!b) notFound();
  const chez = eleves.filter((e) => e.ressources.includes(b.id));

  return (
    <>
      <Link href={`/admin/bibliotheque?type=${b.type}`} className="mb-4 inline-flex items-center gap-1.5 text-[14px] text-ink/60 no-underline hover:text-ink">
        <Icon name="arrowLeft" size={16} /> Bibliothèque
      </Link>
      <Titre titre={b.titre} />
      <Confirmation message={ok} />
      <div className="grid items-start gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Carte>
          <FormRessource action={modifierRessource} b={b} />
        </Carte>
        <div className="grid gap-6">
          <Carte titre={`Attribué à ${chez.length} élève${chez.length > 1 ? "s" : ""}`}>
            {chez.length === 0 ? (
              <p className="m-0 text-[14px] text-ink/55">Attribuez-le depuis la fiche d&apos;un élève.</p>
            ) : (
              <ul className="m-0 grid list-none gap-1.5 p-0">
                {chez.map((e) => (
                  <li key={e.id}>
                    <Link href={`/admin/eleves/${e.id}`} className="font-semibold text-royal no-underline">
                      {e.prenom} {e.nom}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Carte>
          <form action={supprimerRessource}>
            <input type="hidden" name="id" value={b.id} />
            <Bouton ton="danger">Supprimer de la bibliothèque</Bouton>
          </form>
        </div>
      </div>
    </>
  );
}
