import type { Metadata } from "next";
import Link from "next/link";
import { getPricing } from "@/content";
import { SITE, paymentHref } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { Header } from "@/components/layout/Header";
import { BubbleTail, DrawUnderline, Heart, Sparkle } from "@/components/ui/Doodles";
import { Icon, type IconName } from "@/components/ui/Icons";
import { WaitlistForm } from "@/components/communaute/WaitlistForm";

export const metadata: Metadata = {
  title: "La communauté LEQ'FAM",
  description: "La première communauté francophone en ligne dédiée à la prise de parole en public, à l'éloquence et aux soft skills. Sur Discord, 3,99 € par mois.",
  alternates: { canonical: "/communaute" },
};

const ENSEMBLE: { icon: IconName; title: string; text: string; rotate: number }[] = [
  { icon: "video", title: "Des lives chaque semaine", text: "Sur des thématiques choisies par la communauté : prise de parole, storytelling, gestion du trac, improvisation, culture générale, avec des invités surprises réguliers.", rotate: -1.2 },
  { icon: "chat", title: "Une entraide quotidienne", text: "Vous préparez une soutenance, un concours, un entretien ? Vous postez, la communauté répond.", rotate: 1 },
  { icon: "trophy", title: "Le Grand Prix LEQ", text: "Un concours trimestriel ouvert à tous les membres. Le gagnant est désigné à 50 % par le vote du public et à 50 % par un jury invité. À la clé, jusqu'à 200 € de prix.", rotate: -0.8 },
];

const SALONS = [
  ["annonces", "toutes les informations importantes sur les lives, les concours et les opportunités extérieures."],
  ["présente-toi", "faire connaissance avec les autres membres dès l'arrivée."],
  ["discussion-générale", "échanger librement sur l'éloquence, la communication et la culture."],
  ["vos-prises-de-parole", "partager ses discours et recevoir des retours bienveillants."],
  ["quiz", "se challenger sur la culture générale et l'éloquence."],
  ["témoignages", "partager ses progrès et inspirer la communauté."],
  ["concours-éloquence", "suivre toute l'actualité du Grand Prix LEQ."],
];

