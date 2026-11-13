import { getArticles, getEvents, getPricing, getReviews } from "@/content";
import { readAll } from "@/lib/store";
import { Badge, Carte, Titre, Vide, dateFr } from "@/components/admin/ui";
import { Icon } from "@/components/ui/Icons";

/** Vue d'ensemble du contenu du site. La modification depuis l'admin arrive à l'étape suivante (aujourd'hui : fichiers content/). */
export default async function AdminContenu() {
  const [evenements, articles, avis, avisRecus, inscriptions, { packs }] = await Promise.all([getEvents(), getArticles(), getReviews(), readAll("avis-recus"), readAll("inscriptions"), getPricing()]);
  const inscrits = (slug: string) => inscriptions.filter((l) => l.event === slug).length;

  return (
    <>
      <Titre titre="Contenu" accent="du site" sous="Événements, blog, avis et tarifs tels qu'ils sont en ligne." />
      <p className="mb-6 flex items-center gap-2 rounded-[14px] bg-[#E3EDFB] px-5 py-3 text-[14.5px] text-royal">
        <Icon name="pen" size={17} /> Pour l&apos;instant, demandez-moi les modifications. L&apos;édition directe ici est la prochaine étape.
      </p>
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Carte titre={`Événements (${evenements.length})`}>
          {evenements.length === 0 ? (
            <Vide>Aucun événement publié.</Vide>
          ) : (
            <ul className="m-0 grid list-none gap-2 p-0">
              {evenements.map((e) => (
                <li key={e.slug} className="flex flex-wrap items-center gap-3 rounded-[12px] bg-[#F4F7FC] px-4 py-3 text-[14.5px]">
                  <span className="flex-1 font-semibold">{e.title ?? "Événement"}</span>
                  <span className="text-ink/55">{e.startsAt ? dateFr(e.startsAt) : e.dateLabel}</span>
                  {e.postponed ? <Badge ton="gris">Reporté</Badge> : e.signup ? <Badge ton="bleu">{inscrits(e.slug)} inscrits</Badge> : <Badge>{e.priceLabel ?? ""}</Badge>}
                </li>
              ))}
            </ul>
          )}
        </Carte>
        <Carte titre={`Blog (${articles.length})`}>
          <ul className="m-0 grid list-none gap-2 p-0">
            {articles.map((a) => (
              <li key={a.slug} className="flex items-center gap-3 rounded-[12px] bg-[#F4F7FC] px-4 py-3 text-[14.5px]">
                <span className="flex-1 font-semibold">{a.title}</span>
                <span className="text-ink/55">{dateFr(a.date)}</span>
              </li>
            ))}
          </ul>
        </Carte>
        <Carte titre="Avis">
          <p className="m-0 text-[14.5px]">
            <strong>{avis.length}</strong> avis publiés sur le site · <strong>{avisRecus.length}</strong> reçus par le formulaire (liebeneloquence.com/avis).
          </p>
          {avisRecus.slice(-3).reverse().map((r, i) => (
            <p key={i} className="mt-3 mb-0 rounded-[12px] bg-[#F4F7FC] px-4 py-3 text-[14px]">
              <strong>{String(r.prenom)}</strong> · {String(r.note)}/5 · {r.publication ? "accepte la publication" : "ne souhaite pas être publié"}
              <span className="mt-1 block text-ink/70">{String(r.texte)}</span>
            </p>
          ))}
        </Carte>
        <Carte titre="Tarifs des packs">
          <ul className="m-0 grid list-none gap-2 p-0">
            {packs.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-[12px] bg-[#F4F7FC] px-4 py-3 text-[14.5px]">
                <span className="font-semibold">{p.name}</span>
                <span className="tabular-nums">{p.price.toString().replace(".", ",")} €</span>
              </li>
            ))}
          </ul>
        </Carte>
      </div>
    </>
  );
}
