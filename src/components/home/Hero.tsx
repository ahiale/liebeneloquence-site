import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ArrowRight, Heart, MicDoodle, ScribbleArrow, Sparkle, Star } from "@/components/ui/Doodles";

export function Hero() {
  return (
    <div className="bg-hero">
      <Header />
      <section className="relative overflow-hidden pt-8 pb-20 sm:pt-14 sm:pb-[104px]">
        <div className="wrap flex flex-wrap items-center gap-6">
          <div className="relative min-w-0" style={{ flex: "1.05 1 520px" }}>
            <h1 className="serif m-0 leading-[1.08] tracking-[-0.01em]" style={{ fontSize: "clamp(42px, 8.4vw, 66px)" }}>
              <span className="text-white">Parlez</span>
              <br />
              <span className="text-white/90">pour </span>
              <span className="text-gold">PLAIRE,</span>
              <br />
              <span className="text-white/90">pour </span>
              <span className="text-gold">CONVAINCRE,</span>
              <br />
              <span className="text-white/90">pour </span>
              <span className="text-gold">IMPACTER.</span>
            </h1>
            <svg className="draw ml-12 sm:ml-24" width="250" height="26" viewBox="0 0 250 26" fill="none" aria-hidden="true" style={{ display: "block", marginTop: 4, maxWidth: "70%" }}>
              <path d="M4 17c34-10 72-12 112-9s82 5 128-7" stroke="#FFBD59" strokeWidth="3" strokeLinecap="round" />
              <path d="M48 22c46-6 98-7 150-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="mt-[26px] max-w-[512px] text-[15.7px] leading-[1.7] text-white/82">
              Aujourd&apos;hui, l&apos;éloquence est une compétence essentielle. Avec Lieben Éloquence, vous apprenez à prendre la parole avec assurance pour réussir un examen, convaincre un jury ou saisir les opportunités qui se présentent à vous.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="btn btn-p" href="#offres">
                Découvrir les formations <ArrowRight />
              </Link>
              <Link className="btn btn-g" href="/quiz">
                <Star size={17} color="currentColor" /> Quel type d&apos;orateur êtes-vous ?
              </Link>
            </div>
            <p className="mt-7 text-[12.8px] text-white/62">
              Séance diagnostic offerte · Lycéens, étudiants et professionnels · En visio ou en présentiel
            </p>
          </div>

          <div className="flex min-w-0 justify-center" style={{ flex: ".95 1 380px" }}>
            <div className="relative" style={{ width: "min(100%, 420px)", aspectRatio: "1 / 1.08" }}>
              <div className="absolute rounded-full" style={{ inset: "4% 2% 8%", background: "radial-gradient(circle,rgba(255,255,255,.55),rgba(255,189,89,.25) 45%,transparent 70%)" }} />
              <div
                className="floaty absolute overflow-hidden bg-gold"
                style={{ left: "14%", right: "14%", top: "8%", bottom: "6%", borderRadius: "200px 200px 36px 36px", border: "4px solid #fff", boxShadow: "0 30px 60px -20px rgba(0,22,54,.6)" }}
              >
                <Image
                  src="/formatrice.jpg"
                  alt="Rebecca Lieben Ahiale, formatrice en prise de parole"
                  fill
                  priority
                  sizes="(max-width: 760px) 70vw, 300px"
                  style={{ objectFit: "cover", objectPosition: "50% 20%" }}
                />
              </div>
              <div
                className="bob absolute font-bold text-ink"
                style={{ left: "-2%", top: "12%", background: "#fff", border: "2px solid #001636", borderRadius: 20, padding: "10px 16px", fontSize: 15, boxShadow: "4px 4px 0 #FF5E01" }}
              >
                Prends la parole <span className="serif text-royal" style={{ fontSize: 19 }}>!</span>
              </div>
              <Sparkle className="wiggle absolute" size={46} style={{ top: 0, right: "6%" }} />
              <MicDoodle className="bob absolute" style={{ right: "-2%", bottom: "20%" }} />
              <Heart className="wiggle absolute" size={34} color="#FFBD59" style={{ left: "6%", bottom: "14%" }} />
              <ScribbleArrow className="absolute" style={{ left: "24%", bottom: "-4%" }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
