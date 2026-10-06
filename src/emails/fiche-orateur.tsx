import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { QuizResult } from "@/lib/quiz";

/**
 * Fiche orateur : infographie PNG (format portrait 4:5) envoyée avec le mail du quiz.
 * Polices et couleurs de la charte. Rendu avec next/og (même moteur que les images de partage).
 */

const FONTS_DIR = path.join(process.cwd(), "src", "design", "fonts");
const QUIZ_IMG_DIR = path.join(process.cwd(), "public", "quiz");

let fontsCache: { name: string; data: Buffer; weight: 400 | 600 | 700; style: "normal" | "italic" }[] | null = null;

async function fonts() {
  fontsCache ??= await Promise.all([
    readFile(path.join(FONTS_DIR, "sf-pro-display-400.otf")).then((data) => ({ name: "SF", data, weight: 400 as const, style: "normal" as const })),
    readFile(path.join(FONTS_DIR, "sf-pro-display-600.otf")).then((data) => ({ name: "SF", data, weight: 600 as const, style: "normal" as const })),
    readFile(path.join(FONTS_DIR, "sf-pro-display-700.otf")).then((data) => ({ name: "SF", data, weight: 700 as const, style: "normal" as const })),
    readFile(path.join(FONTS_DIR, "melodrame.ttf")).then((data) => ({ name: "Melodrame", data, weight: 400 as const, style: "italic" as const })),
  ]);
  return fontsCache;
}

const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

const SPARKLE = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFBD59" stroke-width="1.8" stroke-linecap="round"><path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></svg>',
);
const HEART = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF5E01"><path d="M12 21s-7-4.4-9.5-9A5.4 5.4 0 0 1 12 6.1 5.4 5.4 0 0 1 21.5 12C19 16.6 12 21 12 21z"/></svg>',
);

const NAVY = "#001636";
const GOLD = "#FFBD59";
const ORANGE = "#FF5E01";

export async function renderFicheOrateur(r: QuizResult, prenom: string): Promise<Buffer> {
  const icon = svgUri(await readFile(path.join(QUIZ_IMG_DIR, path.basename(r.profile.img)), "utf8"));
  const height = 1030 + r.points.length * 215;

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          color: "#fff",
          fontFamily: "SF",
          background: "linear-gradient(160deg, #0B3070 0%, #114DA8 55%, #2A64C4 100%)",
          position: "relative",
        }}
      >
        <img src={SPARKLE} width={70} height={70} style={{ position: "absolute", top: 150, right: 80 }} />
        <img src={HEART} width={46} height={46} style={{ position: "absolute", top: 330, right: 150 }} />

        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 700, letterSpacing: -2, color: GOLD }}>
            LEQ<span style={{ color: ORANGE }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 20, fontWeight: 600, letterSpacing: 6, color: GOLD }}>FICHE ORATEUR</div>
        </div>

        {/* Profil */}
        <div style={{ display: "flex", marginTop: 56, fontSize: 28, color: "rgba(255,255,255,.85)" }}>{`Le profil de ${prenom}`}</div>
        <div style={{ display: "flex", fontFamily: "Melodrame", fontStyle: "italic", fontSize: 118, color: GOLD, lineHeight: 1.05, marginTop: 6 }}>{r.profile.name}</div>

        <div style={{ display: "flex", alignItems: "center", marginTop: 36, background: "#fff", borderRadius: 32, padding: 32, color: NAVY }}>
          <div style={{ display: "flex", width: 150, height: 150, borderRadius: 75, background: "radial-gradient(circle, rgba(255,189,89,.75), rgba(255,189,89,0) 70%)", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <img src={icon} width={130} height={130} />
          </div>
          <div style={{ display: "flex", flex: 1, minWidth: 0, marginLeft: 30, fontSize: 27, lineHeight: 1.45, color: "rgba(0,22,54,.8)" }}>{r.profile.desc}</div>
        </div>

        {/* Niveau */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 26, background: "#fff", borderRadius: 32, padding: "28px 32px", color: NAVY }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 600, color: "rgba(0,22,54,.6)", letterSpacing: 3 }}>VOTRE NIVEAU</div>
            <div style={{ display: "flex", fontSize: 38, fontWeight: 700, letterSpacing: -1 }}>{r.level.name}</div>
          </div>
          <div style={{ display: "flex", height: 18, borderRadius: 9, background: "#E8EFFA", marginTop: 18 }}>
            <div style={{ display: "flex", width: r.level.width, height: 18, borderRadius: 9, background: GOLD }} />
          </div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 23, color: "rgba(0,22,54,.7)" }}>{r.level.desc}</div>
        </div>

        {/* Points à travailler + exercices */}
        <div style={{ display: "flex", alignItems: "baseline", marginTop: 44 }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>Vos points</div>
          <div style={{ display: "flex", fontFamily: "Melodrame", fontStyle: "italic", fontSize: 46, color: GOLD, marginLeft: 12 }}>à travailler</div>
        </div>
        {r.points.map((pt, i) => (
          <div key={pt.title} style={{ display: "flex", marginTop: 20, borderRadius: 28, padding: "24px 28px", background: "rgba(0,22,54,.38)", border: "1px solid rgba(255,255,255,.18)" }}>
            <div style={{ display: "flex", width: 56, height: 56, borderRadius: 28, background: GOLD, color: NAVY, fontSize: 28, fontWeight: 700, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{String(i + 1)}</div>
            <div style={{ display: "flex", flexDirection: "column", marginLeft: 22, flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>{pt.title}</div>
              <div style={{ display: "flex", marginTop: 10, fontSize: 17, fontWeight: 600, letterSpacing: 3, color: GOLD }}>EXERCICE</div>
              <div style={{ display: "flex", marginTop: 4, fontSize: 23, lineHeight: 1.45, color: "rgba(255,255,255,.88)" }}>{pt.exercise}</div>
            </div>
          </div>
        ))}

        {/* Pied */}
        <div style={{ display: "flex", marginTop: "auto", paddingTop: 30, justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,.2)" }}>
          <div style={{ display: "flex", fontSize: 24, color: "rgba(255,255,255,.85)" }}>Séance diagnostic de 30 min offerte</div>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 600, color: GOLD }}>liebeneloquence.com</div>
        </div>
      </div>
    ),
    { width: 1080, height, fonts: await fonts() },
  );

  return Buffer.from(await image.arrayBuffer());
}
