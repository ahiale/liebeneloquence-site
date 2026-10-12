// Génère les bannières des salons Discord LEQ'FAM (1200 × 400) et l'icône du serveur (512 × 512).
// Utilisation (depuis le dossier du projet) :  node communication/discord/generer-bannieres.mjs
// Résultat : communication/discord/bannieres/*.png

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";
import { BUBBLE, GOLD, HEART, MIC, NAVY, ORANGE, ROOT, SPARKLE, UNDERLINE, fonts, h, img, serif, svg } from "../instagram/commun.mjs";

const OUT = path.join(ROOT, "communication", "discord", "bannieres");

const TROPHY = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 90" fill="none"><path d="M20 8h40v22a20 20 0 0 1-40 0V8z" fill="#fff" stroke="#001636" stroke-width="3"/><path d="M20 14H8c0 12 6 18 14 18M60 14h12c0 12-6 18-14 18" stroke="#FFBD59" stroke-width="3.5" stroke-linecap="round"/><path d="M40 50v14M26 80h28l-3-14H29z" stroke="#FF5E01" stroke-width="3.5" stroke-linejoin="round"/></svg>`);
const GLOBE = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="32" fill="#fff" stroke="#001636" stroke-width="3"/><path d="M8 40h64M40 8c10 10 14 21 14 32S50 62 40 72M40 8C30 18 26 29 26 40s4 22 14 32" stroke="#114DA8" stroke-width="3"/><circle cx="58" cy="20" r="6" fill="#FF5E01"/></svg>`);
const BOOK = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 70" fill="none"><path d="M45 14C35 6 18 6 6 10v50c12-4 29-4 39 4 10-8 27-8 39-4V10C72 6 55 6 45 14z" fill="#fff" stroke="#001636" stroke-width="3" stroke-linejoin="round"/><path d="M45 14v50M16 22c8-2 15-2 21 1M16 32c8-2 15-2 21 1M54 23c6-3 13-3 21-1" stroke="#FF5E01" stroke-width="3" stroke-linecap="round"/></svg>`);
const CAL = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none"><rect x="8" y="14" width="64" height="58" rx="10" fill="#fff" stroke="#001636" stroke-width="3"/><path d="M8 30h64M24 6v16M56 6v16" stroke="#001636" stroke-width="3" stroke-linecap="round"/><circle cx="28" cy="46" r="5" fill="#FF5E01"/><circle cx="44" cy="46" r="5" fill="#FFBD59"/><circle cx="28" cy="60" r="5" fill="#FFBD59"/></svg>`);
const KEY = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 60" fill="none"><rect x="6" y="10" width="78" height="40" rx="12" fill="#fff" stroke="#001636" stroke-width="3"/><path d="M60 10v40" stroke="#001636" stroke-width="3" stroke-dasharray="5 5"/><path d="M18 24h30M18 34h20" stroke="#FF5E01" stroke-width="3.5" stroke-linecap="round"/><path d="M70 22l4 8-4 8" stroke="#114DA8" stroke-width="3" stroke-linecap="round"/></svg>`);

const FONDS = {
  nuit: "linear-gradient(165deg, #000d21 0%, #001636 50%, #0B3070 100%)",
  roi: "linear-gradient(160deg, #0B3070 0%, #114DA8 55%, #2A64C4 100%)",
  braise: "linear-gradient(165deg, #2E1106 0%, #0b1d3f 55%, #001636 100%)",
  soleil: "linear-gradient(150deg, #FF5E01 0%, #FF8A2A 55%, #FFBD59 100%)",
};

