// Briques communes des visuels Instagram LEQ (polices, couleurs, dessins, cadre 1080 × 1350).
// Utilisées par generer-carrousel.mjs et generer-actus.mjs.

import { readFile } from "node:fs/promises";
import path from "node:path";

export const ROOT = process.cwd();
export const W = 1080, H = 1350;
export const NAVY = "#001636", ROYAL = "#114DA8", GOLD = "#FFBD59", ORANGE = "#FF5E01", CREAM = "#FFF6D6";

export const font = (f) => readFile(path.join(ROOT, "src/design/fonts", f));
export const fonts = [
  { name: "SF", data: await font("sf-pro-display-400.otf"), weight: 400, style: "normal" },
  { name: "SF", data: await font("sf-pro-display-600.otf"), weight: 600, style: "normal" },
  { name: "SF", data: await font("sf-pro-display-700.otf"), weight: 700, style: "normal" },
  { name: "Melodrame", data: await font("melodrame.ttf"), weight: 400, style: "italic" },
];
export const pricing = JSON.parse(await readFile(path.join(ROOT, "content/tarifs.json"), "utf8"));
export const photo = `data:image/jpeg;base64,${(await readFile(path.join(ROOT, "public/images/rebecca/pont-du-gard.jpg"))).toString("base64")}`;
export const svg = (s) => `data:image/svg+xml;base64,${Buffer.from(s).toString("base64")}`;
export const quizIcon = async (n) => svg(await readFile(path.join(ROOT, "public/quiz", `q-${n}.svg`), "utf8"));

export const SPARKLE = (c) => svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"><path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></svg>`);
export const HEART = (c) => svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${c}"><path d="M12 21s-7-4.4-9.5-9A5.4 5.4 0 0 1 12 6.1 5.4 5.4 0 0 1 21.5 12C19 16.6 12 21 12 21z"/></svg>`);
export const MIC = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 90" fill="none"><rect x="20" y="4" width="30" height="44" rx="15" fill="#fff" stroke="#001636" stroke-width="2.5"/><path d="M24 18h22M24 26h22M24 34h22" stroke="#001636" stroke-width="2" stroke-linecap="round"/><path d="M12 36c0 14 10 24 23 24s23-10 23-24M35 60v18M24 84h22" stroke="#FF5E01" stroke-width="3" stroke-linecap="round"/></svg>`);
export const BUBBLE = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 56" fill="none"><path d="M10 6h50a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H32l-12 12V38H10a8 8 0 0 1-8-8V14a8 8 0 0 1 8-8z" fill="#fff" stroke="#001636" stroke-width="2.4" stroke-linejoin="round"/><path d="M20 20h30M20 27h20" stroke="#FF5E01" stroke-width="2.6" stroke-linecap="round"/></svg>`);

export const UNDERLINE = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 26" fill="none"><path d="M4 17c34-10 72-12 112-9s82 5 128-7" stroke="#FFBD59" stroke-width="4" stroke-linecap="round"/><path d="M48 22c46-6 98-7 150-3" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`);
export const ARROW = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 50" fill="none"><path d="M4 30c16-20 34-22 44-10 6 8-2 16-8 10s4-20 22-20c8 0 16 4 22 10" stroke="#FFBD59" stroke-width="3" stroke-linecap="round"/><path d="m78 12 8 8-11 2" stroke="#FFBD59" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

// Mini « JSX » : h("div", style, ...enfants)
export const h = (type, style = {}, ...children) => {
  const kids = children.flat().filter((c) => c !== null && c !== undefined && c !== false);
  const props = type === "img" ? { ...style } : { style: { display: "flex", ...style } };
  if (type !== "img") props.children = kids.length === 1 ? kids[0] : kids;
  return { type, props, key: null };
};
export const img = (src, w, h_, style = {}) => ({ type: "img", props: { src, width: w, height: h_, style }, key: null });
export const serif = (text, style = {}) => h("div", { fontFamily: "Melodrame", fontStyle: "italic", color: GOLD, ...style }, text);

export const BG = {
  hero: "linear-gradient(160deg, #0B3070 0%, #114DA8 55%, #2A64C4 100%)",
  nuit: "linear-gradient(165deg, #000d21 0%, #001636 50%, #0B3070 100%)",
  braise: "linear-gradient(165deg, #2E1106 0%, #0b1d3f 55%, #001636 100%)",
  ciel: "linear-gradient(170deg, #2A64C4 0%, #1A57B8 45%, #114DA8 100%)",
  clair: "linear-gradient(180deg, #FFFFFF 0%, #F6F8FC 50%, #E8EFFA 100%)",
};

/** Cadre commun : logo, numéro, contenu, pied de page. */
export function frame(n, total, bg, content, { dark = true, swipe = true } = {}) {
  const ink = dark ? "#fff" : NAVY;
  return h("div", { width: "100%", height: "100%", flexDirection: "column", padding: "70px 80px", background: bg, color: ink, fontFamily: "SF", position: "relative" },
    h("div", { justifyContent: "space-between", alignItems: "center" },
      h("div", { fontSize: 46, fontWeight: 700, letterSpacing: -2, color: ink }, "LEQ", h("span", { color: ORANGE }, ".")),
      total > 1 ? h("div", { fontSize: 22, fontWeight: 600, letterSpacing: 2, color: dark ? "rgba(255,255,255,.6)" : "rgba(0,22,54,.5)" }, `${n}/${total}`) : null,
    ),
    h("div", { flex: 1, flexDirection: "column", justifyContent: "center" }, content),
    h("div", { justifyContent: "space-between", alignItems: "center", paddingTop: 26, borderTop: `1px solid ${dark ? "rgba(255,255,255,.2)" : "rgba(0,22,54,.15)"}` },
      h("div", { fontSize: 26, fontWeight: 600, color: dark ? GOLD : ROYAL }, "liebeneloquence.com"),
      swipe ? h("div", { fontSize: 26, fontWeight: 600, color: dark ? "#fff" : NAVY }, "Glissez  →") : h("div", { fontSize: 26, fontWeight: 600, color: ORANGE }, "Lien en bio"),
    ),
  );
}

export const chip = (text, style = {}) => h("div", { padding: "12px 24px", borderRadius: 999, background: "linear-gradient(96deg, #FFBD59, #FF5E01)", color: NAVY, fontSize: 26, fontWeight: 600, marginRight: 12, marginBottom: 12, ...style }, text);
export const check = (text, color = "#fff") => h("div", { alignItems: "flex-start", marginBottom: 16, fontSize: 30, color },
  h("div", { color: GOLD, fontWeight: 700, marginRight: 16 }, "✓"), h("div", { flex: 1 }, text));

