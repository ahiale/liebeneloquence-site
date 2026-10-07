// Génère le carrousel Instagram « Le site est en ligne » (7 visuels 1080 x 1350, format portrait).
// Utilisation (depuis le dossier du projet) :  node communication/instagram/generer-carrousel.mjs
// Résultat : communication/instagram/lancement/01.png … 07.png

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";
import {
  ARROW, BG, BUBBLE, CREAM, GOLD, H, HEART, MIC, NAVY, ORANGE, ROOT, ROYAL, SPARKLE, UNDERLINE, W, check, chip, fonts, frame, h, img, photo, pricing, quizIcon, serif, svg,
} from "./commun.mjs";

const OUT = path.join(process.cwd(), "communication", "instagram", "lancement");

const total = 7;
const { packs, grandOral, leqfam } = pricing;
const euro = (v) => `${String(v).replace(".", ",")} €`;

const slides = [
  // 1. Le site est en ligne (version festive)
  frame(1, total, BG.hero, h("div", { flexDirection: "column", position: "relative" },
    // confettis et petits dessins
    img(SPARKLE(GOLD), 96, 96, { position: "absolute", top: -50, right: 10 }),
    img(SPARKLE("#fff"), 52, 52, { position: "absolute", top: 120, right: 170 }),
    img(MIC, 100, 128, { position: "absolute", top: 250, right: 30, transform: "rotate(10deg)" }),
    img(HEART(ORANGE), 58, 58, { position: "absolute", top: 470, left: -14, transform: "rotate(-14deg)" }),
    img(HEART(GOLD), 40, 40, { position: "absolute", bottom: 40, right: 20, transform: "rotate(12deg)" }),
    ...[[30, 760, GOLD, 18], [120, 900, ORANGE, 12], [-40, 640, "#fff", 10], [60, 300, "#fff", 14], [200, 40, ORANGE, 14], [350, 820, GOLD, 12]].map(([top, left, c, r]) =>
      h("div", { position: "absolute", top, left, width: r, height: r, borderRadius: r, background: c })),
    ...[[90, 520, GOLD, 30, 8, -25], [260, 880, ORANGE, 34, 8, 30], [430, 860, "#fff", 26, 7, -40]].map(([top, left, c, w, hh, rot]) =>
      h("div", { position: "absolute", top, left, width: w, height: hh, borderRadius: 4, background: c, transform: `rotate(${rot}deg)` })),

    h("div", { alignSelf: "flex-start", padding: "10px 22px", borderRadius: 999, background: ORANGE, color: "#fff", fontSize: 24, fontWeight: 700, letterSpacing: 6, transform: "rotate(-3deg)" }, "C'EST OFFICIEL"),
    h("div", { fontSize: 112, fontWeight: 700, letterSpacing: -4, lineHeight: 1, marginTop: 26 }, "Le site est"),
    serif("en ligne !", { fontSize: 156, lineHeight: 1.05 }),
    img(UNDERLINE, 430, 40, { marginTop: -6, marginLeft: 10 }),

    h("div", { alignItems: "flex-end", marginTop: 34, position: "relative" },
      h("div", { width: 340, height: 410, borderRadius: "190px 190px 34px 34px", overflow: "hidden", border: "6px solid #fff", background: GOLD, boxShadow: "0 30px 60px -20px rgba(0,22,54,.6)", transform: "rotate(-2deg)" },
        img(photo, 340, 460, { objectFit: "cover", objectPosition: "50% 20%" })),
      // bulle « Prends la parole ! » comme sur le site
      h("div", { position: "absolute", top: -10, left: 230, padding: "14px 22px", borderRadius: 22, background: "#fff", color: NAVY, fontSize: 28, fontWeight: 700, border: `3px solid ${NAVY}`, boxShadow: `6px 6px 0 ${ORANGE}`, transform: "rotate(4deg)" }, "Prends la parole !"),
      h("div", { flexDirection: "column", marginLeft: 46, flex: 1 },
        h("div", { fontSize: 32, lineHeight: 1.4, color: "rgba(255,255,255,.92)" }, "Formations, Grand Oral, quiz d'orateur, communauté : tout Lieben Éloquence au même endroit."),
        // adresse façon barre de navigateur, avec flèche gribouillée
        h("div", { alignItems: "center", marginTop: 26 },
          h("div", { alignItems: "center", padding: "14px 22px", borderRadius: 999, background: "#fff", color: NAVY, fontSize: 28, fontWeight: 700, boxShadow: `5px 5px 0 ${GOLD}` },
            h("div", { width: 14, height: 14, borderRadius: 7, background: "#2fbd6e", marginRight: 12 }), "liebeneloquence.com"),
        ),
      ),
    ),
  )),

  // 2. Ce que vous y trouverez
  frame(2, total, BG.nuit, h("div", { flexDirection: "column" },
    h("div", { fontSize: 80, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }, "Parlez pour"),
    serif("plaire, convaincre, impacter.", { fontSize: 84, lineHeight: 1.1, marginBottom: 44 }),
    ...[
      ["Des formations", "3 packs pour progresser à votre rythme"],
      ["L'offre Grand Oral", "Bac, BTS, soutenance, pitch"],
      ["Le quiz d'orateur", "Découvrez votre profil en 2 minutes"],
      ["Les interventions", "Écoles, universités, structures culturelles"],
      ["La communauté LEQ'FAM", "S'entraîner à l'oral, ensemble"],
    ].map(([t, s], i) => h("div", { alignItems: "center", marginBottom: 22, padding: "22px 28px", borderRadius: 26, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)" },
      h("div", { width: 56, height: 56, borderRadius: 28, background: GOLD, color: NAVY, fontSize: 28, fontWeight: 700, alignItems: "center", justifyContent: "center", marginRight: 24 }, String(i + 1)),
      h("div", { flexDirection: "column" }, h("div", { fontSize: 34, fontWeight: 700 }, t), h("div", { fontSize: 26, color: "rgba(255,255,255,.75)", marginTop: 4 }, s)),
    )),
  )),

  // 3. Les formations
  frame(3, total, BG.clair, h("div", { flexDirection: "column" },
    h("div", { fontSize: 26, fontWeight: 600, letterSpacing: 8, color: ORANGE }, "LES FORMATIONS"),
    h("div", { fontSize: 84, fontWeight: 700, letterSpacing: -3, marginTop: 16, alignItems: "baseline" }, "Choisissez votre", serif("pack.", { color: ROYAL, fontSize: 96, marginLeft: 18 })),
    h("div", { flexDirection: "column", marginTop: 40 },
      ...packs.map((p) => h("div", { alignItems: "center", justifyContent: "space-between", marginBottom: 20, padding: "28px 34px", borderRadius: 28, background: p.featured ? "linear-gradient(165deg,#04193c,#0e3f8b)" : "#fff", color: p.featured ? "#fff" : NAVY, boxShadow: "0 24px 50px -30px rgba(0,22,54,.6)" },
        h("div", { flexDirection: "column" }, h("div", { fontSize: 44, fontWeight: 700, letterSpacing: -1 }, p.name), h("div", { fontSize: 26, marginTop: 4, color: p.featured ? "rgba(255,255,255,.7)" : "rgba(0,22,54,.6)" }, `${p.sessions} séances · ${p.level}`)),
        h("div", { fontSize: 64, fontWeight: 700, letterSpacing: -2, color: p.featured ? GOLD : NAVY }, euro(p.price)),
      )),
    ),
    h("div", { marginTop: 20, fontSize: 30, fontWeight: 600, color: ROYAL }, "Séance diagnostic de 30 minutes offerte"),
  ), { dark: false }),

  // 4. Grand Oral
  frame(4, total, BG.braise, h("div", { flexDirection: "column" },
    img(SPARKLE(GOLD), 70, 70, { position: "absolute", top: 120, right: 90 }),
    h("div", { fontSize: 26, fontWeight: 600, letterSpacing: 8, color: ORANGE }, "OFFRE EXCLUSIVE LEQ"),
    h("div", { fontSize: 100, fontWeight: 700, letterSpacing: -4, marginTop: 16, lineHeight: 1 }, "L'offre"),
    serif("GRAND ORAL", { fontSize: 140, color: GOLD, lineHeight: 1.1 }),
    h("div", { alignItems: "baseline", marginTop: 30 },
      h("div", { fontSize: 120, fontWeight: 700, letterSpacing: -5, color: ORANGE }, euro(grandOral.price)),
      h("div", { fontSize: 32, marginLeft: 20, color: "rgba(255,255,255,.8)" }, `${grandOral.sessions} séances intensives`),
    ),
    h("div", { flexWrap: "wrap", marginTop: 30 }, ...["Grand Oral BAC", "Oral de BTS", "Soutenance", "Pitch", "Concours d'éloquence"].map((t) => chip(t))),
    h("div", { marginTop: 20, fontSize: 30, color: "rgba(255,255,255,.8)" }, `${grandOral.sessionDuration} par séance · Paiement en ${grandOral.installments} fois possible`),
  )),

  // 5. Quiz
  frame(5, total, BG.ciel, h("div", { flexDirection: "column", alignItems: "center", textAlign: "center" },
    h("div", { fontSize: 26, fontWeight: 600, letterSpacing: 8, color: GOLD }, "QUIZ D'ORATEUR"),
    h("div", { fontSize: 96, fontWeight: 700, letterSpacing: -3, marginTop: 20, lineHeight: 1 }, "Quel type"),
    serif("d'orateur", { fontSize: 130, lineHeight: 1.1 }),
    h("div", { fontSize: 96, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }, "êtes-vous ?"),
    h("div", { marginTop: 50, justifyContent: "center" },
      ...await Promise.all(["book", "bulb", "mic", "users", "zap"].map(async (n) => img(await quizIcon(n), 130, 130, { margin: "0 10px" })))),
    h("div", { marginTop: 50, fontSize: 36, lineHeight: 1.4, color: "rgba(255,255,255,.92)", maxWidth: 820, justifyContent: "center" }, "6 questions, 2 minutes. Recevez votre fiche orateur : vos forces et vos exercices."),
  )),

  // 6. Interventions et services
  frame(6, total, BG.clair, h("div", { flexDirection: "column" },
    img(BUBBLE, 110, 88, { position: "absolute", top: 110, right: 90 }),
    h("div", { fontSize: 26, fontWeight: 600, letterSpacing: 8, color: ORANGE }, "SUR MESURE"),
    h("div", { fontSize: 84, fontWeight: 700, letterSpacing: -3, marginTop: 16, lineHeight: 1.05 }, "Autres"),
    serif("services", { fontSize: 100, color: ROYAL, lineHeight: 1.1, marginBottom: 36 }),
    ...[
      ["Interventions en école", "Ateliers ludiques pour les établissements et les structures culturelles"],
      ["Discours sur mesure", "Mariage, hommage, soutenance, prise de poste"],
      ["Animation d'événements", "Maîtrise de cérémonie et modération"],
      ["Coaching concours d'éloquence", "Par une oratrice qui concourt et qui juge"],
    ].map(([t, s]) => h("div", { flexDirection: "column", marginBottom: 20, padding: "24px 30px", borderRadius: 28, background: "#fff", border: `3px solid ${NAVY}`, color: NAVY },
      h("div", { fontSize: 36, fontWeight: 700 }, t), h("div", { fontSize: 26, marginTop: 6, color: "rgba(0,22,54,.68)" }, s))),
  ), { dark: false }),

  // 7. Communauté + appel à l'action
  frame(7, total, BG.hero, h("div", { flexDirection: "column" },
    img(SPARKLE(GOLD), 80, 80, { position: "absolute", top: 100, right: 80 }),
    img(HEART(ORANGE), 50, 50, { position: "absolute", top: 600, right: 120 }),
    h("div", { alignSelf: "flex-start", padding: "12px 24px", borderRadius: 999, background: "#fff", color: ORANGE, fontSize: 22, fontWeight: 700, letterSpacing: 4 }, (leqfam.availability || "BIENTÔT").toUpperCase()),
    h("div", { fontSize: 96, fontWeight: 700, letterSpacing: -3, marginTop: 30, lineHeight: 1 }, "La communauté"),
    serif("LEQ'FAM", { fontSize: 150, lineHeight: 1.1 }),
    h("div", { flexDirection: "column", marginTop: 26 },
      check("Des lives collectifs chaque semaine"), check("Des entraînements et des défis"), check("Une vraie entraide entre membres"), check("Le Grand Prix LEQ chaque trimestre")),
    h("div", { marginTop: 30, padding: "30px 36px", borderRadius: 30, background: "#fff", color: NAVY, flexDirection: "column", boxShadow: "8px 8px 0 #FFBD59" },
      h("div", { fontSize: 38, fontWeight: 700 }, `${euro(leqfam.monthlyPrice)} / mois`),
      h("div", { fontSize: 28, marginTop: 8, color: "rgba(0,22,54,.75)" }, "Inscrivez-vous sur la liste d'attente sur liebeneloquence.com"),
    ),
  ), { swipe: false }),
];

await mkdir(OUT, { recursive: true });
for (let i = 0; i < slides.length; i++) {
  const png = Buffer.from(await new ImageResponse(slides[i], { width: W, height: H, fonts }).arrayBuffer());
  const file = path.join(OUT, `${String(i + 1).padStart(2, "0")}.png`);
  await writeFile(file, png);
  console.log("ok", path.relative(ROOT, file));
}
