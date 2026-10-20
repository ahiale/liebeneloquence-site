import Image from "next/image";
import { SITE } from "@/config/site";
import { EBOOKS, OBJECTIF_PRECOMMANDES } from "@/lib/lancements";
import { recevoirEbook } from "@/app/actions";
import { Check } from "@/components/ui/Doodles";
import { PrenomEmailForm } from "@/components/ui/PrenomEmailForm";
import { LivreMellie } from "@/components/mellie/LivreMellie";
import { MerciMellie } from "@/components/mellie/MerciMellie";

const APERCU = [
  { src: "/mellie/personnages.webp", alt: "Les personnages : Mellie, Tom, Mamie Jo, Pollen, Lili, Hugo, la Reine, Léon et Mme Garnier" },
  { src: "/mellie/planche-ruche.webp", alt: "Planche de la BD : la Reine annonce que Mellie dansera devant toute la ruche" },
  { src: "/mellie/cahier-respiration.webp", alt: "Cahier d'exercices : respire comme Mellie" },
];

/**
 * BD « Mellie a le trac » (page Autres services, ancre #mellie ; l'adresse /mellie y renvoie) :
 * le livre en 3D, trois pages en aperçu, puis e-book gratuit, précommande papier et soutien libre.
 */
export function SectionMellie() {
  return (
    <section id="mellie" className="bg-miel overflow-hidden py-20 text-ink sm:py-[104px]">
      <div className="wrap">
        <MerciMellie />

        <div className="flex flex-wrap items-center gap-12">
          <div className="relative flex min-w-0 justify-center" style={{ flex: ".9 1 340px" }}>
            <LivreMellie />
          </div>
          <div className="reveal min-w-0" style={{ flex: "1.1 1 420px" }}>
            <span className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-[11px] font-bold tracking-[.16em] text-gold uppercase">Nouveau · BD gratuite</span>
            <h2 className="h2 mt-[22px]">
              Mellie <span className="serif text-orange">a le trac</span>
            </h2>
            <p className="mt-3 mb-0 text-[18px] font-semibold">La gestion du trac racontée par une abeille</p>
            <p className="mt-4 mb-0 max-w-[540px] text-[16px] leading-[1.7] text-ink/75">
              Mellie doit danser devant 20 000 abeilles. Tom doit parler devant 28 élèves. Et tous les deux ont le trac. Heureusement, Mamie Jo, ancienne comédienne et apicultrice, connaît six secrets pour apprivoiser le trac… À condition de les essayer pour de vrai.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["BD + cahier d'exercices anti-trac", "De 9 à 99 ans"].map((t) => (
                <span key={t} className="rounded-full border border-ink/20 bg-white/60 px-3.5 py-1.5 text-[13px] font-semibold">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Aperçu : trois pages seulement */}
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          {APERCU.map((a, i) => (
            <Image
              key={a.src}
              src={a.src}
              alt={a.alt}
              width={900}
              height={1273}
              sizes="220px"
              className="apercu-page relative w-[180px] rounded-[8px] sm:w-[220px]"
              style={{ height: "auto", rotate: `${[-3, 2, -2][i]}deg`, boxShadow: "0 24px 40px -18px rgba(43,26,10,.45)" }}
            />
          ))}
        </div>

        {/* Les trois façons de la recevoir */}
        <div className="mt-16 grid items-start gap-7" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))" }}>
          <article id="ebook" className="reveal scroll-mt-24 rounded-[26px] p-7 text-white" style={{ background: "linear-gradient(165deg,#0e3f8b,#04193c)", boxShadow: "0 44px 80px -44px rgba(0,0,0,.6)" }}>
            <p className="m-0 text-[13px] font-bold tracking-[.16em] text-gold uppercase">📖 E-book</p>
            <p className="mt-2 mb-0 text-[30px] font-black">Gratuit</p>
            <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-white/75">La BD et son cahier d&apos;exercices en PDF, envoyés tout de suite par mail. À partager librement, sans modification ni usage commercial.</p>
            <PrenomEmailForm
              action={recevoirEbook}
              champs={{ livre: "mellie" }}
              bouton="Recevoir la BD"
              succes={{ titre: "C'est envoyé !", texte: "Le lien est aussi dans votre boîte mail.", lien: { label: "Télécharger la BD", href: EBOOKS.mellie.fichier } }}
              className="mt-5"
            />
          </article>

          <article id="papier" className="reveal relative scroll-mt-24 rounded-[26px] bg-white p-7 text-ink" style={{ boxShadow: "8px 8px 0 #FFBD59" }}>
            <span className="absolute -top-3.5 right-6 rounded-full bg-orange px-3 py-[5px] text-[11px] font-bold tracking-[.12em] text-white uppercase">Précommande</span>
            <p className="m-0 text-[13px] font-bold tracking-[.16em] text-royal uppercase">📦 Version papier</p>
            <p className="mt-2 mb-0 flex items-baseline gap-2">
              <span className="text-[30px] font-black">12 €</span>
              <span className="text-[14px] text-ink/60">minimum</span>
            </p>
            <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-ink/75">
              Le cahier se remplit mieux sur papier ! Les 12 € couvrent uniquement l&apos;impression et l&apos;envoi. Vous pouvez ajouter ce que vous voulez au-dessus pour soutenir LEQ.
            </p>
            <ul className="mt-4 mb-0 grid list-none gap-2.5 p-0">
              {[`L'impression est lancée dès ${OBJECTIF_PRECOMMANDES} précommandes, pas avant`, "Livraison en France uniquement", "Remboursement intégral si l'impression n'a pas lieu"].map((t) => (
                <li key={t} className="flex gap-2.5 text-[14.5px] leading-[1.5] text-ink/80">
                  <Check />
                  {t}
                </li>
              ))}
            </ul>
            <a className="btn btn-p mt-6 w-full" href={SITE.stripeMellie} target="_blank" rel="noopener">
              Précommander
            </a>
          </article>

          <article className="reveal rounded-[26px] p-7 text-ink" style={{ background: "linear-gradient(160deg,#FFF6E6,#ffffff)", boxShadow: "0 44px 80px -44px rgba(43,26,10,.5)" }}>
            <p className="m-0 text-[13px] font-bold tracking-[.16em] text-[#B86B00] uppercase">💛 Soutenir LEQ</p>
            <p className="mt-2 mb-0 text-[30px] font-black">Montant libre</p>
            <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-ink/75">
              Mellie est gratuite, et le restera. Si elle vous a aidé, vous pouvez soutenir LEQ du montant de votre choix : c&apos;est ce qui permet de créer de nouveaux outils pour apprendre à parler en public.
            </p>
            <a className="btn btn-royal mt-6 w-full" href={SITE.stripeSoutien} target="_blank" rel="noopener">
              Soutenir LEQ
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
