import { BubbleTail } from "@/components/ui/Doodles";
import { Icon, type IconName } from "@/components/ui/Icons";

const APPORTS: { icon: IconName; title: string; text: string; rotate: number }[] = [
  { icon: "target", title: "Accompagnement sur mesure", text: "Chaque parcours est construit pour vous et avec vous, afin de répondre au mieux à vos problématiques.", rotate: -1.5 },
  { icon: "heartPulse", title: "Gestion du trac", text: "Des techniques concrètes pour transformer le trac en force et arriver à le dompter sans se sentir exposé.", rotate: 1.2 },
  { icon: "award", title: "Certification en fin de parcours", text: "Une attestation de fin de formation est remise à l'issue du parcours, pour attester de votre progression et faire valoir vos acquis.", rotate: -0.8 },
  { icon: "gamepad", title: "Méthodes ludiques & concrètes", text: "Icebreakers, jeux de rôle, mises en situation, Kahoot. On apprend en pratiquant et en sortant de sa zone de confort.", rotate: 1 },
  { icon: "heart", title: "Suivi bienveillant", text: "Une formatrice disponible et à l'écoute, qui adapte le rythme et le contenu à chaque séance selon vos avancées réelles.", rotate: -1.2 },
  { icon: "zap", title: "Résultats rapides & mesurables", text: "Dès la première séance, vous repartez avec des outils applicables immédiatement. Pas de parcours inutilement long.", rotate: 1.5 },
];

export function Apports() {
  return (
    <section className="bg-light relative overflow-hidden py-20 text-ink sm:py-[104px]">
      <div className="wrap">
        <div className="relative text-center">
          <p className="eyebrow" style={{ color: "#114DA8" }}>Pourquoi LEQ ?</p>
          <h2 className="h2">
            Ce que j&apos;apporte <span className="serif text-royal">réellement.</span>
          </h2>
          <svg className="draw hide-sm" width="200" height="22" viewBox="0 0 200 22" fill="none" aria-hidden="true" style={{ display: "block", margin: "2px auto 0", transform: "translateX(150px)" }}>
            <path d="M4 14c28-8 58-10 92-7s66 4 100-6" stroke="#114DA8" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <div className="mt-14 grid gap-x-8 gap-y-10" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(310px,100%),1fr))" }}>
          {APPORTS.map((a, i) => (
            <div key={a.title} className="bubble" style={{ transform: `rotate(${a.rotate}deg)` }}>
              <div className="flex items-center gap-3.5">
                <span className="tile rounded-full bg-royal text-white">
                  <Icon name={a.icon} />
                </span>
                <h3 className="m-0 text-[18px] font-bold tracking-[-0.015em]">{a.title}</h3>
              </div>
              <p className="mt-3 mb-0 text-[14px] leading-[1.65] text-ink/68">{a.text}</p>
              <BubbleTail side={i % 2 === 0 ? "left" : "right"} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
