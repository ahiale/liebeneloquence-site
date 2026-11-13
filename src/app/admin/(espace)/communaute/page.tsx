import { getPartenaires, getPricing } from "@/content";
import { utilisationsCode } from "@/lib/leqfam";
import { stripeMode } from "@/lib/stripe";
import { readAll } from "@/lib/store";
import { Badge, Carte, Chiffre, Onglets, Titre, Vide, dateFr, type Ton } from "@/components/admin/ui";
import { Icon } from "@/components/ui/Icons";

type Ligne = Record<string, unknown>;
const s = (v: unknown) => (v == null ? "" : String(v));

/** État actuel de chaque abonnement : la dernière ligne du journal data/membres.jsonl l'emporte. */
function membresActuels(journal: Ligne[]) {
  const parAbonnement = new Map<string, { adhesion: Ligne; dernier: Ligne }>();
  for (const l of journal) {
    const ab = s(l.abonnement);
    if (l.evenement === "adhesion") parAbonnement.set(ab, { adhesion: l, dernier: l });
    else if (parAbonnement.has(ab)) parAbonnement.get(ab)!.dernier = l;
  }
  return [...parAbonnement.values()].reverse();
}

const STATUT: Record<string, [Ton, string]> = {
  adhesion: ["vert", "Actif"],
  resiliation_demandee: ["or", "Résiliation demandée"],
  fin: ["gris", "Terminé"],
  impaye: ["orange", "Paiement échoué"],
};

