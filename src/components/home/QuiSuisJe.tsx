import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/config/site";
import { Sparkle } from "@/components/ui/Doodles";
import { Icon } from "@/components/ui/Icons";

const DISTINCTIONS = [
  { year: "2022", text: "Vice-championne du concours d'art oratoire au féminin" },
  { year: "2023", text: "Lauréate du Trophée Coup de Cœur de la meilleure compétition d'éloquence du Togo" },
  { year: "2025", text: "Présidente d'Eloquentia Toulon" },
];

export function QuiSuisJe() {
  return (
    <section className="bg-night py-20 sm:py-28">
      <div className="wrap flex flex-wrap items-center gap-12">
        <div className="flex min-w-0 justify-center" style={{ flex: ".8 1 300px" }}>
          <div className="relative w-full max-w-[384px]">
            <div aria-hidden="true" className="absolute inset-0 rounded-[28px]" style={{ transform: "translate(16px,16px)", border: "1px solid rgba(255,189,89,.25)" }} />
            <Image
              src="/images/rebecca/eloquentia-toulon.jpg"
              alt="Rebecca Lieben Ahiale sur scène, à la soirée de lancement d'Eloquentia Toulon"
              width={720}
              height={970}
              sizes="(max-width: 760px) 90vw, 384px"
              className="relative block h-auto w-full rounded-[28px] object-cover"
              style={{ aspectRatio: "4 / 5", objectPosition: "50% 30%" }}
            />
          </div>
        </div>
        <div className="relative min-w-0" style={{ flex: "1.2 1 460px" }}>
          <Sparkle className="wiggle hide-sm absolute" size={38} style={{ right: "4%", top: -10 }} />
          <p className="eyebrow">La formatrice</p>
          <h2 className="h2 text-white">Qui suis-je ?</h2>
          <p className="mt-5 mb-0 max-w-[576px] text-[16px] leading-[1.7] text-white/72">
            Je suis Rebecca Lieben Ahiale, passionnée de la scène, du public et du micro. Togolaise, installée en France, je travaille dans la tech, la preuve que l&apos;art oratoire ne rime pas seulement avec droit et littérature. Depuis 2019, je pratique, je concours, je juge et j&apos;accompagne : aujourd&apos;hui, je transmets cette maîtrise de la parole à celles et ceux qui veulent oser et convaincre.
          </p>
          <div className="mt-8 overflow-hidden rounded-[24px] border border-white/10">
            <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ background: "linear-gradient(96deg,rgba(17,77,168,.55),rgba(17,77,168,.15))" }}>
              <Icon name="trophy" size={18} color="#FFBD59" />
              <h3 className="m-0 text-[15px] font-semibold text-white">Distinctions &amp; expériences</h3>
            </div>
            <ul className="m-0 list-none bg-white/4 p-0">
              {DISTINCTIONS.map((d, i) => (
                <li key={d.year} className={`flex gap-4 px-5 py-3.5 ${i < DISTINCTIONS.length - 1 ? "border-b border-white/8" : ""}`}>
                  <span className="serif w-12 shrink-0 text-[17px] text-gold">{d.year}</span>
                  <span className="text-[14px] text-white/78">{d.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn btn-p" href="/a-propos">Mon parcours complet</Link>
            <a className="btn btn-g" href={SITE.instagram} target="_blank" rel="noreferrer noopener">Instagram</a>
            <a className="btn btn-g" href={SITE.linkedin} target="_blank" rel="noreferrer noopener">LinkedIn</a>
          </div>
        </div>
      </div>
    </section>
  );
}
