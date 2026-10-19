"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/* Le plateau des points en roue : il tourne en continu ; d'un clic, il part en grand tour et freine. */
export function RoueJeu() {
  const roue = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const [lancee, setLancee] = useState(false);

  const lancer = () => {
    if (lancee) return;
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Angle actuel de la rotation continue, pour repartir sans à-coup
    const m = roue.current ? new DOMMatrix(getComputedStyle(roue.current).transform) : null;
    const depart = m ? (Math.atan2(m.b, m.a) * 180) / Math.PI : 0;
    const arrivee = depart + (calme ? 0 : 1440 + Math.random() * 720);
    setAngle(depart);
    setLancee(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setAngle(arrivee)));
    window.setTimeout(() => setLancee(false), calme ? 0 : 4200);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <span className="roue-repere" aria-hidden="true" />
        <div
          ref={roue}
          className={`roue ${lancee ? "roue--lancee" : "roue--continue"}`}
          style={lancee ? { transform: `rotate(${angle}deg)` } : undefined}
        >
          <Image src="/jeu/plateau.webp" alt="Plateau des points du jeu Avocat du diable : fond +2, forme +2, sabotages" width={900} height={900} sizes="400px" className="block h-auto w-full" />
        </div>
      </div>
      <button type="button" onClick={lancer} disabled={lancee} className="btn btn-p mt-10 disabled:opacity-70">
        {lancee ? "Ça tourne…" : "Faire tourner le plateau"}
      </button>
    </div>
  );
}
