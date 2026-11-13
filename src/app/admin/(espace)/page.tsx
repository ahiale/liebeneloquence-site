import Link from "next/link";
import { MODULES } from "@/lib/admin";
import { readAll } from "@/lib/store";

/** Tableau de bord : les chiffres du moment et les modules de l'admin. */
export default async function AdminAccueil() {
  const [membres, ebooks, prevenir, candidatures, inscriptions] = await Promise.all([
    readAll("membres"),
    readAll("ebooks"),
    readAll("a-prevenir"),
    readAll("candidatures-ambassadeur"),
    readAll("inscriptions"),
  ]);
  const chiffres = [
    { label: "Adhésions LEQ'FAM (réelles)", valeur: membres.filter((m) => m.evenement === "adhesion" && m.mode === "live").length },
    { label: "E-books Mellie demandés", valeur: ebooks.length },
    { label: "Inscriptions aux événements", valeur: inscriptions.length },
    { label: "Personnes à prévenir (jeu, appli)", valeur: prevenir.length },
    { label: "Candidatures ambassadeur", valeur: candidatures.length },
  ];

  return (
    <>
      <h1 className="m-0 text-[32px] font-bold tracking-[-0.03em]">
        Bonjour <span className="serif text-royal">Rebecca</span>
      </h1>
      <div className="mt-8 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(200px,100%),1fr))" }}>
        {chiffres.map((c) => (
          <div key={c.label} className="rounded-[18px] bg-white p-5" style={{ boxShadow: "0 20px 40px -32px rgba(0,22,54,.6)" }}>
            <p className="m-0 text-[34px] font-bold tabular-nums">{c.valeur}</p>
            <p className="mt-1 mb-0 text-[14px] text-ink/65">{c.label}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-12 mb-0 text-[22px] font-bold">Modules</h2>
      <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(220px,100%),1fr))" }}>
        {MODULES.map((m) =>
          m.pret ? (
            <Link key={m.href} href={m.href} className="rounded-[18px] bg-royal p-5 font-semibold text-white no-underline">
              {m.label} →
            </Link>
          ) : (
            <div key={m.href} className="rounded-[18px] border-2 border-dashed border-ink/15 p-5 text-ink/45">
              {m.label} · bientôt
            </div>
          ),
        )}
      </div>
    </>
  );
}
