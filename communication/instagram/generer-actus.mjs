// Génère les visuels Instagram des événements, à partir de content/evenements.json :
//   - le carrousel « Les actus LEQ du moment » (5 visuels 1080 × 1350) ;
//   - une publication et une story qui annoncent la masterclass parmi nos événements.
// Utilisation (depuis le dossier du projet) :  node communication/instagram/generer-actus.mjs
// Résultat : communication/instagram/actus/ (01.png … 05.png, masterclass-publication.png, masterclass-story.png)

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";
import { BG, BUBBLE, GOLD, H, HEART, MIC, NAVY, ORANGE, ROOT, ROYAL, SPARKLE, UNDERLINE, W, check, chip, fonts, frame, h, img, serif } from "./commun.mjs";

const OUT = path.join(ROOT, "communication", "instagram", "actus");
const STORY_H = 1920;

const events = JSON.parse(await readFile(path.join(ROOT, "content/evenements.json"), "utf8")).filter((e) => e.status === "published");
const bySlug = (prefix) => {
  const e = events.find((x) => x.slug.startsWith(prefix));
  if (!e) throw new Error(`Événement introuvable dans content/evenements.json : ${prefix}…`);
  return e;
};
const rdv = bySlug("rendez-vous-mensuel");
const masterclass = bySlug("masterclass");
const leqfam = bySlug("lancement-communaute-leqfam");

const photo = async (p) => `data:image/jpeg;base64,${(await readFile(path.join(ROOT, "public", p))).toString("base64")}`;
const sansAnnee = (label) => label.replace(/\s+\d{4}$/, "");
const horaires = (label) => (label ?? "").replace(/\s*\(.*\)\s*$/, "");
const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
/** Pastille date : « 13 » / « oct. », ou le libellé (« Fin octobre ») si la date exacte n'est pas connue. */
const dateBlock = (e, size = 1) => {
  if (!e.startsAt) {
    return h("div", { width: 150 * size, height: 150 * size, borderRadius: 30 * size, background: GOLD, color: NAVY, alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: 26 * size, fontWeight: 700, lineHeight: 1.1, padding: 12 }, e.dateLabel.replace(/\s+\d{4}$/, ""));
  }
  const [, , day] = e.startsAt.slice(0, 10).split("-");
  const month = MOIS[Number(e.startsAt.slice(5, 7)) - 1];
  return h("div", { width: 150 * size, height: 150 * size, borderRadius: 30 * size, background: "#fff", color: NAVY, flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `6px 6px 0 ${GOLD}` },
    h("div", { fontSize: 64 * size, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }, String(Number(day))),
    h("div", { fontSize: 26 * size, fontWeight: 600, color: ORANGE, marginTop: 4 }, month),
  );
};
const infoLine = (icon, text, color = "#fff") => h("div", { alignItems: "center", marginBottom: 14, fontSize: 32, color },
  h("div", { width: 44, color: GOLD, fontWeight: 700 }, icon), h("div", { flex: 1 }, text));
const ctaBox = (title, sub, { dark = false } = {}) => h("div", { marginTop: 36, padding: "28px 34px", borderRadius: 30, background: dark ? NAVY : "#fff", color: dark ? "#fff" : NAVY, flexDirection: "column", boxShadow: `8px 8px 0 ${GOLD}` },
  h("div", { fontSize: 36, fontWeight: 700 }, title),
  h("div", { fontSize: 27, marginTop: 8, color: dark ? "rgba(255,255,255,.8)" : "rgba(0,22,54,.75)" }, sub),
);
/** Masterclass coorganisée (affiché sur ses visuels). */
const ORGANISATEURS = "Organisée par LEQ et @whassup.ruth";

