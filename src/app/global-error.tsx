"use client";

import { melodrame, sfPro } from "@/design/fonts";
import { SITE } from "@/config/site";
import "./globals.css";

/** Dernier filet de sécurité : remplace toute la page si même la mise en page générale plante. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr" className={`${sfPro.variable} ${melodrame.variable}`}>
      <body>
        <div className="bg-hero grid min-h-screen place-items-center">
          <main className="wrap flex flex-col items-center py-20 text-center">
            <p className="m-0 text-[22px] font-bold text-white">
              LEQ<span className="text-orange">.</span>
            </p>
            <p className="serif mt-8 mb-0 leading-none text-gold" style={{ fontSize: "clamp(90px, 18vw, 150px)" }}>Oups</p>
            <h1 className="mt-4 mb-0 font-bold tracking-[-0.03em] text-white" style={{ fontSize: "clamp(26px, 5vw, 36px)" }}>
              Un petit <span className="serif text-gold">trou de mémoire…</span>
            </h1>
            <p className="mt-4 mb-0 max-w-[500px] text-[16px] leading-[1.7] text-white/85">
              Le site rencontre un problème. Réessayez dans un instant, ou écrivez-nous à{" "}
              <a className="text-gold" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <button type="button" className="btn btn-p" onClick={reset}>Réessayer</button>
              {/* Lien classique (pas next/link) : recharge entièrement le site */}
              <a className="btn btn-g" href="/">Retour à l&apos;accueil</a>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