export default async function CommunautePage() {
  const { leqfam } = await getPricing();
  const price = formatPrice(leqfam.monthlyPrice);
  // Tant que la communauté n'est pas ouverte (mention de disponibilité dans tarifs.json),
  // les boutons mènent à la liste d'attente ; ensuite, au paiement Stripe.
  const waitlist = leqfam.availability !== null;
  const join = waitlist ? "#rejoindre" : paymentHref(SITE.stripeLeqfam);
  const joinLabel = waitlist ? "Rejoindre la liste d'attente" : "Rejoindre la LEQ'FAM";
  const joinProps = join.startsWith("http") ? { target: "_blank", rel: "noreferrer noopener" } : {};

  return (
    <>
      <div className="bg-hero">
        <Header />
        <section className="pt-8 pb-20 sm:pt-12 sm:pb-[104px]">
          <div className="wrap flex flex-wrap items-center gap-12">
            <div className="relative min-w-0" style={{ flex: "1.1 1 480px" }}>
              {leqfam.availability && (
                <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-[11px] font-bold tracking-[.16em] text-orange uppercase">{leqfam.availability}</span>
              )}
              <h1 className="mt-[22px] mb-0 leading-[1.02] font-bold tracking-[-0.04em] text-white" style={{ fontSize: "clamp(42px, 8vw, 64px)" }}>
                La communauté
                <br />
                <span className="serif text-gold">LEQ&apos;FAM</span>
              </h1>
              <DrawUnderline style={{ marginTop: 4 }} />
              <p className="mt-[22px] mb-0 max-w-[540px] text-[17px] leading-[1.7] text-white/88">
                La toute première communauté francophone en ligne dédiée à la prise de parole en public, à l&apos;éloquence et aux soft skills. Un espace bienveillant, ouvert à tous sans condition d&apos;âge ou de pays, où l&apos;on s&apos;entraîne, débat, progresse et se cultive ensemble.
              </p>
              <div className="mt-[30px] flex flex-wrap items-center gap-3">
                <a className="btn btn-p" href={join} {...joinProps}>{joinLabel}</a>
                <span className="inline-flex items-baseline gap-1 rounded-full px-[18px] py-2.5 text-white" style={{ background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.3)" }}>
                  <strong className="text-[20px] text-gold">{price}</strong>
                  <span className="text-[13px]">/ mois</span>
                </span>
              </div>
            </div>
            <div className="relative flex min-w-0 justify-center" style={{ flex: ".9 1 340px" }} aria-hidden="true">
              <Sparkle className="wiggle hide-sm absolute" size={44} style={{ top: -20, right: "6%" }} />
              <Heart className="wiggle hide-sm absolute" size={32} style={{ bottom: -10, left: "4%" }} />
              <div className="floaty overflow-hidden rounded-[24px] bg-white text-ink" style={{ width: "min(100%, 380px)", boxShadow: "0 40px 80px -30px rgba(0,22,54,.7)" }}>
                <div className="flex items-center gap-2.5 bg-ink px-[18px] py-3.5 text-white">
                  <span className="text-[18px] font-bold text-gold">#</span>
                  <span className="text-[14px] font-semibold">vos-prises-de-parole</span>
                </div>
                <div className="grid gap-3.5 p-[18px]">
                  <div className="flex gap-2.5">
                    <span className="h-[34px] w-[34px] shrink-0 rounded-full bg-gold" />
                    <div>
                      <p className="m-0 text-[13px] font-bold">Inès <span className="font-medium text-ink/45">· membre</span></p>
                      <p className="mt-0.5 mb-0 text-[14px] leading-[1.45]">Je passe ma soutenance vendredi, quelqu&apos;un peut écouter mon intro ?</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="h-[34px] w-[34px] shrink-0 rounded-full bg-royal" />
                    <div>
                      <p className="m-0 text-[13px] font-bold">Yanis <span className="font-medium text-orange">· Ambassadeur</span></p>
                      <p className="mt-0.5 mb-0 text-[14px] leading-[1.45]">Envoie ! Et pense à poser un silence après ta première phrase.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-peach px-2.5 py-1 text-[13px]">bravo 6</span>
                    <span className="rounded-full bg-cloud px-2.5 py-1 text-[13px]">merci 3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <main>
        <section className="bg-light py-20 text-ink sm:py-[104px]">
          <div className="wrap">
            <div className="relative text-center">
              <p className="eyebrow" style={{ color: "#CC4A00" }}>Ce qu&apos;on fait ensemble</p>
              <h2 className="h2">
                S&apos;entraîner, <span className="serif text-royal">ensemble.</span>
              </h2>
              <Sparkle className="wiggle hide-sm absolute" size={38} style={{ right: "18%", top: 6 }} />
            </div>
            <div className="mt-14 grid gap-x-8 gap-y-10" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))" }}>
              {ENSEMBLE.map((e) => (
                <div key={e.title} className="bubble" style={{ transform: `rotate(${e.rotate}deg)` }}>
                  <div className="flex items-center gap-3.5">
                    <span className="tile rounded-full bg-royal text-white">
                      <Icon name={e.icon} />
                    </span>
                    <h3 className="m-0 text-[19px] font-bold tracking-[-0.015em]">{e.title}</h3>
                  </div>
                  <p className="mt-3 mb-0 text-[14.5px] leading-[1.65] text-ink/70">{e.text}</p>
                  <BubbleTail />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-night py-20 sm:py-[104px]">
          <div className="wrap flex flex-wrap items-center gap-14">
            <div className="relative min-w-0" style={{ flex: "1 1 360px" }}>
              <p className="eyebrow">Sur Discord</p>
              <h2 className="h2 text-white">
                Comment s&apos;organise <span className="serif text-gold">la communauté.</span>
              </h2>
              <p className="mt-[18px] mb-0 text-[16px] leading-[1.7] text-white/75">
                La LEQ&apos;FAM vit sur Discord, organisée en plusieurs salons. Les salons vocaux accueillent les lives hebdomadaires et les sessions d&apos;entraînement libres.
              </p>
              <Heart className="wiggle hide-sm absolute" size={28} style={{ right: "10%", bottom: -40 }} />
            </div>
            <div className="min-w-0 rounded-[24px] p-[18px]" style={{ flex: "1.2 1 440px", background: "#0b1d3f", border: "1px solid rgba(255,255,255,.1)", boxShadow: "0 40px 80px -40px rgba(0,0,0,.8)" }}>
              <p className="mx-2 mt-1 mb-3 text-[12px] font-bold tracking-[.16em] text-white/50 uppercase">Salons textuels</p>
              <ul className="m-0 grid list-none gap-2 p-0">
                {SALONS.map(([name, desc]) => (
                  <li key={name} className="flex items-start gap-3.5 rounded-[14px] bg-white/4 px-4 py-3.5">
                    <span aria-hidden="true" className="shrink-0 text-[20px] leading-[1.2] font-bold text-gold">#</span>
                    <span>
                      <strong className="block text-[15px] text-white">{name}</strong>
                      <span className="text-[14px] leading-[1.55] text-white/70">{desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-sky py-20 sm:py-[104px]">
          <div className="wrap">
            <div className="relative text-center">
              <p className="eyebrow">Les membres</p>
              <h2 className="h2 text-white">
                Membre ou <span className="serif text-gold">Ambassadeur ?</span>
              </h2>
              <Sparkle className="wiggle hide-sm absolute" size={36} color="#fff" style={{ left: "18%", top: 0 }} />
            </div>
            <div className="mx-auto mt-12 grid max-w-[900px] gap-7" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))" }}>
              <div className="sticker p-[30px]">
                <p className="eyebrow" style={{ color: "#114DA8" }}>Membre</p>
                <h3 className="mt-3 mb-0 text-[26px] font-bold tracking-[-0.03em]">Membre classique</h3>
                <ul className="mt-[18px] mb-0 grid list-none gap-2.5 p-0">
                  {["Accès aux lives hebdomadaires", "Entraide quotidienne sur les salons", "Participation au Grand Prix LEQ"].map((it) => (
                    <li key={it} className="flex gap-2.5 text-[15px] text-ink/78">
                      <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-royal" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="sticker relative p-[30px]" style={{ background: "linear-gradient(160deg,#FFF6E6,#fff)" }}>
                <span className="absolute -top-3.5 right-[22px] rounded-full bg-orange px-3 py-[5px] text-[11px] font-bold tracking-[.12em] text-white uppercase">Privilèges</span>
                <p className="eyebrow" style={{ color: "#CC4A00" }}>Ambassadeur</p>
                <h3 className="mt-3 mb-0 text-[26px] font-bold tracking-[-0.03em]">Ambassadeur LEQ</h3>
                <ul className="mt-[18px] mb-0 grid list-none gap-2.5 p-0">
                  {["Accès en avant-première aux nouvelles fonctionnalités", "Goodies physiques", "Implication directe dans la construction de la communauté"].map((it) => (
                    <li key={it} className="flex gap-2.5 text-[15px] text-ink/78">
                      <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-orange" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="tarifs" className="bg-light py-20 text-ink sm:py-[104px]">
          <div className="wrap">
            <div className="text-center">
              <p className="eyebrow" style={{ color: "#CC4A00" }}>Tarifs &amp; partenariats</p>
              <h2 className="h2">
                Accessible à <span className="serif text-royal">tous.</span>
              </h2>
            </div>
            <div className="mt-[52px] grid items-stretch gap-7" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))" }}>
              <div className="lift flex flex-col rounded-[26px] p-8 text-white" style={{ background: "linear-gradient(165deg,#04193c,#0e3f8b)", boxShadow: "0 44px 80px -44px rgba(0,22,54,.85)" }}>
                <p className="eyebrow">Abonnement</p>
                <p className="mt-[18px] mb-0 flex items-baseline text-gold">
                  <span className="text-[56px] leading-none font-bold tracking-[-0.04em]">{price}</span>
                  <span className="ml-1.5 text-[15px] text-white/65">/ mois</span>
                </p>
                <p className="mt-3.5 mb-0 flex-1 text-[15px] leading-[1.6] text-white/78">L&apos;abonnement de base, pour accéder à toute la communauté.</p>
                <a className="btn btn-p mt-6" href={join} {...joinProps}>{joinLabel}</a>
              </div>
              <div className="card-light lift flex flex-col rounded-[26px] p-8">
                <p className="eyebrow" style={{ color: "#114DA8" }}>Partenaires associatifs</p>
                <h3 className="mt-3.5 mb-0 text-[22px] font-bold">BDE, clubs, associations</h3>
                <p className="mt-3 mb-0 flex-1 text-[15px] leading-[1.6] text-ink/70">
                  Vos membres bénéficient d&apos;un tarif préférentiel à{" "}
                  <strong>
                    {formatPrice(leqfam.partnerMonthlyPrice)} / mois pendant {leqfam.partnerDurationMonths} mois
                  </strong>
                  , puis passent au tarif normal. Vous pouvez aussi intervenir dans nos lives pour partager vos connaissances.
                </p>
                <Link className="btn btn-royal mt-6" href={`/autres-produits?demande=${encodeURIComponent("Partenariat LEQ'FAM")}#contact`}>Devenir partenaire</Link>
              </div>
              <div className="card-light lift flex flex-col rounded-[26px] p-8">
                <p className="eyebrow" style={{ color: "#114DA8" }}>Partenaires institutionnels</p>
                <h3 className="mt-3.5 mb-0 text-[22px] font-bold">Écoles, entreprises, institutions</h3>
                <p className="mt-3 mb-0 flex-1 text-[15px] leading-[1.6] text-ink/70">
                  En sponsorisant le Grand Prix LEQ, vos membres et adhérents bénéficient d&apos;un <strong>accès gratuit</strong> à la communauté pendant toute la durée du partenariat.
                </p>
                <Link className="btn btn-royal mt-6" href={`/autres-produits?demande=${encodeURIComponent("Partenariat LEQ'FAM")}#contact`}>Devenir partenaire</Link>
              </div>
            </div>
          </div>
        </section>

        <section id="rejoindre" className="bg-hero relative overflow-hidden py-20 sm:py-[104px]">
          <div className="wrap relative text-center" style={{ maxWidth: 760 }}>
            <Sparkle className="wiggle hide-sm absolute" size={44} style={{ left: 0, top: 0 }} />
            <Heart className="wiggle hide-sm absolute" style={{ right: "4%", top: 20 }} />
            <h2 className="h2 text-white">
              Prêt à rejoindre <span className="serif text-gold">la LEQ&apos;FAM ?</span>
            </h2>
            <p className="mx-auto mt-4 mb-0 max-w-[520px] text-[16.5px] leading-[1.7] text-white/85">{price} par mois pour s&apos;entraîner, progresser et se cultiver ensemble.</p>
            {waitlist ? (
              <WaitlistForm />
            ) : (
              <>
                <a className="btn btn-p mt-[30px]" href={join} {...joinProps} style={{ fontSize: 17, padding: "18px 34px" }}>
                  Rejoindre la LEQ&apos;FAM
                </a>
                <p className="mt-3.5 mb-0 text-[13px] text-white/65">Paiement sécurisé</p>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
