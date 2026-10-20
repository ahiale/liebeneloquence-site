import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { Suspense } from "react";
import { getPricing } from "@/content";
import { SITE } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { Header } from "@/components/layout/Header";
import { Check, DrawUnderline, Heart, Sparkle, SpeechBubble, Star } from "@/components/ui/Doodles";
import { Icon, type IconName } from "@/components/ui/Icons";
import { ContactForm } from "@/components/autres-services/ContactForm";
import { JeuAvocat } from "@/components/autres-services/JeuAvocat";
import { SectionMellie } from "@/components/mellie/SectionMellie";
import { PrenomEmailForm } from "@/components/ui/PrenomEmailForm";
import { etrePrevenu } from "@/app/actions";
import { DEMANDES } from "@/lib/options";

export const metadata: Metadata = pageMeta({
  title: "Coaching concours d'éloquence, discours et animation",
  description: "Coaching pour concours d'éloquence, discours sur mesure, animation d'événements et communauté LEQ'FAM : demandez votre devis à Lieben Éloquence.",
  path: "/autres-services",
});

const LEQFAM_POINTS = [
  "Des lives collectifs chaque semaine",
  "Des entraînements et des défis",
  "Une vraie entraide entre membres",
  "Le Grand Prix LEQ chaque trimestre, avec une dotation de 200 €, vote partagé entre le jury et la communauté",
  "Tout se passe sur Discord : vos prises de parole, des ressources, des défis",
];

const SERVICES: { icon: IconName; title: string; text: string; items: string[]; demande: (typeof DEMANDES)[number] }[] = [
  { icon: "pen", title: "Discours sur mesure", text: "J'écris avec vous le discours qui vous ressemble, prêt à être prononcé.", items: ["Mariage, anniversaire, hommage", "Soutenance, conférence, prise de poste", "Travail du fond, du rythme et de la chute"], demande: "Discours sur mesure" },
  { icon: "mic", title: "Animation d'événements", text: "Maîtrise de cérémonie et modération pour donner du rythme à vos événements.", items: ["Maîtrise de cérémonie", "Modération de conférences et de tables rondes", "Événements associatifs, universitaires et d'entreprise"], demande: "Animation d'événement" },
  { icon: "trophy", title: "Coaching concours d'éloquence", text: "Un accompagnement ponctuel pour préparer un concours, par une oratrice qui concourt et qui juge.", items: ["Préparation sur sujet imposé", "Improvisation et gestion du temps", "Simulation face à un jury"], demande: "Coaching concours d'éloquence" },
];

const APP_POINTS = [
  "Des défis courts : virelangues, exercices rapides",
  "Un grand défi chaque mois, avec des mécaniques de jeu originales",
  "Un conseil du jour en notification",
  "Des défis entre amis",
  "Des débats face à une IA",
];

