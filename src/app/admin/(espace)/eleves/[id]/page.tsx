import Link from "next/link";
import { notFound } from "next/navigation";
import { lister, trouver } from "@/lib/base";
import { PACKS, progression, STATUTS_ELEVE, TYPES_BIBLIO, type BiblioDoc, type EleveDoc, type Seance } from "@/lib/eleves";
import { Badge, Bouton, Carte, Champ, Choix, Confirmation, Repli, Vide, Zone, dateFr } from "@/components/admin/ui";
import { Icon } from "@/components/ui/Icons";
import { attribuerRessource, enregistrerSeance, envoyerCompteRendu, envoyerDiagnostic, modifierEleve, retirerRessource, supprimerEleve, supprimerSeance } from "../actions";

const TON = { decouverte: "or", parcours: "bleu", termine: "vert" } as const;

/** Formulaire d'une séance (nouvelle ou existante), sur le modèle « avant / après la séance ». */
function FormSeance({ id, s }: { id: string; s?: Seance }) {
  return (
    <form action={enregistrerSeance} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="id" value={id} />
      {s && <input type="hidden" name="seance" value={s.id} />}
      <Champ label="Date" name="date" type="date" defaut={s?.date ?? new Date().toISOString().slice(0, 10)} />
      <Champ label="Thème travaillé" name="theme" defaut={s?.theme} />
      <Zone label="Avant · objectif du jour" name="objectif" defaut={s?.objectif} lignes={2} />
      <Zone label="Avant · humeur et état d'esprit" name="humeur" defaut={s?.humeur} lignes={2} />
      <Zone label="Après · ce qui a bien fonctionné" name="bienFonctionne" defaut={s?.bienFonctionne} lignes={3} aide="Une idée par ligne" />
      <Zone label="Après · ce qui reste à travailler" name="aTravailler" defaut={s?.aTravailler} lignes={3} aide="Une idée par ligne" />
      <Zone label="Exercice d'ici la prochaine séance" name="exercice" defaut={s?.exercice} lignes={2} />
      <Zone label="Note personnelle (privée)" name="note" defaut={s?.note} lignes={2} />
      <div className="sm:col-span-2">
        <Bouton>{s ? "Enregistrer la séance" : "Ajouter la séance"}</Bouton>
      </div>
    </form>
  );
}

