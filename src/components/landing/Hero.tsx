import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { MicEmblem } from "@/components/ui/MicEmblem";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <Container className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <div className="reveal">
          <h1 className="font-serif text-[2.05rem] leading-[1.08] tracking-[-0.01em] min-[420px]:text-[2.4rem] sm:text-[3.4rem] lg:text-[4.1rem]">
            <span className="italic text-white">Parlez</span>
            <br />
            <span className="italic text-white/85">pour </span>
            <span className="italic text-orange">PLAIRE,</span>
            <br />
            <span className="italic text-white/85">pour </span>
            <span className="italic text-orange">CONVAINCRE,</span>
            <br />
            <span className="italic text-white/85">pour </span>
            <span className="italic text-orange">IMPACTER.</span>
          </h1>

          <p className="mt-8 max-w-lg text-[0.98rem] leading-relaxed text-white/65">
            Aujourd&apos;hui, l&apos;éloquence est une compétence essentielle.
            Avec Lieben Éloquence, vous apprenez à prendre la parole avec
            assurance pour réussir un examen, convaincre un jury ou saisir les
            opportunités qui se présentent à vous.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#offres" variant="primary" size="lg">
              Découvrir les formations <ArrowRight size={18} />
            </ButtonLink>
            <ButtonLink href="/quiz" variant="ghost" size="lg">
              <Sparkles size={17} /> Quel type d&apos;orateur êtes-vous&nbsp;?
            </ButtonLink>
          </div>

          <p className="mt-7 text-[0.8rem] text-white/45">
            Séance diagnostic offerte · Lycéens, étudiants et professionnels ·
            En visio ou en présentiel
          </p>
        </div>

        <div className="reveal flex justify-center lg:justify-end">
          <MicEmblem />
        </div>
      </Container>
    </section>
  );
}
