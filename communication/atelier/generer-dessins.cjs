// Rend les petits dessins du site (src/components/ui/Doodles.tsx) en PNG transparents, au trait, pour les diaporamas.
// Utilisation : node communication/atelier/generer-dessins.cjs  (puppeteer-core + Chrome installé)
// Résultat : communication/atelier/dessins/<nom>-<couleur>.png
const path = require("node:path");
const fs = require("node:fs");
const puppeteer = require(process.env.PUPPETEER || "puppeteer-core");

const OUT = path.join(__dirname, "dessins");
const COULEURS = { blanc: "#FFFFFF", ciel: "#3A8DDE", royal: "#114DA8", orange: "#FF5E01", or: "#FFBD59" };

// Chemins identiques à ceux du site ; tous au trait (aucun remplissage).
const DESSINS = {
  etincelle: [24, 24, (c) => `<path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`],
  etoile: [24, 24, (c) => `<path d="M12 3l1.9 5.8L20 10.7l-5.1 3.6L16.8 21 12 17.3 7.2 21l1.9-6.7L4 10.7l6.1-1.9z" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/>`],
  coeur: [24, 24, (c) => `<path d="M12 21s-7-4.4-9.5-9A5.4 5.4 0 0 1 12 6.1 5.4 5.4 0 0 1 21.5 12C19 16.6 12 21 12 21z" fill="${c}"/>`],
  gribouillis: [72, 44, (c) => `<path d="M4 32c10-22 26-26 36-14s8 18 0 16-6-16 6-22 18 0 22 6" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>`],
  fleche: [90, 50, (c) => `<path d="M4 30c16-20 34-22 44-10 6 8-2 16-8 10s4-20 22-20c8 0 16 4 22 10" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/><path d="m78 12 8 8-11 2" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`],
  souligne: [230, 24, (c) => `<path d="M4 15c32-9 66-11 104-8s78 4 118-6" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`],
  bulle: [70, 56, (c) => `<path d="M10 6h50a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H32l-12 12V38H10a8 8 0 0 1-8-8V14a8 8 0 0 1 8-8z" stroke="${c}" stroke-width="2.4" stroke-linejoin="round"/><path d="M20 20h30M20 27h20" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>`],
  micro: [70, 90, (c) => `<rect x="20" y="4" width="30" height="44" rx="15" stroke="${c}" stroke-width="2.5"/><path d="M26 18h18M26 26h18M26 34h18" stroke="${c}" stroke-width="2" stroke-linecap="round"/><path d="M12 36c0 14 10 24 23 24s23-10 23-24M35 60v18M24 84h22" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`],
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
  const pg = await b.newPage();
  const ECHELLE = 12; // haute définition
  for (const [nom, [w, h, svg]] of Object.entries(DESSINS))
    for (const [cn, c] of Object.entries(COULEURS)) {
      await pg.setViewport({ width: w * ECHELLE, height: h * ECHELLE });
      await pg.setContent(`<html><body style="margin:0;background:transparent"><svg width="${w * ECHELLE}" height="${h * ECHELLE}" viewBox="0 0 ${w} ${h}" fill="none">${svg(c)}</svg></body></html>`);
      await pg.screenshot({ path: path.join(OUT, `${nom}-${cn}.png`), omitBackground: true });
    }
  await b.close();
  console.log("ok", fs.readdirSync(OUT).length, "dessins");
})();