export default async function AutresServicesPage() {
  const { leqfam } = await getPricing();

  return (
    <>
      <div className="bg-hero">
        <Header />
        <section className="relative pt-10 pb-20 text-center sm:pt-16 sm:pb-24">
          <div className="wrap relative">
            <Sparkle className="wiggle hide-sm absolute" size={46} style={{ left: "14%", top: 0 }} />
            <Heart className="wiggle hide-sm absolute" size={34} color="#FFBD59" style={{ right: "16%", top: 40 }} />
            <p className="eyebrow">L&apos;univers LEQ</p>
            <h1 className="mt-5 mb-0 leading-[1.02] font-bold tracking-[-0.04em] text-white" style={{ fontSize: "clamp(42px, 8vw, 64px)" }}>
              Autres <span className="serif text-gold">services</span>
            </h1>
            <DrawUnderline className="hide-sm" style={{ margin: "4px auto 0", transform: "translateX(70px)" }} />
            <p className="mx-auto mt-[22px] mb-0 max-w-[620px] text-[17px] leading-[1.7] text-white/85">
              Une communauté, des discours sur mesure, l&apos;animation de vos événements et une BD, bientôt une application mobile et un jeu de cartes : d&apos;autres façons de prendre la parole avec LEQ.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              {[
                ["#leqfam", "LEQ'FAM"],
                ["#services", "Discours & animation"],
                ["#app", "Application mobile"],
                ["#jeu", "Jeu de cartes"],
                ["#mellie", "BD Mellie"],
              ].map(([href, label]) => (
                <a key={href} href={href} className="rounded-full bg-white px-[18px] py-[9px] text-[14px] font-semibold text-ink no-underline">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>

      <main>
        {/* LEQ'FAM */}
        <section id="leqfam" className="bg-night py-20 sm:py-[104px]">
          <div className="wrap">
            <div className="panel relative flex flex-wrap items-center gap-12 px-6 py-12 sm:px-12 sm:py-14">
              <div className="min-w-0" style={{ flex: "1.2 1 420px" }}>
                {leqfam.availability && (
                  <span className="inline-flex items-center rounded-full bg-royal px-4 py-2 text-[11px] font-semibold tracking-[.16em] text-white uppercase">{leqfam.availability}</span>
                )}
                <h2 className="h2 mt-[22px] text-white">
                  La communauté <span className="serif text-gold">LEQ&apos;FAM</span>
                </h2>
                <p className="mt-[18px] mb-0 max-w-[560px] text-[16px] leading-[1.7] text-white/75">
                  La communauté dédiée à l&apos;éloquence, aux soft skills et à la prise de parole. Pas besoin d&apos;être expert, ni d&apos;avoir déjà fait de la compétition : que vous partiez de zéro ou que vous ayez de l&apos;expérience, vous avez votre place ici.
                </p>
                <ul className="mt-[26px] mb-0 grid list-none gap-3 p-0">
                  {LEQFAM_POINTS.map((pt) => (
                    <li key={pt} className="flex gap-3 text-[15px] leading-[1.5] text-white/85">
                      <Check color="#FFBD59" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="min-w-0" style={{ flex: ".8 1 300px" }}>
                <div className="relative rounded-[28px] bg-white p-8 text-center text-ink" style={{ boxShadow: "8px 8px 0 #FFBD59" }}>
                  <SpeechBubble className="bob absolute" fill="#FF5E01" stroke={null} lines="#fff" style={{ top: -30, right: -18 }} />
                  <p className="m-0 text-[12px] font-semibold tracking-[.2em] text-royal uppercase">Abonnement</p>
                  <p className="mt-3 mb-0 flex items-baseline justify-center">
                    <span className="text-[52px] leading-none font-bold tracking-[-0.04em]">{formatPrice(leqfam.monthlyPrice)}</span>
                    <span className="ml-1 text-[15px] text-ink/55">/mois</span>
                  </p>
                  <p className="mt-1.5 mb-0 text-[13.5px] text-ink/60">Tarifs préférentiels pour les partenaires</p>
                  <Link className="btn btn-p mt-6 w-full" href="/communaute">Découvrir la communauté</Link>
                  <p className="mt-3 mb-0 text-[12.5px] text-ink/50">Sur Discord · ouvert à tous</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="bg-light py-20 text-ink sm:py-[104px]">
          <div className="wrap">
            <div className="relative text-center">
              <p className="eyebrow" style={{ color: "#114DA8" }}>Sur mesure</p>
              <h2 className="h2">
                Autres <span className="serif text-royal">services</span>
              </h2>
              <Star className="wiggle hide-sm absolute" style={{ right: "18%", top: 10 }} />
            </div>
            <div className="mt-14 grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))" }}>
              {SERVICES.map((s) => (
                <article key={s.title} className="bubble flex flex-col p-[30px]">
                  <span className="tile h-[52px] w-[52px] rounded-full bg-royal text-white">
                    <Icon name={s.icon} size={24} />
                  </span>
                  <h3 className="mt-[18px] mb-0 text-[22px] font-bold tracking-[-0.025em]">{s.title}</h3>
                  <p className="mt-2.5 mb-0 text-[14.5px] leading-[1.65] text-ink/68">{s.text}</p>
                  <ul className="mt-[18px] mb-0 grid flex-1 list-none content-start gap-2.5 p-0">
                    {s.items.map((it) => (
                      <li key={it} className="flex gap-3 text-[15px] leading-[1.5] text-ink/75">
                        <Check />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <a className="btn btn-p mt-6" href={`?demande=${encodeURIComponent(s.demande)}#contact`}>
                    Me contacter
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* APPLICATION MOBILE */}
        <section id="app" className="bg-hero overflow-hidden py-20 sm:py-[104px]">
          <div className="wrap flex flex-wrap items-center gap-14">
            <div className="min-w-0" style={{ flex: "1.1 1 440px" }}>
              <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-[11px] font-bold tracking-[.16em] text-orange uppercase">Bientôt</span>
              <h2 className="h2 mt-[22px] text-white">
                L&apos;application <span className="serif text-gold">mobile LEQ</span>
              </h2>
              <p className="mt-[18px] mb-0 max-w-[540px] text-[16px] leading-[1.7] text-white/85">
                Progresser à l&apos;oral comme on joue : une application fun et ludique pour s&apos;entraîner chaque jour, à son rythme.
              </p>
              <ul className="mt-[26px] mb-0 grid list-none gap-3 p-0">
                {APP_POINTS.map((pt) => (
                  <li key={pt} className="flex gap-3 text-[15px] leading-[1.5] text-white/85">
                    <Check color="#FFBD59" />
                    {pt}
                  </li>
                ))}
              </ul>
              <p className="mt-[22px] mb-0 text-[14px] text-white/70">Trois formules : gratuite, standard et accès complet avec coaching.</p>
              <PrenomEmailForm
                action={etrePrevenu}
                champs={{ sujet: "application-mobile" }}
                bouton="Être prévenu du lancement"
                succes={{ titre: "C'est noté !", texte: "Un mail de confirmation vient de vous être envoyé. Vous serez prévenu·e dès le lancement de l'application." }}
                className="mt-7 max-w-[520px]"
              />
            </div>
            <div className="relative flex min-w-0 justify-center" style={{ flex: ".9 1 300px" }} aria-hidden="true">
              <Sparkle className="wiggle absolute" size={44} style={{ left: "4%", top: "4%" }} />
              <div className="floaty rounded-[44px] bg-ink p-3" style={{ width: 260, height: 520, boxShadow: "0 40px 80px -30px rgba(0,0,0,.6),0 0 0 3px rgba(255,255,255,.25)" }}>
                <div className="flex h-full flex-col gap-3.5 rounded-[34px] px-5 py-7 text-ink" style={{ background: "linear-gradient(180deg,#FFFFFF,#E8EFFA)" }}>
                  <p className="m-0 text-[20px] font-extrabold tracking-[-0.04em]">
                    LEQ<span className="text-orange">.</span>
                  </p>
                  <div className="rounded-[18px] bg-royal p-4 text-white">
                    <p className="m-0 text-[11px] font-semibold tracking-[.14em] text-gold uppercase">Défi du jour</p>
                    <p className="mt-1.5 mb-0 text-[15px] leading-[1.35] font-semibold">Dites ce virelangue 3 fois sans vous tromper</p>
                  </div>
                  <div className="rounded-[18px] border-2 border-ink bg-white p-3.5">
                    <p className="m-0 text-[11px] font-semibold tracking-[.14em] text-orange uppercase">Grand défi du mois</p>
                    <p className="mt-1.5 mb-0 text-[14px] font-semibold">Course de mots</p>
                    <div className="mt-2.5 h-2 overflow-hidden rounded-[9px]" style={{ background: "#E5EBF7" }}>
                      <div className="h-full w-[62%]" style={{ background: "linear-gradient(90deg,#FFBD59,#FF5E01)" }} />
                    </div>
                  </div>
                  <div className="rounded-[18px] bg-peach p-3.5">
                    <p className="m-0 text-[13px] leading-[1.45]">
                      <strong>Conseil du jour :</strong>{" "}un silence bien placé vaut mieux qu&apos;un « euh ».
                    </p>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <span className="flex-1 rounded-xl bg-ink py-2.5 text-center text-[12px] font-semibold text-white">Défier un ami</span>
                    <span className="flex-1 rounded-xl py-2.5 text-center text-[12px] font-semibold" style={{ background: "#E5EBF7" }}>Débat IA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <JeuAvocat />

        <SectionMellie />

        {/* CONTACT */}
        <section id="contact" className="bg-night relative overflow-hidden py-20 sm:py-[104px]">
          <div className="wrap relative flex flex-wrap items-center gap-14">
            <Sparkle className="wiggle hide-sm absolute" size={42} style={{ left: 0, top: -40 }} />
            <div className="min-w-0" style={{ flex: "1 1 360px" }}>
              <p className="eyebrow">Contact</p>
              <h2 className="h2 text-white">
                Parlons de <span className="serif text-gold">votre projet.</span>
              </h2>
              <p className="mt-[18px] mb-0 text-[16px] leading-[1.7] text-white/75">
                Discours sur mesure, animation d&apos;événement, coaching pour un concours ou partenariat : décrivez votre besoin, je vous réponds par mail.
              </p>
              <p className="mt-[18px] mb-0 text-[15px] text-white/70">
                Ou écrivez-moi directement :{" "}
                <a href={`mailto:${SITE.email}`} className="font-semibold text-gold">{SITE.email}</a>
              </p>
            </div>
            <Suspense>
              <ContactForm />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
}