export default async function FicheEleve({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string }> }) {
  const [{ id }, { ok }] = await Promise.all([params, searchParams]);
  const [e, biblio] = await Promise.all([trouver<EleveDoc>("eleves", id), lister<BiblioDoc>("bibliotheque")]);
  if (!e) notFound();
  const attribuees = e.ressources.map((r) => biblio.find((b) => b.id === r)).filter((b): b is BiblioDoc => Boolean(b));
  const disponibles = biblio.filter((b) => !e.ressources.includes(b.id));

  return (
    <>
      <Link href="/admin/eleves" className="mb-4 inline-flex items-center gap-1.5 text-[14px] text-ink/60 no-underline hover:text-ink">
        <Icon name="arrowLeft" size={16} /> Tous les élèves
      </Link>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-royal text-[20px] font-bold text-white">
          {(e.prenom.at(0) ?? "") + (e.nom.at(0) ?? "")}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="m-0 text-[28px] font-bold tracking-[-0.03em]">
            {e.prenom} <span className="serif font-normal text-royal">{e.nom}</span>
          </h1>
          <p className="mt-1 mb-0 flex flex-wrap items-center gap-2 text-[14px] text-ink/60">
            <Badge ton={TON[e.statut]}>{STATUTS_ELEVE[e.statut]}</Badge>
            {e.pack && <span>Pack {e.pack}</span>}
            <span>
              {e.seances.length}/{e.seancesPrevues || "?"} séances · {progression(e)} %
            </span>
            {e.email && <span>· {e.email}</span>}
          </p>
        </div>
      </div>
      <Confirmation message={ok} />

      <div className="grid items-start gap-6 xl:grid-cols-[1.35fr_1fr]">
        {/* La fiche */}
        <form action={modifierEleve} className="grid gap-6">
          <input type="hidden" name="id" value={e.id} />
          <Carte titre="Informations générales">
            <div className="grid gap-3 sm:grid-cols-2">
              <Champ label="Prénom" name="prenom" defaut={e.prenom} />
              <Champ label="Nom" name="nom" defaut={e.nom} />
              <Champ label="Email" name="email" type="email" defaut={e.email} />
              <Champ label="Téléphone" name="telephone" defaut={e.telephone} />
              <Choix label="Étape" name="statut" defaut={e.statut} options={Object.entries(STATUTS_ELEVE)} />
              <Choix label="Pack souscrit" name="pack" defaut={e.pack} options={[["", "À définir"], ...PACKS.map((p) => [p, p] as const)]} />
              <Champ label="Séances prévues" name="seancesPrevues" type="number" defaut={e.seancesPrevues} />
              <Champ label="Date de début" name="debut" type="date" defaut={e.debut} />
              <Choix label="Canal" name="canal" defaut={e.canal} options={["Visio", "Présentiel"]} />
              <Champ label="Échéance (oral, concours, entretien)" name="echeance" defaut={e.echeance} />
            </div>
          </Carte>

          <Carte titre="Profil initial (séance diagnostic)">
            <div className="grid gap-3 sm:grid-cols-2">
              <Zone label="Objectif principal" name="objectif" defaut={e.objectif} lignes={2} className="sm:col-span-2" />
              <Zone label="Son histoire, son contexte" name="histoire" defaut={e.histoire} lignes={4} className="sm:col-span-2" aide="Situation, pourquoi maintenant, ce qui l'amène" />
              <Champ label="Profil d'orateur (quiz)" name="profilOrateur" defaut={e.profilOrateur} />
              <Champ label="Se note à l'oral (sur 10)" name="noteOral" defaut={e.noteOral} />
              <Zone label="Qualités" name="qualites" defaut={e.qualites} aide="Une par ligne" />
              <Zone label="Points forts" name="pointsForts" defaut={e.pointsForts} aide="Une par ligne" />
              <Zone label="Points faibles, à travailler" name="pointsFaibles" defaut={e.pointsFaibles} aide="Une par ligne" />
              <Zone label="Blocages et freins" name="blocages" defaut={e.blocages} aide="Trac, tics de langage, structure, confiance…" />
              <Choix label="Pack recommandé" name="packRecommande" defaut={e.packRecommande} options={[["", "Aucun"], ...PACKS.map((p) => [p, p] as const)]} />
              <Zone label="Mot pour l'élève (dans le diagnostic)" name="motDiagnostic" defaut={e.motDiagnostic} lignes={3} />
              <Zone label="Commentaire (privé, jamais envoyé)" name="commentaire" defaut={e.commentaire} lignes={4} className="sm:col-span-2" />
            </div>
          </Carte>

          <Carte titre="Bilan final">
            <div className="grid gap-3">
              <Zone label="Progression observée" name="bilan" defaut={e.bilan} lignes={3} />
              <Zone label="Message personnalisé pour l'élève" name="messageFinal" defaut={e.messageFinal} lignes={3} />
            </div>
          </Carte>
          <div className="sticky bottom-4 flex gap-3">
            <Bouton ton="orange">Enregistrer la fiche</Bouton>
          </div>
        </form>

        <div className="grid gap-6">
          <Carte titre="Mail de diagnostic">
            <p className="mt-0 mb-4 text-[14px] text-ink/65">
              Construit depuis la fiche : objectif, points forts, qualités, à travailler, blocages, pack recommandé et votre mot. Enregistrez la fiche avant de l&apos;envoyer.
            </p>
            {e.diagnosticEnvoyeLe && <p className="mt-0 mb-3 text-[13.5px]"><Badge ton="vert">Envoyé le {dateFr(e.diagnosticEnvoyeLe)}</Badge></p>}
            <form action={envoyerDiagnostic}>
              <input type="hidden" name="id" value={e.id} />
              <Bouton>{e.diagnosticEnvoyeLe ? "Renvoyer le diagnostic" : "Envoyer le diagnostic"}</Bouton>
            </form>
          </Carte>

          <Carte titre={`Séances (${e.seances.length})`}>
            <div className="grid gap-3">
              {e.seances.length === 0 && <Vide>Aucune séance enregistrée.</Vide>}
              {e.seances.map((s, i) => (
                <div key={s.id} className="rounded-[14px] bg-[#F4F7FC] p-4">
                  <p className="m-0 text-[14.5px] font-bold">
                    Séance {i + 1} · {dateFr(s.date)}
                    {s.theme && <span className="font-normal text-ink/65"> · {s.theme}</span>}
                  </p>
                  {s.aTravailler && <p className="mt-1 mb-0 text-[13.5px] whitespace-pre-line text-ink/65">{s.aTravailler}</p>}
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <form action={envoyerCompteRendu}>
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="seance" value={s.id} />
                      <Bouton ton="doux">Envoyer le compte-rendu</Bouton>
                    </form>
                    <form action={supprimerSeance}>
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="seance" value={s.id} />
                      <Bouton ton="danger">Supprimer</Bouton>
                    </form>
                  </div>
                  <div className="mt-3">
                    <Repli resume="Modifier la séance">
                      <FormSeance id={e.id} s={s} />
                    </Repli>
                  </div>
                </div>
              ))}
              <Repli resume="+ Ajouter une séance">
                <FormSeance id={e.id} />
              </Repli>
            </div>
          </Carte>

          <Carte titre="Cours, exercices et icebreakers attribués">
            {attribuees.length === 0 && <Vide>Rien d&apos;attribué pour l&apos;instant.</Vide>}
            <ul className="m-0 grid list-none gap-2 p-0">
              {attribuees.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 rounded-[12px] bg-[#F4F7FC] px-3 py-2">
                  <span className="text-[14px]">
                    <Badge ton="bleu">{TYPES_BIBLIO[b.type]}</Badge> <Link href={`/admin/bibliotheque/${b.id}`} className="font-semibold text-ink no-underline">{b.titre}</Link>
                  </span>
                  <form action={retirerRessource}>
                    <input type="hidden" name="id" value={e.id} />
                    <input type="hidden" name="ressource" value={b.id} />
                    <button className="cursor-pointer border-0 bg-transparent text-[13px] font-semibold text-[#C24600]">Retirer</button>
                  </form>
                </li>
              ))}
            </ul>
            {disponibles.length > 0 ? (
              <form action={attribuerRessource} className="mt-4 flex flex-wrap items-end gap-3">
                <input type="hidden" name="id" value={e.id} />
                <Choix label="Ajouter depuis la bibliothèque" name="ressource" options={disponibles.map((b) => [b.id, `${TYPES_BIBLIO[b.type]} · ${b.titre}`] as const)} className="min-w-[220px] flex-1" />
                <Bouton ton="doux">Attribuer</Bouton>
              </form>
            ) : (
              <p className="mt-3 mb-0 text-[13.5px] text-ink/55">
                La bibliothèque est vide : <Link href="/admin/bibliotheque" className="font-semibold text-royal">créez vos cours et exercices</Link>.
              </p>
            )}
          </Carte>

          <form action={supprimerEleve}>
            <input type="hidden" name="id" value={e.id} />
            <Bouton ton="danger">Supprimer cet élève</Bouton>
          </form>
        </div>
      </div>
    </>
  );
}
