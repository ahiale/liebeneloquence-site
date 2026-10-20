"use client";

import { useEffect, useState } from "react";

/* Message de remerciement au retour de Stripe (?merci=precommande ou ?merci=soutien), lu côté navigateur
   pour que la page Autres services reste statique. */
const MERCI: Record<string, { titre: string; texte: string }> = {
  precommande: { titre: "Merci pour votre précommande !", texte: "Vous recevez la confirmation par mail. Je vous préviens dès que l'impression est lancée, puis à l'expédition." },
  soutien: { titre: "Merci pour votre soutien !", texte: "Votre coup de pouce aide LEQ à créer de nouveaux outils pour apprendre à parler en public." },
};

export function MerciMellie() {
  const [merci, setMerci] = useState<(typeof MERCI)[string] | null>(null);
  useEffect(() => {
    const m = MERCI[new URLSearchParams(window.location.search).get("merci") ?? ""];
    if (m) {
      setMerci(m);
      document.getElementById("mellie")?.scrollIntoView();
    }
  }, []);
  if (!merci) return null;
  return (
    <div role="status" className="mb-12 rounded-[22px] bg-gold px-6 py-5 text-center text-ink">
      <p className="m-0 text-[18px] font-bold">{merci.titre}</p>
      <p className="mt-1 mb-0 text-[15px]">{merci.texte}</p>
    </div>
  );
}