export default async function AdminCommunaute({ searchParams }: { searchParams: Promise<{ onglet?: string }> }) {
  const { onglet = "membres" } = await searchParams;
  const mode = stripeMode();
  const [journal, partenaires, candidatures, { leqfam }] = await Promise.all([readAll("membres"), getPartenaires(), readAll("candidatures-ambassadeur"), getPricing()]);
  const membres = membresActuels(journal);
  const reels = membres.filter((m) => m.adhesion.mode === "live");
  const actifs = reels.filter((m) => m.dernier.evenement === "adhesion" || m.dernier.evenement === "resiliation_demandee");
  const codes = await Promise.all(partenaires.map(async (p) => ({ ...p, utilisations: await utilisationsCode(p.code) })));

  return (
    <>
      <Titre titre="Communauté" accent="LEQ'FAM" sous="Tout ce qui se passe en dehors de Discord : adhésions, codes promo, ambassadeurs." />
      {mode !== "live" && (
        <p className="mb-6 flex items-center gap-2 rounded-[14px] bg-[#FFF2D6] px-5 py-3 text-[14.5px] text-[#7A5000]">
          <Icon name="alert" size={18} /> Les paiements LEQ&apos;FAM sont encore en <strong>mode test</strong> : les adhésions ci-dessous sont des essais.
        </p>
      )}
      <div className="mb-6 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(180px,100%),1fr))" }}>
        <Chiffre valeur={actifs.length} libelle="Membres actifs (réels)" />
        <Chiffre valeur={membres.length - reels.length} libelle="Adhésions de test" />
        <Chiffre valeur={codes.length} libelle="Codes promo" />
        <Chiffre valeur={candidatures.length} libelle="Candidatures ambassadeur" />
      </div>
      <Onglets
        actif={onglet}
        onglets={[
          { id: "membres", label: "Membres", href: "/admin/communaute", nombre: membres.length },
          { id: "codes", label: "Codes promo", href: "/admin/communaute?onglet=codes", nombre: codes.length },
          { id: "ambassadeurs", label: "Candidatures ambassadeur", href: "/admin/communaute?onglet=ambassadeurs", nombre: candidatures.length },
        ]}
      />

      {onglet === "membres" && (
        <Carte>
          {membres.length === 0 ? (
            <Vide>Aucune adhésion pour l&apos;instant.</Vide>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[14.5px]">
                <thead>
                  <tr className="text-[12px] tracking-[.06em] text-ink/50 uppercase">
                    <th className="px-3 pb-3">Membre (Discord)</th>
                    <th className="px-3 pb-3">Formule</th>
                    <th className="px-3 pb-3">Code</th>
                    <th className="px-3 pb-3">Depuis</th>
                    <th className="px-3 pb-3">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {membres.map(({ adhesion: a, dernier: d }) => {
                    const [ton, libelle] = STATUT[s(d.evenement)] ?? ["gris", s(d.evenement)];
                    return (
                      <tr key={s(a.abonnement)} className="border-t border-ink/8">
                        <td className="px-3 py-3">
                          <span className="font-bold">{s(a.discordNom) || "—"}</span>
                          <div className="text-[12.5px] text-ink/50">{s(a.email)}</div>
                        </td>
                        <td className="px-3 py-3">{a.formule === "engagement" ? "Avec engagement" : "Sans engagement"}</td>
                        <td className="px-3 py-3">{s(a.code) || "—"}</td>
                        <td className="px-3 py-3">{dateFr(s(a.createdAt))}</td>
                        <td className="px-3 py-3">
                          <Badge ton={ton}>{libelle}</Badge> {a.mode !== "live" && <Badge>Test</Badge>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Carte>
      )}

      {onglet === "codes" && (
        <Carte>
          <p className="mt-0 mb-4 text-[14px] text-ink/60">
            Avec un code : {leqfam.partnerMonthlyPrice.toString().replace(".", ",")} € par mois pendant {leqfam.partnerDurationMonths} mois. Pour créer un code, donnez-moi le nom et l&apos;ambassadeur ou l&apos;association (création depuis l&apos;admin bientôt).
          </p>
          <div className="grid gap-3">
            {codes.map((c) => (
              <div key={c.code} className="flex flex-wrap items-center gap-4 rounded-[14px] bg-[#F4F7FC] px-4 py-3">
                <span className="min-w-[130px] font-mono text-[15px] font-bold">{c.code}</span>
                <span className="flex-1 text-[14px]">
                  {c.nom} <Badge>{c.type === "ambassadeur" ? "Ambassadeur" : "Association"}</Badge> {!c.actif && <Badge ton="orange">Désactivé</Badge>}
                </span>
                <span className="flex items-center gap-2 text-[14px] tabular-nums">
                  <span className="h-2 w-24 overflow-hidden rounded-full bg-[#E5EBF5]">
                    <span className="block h-full" style={{ width: `${c.limite ? Math.min(100, (c.utilisations / c.limite) * 100) : 0}%`, background: "linear-gradient(90deg,#FFBD59,#FF5E01)" }} />
                  </span>
                  {c.utilisations}/{c.limite ?? "∞"}
                </span>
              </div>
            ))}
          </div>
        </Carte>
      )}

      {onglet === "ambassadeurs" && (
        <div className="grid gap-4">
          {candidatures.length === 0 && <Vide>Aucune candidature pour l&apos;instant (formulaire : liebeneloquence.com/ambassadeurs).</Vide>}
          {[...candidatures].reverse().map((c, i) => (
            <Carte key={i} titre={`${s(c.prenom)} ${s(c.nom)}`} action={<span className="text-[13px] text-ink/50">{dateFr(s(c.createdAt))}</span>}>
              <p className="mt-0 mb-2 text-[14px] text-ink/65">
                {s(c.email)}
                {c.reseaux ? ` · ${s(c.reseaux)}` : ""}
                {c.association ? ` · ${s(c.association)}` : ""} · {c.concours === "oui" ? "A déjà fait un concours d'éloquence" : "Jamais de concours"}
              </p>
              <p className="mt-3 mb-1 text-[13px] font-bold text-ink/60 uppercase">Parcours</p>
              <p className="m-0 text-[14.5px] whitespace-pre-line">{s(c.parcours)}</p>
              <p className="mt-3 mb-1 text-[13px] font-bold text-ink/60 uppercase">Motivation</p>
              <p className="m-0 text-[14.5px] whitespace-pre-line">{s(c.motivation)}</p>
              <a href={`mailto:${s(c.email)}`} className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-royal no-underline">
                <Icon name="mail" size={16} /> Lui répondre
              </a>
            </Carte>
          ))}
        </div>
      )}
    </>
  );
}
