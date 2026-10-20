import type { Metadata } from "next";
import Image from "next/image";
import { pageMeta } from "@/lib/seo";
import { SITE } from "@/config/site";
import { EBOOKS } from "@/lib/lancements";
import { recevoirEbook } from "@/app/actions";
import { Header } from "@/components/layout/Header";
import { Check, DrawUnderline, Heart, Sparkle } from "@/components/ui/Doodles";
import { PrenomEmailForm } from "@/components/ui/PrenomEmailForm";
import { LivreMellie } from "@/components/mellie/LivreMellie";

export const metadata: Metadata = pageMeta({
  title: "Mellie a le trac, la BD gratuite pour gérer son trac",
  description: "Une BD drôle et utile pour apprendre à parler en public, avec un cahier d'exercices anti-trac. Gratuite en e-book, version papier en précommande. De 9 à 99 ans.",
  path: "/mellie",
  image: "/mellie/couverture.webp",
});

/** Les 6 secrets anti-trac de Mellie (page 22 de la BD). */
const SECRETS = [
  { titre: "Le trac est normal", texte: "C'est de l'énergie. On ne le chasse pas : on l'utilise.", fond: "#FFF0B3" },
  { titre: "Respire", texte: "4 secondes par le ventre, 6 secondes pour souffler.", fond: "#DDF0FB" },
  { titre: "Ancre-toi", texte: "Deux pieds bien à plat (ou six pattes).", fond: "#E3F3DA" },
  { titre: "Prépare ton décollage", texte: "Tes 3 premières phrases par cœur.", fond: "#FDE3D6" },
  { titre: "Cherche les fleurs", texte: "Regarde les visages qui sourient, pas les frelons.", fond: "#FBDDE8" },
  { titre: "Ose la pause", texte: "Le silence n'est pas un trou : c'est une respiration.", fond: "#EAE2FA" },
];

const APERCU = [
  { src: "/mellie/planche-ruche.webp", alt: "Planche de la BD : la Reine annonce que Mellie dansera devant toute la ruche" },
  { src: "/mellie/personnages.webp", alt: "Les personnages : Mellie, Tom, Mamie Jo, Pollen, Lili, Hugo, la Reine, Léon et Mme Garnier" },
  { src: "/mellie/six-secrets.webp", alt: "Les 6 secrets anti-trac de Mellie" },
  { src: "/mellie/cahier-respiration.webp", alt: "Cahier d'exercices : respire comme Mellie" },
];

const MERCI: Record<string, { titre: string; texte: string }> = {
  precommande: { titre: "Merci pour votre précommande !", texte: "Vous recevez la confirmation par mail. Je vous préviens dès que la BD part à l'impression, puis à l'expédition." },
  soutien: { titre: "Merci pour votre soutien !", texte: "Votre coup de pouce aide LEQ à créer de nouveaux outils pour apprendre à parler en public." },
};

