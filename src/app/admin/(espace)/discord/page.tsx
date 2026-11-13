import { getDefis, getOpportunites } from "@/content";
import { salonsTexte } from "@/lib/discord";
import { DEFIS_ACTIFS, lirePlanning } from "@/lib/publications-discord";
import { readAll } from "@/lib/store";
import { annulerMessage, validerOpportunite } from "@/app/admin/actions";
import { ProgrammerForm } from "@/components/admin/ProgrammerForm";

const dateParis = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

/** Prochain lundi à 9 h (ou aujourd'hui si on est lundi avant 9 h), pour l'affichage. */
function prochainLundi(): string {
  const d = new Date();
  const jour = (8 - d.getDay()) % 7;
  d.setDate(d.getDate() + (jour === 0 && d.getHours() >= 9 ? 7 : jour));
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(d);
}

const Carte = ({ titre, children }: { titre: string; children: React.ReactNode }) => (
  <section className="rounded-[22px] bg-white p-6" style={{ boxShadow: "0 20px 40px -32px rgba(0,22,54,.6)" }}>
    <h2 className="m-0 text-[20px] font-bold">{titre}</h2>
    <div className="mt-4">{children}</div>
  </section>
);

export default async function AdminDiscord() {
  const [salons, planning, publies, defis, opportunites, validees] = await Promise.all([
    salonsTexte().catch(() => []),
    lirePlanning(),
    readAll("discord-publies"),
    getDefis(),
    getOpportunites(),
    readAll("opportunites-validees"),
  ]);
  const dejaPublies = new Set(publies.map((p) => String(p.cle)));
  const aVenir = planning.filter((m) => !dejaPublies.has(`planning-${m.id}`));
  const defisTires = [...dejaPublies].filter((c) => c.startsWith("defi-")).length;
  const prochainDefi = defis[defisTires % defis.length];
  const ok = new Set(validees.map((v) => String(v.id)));
  const brouillons = opportunites.filter((o) => o.brouillon && !ok.has(o.id) && !dejaPublies.has(`opportunite-${o.id}`));

  return (
    <>
      <h1 className="m-0 text-[30px] font-bold tracking-[-0.03em]">Discord</h1>
      <p className="mt-2 mb-0 text-[15px] text-ink/65">Le robot LEQ publie toutes les 5 minutes ce qui est arrivé à l&apos;heure.</p>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
        <Carte titre="Programmer un message">
          <ProgrammerForm salons={salons.map((s) => s.name)} />
        </Carte>

        <div className="grid gap-6">
          <Carte titre={`À venir (${aVenir.length})`}>
            {aVenir.length === 0 && <p className="m-0 text-[14.5px] text-ink/55">Aucun message programmé.</p>}
            <ul className="m-0 grid list-none gap-3 p-0">
              {aVenir.map((m) => (
                <li key={m.id} className="rounded-[14px] bg-[#F4F7FC] p-4">
                  <p className="m-0 text-[13px] font-semibold text-royal">
                    #{m.salon} · {dateParis(m.quand)}
                  </p>
                  <p className="mt-1 mb-0 text-[14.5px] whitespace-pre-line text-ink/80">{m.message.length > 220 ? `${m.message.slice(0, 220)}…` : m.message}</p>
                  <form action={annulerMessage} className="mt-2">
                    <input type="hidden" name="id" value={m.id} />
                    <button className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-orange underline">Annuler</button>
                  </form>
                </li>
              ))}
            </ul>
          </Carte>

          <Carte titre="Défi de la semaine">
            {DEFIS_ACTIFS ? (
              <p className="m-0 text-[14.5px] text-ink/70">
                Prochain défi, <strong>{prochainLundi()} à 9 h</strong> dans #discussion-générale :
              </p>
            ) : (
              <p className="m-0 rounded-[12px] bg-[#FFF2D6] px-4 py-3 text-[14px] text-[#7A5000]">
                <strong>En pause</strong> : aucun défi ne part tant que vous ne l&apos;avez pas validé. Premier défi prévu :
              </p>
            )}
            <p className="mt-2 mb-0 text-[16px] font-semibold">🎯 {prochainDefi.titre}</p>
            <p className="mt-1 mb-0 text-[14px] text-ink/70">{prochainDefi.consigne}</p>
            <p className="mt-3 mb-0 text-[13px] text-ink/50">
              {defisTires} défi{defisTires > 1 ? "s" : ""} publié{defisTires > 1 ? "s" : ""} sur {defis.length} dans la banque.
            </p>
          </Carte>

          <Carte titre={`Opportunités à valider (${brouillons.length})`}>
            {brouillons.length === 0 && <p className="m-0 text-[14.5px] text-ink/55">Rien à valider.</p>}
            <ul className="m-0 grid list-none gap-3 p-0">
              {brouillons.map((o) => (
                <li key={o.id} className="rounded-[14px] bg-[#F4F7FC] p-4">
                  <p className="m-0 text-[14.5px] font-semibold">{o.titre}</p>
                  <p className="mt-1 mb-0 text-[13px] text-ink/60">
                    {o.etiquettes.join(", ")}
                    {o.dateLimite ? ` · date limite : ${o.dateLimite}` : ""}
                  </p>
                  <form action={validerOpportunite} className="mt-2">
                    <input type="hidden" name="id" value={o.id} />
                    <button className="cursor-pointer rounded-full border-0 bg-royal px-4 py-1.5 text-[13px] font-semibold text-white">Publier dans le forum</button>
                  </form>
                </li>
              ))}
            </ul>
          </Carte>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="m-0 text-[20px] font-bold">Dernières publications</h2>
        <ul className="mt-4 mb-0 grid list-none gap-2 p-0">
          {publies
            .slice(-10)
            .reverse()
            .map((p, i) => (
              <li key={i} className="text-[14px] text-ink/75">
                <span className="text-ink/45">{dateParis(String(p.createdAt))}</span> · {String(p.origine)} · #{String(p.salon)} · {String(p.apercu)}
              </li>
            ))}
        </ul>
      </section>
    </>
  );
}