/** [fichier, surtitre, titre, accent en italique, illustration, fond] */
const BANNIERES = [
  ["bienvenue", "LEQ'FAM", "Bienvenue dans", "la famille.", BUBBLE, "roi"],
  ["reglements", "Accueil", "Les règles", "de la maison.", HEART(ORANGE), "nuit"],
  ["rejoindre", "Communauté LEQ'FAM", "Rejoindre", "la LEQ'FAM.", KEY, "soleil"],
  ["liens", "Accueil", "Tous nos", "liens utiles.", BUBBLE, "nuit"],
  ["presente-toi", "LEQ'FAM", "Présente-toi,", "on t'écoute !", MIC, "roi"],
  ["entrainements", "LEQ'FAM", "On s'entraîne", "ensemble.", MIC, "nuit"],
  ["defis", "LEQ'FAM", "Le défi", "de la semaine.", SPARKLE(GOLD), "braise"],
  ["entraide", "LEQ'FAM", "Une question ?", "On s'entraide.", BUBBLE, "roi"],
  ["ressources", "LEQ'FAM", "Les ressources", "pour progresser.", BOOK, "nuit"],
  ["organisations", "Veille LEQ", "Organisations", "internationales.", GLOBE, "roi"],
  ["grand-prix", "Chaque trimestre", "Le Grand Prix", "LEQ.", TROPHY, "braise"],
  ["lives", "LeqAteliers", "Le programme", "des lives.", CAL, "nuit"],
  ["ambassadeurs", "Réservé", "L'espace", "ambassadeurs.", TROPHY, "braise"],
];

function banniere([, surtitre, titre, accent, illus, fond]) {
  const clair = fond === "soleil";
  return h("div", { width: "100%", height: "100%", padding: "48px 64px", background: FONDS[fond], fontFamily: "SF", color: clair ? NAVY : "#fff", position: "relative", alignItems: "center" },
    img(SPARKLE(clair ? NAVY : GOLD), 56, 56, { position: "absolute", top: 34, right: 300 }),
    img(HEART(clair ? "#fff" : ORANGE), 34, 34, { position: "absolute", bottom: 46, right: 330, transform: "rotate(-12deg)" }),
    h("div", { flexDirection: "column", flex: 1 },
      h("div", { fontSize: 34, fontWeight: 700, letterSpacing: -1 }, "LEQ", h("span", { color: clair ? "#fff" : ORANGE }, ".")),
      h("div", { fontSize: 20, fontWeight: 700, letterSpacing: 6, color: clair ? NAVY : GOLD, marginTop: 26 }, surtitre.toUpperCase()),
      h("div", { fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1, marginTop: 10 }, titre),
      serif(accent, { fontSize: 88, lineHeight: 1.05, color: clair ? "#fff" : GOLD }),
      img(UNDERLINE, 300, 30, { marginTop: 2, marginLeft: 6 }),
    ),
    h("div", { width: 230, height: 230, borderRadius: 115, background: clair ? "rgba(255,255,255,.35)" : "rgba(255,255,255,.1)", border: `3px solid ${clair ? "#fff" : "rgba(255,189,89,.55)"}`, alignItems: "center", justifyContent: "center" },
      img(illus, 130, 130, {})),
  );
}

const icone = h("div", { width: "100%", height: "100%", background: FONDS.nuit, alignItems: "center", justifyContent: "center", fontFamily: "SF", position: "relative" },
  img(SPARKLE(GOLD), 70, 70, { position: "absolute", top: 70, right: 80 }),
  h("div", { fontSize: 190, fontWeight: 700, letterSpacing: -10, color: "#fff" }, "LEQ", h("span", { color: ORANGE }, ".")),
);

await mkdir(OUT, { recursive: true });
for (const b of BANNIERES) {
  await writeFile(path.join(OUT, `${b[0]}.png`), Buffer.from(await new ImageResponse(banniere(b), { width: 1200, height: 400, fonts }).arrayBuffer()));
  console.log("ok", b[0]);
}
await writeFile(path.join(OUT, "icone-serveur.png"), Buffer.from(await new ImageResponse(icone, { width: 512, height: 512, fonts }).arrayBuffer()));
console.log("ok icone-serveur");