export default async function MelliePage({ searchParams }: { searchParams: Promise<{ merci?: string }> }) {
  const merci = MERCI[(await searchParams).merci ?? ""];

  return (
    <>
      <div className="bg-hero overflow-hidden">
        <Header />
        <section className="wrap relative flex flex-wrap items-center gap-10 pt-8 pb-16 sm:pt-12 sm:pb-20">
          <Sparkle className="wiggle hide-sm absolute" size={44} style={{ left: "44%", top: 20 }} />
          <div className="min-w-0" style={{ flex: "1.1 1 420px" }}>
            <span className="inline-flex items-center rounded-full bg-gold px-4 py-2 text-[11px] font-bold tracking-[.16em] text-ink uppercase">Nouveau · BD gratuite</span>
            <h1 className="mt-5 mb-0 leading-[1] font-black tracking-[-0.04em] text-white" style={{ fontSize: "clamp(44px, 8vw, 72px)" }}>
              Mellie <span className="serif font-normal text-gold">a le trac</span>
            </h1>
            <DrawUnderline style={{ marginTop: 6 }} />
            <p className="mt-4 mb-0 text-[19px] font-semibold text-white">La gestion du trac racontée par une abeille</p>
            <p className="mt-4 mb-0 max-w-[540px] text-[16.5px] leading-[1.7] text-white/85">
              Mellie doit danser devant 20 000 abeilles. Tom doit parler devant 28 élèves. Et tous les deux ont le trac. Heureusement, Mamie Jo, ancienne comédienne et apicultrice, connaît six secrets pour apprivoiser le trac… À condition de les essayer pour de vrai.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["BD + cahier d'exercices anti-trac", "De 9 à 99 ans", "Gratuite en e-book"].map((t) => (
                <span key={t} className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-white">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="btn btn-p" href="#ebook">
                Recevoir la BD gratuite
              </a>
              <a className="btn btn-g" href="#papier">
                Version papier
              </a>
            </div>
          </div>
          <div className="relative flex min-w-0 justify-center" style={{ flex: ".9 1 340px" }}>
            <LivreMellie />
          </div>
        </section>
      </div>

      <main>
        {merci && (
          <div className="bg-gold px-4 py-5 text-center text-ink">
            <p className="m-0 text-[18px] font-bold">{merci.titre}</p>
            <p className="mt-1 mb-0 text-[15px]">{merci.texte}</p>
          </div>
        )}

        {/* Les 6 secrets */}
        <section className="bg-miel py-20 text-ink sm:py-24">
          <div className="wrap">
            <div className="reveal text-center">
              <p className="eyebrow" style={{ color: "#B86B00" }}>Dans la BD</p>
              <h2 className="h2">
                Les 6 secrets <span className="serif text-orange">anti-trac de Mellie</span>
              </h2>
              <p className="mx-auto mt-3 mb-0 max-w-[520px] text-[16px] text-ink/70">À relire avant chaque prise de parole. Ou à afficher au-dessus de ton bureau.</p>
            </div>
            <ol className="mt-12 grid list-none gap-5 p-0" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))" }}>
              {SECRETS.map((s, i) => (
                <li key={s.titre} className="secret-mellie reveal relative rounded-[22px] border-[3px] border-ink p-6" style={{ background: s.fond, boxShadow: "5px 5px 0 #2b1a0a" }}>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-[18px] font-black text-gold">{i + 1}</span>
                  <p className="mt-3 mb-0 text-[21px] font-black tracking-[-0.02em] uppercase">{s.titre}</p>
                  <p className="mt-2 mb-0 text-[15.5px] leading-[1.55] text-ink/80">{s.texte}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Aperçu des pages */}
        <section className="bg-light overflow-hidden py-20 text-ink sm:py-24">
          <div className="wrap">
            <div className="reveal relative text-center">
              <p className="eyebrow" style={{ color: "#114DA8" }}>Feuilletez</p>
              <h2 className="h2">
                Une BD drôle <span className="serif text-royal">et utile</span>
              </h2>
              <Heart className="wiggle hide-sm absolute" size={28} style={{ right: "22%", top: 0 }} />
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              {APERCU.map((a, i) => (
                <Image
                  key={a.src}
                  src={a.src}
                  alt={a.alt}
                  width={900}
                  height={1273}
                  sizes="240px"
                  className="apercu-page relative w-[200px] rounded-[8px] sm:w-[240px]"
                  style={{ height: "auto", rotate: `${[-3, 2, -2, 3][i]}deg`, boxShadow: "0 24px 40px -18px rgba(0,22,54,.45)" }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Les trois façons de la recevoir */}
        <section className="bg-night py-20 sm:py-[104px]">
          <div className="wrap">
            <div className="reveal text-center">
              <p className="eyebrow">Recevoir Mellie</p>
              <h2 className="h2 text-white">
                Gratuite, <span className="serif text-gold">ou en vrai papier.</span>
              </h2>
              <p className="mx-auto mt-3 mb-0 max-w-[560px] text-[15.5px] text-white/70">Gratuite et à partager librement, sans modification ni usage commercial.</p>
            </div>
            <div className="mt-12 grid items-start gap-7" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))" }}>
              {/* E-book */}
              <article id="ebook" className="reveal scroll-mt-24 rounded-[26px] p-7 text-white" style={{ background: "linear-gradient(165deg,#0e3f8b,#04193c)", boxShadow: "0 44px 80px -44px rgba(0,0,0,.85)" }}>
                <p className="m-0 text-[13px] font-bold tracking-[.16em] text-gold uppercase">📖 E-book</p>
                <p className="mt-2 mb-0 text-[30px] font-black">Gratuit</p>
                <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-white/75">La BD et son cahier d&apos;exercices en PDF, envoyés tout de suite par mail.</p>
                <PrenomEmailForm
                  action={recevoirEbook}
                  champs={{ livre: "mellie" }}
                  bouton="Recevoir la BD"
                  succes={{ titre: "C'est envoyé !", texte: "Le lien est aussi dans votre boîte mail.", lien: { label: "Télécharger la BD", href: EBOOKS.mellie.fichier } }}
                  className="mt-5"
                />
              </article>

              {/* Papier */}
              <article id="papier" className="reveal relative scroll-mt-24 rounded-[26px] bg-white p-7 text-ink" style={{ boxShadow: "8px 8px 0 #FFBD59" }}>
                <span className="absolute -top-3.5 right-6 rounded-full bg-orange px-3 py-[5px] text-[11px] font-bold tracking-[.12em] text-white uppercase">Précommande</span>
                <p className="m-0 text-[13px] font-bold tracking-[.16em] text-royal uppercase">📦 Version papier</p>
                <p className="mt-2 mb-0 flex items-baseline gap-2">
                  <span className="text-[30px] font-black">12 €</span>
                  <span className="text-[14px] text-ink/60">minimum, livraison comprise</span>
                </p>
                <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-ink/75">Le cahier se remplit mieux sur papier ! Prix libre : tout ce que vous ajoutez au-dessus de 12 € soutient LEQ.</p>
                <ul className="mt-4 mb-0 grid list-none gap-2.5 p-0">
                  {["Livraison en France", "Impression en un seul lot : vous êtes prévenu·e par mail de l'expédition", "Remboursement intégral si l'impression n'a pas lieu"].map((t) => (
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

              {/* Soutien */}
              <article className="reveal rounded-[26px] p-7 text-ink" style={{ background: "linear-gradient(160deg,#FFF6E6,#ffffff)", boxShadow: "0 44px 80px -44px rgba(0,0,0,.6)" }}>
                <p className="m-0 text-[13px] font-bold tracking-[.16em] text-[#B86B00] uppercase">💛 Soutenir LEQ</p>
                <p className="mt-2 mb-0 text-[30px] font-black">Montant libre</p>
                <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-ink/75">
                  Mellie est gratuite, et le restera. Si elle vous a aidé, vous pouvez soutenir LEQ librement, du montant de votre choix : c&apos;est ce qui permet de créer de nouveaux outils pour apprendre à parler en public.
                </p>
                <a className="btn btn-royal mt-6 w-full" href={SITE.stripeSoutien} target="_blank" rel="noopener">
                  Soutenir LEQ
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* Le mot de l'autrice */}
        <section className="bg-miel py-20 text-ink sm:py-24">
          <div className="wrap reveal" style={{ maxWidth: 760 }}>
            <p className="eyebrow" style={{ color: "#B86B00" }}>Le mot de l&apos;autrice</p>
            <p className="serif mt-4 mb-0 text-[26px] leading-[1.45]">
              « Le trac ne disparaît pas, mais on apprend à danser avec. Et si Mellie t&apos;a aidé, partage-la à quelqu&apos;un qui a le trac. »
            </p>
            <p className="mt-5 mb-0 text-[16px] font-bold">{SITE.founder}</p>
          </div>
        </section>
      </main>
    </>
  );
}
