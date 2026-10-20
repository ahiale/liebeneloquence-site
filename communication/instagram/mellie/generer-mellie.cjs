// Rend les visuels Instagram de la BD « Mellie a le trac » (visuels.html) en PNG, un fichier par visuel.
// Utilisation (depuis le dossier du projet) :  node communication/instagram/mellie/generer-mellie.cjs
// Il faut Google Chrome et puppeteer-core (variable PUPPETEER si puppeteer-core n'est pas installé dans le projet).
const path = require("node:path");
const puppeteer = require(process.env.PUPPETEER || "puppeteer-core");

(async () => {
  const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--allow-file-access-from-files"] });
  const pg = await b.newPage();
  await pg.setViewport({ width: 1080, height: 1920 });
  await pg.goto("file:///" + path.join(__dirname, "visuels.html").replace(/\\/g, "/"), { waitUntil: "networkidle0" });
  await pg.evaluate(() => document.fonts.ready);
  for (const el of await pg.$$(".visuel")) {
    const id = await el.evaluate((e) => e.id);
    await el.screenshot({ path: path.join(__dirname, `${id}.png`) });
    console.log(`${id}.png`);
  }
  await b.close();
})();
