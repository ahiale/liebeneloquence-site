// Rend les maquettes de l'admin (maquettes.html) en PNG, une image par écran.
// Utilisation : node communication/maquettes/admin/generer-maquettes.cjs  (PUPPETEER = chemin de puppeteer-core si besoin)
const path = require("node:path");
const puppeteer = require(process.env.PUPPETEER || "puppeteer-core");
(async () => {
  const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
  const pg = await b.newPage();
  await pg.setViewport({ width: 1440, height: 900 });
  await pg.goto("file:///" + path.join(__dirname, "maquettes.html").split(path.sep).join("/"), { waitUntil: "networkidle0" });
  await pg.evaluate(() => document.fonts.ready);
  const ids = await pg.$$eval(".ecran", (e) => e.map((x) => x.id));
  for (const [i, id] of ids.entries()) {
    await (await pg.$(`#${id}`)).screenshot({ path: path.join(__dirname, `${i + 1}-${id}.png`) });
    console.log(`${i + 1}-${id}.png`);
  }
  await b.close();
})();
