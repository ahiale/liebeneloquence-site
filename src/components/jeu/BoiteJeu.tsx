"use client";

import Image from "next/image";
import { useRef } from "react";

/* Boîte du jeu en 3D : elle entre en scène en pivotant (au défilement) et suit la souris. */
export function BoiteJeu() {
  const scene = useRef<HTMLDivElement>(null);

  const suivre = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !scene.current) return;
    const r = scene.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    scene.current.style.setProperty("--tx", `${x * 40}deg`);
    scene.current.style.setProperty("--ty", `${y * -24}deg`);
  };
  const repos = () => {
    scene.current?.style.setProperty("--tx", "0deg");
    scene.current?.style.setProperty("--ty", "0deg");
  };

  return (
    <div ref={scene} onPointerMove={suivre} onPointerLeave={repos} className="jeu-scene" aria-hidden="true">
      <div className="jeu-entree">
        <div className="jeu-flotte">
          <div className="jeu-boite">
            <div className="jeu-face jeu-dessus">
              <Image src="/jeu/couverture.webp" alt="" fill sizes="(max-width: 640px) 300px, 520px" style={{ objectFit: "cover" }} />
              <span className="jeu-reflet" />
            </div>
            <div className="jeu-face jeu-cote">
              <span>
                AVOCAT DU DIABLE <span className="text-orange">·</span> LEQ<span className="text-orange">.</span>
              </span>
            </div>
            <div className="jeu-face jeu-tranche">
              <span>PLAIDE · BLUFFE · CONVAINCS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