// Rebecca : version éclaircie du portrait (celle du site est trop sombre en petit format)
const PORTRAIT_REBECCA = "/images/rebecca/portrait-studio-lumineux.jpg";
const speakers = await Promise.all((masterclass.speakers ?? []).map(async (s) => {
  const image = s.name.startsWith("Rebecca") ? PORTRAIT_REBECCA : s.image;
  return { ...s, src: image ? await photo(image) : null };
}));
const speakerRow = (size = 150) => h("div", { marginTop: 34 },
  ...speakers.map((s) => h("div", { alignItems: "center", marginRight: 46 },
    s.src
      ? h("div", { width: size, height: size, borderRadius: size, overflow: "hidden", border: `5px solid ${GOLD}` }, img(s.src, size - 10, size - 10, { objectFit: "cover", objectPosition: "50% 20%", borderRadius: size }))
      : h("div", { width: size, height: size, borderRadius: size, background: GOLD }),
    h("div", { flexDirection: "column", marginLeft: 22 },
      h("div", { fontSize: 34, fontWeight: 700 }, s.name.split(" ")[0]),
      serif(s.role, { fontSize: 44, color: GOLD }),
    ),
  )),
);

const total = 5;
const carrousel = [
  // 1. Couverture : les trois rendez-vous du moment
  frame(1, total, BG.hero, h("div", { flexDirection: "column", position: "relative" },
    img(SPARKLE(GOLD), 90, 90, { position: "absolute", top: -60, right: 20 }),
    img(HEART(ORANGE), 50, 50, { position: "absolute", top: 210, right: 60, transform: "rotate(12deg)" }),
    h("div", { alignSelf: "flex-start", padding: "10px 22px", borderRadius: 999, background: ORANGE, color: "#fff", fontSize: 24, fontWeight: 700, letterSpacing: 6, transform: "rotate(-3deg)" }, "OCTOBRE 2026"),
    h("div", { fontSize: 112, fontWeight: 700, letterSpacing: -4, lineHeight: 1, marginTop: 28 }, "Les actus"),
    serif("LEQ du moment", { fontSize: 130, lineHeight: 1.08 }),
    img(UNDERLINE, 430, 40, { marginTop: -4, marginLeft: 10 }),
    h("div", { flexDirection: "column", marginTop: 46 },
      ...[rdv, masterclass, leqfam].map((e) => h("div", { alignItems: "center", marginBottom: 22, padding: "20px 24px", borderRadius: 28, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.22)" },
        dateBlock(e, 0.72),
        h("div", { flexDirection: "column", marginLeft: 28, flex: 1 },
          h("div", { fontSize: 22, fontWeight: 700, letterSpacing: 4, color: GOLD }, (e.type ?? "").toUpperCase()),
          h("div", { fontSize: 36, fontWeight: 700, marginTop: 4, letterSpacing: -0.5 }, e.title),
          h("div", { fontSize: 25, marginTop: 4, color: "rgba(255,255,255,.78)" }, e.priceLabel === "Gratuit" ? "Gratuit · en ligne" : "En ligne"),
        ),
      )),
    ),
  )),

  // 2. Le rendez-vous mensuel
  frame(2, total, BG.ciel, h("div", { flexDirection: "column", position: "relative" },
    img(BUBBLE, 120, 96, { position: "absolute", top: -30, right: 20, transform: "rotate(6deg)" }),
    h("div", { alignItems: "center" }, chip("GRATUIT", { color: NAVY, fontWeight: 700, letterSpacing: 4, marginBottom: 0 }), h("div", { fontSize: 24, fontWeight: 700, letterSpacing: 6, color: GOLD, marginLeft: 8 }, "CHAQUE MOIS")),
    h("div", { fontSize: 100, fontWeight: 700, letterSpacing: -4, lineHeight: 1, marginTop: 30 }, "Le rendez-vous"),
    serif("mensuel LEQ", { fontSize: 128, lineHeight: 1.08 }),
    h("div", { fontSize: 34, lineHeight: 1.4, marginTop: 22, color: "rgba(255,255,255,.92)", maxWidth: 860 }, "Une heure ouverte, sans thème, pour poser toutes vos questions sur l'art oratoire et vos blocages à l'oral."),
    h("div", { flexWrap: "wrap", marginTop: 30 },
      ...["J'ai une soutenance bientôt…", "Comment gérer le trac ?", "Je bloque en conversation"].map((q, i) => h("div", { padding: "16px 24px", borderRadius: 24, background: "#fff", color: NAVY, fontSize: 27, fontWeight: 600, marginRight: 14, marginBottom: 14, border: `3px solid ${NAVY}`, transform: `rotate(${[-2, 1.5, -1][i]}deg)` }, q)),
    ),
    h("div", { flexDirection: "column", marginTop: 20 },
      infoLine("●", `${sansAnnee(rdv.dateLabel)} · ${horaires(rdv.timeLabel)}`),
      infoLine("●", rdv.location),
    ),
    ctaBox("Inscription gratuite", "Le lien Google Meet vous est envoyé par mail · liebeneloquence.com"),
  )),

  // 3. La masterclass
  frame(3, total, BG.braise, h("div", { flexDirection: "column", position: "relative" },
    img(SPARKLE(GOLD), 80, 80, { position: "absolute", top: -40, right: 30 }),
    h("div", { fontSize: 26, fontWeight: 700, letterSpacing: 8, color: ORANGE }, "MASTERCLASS"),
    h("div", { fontSize: 108, fontWeight: 700, letterSpacing: -4, lineHeight: 1, marginTop: 22 }, "Convaincre"),
    serif("en entretien", { fontSize: 136, lineHeight: 1.08 }),
    h("div", { fontSize: 30, fontWeight: 600, color: GOLD, marginTop: 14 }, ORGANISATEURS),
    h("div", { fontSize: 33, lineHeight: 1.4, marginTop: 20, color: "rgba(255,255,255,.9)", maxWidth: 880 }, "Deux voix, deux expertises : le fond de votre discours et la forme de votre prise de parole."),
    speakerRow(150),
    h("div", { flexDirection: "column", marginTop: 34 },
      infoLine("●", `${sansAnnee(masterclass.dateLabel)} · ${horaires(masterclass.timeLabel)}`),
      infoLine("●", masterclass.location),
    ),
    ctaBox("Réservez votre place", "Places limitées · liebeneloquence.com"),
  )),

  // 4. Le lancement de la LEQ'FAM
  frame(4, total, BG.hero, h("div", { flexDirection: "column", position: "relative" },
    img(SPARKLE(GOLD), 80, 80, { position: "absolute", top: -30, right: 40 }),
    img(HEART(ORANGE), 50, 50, { position: "absolute", top: 560, right: 110 }),
    h("div", { alignSelf: "flex-start", padding: "12px 24px", borderRadius: 999, background: "#fff", color: ORANGE, fontSize: 22, fontWeight: 700, letterSpacing: 4 }, `LANCEMENT · ${leqfam.dateLabel.replace(/\s+\d{4}$/, "").toUpperCase()}`),
    h("div", { fontSize: 96, fontWeight: 700, letterSpacing: -3, marginTop: 30, lineHeight: 1 }, "La communauté"),
    serif("LEQ'FAM", { fontSize: 150, lineHeight: 1.1 }),
    h("div", { flexDirection: "column", marginTop: 26 }, ...leqfam.program.map((p) => check(p))),
    ctaBox("Rejoignez la liste d'attente", "Soyez prévenu·e en premier à l'ouverture · liebeneloquence.com"),
  )),

  // 5. Fin : toutes les dates au même endroit
  frame(5, total, BG.nuit, h("div", { flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative" },
    img(MIC, 110, 141, { position: "absolute", top: 560, right: 40, transform: "rotate(10deg)" }),
    img(SPARKLE(GOLD), 70, 70, { position: "absolute", top: -110, left: 40 }),
    h("div", { fontSize: 100, fontWeight: 700, letterSpacing: -4, lineHeight: 1, marginTop: 40 }, "Toutes nos dates"),
    serif("au même endroit.", { fontSize: 120, lineHeight: 1.1 }),
    h("div", { alignItems: "center", marginTop: 56, padding: "20px 34px", borderRadius: 999, background: "#fff", color: NAVY, fontSize: 36, fontWeight: 700, boxShadow: `6px 6px 0 ${GOLD}` },
      h("div", { width: 16, height: 16, borderRadius: 8, background: "#2fbd6e", marginRight: 14 }), "liebeneloquence.com/evenements"),
    h("div", { fontSize: 34, marginTop: 50, color: "rgba(255,255,255,.88)", maxWidth: 820, lineHeight: 1.4, justifyContent: "center" }, "Enregistrez ce post et partagez-le à celles et ceux qui ont un oral à préparer."),
  ), { swipe: false }),
];

/** Annonce de la masterclass : contenu commun à la publication et à la story. */
const annonce = (story) => {
  const s = story ? 1.12 : 1;
  return h("div", { flexDirection: "column", position: "relative" },
    img(SPARKLE(GOLD), 90 * s, 90 * s, { position: "absolute", top: -50, right: 20 }),
    img(HEART(ORANGE), 46 * s, 46 * s, { position: "absolute", top: 300 * s, right: 70, transform: "rotate(14deg)" }),
    h("div", { alignSelf: "flex-start", padding: "10px 22px", borderRadius: 999, background: ORANGE, color: "#fff", fontSize: 24 * s, fontWeight: 700, letterSpacing: 5, transform: "rotate(-3deg)" }, "NOUVEAU DANS NOS ÉVÉNEMENTS"),
    h("div", { fontSize: 104 * s, fontWeight: 700, letterSpacing: -4, lineHeight: 1, marginTop: 34 }, "Une"),
    serif("masterclass", { fontSize: 150 * s, lineHeight: 1.05 }),
    h("div", { fontSize: 104 * s, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }, "vous attend."),
    img(UNDERLINE, 430, 40, { marginTop: 8, marginLeft: 10 }),
    // billet
    h("div", { marginTop: 50 * s, borderRadius: 30, overflow: "hidden", background: "#fff", color: NAVY, boxShadow: `10px 10px 0 ${GOLD}`, transform: "rotate(-1.5deg)" },
      h("div", { flex: 1, flexDirection: "column", padding: "30px 34px", borderRight: "3px dashed rgba(0,22,54,.2)" },
        h("div", { fontSize: 22 * s, fontWeight: 700, letterSpacing: 5, color: ORANGE }, "MASTERCLASS"),
        h("div", { fontSize: 46 * s, fontWeight: 700, letterSpacing: -1, marginTop: 8 }, masterclass.title),
        h("div", { fontSize: 27 * s, marginTop: 10, color: "rgba(0,22,54,.7)" }, `${sansAnnee(masterclass.dateLabel)} · ${horaires(masterclass.timeLabel).split(" ")[0]} · en ligne`),
        h("div", { fontSize: 27 * s, marginTop: 6, color: ROYAL, fontWeight: 600 }, speakers.length > 1 ? `Avec ${speakers.map((x) => x.name.split(" ")[0]).join(" et ")}` : ""),
        h("div", { fontSize: 24 * s, marginTop: 6, color: "rgba(0,22,54,.6)" }, ORGANISATEURS),
      ),
      h("div", { width: 110 * s, alignItems: "center", justifyContent: "center", background: ROYAL },
        serif("LEQ", { fontSize: 44 * s, color: "#fff", transform: "rotate(-90deg)" })),
    ),
    h("div", { fontSize: 34 * s, lineHeight: 1.4, marginTop: 50 * s, color: "rgba(255,255,255,.92)", maxWidth: 880 }, "Rendez-vous dans nos événements pour découvrir le programme et réserver votre place."),
  );
};

const story = h("div", { width: "100%", height: "100%", flexDirection: "column", padding: "230px 80px 270px", background: BG.braise, color: "#fff", fontFamily: "SF", position: "relative" },
  h("div", { fontSize: 50, fontWeight: 700, letterSpacing: -2 }, "LEQ", h("span", { color: ORANGE }, ".")),
  h("div", { flex: 1, flexDirection: "column", justifyContent: "center" }, annonce(true)),
  h("div", { alignSelf: "center", alignItems: "center", padding: "20px 34px", borderRadius: 999, background: "#fff", color: NAVY, fontSize: 34, fontWeight: 700, boxShadow: `6px 6px 0 ${GOLD}` }, "liebeneloquence.com/evenements"),
);

const rendus = [
  ...carrousel.map((el, i) => [`${String(i + 1).padStart(2, "0")}.png`, el, H]),
  ["masterclass-publication.png", frame(1, 1, BG.braise, annonce(false), { swipe: false }), H],
  ["masterclass-story.png", story, STORY_H],
];

await mkdir(OUT, { recursive: true });
for (const [name, el, height] of rendus) {
  const png = Buffer.from(await new ImageResponse(el, { width: W, height, fonts }).arrayBuffer());
  await writeFile(path.join(OUT, name), png);
  console.log("ok", path.join("communication", "instagram", "actus", name));
}
