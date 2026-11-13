import Link from "next/link";
import { getEvents } from "@/content";
import { lister } from "@/lib/base";
import { STATUTS_ELEVE, type EleveDoc } from "@/lib/eleves";
import { defis, opportunites, prochainDefi } from "@/lib/publications-discord";
import { readAll } from "@/lib/store";
import { Badge, Carte, Chiffre, Titre, Vide, dateFr, type Ton } from "@/components/admin/ui";
import { Icon, type IconName } from "@/components/ui/Icons";

type Alerte = { ton: Ton; icone: IconName; texte: string; href: string };

/** Tableau de bord : les chiffres, ce qui demande une action, les élèves en cours et les prochains événements. */
export default async function AdminAccueil() {
  const [eleves, membres, ebooks, candidatures, inscriptions, banque, fiches, evenements] = await Promise.all([
    lister<EleveDoc>("eleves"),
    readAll("membres"),
    readAll("ebooks"),
    readAll("candidatures-ambassadeur"),
    readAll("inscriptions"),
    defis(),
    opportunites(),
    getEvents(),
  ]);
  const adhesions = membres.filter((m) => m.evenement === "adhesion" && m.mode === "live");
  const enParcours = eleves.filter((e) => e.statut === "parcours");

  const alertes: Alerte[] = [];
  const aValider = fiches.filter((o) => o.statut === "a-valider").length;
  if (aValider) alertes.push({ ton: "or", icone: "send", texte: `${aValider} ressource${aValider > 1 ? "s" : ""} ou opportunité${aValider > 1 ? "s" : ""} à valider pour Discord`, href: "/admin/discord?onglet=opportunites" });
  if (!prochainDefi(banque)) alertes.push({ ton: "or", icone: "trophy", texte: "Aucun défi validé : rien ne part lundi sur Discord", href: "/admin/discord" });
  for (const e of eleves.filter((x) => x.statut === "decouverte" && !x.diagnosticEnvoyeLe))
    alertes.push({ ton: "orange", icone: "mail", texte: `Diagnostic à envoyer à ${e.prenom} ${e.nom}`.trim(), href: `/admin/eleves/${e.id}` });
  for (const e of enParcours.filter((x) => !x.seances.length))
    alertes.push({ ton: "bleu", icone: "calendar", texte: `${e.prenom} ${e.nom} n'a encore aucune séance`.trim(), href: `/admin/eleves/${e.id}` });
  if (candidatures.length) alertes.push({ ton: "bleu", icone: "award", texte: `${candidatures.length} candidature${candidatures.length > 1 ? "s" : ""} ambassadeur à regarder`, href: "/admin/communaute" });

  const aVenir = evenements.filter((e) => !e.postponed).slice(0, 3);

  return (
    <>
      <Titre titre="Bonjour" accent="Rebecca" sous={new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Paris" }).format(new Date())} />
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(180px,100%),1fr))" }}>
        <Chiffre valeur={enParcours.length} libelle="LEQ'ORA en parcours" href="/admin/eleves" />
        <Chiffre valeur={adhesions.length} libelle="Membres LEQ'FAM (réels)" href="/admin/communaute" />
        <Chiffre valeur={inscriptions.length} libelle="Inscriptions aux événements" href="/admin/contenu" />
        <Chiffre valeur={ebooks.length} libelle="E-books Mellie demandés" />
        <Chiffre valeur={alertes.length} libelle="Actions à faire" ton={alertes.length ? "orange" : undefined} />
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Carte titre="À faire">
          {alertes.length === 0 ? (
            <Vide>Tout est à jour.</Vide>
          ) : (
            <ul className="m-0 grid list-none gap-1 p-0">
              {alertes.map((a, i) => (
                <li key={i}>
                  <Link href={a.href} className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[14.5px] text-ink no-underline hover:bg-[#F4F7FC]">
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${{ or: "bg-[#FFF2D6] text-[#9A6400]", orange: "bg-[#FFE6D8] text-[#C24600]", bleu: "bg-[#E3EDFB] text-royal", vert: "bg-[#E6F6EC] text-[#1C8A4A]", gris: "bg-[#ECEFF4] text-ink/60" }[a.ton]}`}>
                      <Icon name={a.icone} size={16} />
                    </span>
                    {a.texte}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Carte>

        <div className="grid gap-6">
          <Carte titre="LEQ'ORA en cours" action={<Link href="/admin/eleves" className="text-[13.5px] font-bold text-royal no-underline">Tout voir</Link>}>
            {eleves.length === 0 ? (
              <Vide>
                Aucun élève pour l&apos;instant. <Link href="/admin/eleves" className="font-semibold text-royal">Ajouter un élève</Link>
              </Vide>
            ) : (
              <ul className="m-0 grid list-none gap-1 p-0">
                {eleves.slice(-5).reverse().map((e) => (
                  <li key={e.id}>
                    <Link href={`/admin/eleves/${e.id}`} className="flex items-center justify-between gap-3 rounded-[12px] px-3 py-2 text-[14.5px] text-ink no-underline hover:bg-[#F4F7FC]">
                      <span className="font-semibold">
                        {e.prenom} {e.nom}
                      </span>
                      <Badge ton={e.statut === "parcours" ? "bleu" : e.statut === "termine" ? "vert" : "or"}>{STATUTS_ELEVE[e.statut]}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Carte>
          <Carte titre="Prochains événements">
            {aVenir.length === 0 ? (
              <Vide>Aucun événement programmé.</Vide>
            ) : (
              <ul className="m-0 grid list-none gap-2 p-0">
                {aVenir.map((e) => (
                  <li key={e.slug} className="flex items-center gap-3 text-[14.5px]">
                    <Icon name="calendar" size={16} color="#114DA8" />
                    <span className="font-semibold">{e.title ?? "Événement"}</span>
                    <span className="text-ink/55">{e.startsAt ? dateFr(e.startsAt) : e.dateLabel}</span>
                  </li>
                ))}
              </ul>
            )}
          </Carte>
        </div>
      </div>
    </>
  );
}
