import Link from "next/link";
import { LivreMellie } from "@/components/mellie/LivreMellie";

/** Encart de la BD « Mellie a le trac » (page Autres services) : le livre en 3D et le lien vers /mellie. */
export function SectionMellie() {
  return (
    <section id="mellie" className="bg-miel overflow-hidden py-20 text-ink sm:py-[104px]">
      <div className="wrap flex flex-wrap items-center gap-12">
        <div className="relative flex min-w-0 justify-center" style={{ flex: ".9 1 340px" }}>
          <LivreMellie />
        </div>
        <div className="reveal min-w-0" style={{ flex: "1.1 1 420px" }}>
          <span className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-[11px] font-bold tracking-[.16em] text-gold uppercase">Nouveau · gratuit</span>
          <h2 className="h2 mt-[22px]">
            La BD <span className="serif text-orange">Mellie a le trac</span>
          </h2>
          <p className="mt-[18px] mb-0 max-w-[540px] text-[16px] leading-[1.7] text-ink/75">
            Une BD drôle et utile pour apprendre à parler en public, avec un cahier d&apos;exercices anti-trac. De 9 à 99 ans. Gratuite en e-book, et en version papier en précommande.
          </p>
          <Link className="btn btn-p mt-7" href="/mellie">
            Découvrir Mellie
          </Link>
        </div>
      </div>
    </section>
  );
}
