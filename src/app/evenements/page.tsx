import type { Metadata } from "next";
import { getEvents } from "@/content";
import { Header } from "@/components/layout/Header";
import { DrawUnderline, Heart, Sparkle, SpeechBubble } from "@/components/ui/Doodles";
import { Check } from "@/components/ui/Doodles";
import { EventCard } from "@/components/evenements/EventCard";
import { NewsletterForm } from "@/components/evenements/NewsletterForm";

export const metadata: Metadata = {
  title: "Événements & actualités",
  description: "Ateliers, conférences et formations collectives LEQ pour progresser à chaque prise de parole. Inscrivez-vous à la newsletter.",
  alternates: { canonical: "/evenements" },
};

const TICKETS = [
  { kind: "Atelier", title: "L'art de captiver", color: "#114DA8", anim: "floaty", style: { left: "4%", top: "12%", transform: "rotate(-8deg)" } },
  { kind: "Masterclass", title: "Prendre la parole", color: "#FF5E01", anim: "bob", style: { right: "2%", top: "40%", transform: "rotate(5deg)" } },
  { kind: "Concours", title: "Grand Prix LEQ", color: "#001636", anim: "floaty", style: { left: "10%", bottom: "6%", transform: "rotate(-3deg)" } },
];

const AVANTAGES = [
  "Accès prioritaire aux événements",
  "Conseils & exercices oratoires exclusifs",
  "Ressources gratuites en avant-première",
  "Actualités et coulisses du projet LEQ",
  "Pas de spam, désinscription possible en un clic",
];

const FAQ = [
  {
    group: "Les formations",
    items: [
      ["Comment réserver une séance ?", "Cliquez sur « Réserver » sous le pack de votre choix : vous choisissez un créneau dans mon agenda pour votre séance diagnostic de 30 minutes, offerte."],
      ["Les séances ont lieu en visio ou en présentiel ?", "Les deux sont possibles. On choisit ensemble le format qui vous convient le mieux."],
      ["Quelle est la différence entre les packs ?", "Senghor (3 séances) pose les bases de la culture oratoire. Cicéron (5 séances) vous apprend à structurer et rédiger un discours. Socrate (7 séances) est le parcours complet : trac, improvisation, non-verbal et variation vocale."],
      ["Peut-on payer en plusieurs fois ?", "Oui : en 3 fois pour les packs Senghor et Cicéron, en 4 fois pour le pack Socrate et l'offre Grand Oral."],
      ["Que se passe-t-il après la formation ?", "Vous recevez une fiche de synthèse, un diagnostic de fin et une attestation de fin de formation. Je vous accompagne ensuite jusqu'à 3 mois après la formation."],
      ["Comment fonctionne l'offre Grand Oral ?", "5 séances intensives de 50 minutes, sans diagnostic préalable. Vous réservez votre place directement en ligne."],
      ["Intervenez-vous dans les établissements scolaires ?", "Oui. Remplissez le formulaire de demande de devis : j'interviens principalement en région parisienne, avec possibilité de déplacement selon la demande."],
    ],
  },
  {
    group: "Les événements",
    items: [
      ["À qui s'adressent les événements LEQ ?", "À tout le monde : lycéens, étudiants, professionnels, entrepreneurs, et toute personne qui veut oser prendre la parole."],
      ["Faut-il un niveau particulier pour participer ?", "Non. Les ateliers sont ouverts à tous les niveaux, sans prérequis."],
      ["Où ont lieu les événements ?", "Principalement à Paris et en région parisienne. Le lieu exact est communiqué à l'inscription."],
      ["Comment être prévenu des prochaines dates ?", "En vous inscrivant à la newsletter : les abonnés reçoivent les dates en avant-première."],
    ],
  },
] as const;

