const ETAPES = [
  { n: 1, tag: "Gratuit", title: "Diagnostic", text: "30 minutes en visio, offertes. On fait le point sur vos besoins et vos objectifs.", pos: "min-[900px]:left-0 min-[900px]:top-0" },
  { n: 2, tag: "Votre pack", title: "Parcours", text: "Des séances rythmées, avec peu de théorie et beaucoup de pratique. On apprend en faisant.", pos: "min-[900px]:left-[36%] min-[900px]:top-[330px]" },
  { n: 3, tag: "Après", title: "Suivi", text: "Une fiche de synthèse et un diagnostic de fin. Je vous accompagne jusqu'à 3 mois après.", pos: "min-[900px]:right-0 min-[900px]:top-0" },
];

const ROAD = "M150 180 C150 430 290 480 420 480 L668 480 C800 480 935 430 935 180";

export function Methode() {
  return (
    <section id="methode" className="bg-sky relative overflow-hidden py-20 sm:py-[104px]">
      <div className="wrap relative">
        <div className="text-center">
          <p className="eyebrow">La méthode LEQ</p>
          <h2 className="h2 text-white">
            Un chemin <span className="serif text-gold">en trois étapes.</span>
          </h2>
          <p className="mt-4 text-[17px] text-white/88">Voici les différentes étapes.</p>
        </div>

        {/* Bureau : cartes posées sur la route. Mobile : étapes empilées le long d'une route verticale. */}
        <ol className="relative mt-10 grid list-none gap-8 p-0 pl-10 min-[900px]:block min-[900px]:h-[620px] min-[900px]:pl-0">
          <svg className="absolute inset-0 z-[1] hidden h-full w-full min-[900px]:block" viewBox="0 0 1088 620" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <path d={ROAD} stroke="rgba(0,22,54,.3)" strokeWidth="66" strokeLinecap="round" />
            <path d={ROAD} stroke="#E8EFFA" strokeWidth="56" strokeLinecap="round" />
            <path className="road-dash" d={ROAD} stroke="#FFBD59" strokeWidth="5" strokeLinecap="round" strokeDasharray="16 16" />
            <g transform="translate(990 300)">
              <path d="M0 0v62" stroke="#001636" strokeWidth="4" strokeLinecap="round" />
              <path d="M2 2h36l-8 10 8 10H2z" fill="#FF5E01" stroke="#001636" strokeWidth="2.5" strokeLinejoin="round" />
            </g>
          </svg>
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[13px] w-[10px] rounded-full bg-cloud min-[900px]:hidden" style={{ boxShadow: "0 0 0 3px rgba(0,22,54,.25)" }}>
            <span className="absolute inset-y-2 left-1/2 -ml-[1.5px] w-[3px]" style={{ backgroundImage: "linear-gradient(#FFBD59 50%, transparent 50%)", backgroundSize: "3px 16px" }} />
          </span>

          {ETAPES.map((e) => (
            <li key={e.n} className={`sticker relative z-[2] px-[26px] py-7 min-[900px]:absolute min-[900px]:w-[28%] ${e.pos}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-[28px] font-bold text-ink" style={{ boxShadow: "0 0 0 6px rgba(255,189,89,.25)" }}>
                  {e.n}
                </span>
                <span className="rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[.18em] uppercase" style={{ background: "#FFF1E3", color: "#CC4A00" }}>
                  {e.tag}
                </span>
              </div>
              <h3 className="mt-[18px] mb-0 text-[25px] font-bold tracking-[-0.03em]">{e.title}</h3>
              <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-ink/70">{e.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
