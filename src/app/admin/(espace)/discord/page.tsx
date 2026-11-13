import { defis, opportunites, prochainDefi, type Statut } from "@/lib/publications-discord";
import { Badge, Bouton, Carte, Champ, Choix, Confirmation, Onglets, Repli, Titre, Vide, Zone, dateFr, type Ton } from "@/components/admin/ui";
import { Icon } from "@/components/ui/Icons";
import { modifierDefi, modifierOpportunite, statutDefi, statutOpportunite } from "./actions";

const BADGE: Record<Statut, [Ton, string]> = {
  "a-valider": ["or", "À valider"],
  valide: ["vert", "Validé"],
  publie: ["bleu", "Publié"],
  ecarte: ["gris", "Écarté"],
};

/** Lundi prochain à 9 h (ou aujourd'hui si on est lundi avant 9 h, heure de Paris). */
function prochainLundi(): string {
  const d = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  const ecart = (8 - d.getDay()) % 7;
  d.setDate(d.getDate() + (ecart === 0 && d.getHours() >= 9 ? 7 : ecart));
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(d);
}

export default async function AdminDiscord({ searchParams }: { searchParams: Promise<{ onglet?: string; ok?: string }> }) {
  const { onglet = "defis", ok } = await searchParams;
  const [banque, fiches] = await Promise.all([defis(), opportunites()]);
  const prochain = prochainDefi(banque);
  const aValider = fiches.filter((o) => o.statut === "a-valider");

  return (
    <>
      <Titre titre="Discord" accent="LEQ'FAM" sous="Le robot LEQ publie seulement ce que vous validez ici : le défi du lundi à 9 h, les opportunités dans le forum." />
      <Confirmation message={ok} />
      <Onglets
        actif={onglet}
        onglets={[
          { id: "defis", label: "Banque de défis", href: "/admin/discord", nombre: banque.length },
          { id: "opportunites", label: "Ressources et opportunités", href: "/admin/discord?onglet=opportunites", nombre: aValider.length },
        ]}
      />

      {onglet === "defis" ? (
        <>
          <Carte className="mb-6">
            {prochain ? (
              <p className="m-0 text-[15px]">
                <strong>Lundi {prochainLundi()}, 9 h</strong> dans #discussion-générale : <strong>{prochain.titre}</strong>
              </p>
            ) : (
              <p className="m-0 text-[15px]">
                <Badge ton="or">En pause</Badge> Aucun défi validé : rien ne part lundi. Validez les défis que vous voulez publier, ils partiront un par lundi, dans l&apos;ordre.
              </p>
            )}
          </Carte>
          <div className="grid gap-3">
            {banque.map((d) => {
              const [ton, libelle] = BADGE[d.statut];
              return (
                <Carte key={d.id}>
                  <div id={d.id} className="flex flex-wrap items-start gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F4F7FC] text-[13px] font-bold text-ink/60">{d.ordre}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="m-0 text-[16px] font-bold">{d.titre}</p>
                        <Badge ton={ton}>{libelle}</Badge>
                        {d.publieLe && <span className="text-[12.5px] text-ink/50">le {dateFr(d.publieLe)}</span>}
                      </div>
                      <p className="mt-1.5 mb-0 text-[14.5px] text-ink/75">{d.consigne}</p>
                      <p className="mt-1 mb-0 flex items-start gap-1.5 text-[13.5px] text-ink/55">
                        <Icon name="lightbulb" size={15} />
                        {d.astuce}
                      </p>
                      {d.statut !== "publie" && (
                        <div className="mt-3">
                          <Repli resume="Modifier">
                            <form action={modifierDefi} className="grid gap-3">
                              <input type="hidden" name="id" value={d.id} />
                              <Champ label="Titre" name="titre" defaut={d.titre} />
                              <Zone label="Consigne" name="consigne" defaut={d.consigne} lignes={3} />
                              <Zone label="L'astuce" name="astuce" defaut={d.astuce} lignes={2} />
                              <div>
                                <Bouton>Enregistrer</Bouton>
                              </div>
                            </form>
                          </Repli>
                        </div>
                      )}
                    </div>
                    {d.statut !== "publie" && (
                      <form action={statutDefi}>
                        <input type="hidden" name="id" value={d.id} />
                        {d.statut === "valide" ? (
                          <Bouton ton="doux" name="statut" value="a-valider">
                            Retirer la validation
                          </Bouton>
                        ) : (
                          <Bouton ton="orange" name="statut" value="valide">
                            Valider
                          </Bouton>
                        )}
                      </form>
                    )}
                  </div>
                </Carte>
              );
            })}
          </div>
        </>
      ) : (
        <div className="grid gap-3">
          {fiches.length === 0 && <Vide>Aucune fiche pour l&apos;instant : l&apos;agent du lundi en ajoutera chaque semaine.</Vide>}
          {fiches.map((o) => {
            const [ton, libelle] = BADGE[o.statut];
            return (
              <Carte key={o.id}>
                <div id={o.id} className="flex flex-wrap items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge ton={ton}>{libelle}</Badge>
                      {o.etiquettes.map((e) => (
                        <Badge key={e}>{e}</Badge>
                      ))}
                      {o.dateLimite && (
                        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#C24600]">
                          <Icon name="clock" size={14} /> {o.dateLimite}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 mb-0 text-[16px] font-bold">{o.titre}</p>
                    <p className="mt-1 mb-0 text-[14.5px] leading-[1.55] text-ink/75">{o.resume}</p>
                    <p className="mt-1.5 mb-0 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] text-ink/55">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="users" size={15} /> {o.pourQui}
                      </span>
                      {o.lieu && (
                        <span className="inline-flex items-center gap-1.5">
                          <Icon name="mapPin" size={15} /> {o.lieu}
                        </span>
                      )}
                      <a href={o.lien} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-royal">
                        <Icon name="externalLink" size={15} /> Source
                      </a>
                    </p>
                    {o.statut !== "publie" && (
                      <div className="mt-3">
                        <Repli resume="Modifier">
                          <form action={modifierOpportunite} className="grid gap-3 sm:grid-cols-2">
                            <input type="hidden" name="id" value={o.id} />
                            <Champ label="Titre" name="titre" defaut={o.titre} className="sm:col-span-2" />
                            <Zone label="Résumé" name="resume" defaut={o.resume} className="sm:col-span-2" />
                            <Champ label="Pour qui" name="pourQui" defaut={o.pourQui} />
                            <Champ label="Date limite" name="dateLimite" defaut={o.dateLimite ?? ""} placeholder="15 décembre 2026" />
                            <Champ label="Où et quand" name="lieu" defaut={o.lieu ?? ""} />
                            <Choix label="Étiquette" name="etiquette" defaut={o.etiquettes.at(0)} options={["Concours", "Opportunité internationale", "Ressource"]} />
                            <Champ label="Lien (source officielle)" name="lien" defaut={o.lien} type="url" className="sm:col-span-2" />
                            <div>
                              <Bouton>Enregistrer</Bouton>
                            </div>
                          </form>
                        </Repli>
                      </div>
                    )}
                  </div>
                  {o.statut !== "publie" && (
                    <form action={statutOpportunite} className="flex flex-wrap gap-2">
                      <input type="hidden" name="id" value={o.id} />
                      {o.statut !== "valide" && (
                        <Bouton ton="orange" name="statut" value="valide">
                          Valider et publier
                        </Bouton>
                      )}
                      {o.statut === "a-valider" ? (
                        <Bouton ton="doux" name="statut" value="ecarte">
                          Écarter
                        </Bouton>
                      ) : (
                        <Bouton ton="doux" name="statut" value="a-valider">
                          Remettre à valider
                        </Bouton>
                      )}
                    </form>
                  )}
                </div>
              </Carte>
            );
          })}
        </div>
      )}
    </>
  );
}
