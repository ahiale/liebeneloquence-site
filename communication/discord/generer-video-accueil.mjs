// Génère les images de la vidéo d'accueil LEQ'FAM (1280 × 720, 24 images/s, environ 18 s).
// Utilisation (depuis le dossier du projet) :
//   node communication/discord/generer-video-accueil.mjs <dossier-des-images>
//   ffmpeg -framerate 24 -i <dossier>/%04d.png -c:v libx264 -pix_fmt yuv420p -crf 20 communication/discord/video-accueil.mp4
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";
import { GOLD, NAVY, ORANGE, SPARKLE, HEART, MIC, UNDERLINE, fonts, h, img, serif } from "../instagram/commun.mjs";

const OUT = process.argv[2];
const W = 1280, H = 720, FPS = 24, DUREE = 18;

// Courbes d'animation
const borne = (x) => Math.max(0, Math.min(1, x));
const doux = (x) => 1 - Math.pow(1 - borne(x), 3);
const apparition = (t, debut, duree = 0.6) => doux((t - debut) / duree);

const ETAPES = [
  { n: "1", salon: "# fonctionnement", texte: "À quoi sert chaque salon" },
  { n: "2", salon: "# règlements", texte: "Les règles de la famille" },
  { n: "3", salon: "# présente-toi", texte: "Présente-toi à la communauté" },
];

function image(t) {
  // Scène 1 (0 à 4 s) : bienvenue ; scène 2 (4 à 13,5 s) : les 3 étapes ; scène 3 (13,5 à 18 s) : à toi de jouer
  const s1 = t < 4.6, s3 = t >= 13.5;
  const sortie1 = 1 - apparition(t, 4, 0.6);
  const fond = "linear-gradient(160deg, #000d21 0%, #001636 45%, #0B3070 100%)";
  const decor = [
    img(SPARKLE(GOLD), 70, 70, { position: "absolute", top: 50, right: 70, transform: `rotate(${t * 20}deg)` }),
    img(HEART(ORANGE), 38, 38, { position: "absolute", bottom: 60, left: 80, transform: `scale(${1 + 0.08 * Math.sin(t * 4)})` }),
    h("div", { position: "absolute", top: 46, left: 64, fontSize: 34, fontWeight: 700, color: "#fff", letterSpacing: -1 }, "LEQ", h("span", { color: ORANGE }, ".")),
  ];

  let scene;
  if (s1) {
    const a = apparition(t, 0.3), b = apparition(t, 1.0), c = apparition(t, 1.8);
    scene = h("div", { flexDirection: "column", alignItems: "center", opacity: sortie1 },
      h("div", { fontSize: 30, fontWeight: 700, letterSpacing: 8, color: GOLD, opacity: a, transform: `translateY(${(1 - a) * 20}px)` }, "TON ACCÈS EST ACTIVÉ"),
      h("div", { fontSize: 104, fontWeight: 700, letterSpacing: -4, color: "#fff", marginTop: 18, opacity: b, transform: `translateY(${(1 - b) * 30}px)` }, "Bienvenue dans"),
      serif("la LEQ'FAM.", { fontSize: 128, lineHeight: 1.05, opacity: c, transform: `translateY(${(1 - c) * 30}px)` }),
      img(UNDERLINE, 360, 36, { marginTop: 6, opacity: c }),
    );
  } else if (!s3) {
    const titre = apparition(t, 4.4);
    scene = h("div", { flexDirection: "column", alignItems: "center", width: "100%", opacity: 1 - apparition(t, 13.1, 0.4) },
      h("div", { fontSize: 54, fontWeight: 700, color: "#fff", letterSpacing: -2, opacity: titre }, "Ta visite en ", h("span", { color: GOLD, marginLeft: 12 }, "3 étapes")),
      h("div", { alignItems: "center", marginTop: 54 },
        ...ETAPES.flatMap((e, i) => {
          const debut = 5.2 + i * 2.5;
          const v = apparition(t, debut);
          const actif = t >= debut && t < debut + 2.5;
          const carte = h("div", {
            flexDirection: "column", width: 300, height: 230, padding: "26px 24px", borderRadius: 28,
            background: actif ? "#fff" : "rgba(255,255,255,.1)", color: actif ? NAVY : "#fff",
            border: `4px solid ${actif ? GOLD : "rgba(255,255,255,.2)"}`, opacity: v, transform: `translateY(${(1 - v) * 40}px) scale(${actif ? 1.04 : 1})`,
            boxShadow: actif ? "0 30px 60px -20px rgba(0,0,0,.6)" : "none",
          },
            h("div", { width: 56, height: 56, borderRadius: 28, background: actif ? ORANGE : GOLD, color: actif ? "#fff" : NAVY, fontSize: 30, fontWeight: 700, alignItems: "center", justifyContent: "center" }, e.n),
            h("div", { fontSize: 25, fontWeight: 700, marginTop: 22 }, e.salon),
            h("div", { fontSize: 21, marginTop: 10, opacity: 0.8, lineHeight: 1.35 }, e.texte),
          );
          const fleche = i < 2 ? [h("div", { width: 70, fontSize: 52, fontWeight: 700, color: GOLD, justifyContent: "center", opacity: apparition(t, debut + 1.6) }, "→")] : [];
          return [carte, ...fleche];
        }),
      ),
    );
  } else {
    const a = apparition(t, 13.7), b = apparition(t, 14.5), c = apparition(t, 15.4);
    scene = h("div", { flexDirection: "column", alignItems: "center" },
      img(MIC, 110, 141, { opacity: a, transform: `translateY(${(1 - a) * 30}px) rotate(${6 * Math.sin(t * 3)}deg)` }),
      h("div", { fontSize: 100, fontWeight: 700, letterSpacing: -4, color: "#fff", marginTop: 20, opacity: b }, "À toi"),
      serif("de jouer !", { fontSize: 120, lineHeight: 1.05, opacity: b }),
      h("div", { marginTop: 30, padding: "16px 30px", borderRadius: 999, background: "#5865F2", color: "#fff", fontSize: 28, fontWeight: 700, opacity: c, transform: `scale(${0.95 + 0.05 * c})` }, "Clique sur « 1. Le fonctionnement »"),
    );
  }

  return h("div", { width: "100%", height: "100%", background: fond, fontFamily: "SF", alignItems: "center", justifyContent: "center", position: "relative" }, ...decor, scene);
}

await mkdir(OUT, { recursive: true });
const total = FPS * DUREE;
for (let i = 0; i < total; i++) {
  const png = Buffer.from(await new ImageResponse(image(i / FPS), { width: W, height: H, fonts }).arrayBuffer());
  await writeFile(path.join(OUT, `${String(i).padStart(4, "0")}.png`), png);
  if (i % 48 === 0) console.log(`image ${i}/${total}`);
}
console.log("ok", total, "images");
