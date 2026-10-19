"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/* « Tire une carte ! » : le paquet tremble (suspense), puis une carte au hasard se retourne avec une réaction.
   Sans animation si le visiteur a demandé à réduire les animations. */

const CARTES = [
  { src: "/jeu/carte-affaire.webp", nom: "Affaire : la dernière frite", reaction: "Coupable ?!" },
  { src: "/jeu/carte-sabotage.webp", nom: "Sabotage : volte-face", reaction: "OBJECTION !" },
  { src: "/jeu/carte-personnage.webp", nom: "Sabotage : la star de télénovela", reaction: "Ha ha ha !" },
  { src: "/jeu/carte-role.webp", nom: "Rôle : le Public", reaction: "Oh !" },
];

type Phase = "repos" | "suspense" | "revele";

export function TirerCarte() {
  const [phase, setPhase] = useState<Phase>("repos");
  const [index, setIndex] = useState(0);
  const [tirage, setTirage] = useState(0); // relance l'animation de la réaction à chaque tirage
  const minuteur = useRef<number | null>(null);

  const tirer = () => {
    if (phase === "suspense") return;
    // Jamais deux fois la même carte de suite
    const suivant = (index + 1 + Math.floor(Math.random() * (CARTES.length - 1))) % CARTES.length;
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveler = () => {
      setIndex(suivant); // la nouvelle carte n'apparaît qu'à la révélation
      setTirage((n) => n + 1);
      setPhase("revele");
    };
    if (calme) return reveler();
    setPhase("suspense");
    if (minuteur.current) window.clearTimeout(minuteur.current);
    minuteur.current = window.setTimeout(reveler, 1100);
  };

  const carte = CARTES[index];
  const revele = phase === "revele";

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center gap-6 sm:gap-12">
        {/* Le paquet */}
        <div className={`jeu-paquet ${phase === "suspense" ? "jeu-tremble" : ""}`} aria-hidden="true">
          {[2, 1, 0].map((i) => (
            <div key={i} className="jeu-dos" style={{ transform: `translate(${i * 5}px, ${i * -5}px) rotate(${i * 2 - 2}deg)` }}>
              <DosDeCarte />
            </div>
          ))}
        </div>

        {/* La carte tirée */}
        <div className="jeu-tirage">
          <div className={`jeu-retourne ${revele ? "jeu-retourne--face" : ""}`}>
            <div className="jeu-retourne-dos">
              <DosDeCarte />
            </div>
            <div className="jeu-retourne-face">
              <Image src={carte.src} alt={carte.nom} width={600} height={840} sizes="240px" className="h-full w-full" />
            </div>
          </div>
          {revele && (
            <span key={tirage} className="jeu-reaction" aria-hidden="true">
              {carte.reaction}
            </span>
          )}
          {phase === "suspense" && <span className="jeu-suspense" aria-hidden="true">Roulement de tambour…</span>}
        </div>
      </div>

      <button type="button" onClick={tirer} disabled={phase === "suspense"} className="btn btn-p mt-10 disabled:opacity-70">
        {phase === "repos" ? "Tirer une carte" : phase === "suspense" ? "Suspense…" : "Encore une !"}
      </button>
      <p className="sr-only" aria-live="polite">
        {revele ? `Carte tirée : ${carte.nom}` : ""}
      </p>
    </div>
  );
}

/** Dos des cartes : bleu nuit, cornes, titre du jeu. */
function DosDeCarte() {
  return (
    <div className="jeu-dos-motif">
      <span className="jeu-cornes" />
      <span className="jeu-dos-titre">
        AVOCAT
        <br />
        DU DIABLE
      </span>
      <span className="text-[13px] font-extrabold tracking-[-0.04em] text-white">
        LEQ<span className="text-orange">.</span>
      </span>
    </div>
  );
}