export default async function EvenementsPage() {
  const events = await getEvents();

  return (
    <>
      <div className="bg-hero">
        <Header />
        <section className="pt-8 pb-20 sm:pt-12 sm:pb-[88px]">
          <div className="wrap flex flex-wrap items-center gap-10">
            <div className="min-w-0" style={{ flex: "1.1 1 480px" }}>
              <h1 className="m-0 leading-[1.02] font-bold tracking-[-0.035em] text-white" style={{ fontSize: "clamp(42px, 8vw, 64px)" }}>
                Événements &amp;
                <br />
                <span className="serif text-gold">Actualités</span>
              </h1>
              <DrawUnderline style={{ marginTop: 4 }} />
              <p className="mt-[22px] mb-0 max-w-[512px] text-[16px] leading-[1.7] text-white/85">
                Progressez à chaque prise de parole en participant à nos ateliers, conférences et formations collectives. Profitez de l&apos;expertise de professionnels pour gagner en confiance à l&apos;oral.
              </p>
              <div className="mt-[30px] flex flex-wrap gap-3">
                <a className="btn btn-p" href="#a-venir">Voir les événements à venir</a>
                <a className="btn btn-g" href="#newsletter">S&apos;inscrire à la newsletter</a>
              </div>
            </div>
            <div className="flex min-w-0 justify-center" style={{ flex: ".9 1 340px" }}>
              <div className="relative" style={{ width: "min(100%, 380px)", aspectRatio: "1 / 1.05" }} aria-hidden="true">
                <div className="absolute rounded-full" style={{ inset: "4%", background: "radial-gradient(circle,rgba(255,255,255,.5),rgba(255,189,89,.2) 45%,transparent 70%)" }} />
                {TICKETS.map((t) => (
                  <div key={t.title} className="absolute w-[62%]" style={t.style}>
                    <div className={t.anim}>
                      <div className="flex overflow-hidden rounded-[18px] bg-white text-ink" style={{ boxShadow: "0 26px 50px -22px rgba(0,22,54,.7)" }}>
                        <div className="flex-1 px-[18px] py-4" style={{ borderRight: "2px dashed rgba(0,22,54,.18)" }}>
                          <p className="m-0 text-[10px] font-bold tracking-[.18em] uppercase" style={{ color: t.color }}>{t.kind}</p>
                          <p className="mt-1.5 mb-0 text-[17px] leading-[1.2] font-bold tracking-[-0.02em]">{t.title}</p>
                          <p className="mt-2 mb-0 text-[12px] text-ink/55">Billet LEQ</p>
                        </div>
                        <div className="flex w-[58px] items-center justify-center" style={{ background: t.color }}>
                          <span className="serif text-[20px] text-white" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>LEQ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Sparkle className="wiggle hide-sm absolute" size={44} style={{ top: 0, right: "4%" }} />
                <Heart className="wiggle absolute" size={34} color="#FFBD59" style={{ right: 0, bottom: "22%" }} />
              </div>
            </div>
          </div>
        </section>
      </div>

      <main>
        <section id="a-venir" className="bg-sky relative overflow-hidden pt-20 pb-24 sm:pt-24 sm:pb-28">
          <div className="wrap relative">
            <Sparkle className="wiggle hide-sm absolute" size={38} color="#fff" style={{ right: "6%", top: 0 }} />
            <p className="eyebrow">Prochainement</p>
            <h2 className="h2 text-white">
              Tous les événements <span className="serif text-gold">à venir</span>
            </h2>
            {events.length > 0 ? (
              <div className="mt-12 grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(300px,100%),380px))" }}>
                {events.map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </div>
            ) : (
              <p className="mt-12 mb-0 max-w-[560px] rounded-[24px] bg-white/10 px-7 py-6 text-[17px] text-white" style={{ border: "1px solid rgba(255,255,255,.2)" }}>
                Aucun événement prévu pour le moment.
              </p>
            )}
          </div>
        </section>

        <section id="newsletter" className="bg-light py-20 text-ink sm:py-28">
          <div className="wrap grid gap-14" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(380px,100%),1fr))" }}>
            <div className="relative">
              <p className="eyebrow" style={{ color: "#114DA8" }}>Restez informés</p>
              <h2 className="mt-4 mb-0 leading-[1.02] font-bold tracking-[-0.035em]" style={{ fontSize: "clamp(38px, 7vw, 52px)" }}>
                La newsletter
                <br />
                <span className="text-royal">LEQ.</span>
              </h2>
              <SpeechBubble className="wiggle hide-sm absolute" width={62} height={50} fill="none" stroke="#FF5E01" lines="#FFBD59" style={{ left: 200, top: 86 }} />
              <p className="mt-6 mb-0 max-w-[448px] text-[16px] leading-[1.7] text-ink/70">
                Les dates d&apos;ateliers en avant-première, les ressources gratuites, les conseils oratoires et les annonces importantes, directement dans votre boîte mail.
              </p>
              <ul className="mt-8 mb-0 grid list-none gap-3 p-0">
                {AVANTAGES.map((a) => (
                  <li key={a} className="flex gap-3 text-[14.7px] text-ink/78">
                    <Check color="#2fbd6e" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <NewsletterForm />
          </div>
        </section>

        <section className="bg-light border-t border-ink/8 py-20 text-ink sm:py-28">
          <div className="wrap" style={{ maxWidth: 860 }}>
            <div className="text-center">
              <p className="eyebrow" style={{ color: "#CC4A00" }}>Questions fréquentes</p>
              <h2 className="h2">
                Vos questions, <span className="serif text-royal">nos réponses.</span>
              </h2>
            </div>
            {FAQ.map((g, gi) => (
              <div key={g.group}>
                <h3 className={`${gi === 0 ? "mt-12" : "mt-11"} mb-0 text-[13px] font-bold tracking-[.2em] text-royal uppercase`}>{g.group}</h3>
                <div className="mt-3 border-t border-ink/12">
                  {g.items.map(([question, answer]) => (
                    <details key={question} className="faq border-b border-ink/12 py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">
                        {question}
                        <span aria-hidden="true" className="faq-plus shrink-0 text-[24px] leading-none font-normal text-orange">+</span>
                      </summary>
                      <p className="mt-3 mb-0 max-w-[720px] text-[15px] leading-[1.65] text-ink/70">{answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
