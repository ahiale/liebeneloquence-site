import Link from "next/link";
import { lister } from "@/lib/base";
import { PACKS, progression, STATUTS_ELEVE, type EleveDoc, type StatutEleve } from "@/lib/eleves";
import { Badge, Bouton, Carte, Champ, Choix, Confirmation, Onglets, Repli, Titre, Vide } from "@/components/admin/ui";
import { creerEleve } from "./actions";

const TON = { decouverte: "or", parcours: "bleu", termine: "vert" } as const;

export default async function AdminEleves({ searchParams }: { searchParams: Promise<{ statut?: string; ok?: string }> }) {
  const { statut = "tous", ok } = await searchParams;
  const eleves = (await lister<EleveDoc>("eleves")).sort((a, b) => b.modifieLe.localeCompare(a.modifieLe));
  const affiches = statut === "tous" ? eleves : eleves.filter((e) => e.statut === statut);
  const nombre = (s: StatutEleve) => eleves.filter((e) => e.statut === s).length;

  return (
    <>
      <Titre titre="LEQ'ORA" accent="élèves" sous="Fiche, séances, diagnostic et ressources de chaque élève." />
      <Confirmation message={ok} />

      <Carte className="mb-6">
        <Repli resume="+ Ajouter un élève">
          <form action={creerEleve} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Champ label="Prénom" name="prenom" requis />
            <Champ label="Nom" name="nom" />
            <Champ label="Email" name="email" type="email" />
            <Champ label="Téléphone" name="telephone" />
            <Choix label="Étape" name="statut" defaut="decouverte" options={Object.entries(STATUTS_ELEVE)} />
            <Choix label="Pack" name="pack" defaut="" options={[["", "À définir"], ...PACKS.map((p) => [p, p] as const)]} />
            <Champ label="Séances prévues" name="seancesPrevues" type="number" defaut={0} />
            <Champ label="Objectif" name="objectif" />
            <div className="sm:col-span-2 lg:col-span-4">
              <Bouton>Créer la fiche</Bouton>
            </div>
          </form>
        </Repli>
      </Carte>

      <Onglets
        actif={statut}
        onglets={[
          { id: "tous", label: "Tous", href: "/admin/eleves", nombre: eleves.length },
          ...(Object.keys(STATUTS_ELEVE) as StatutEleve[]).map((s) => ({ id: s, label: STATUTS_ELEVE[s], href: `/admin/eleves?statut=${s}`, nombre: nombre(s) })),
        ]}
      />

      {affiches.length === 0 ? (
        <Vide>Aucun élève ici pour l&apos;instant.</Vide>
      ) : (
        <Carte>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[14.5px]">
              <thead>
                <tr className="text-[12px] tracking-[.06em] text-ink/50 uppercase">
                  <th className="px-3 pb-3">Élève</th>
                  <th className="px-3 pb-3">Étape</th>
                  <th className="px-3 pb-3">Pack</th>
                  <th className="px-3 pb-3">Objectif</th>
                  <th className="px-3 pb-3">Progression</th>
                  <th className="px-3 pb-3">Diagnostic</th>
                </tr>
              </thead>
              <tbody>
                {affiches.map((e) => (
                  <tr key={e.id} className="border-t border-ink/8">
                    <td className="px-3 py-3">
                      <Link href={`/admin/eleves/${e.id}`} className="font-bold text-ink no-underline hover:text-royal">
                        {e.prenom} {e.nom}
                      </Link>
                      <div className="text-[12.5px] text-ink/50">{e.email}</div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge ton={TON[e.statut]}>{STATUTS_ELEVE[e.statut]}</Badge>
                    </td>
                    <td className="px-3 py-3">{e.pack || "—"}</td>
                    <td className="max-w-[260px] truncate px-3 py-3 text-ink/70">{e.objectif || "—"}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2 tabular-nums">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-[#E5EBF5]">
                          <div className="h-full" style={{ width: `${progression(e)}%`, background: "linear-gradient(90deg,#FFBD59,#FF5E01)" }} />
                        </div>
                        {e.seances.length}/{e.seancesPrevues || "?"}
                      </div>
                    </td>
                    <td className="px-3 py-3">{e.diagnosticEnvoyeLe ? <Badge ton="vert">Envoyé</Badge> : <Badge ton="or">À envoyer</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Carte>
      )}
    </>
  );
}
