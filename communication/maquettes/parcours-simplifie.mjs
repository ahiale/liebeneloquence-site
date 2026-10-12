// Maquette du parcours simplifié pour rejoindre la LEQ'FAM (Discord → site → Discord), 2700 × 1180.
// Utilisation (depuis le dossier du projet) :  node communication/maquettes/parcours-simplifie.mjs communication/maquettes/parcours-simplifie.png
import { writeFile } from "node:fs/promises";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";
import { GOLD, NAVY, ORANGE, ROYAL, SPARKLE, HEART, fonts, h, img, serif } from "../instagram/commun.mjs";

const W = 2700, H = 1180;
const DISCORD = "#5865F2", FOND_DC = "#313338", FOND_DC2 = "#2b2d31", TXT_DC = "#dbdee1", GRIS_DC = "#949ba4";

const etape = (n, titre, sous) => h("div", { flexDirection: "column", marginBottom: 22, height: 96 },
  h("div", { alignItems: "center" },
    h("div", { width: 50, height: 50, flexShrink: 0, borderRadius: 25, background: GOLD, color: NAVY, fontSize: 27, fontWeight: 700, alignItems: "center", justifyContent: "center", marginRight: 14 }, String(n)),
    h("div", { fontSize: 28, fontWeight: 700, color: "#fff" }, titre)),
  h("div", { fontSize: 19, color: "rgba(255,255,255,.7)", marginTop: 8, marginLeft: 64 }, sous));

const ecran = (barre, contenu, { sombre = false } = {}) => h("div", { flexDirection: "column", width: 470, height: 820, borderRadius: 26, overflow: "hidden", background: sombre ? FOND_DC : "#fff", boxShadow: "0 40px 80px -30px rgba(0,0,0,.6)" },
  h("div", { alignItems: "center", height: 44, padding: "0 16px", background: sombre ? "#1e1f22" : "#E8EFFA" },
    ...["#ff5f57", "#febc2e", "#28c840"].map((c) => h("div", { width: 11, height: 11, borderRadius: 6, background: c, marginRight: 7 })),
    h("div", { marginLeft: 12, flex: 1, height: 26, borderRadius: 13, background: sombre ? FOND_DC2 : "#fff", alignItems: "center", padding: "0 12px", fontSize: 15, color: sombre ? "#b5bac1" : "#5b6b85" }, barre)),
  h("div", { flex: 1, flexDirection: "column" }, contenu));

const boutonDc = (txt, couleur = DISCORD) => h("div", { height: 44, padding: "0 18px", borderRadius: 8, background: couleur, alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 600, color: "#fff", marginRight: 8, marginBottom: 8 }, txt);
const salonDc = (nom, actif = false, verrou = false) => h("div", { alignItems: "center", padding: "6px 10px", borderRadius: 6, background: actif ? "#404249" : "transparent", fontSize: 17, color: verrou ? "#5c5f66" : actif ? "#fff" : GRIS_DC, marginBottom: 2 }, `# ${nom}${verrou ? "  🔒" : ""}`);

// 1. Discord : #fonctionnement, le visiteur clique sur « Rejoindre la LEQ'FAM »
const e1 = ecran("discord.com · Serveur Lieben Eloquence", h("div", { height: "100%" },
  h("div", { width: 170, flexDirection: "column", padding: "16px 8px", background: FOND_DC2 },
    h("div", { fontSize: 13, fontWeight: 700, color: GRIS_DC, margin: "0 0 8px 8px" }, "ACCUEIL"),
    salonDc("bienvenue"), salonDc("règlements"), salonDc("fonctionnement", true), salonDc("annonces"),
    h("div", { fontSize: 13, fontWeight: 700, color: GRIS_DC, margin: "18px 0 8px 8px" }, "LEQFAM"),
    salonDc("membres", false, true)),
  h("div", { flex: 1, flexDirection: "column", padding: "18px 16px" },
    h("div", { fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 12 }, "# fonctionnement"),
    h("div", { flexDirection: "column", padding: 14, borderRadius: 8, background: FOND_DC2, borderLeft: `4px solid ${ORANGE}` },
      h("div", { fontSize: 18, fontWeight: 700, color: "#fff" }, "Rejoindre la LEQ'FAM"),
      h("div", { fontSize: 15, lineHeight: 1.5, color: TXT_DC, marginTop: 8 }, "Avec engagement : 3,99 €/mois"),
      h("div", { fontSize: 15, lineHeight: 1.5, color: TXT_DC }, "Sans engagement : 4,99 €/mois"),
      h("div", { fontSize: 15, lineHeight: 1.5, color: GOLD, fontWeight: 700, marginTop: 6 }, "1 € le premier mois"),
      h("div", { width: "100%", height: 110, borderRadius: 6, marginTop: 12, background: "linear-gradient(160deg,#0B3070,#114DA8)", alignItems: "center", padding: "0 16px" },
        h("div", { flexDirection: "column" }, h("div", { fontSize: 22, fontWeight: 700, color: "#fff" }, "Bienvenue dans"), serif("la famille.", { fontSize: 26 })))),
    h("div", { flexWrap: "wrap", marginTop: 14 },
      h("div", { height: 46, padding: "0 18px", borderRadius: 8, background: "#4e5058", alignItems: "center", fontSize: 17, fontWeight: 600, color: "#fff", border: `3px solid ${GOLD}` }, "Rejoindre la LEQ'FAM ↗")),
    h("div", { marginTop: 18, fontSize: 14, color: GRIS_DC }, "Les salons membres sont verrouillés 🔒"),
  )), { sombre: true });

// 2. Site : choix de la formule puis « Continuer avec Discord »
const formule = (titre, prix, choisie, badge) => h("div", { flexDirection: "column", padding: "18px 20px", borderRadius: 18, marginBottom: 14, border: `3px solid ${choisie ? ORANGE : "#dfe6f2"}`, background: choisie ? "#FFF6EF" : "#fff", position: "relative" },
  badge ? h("div", { position: "absolute", top: -14, right: 14, padding: "4px 12px", borderRadius: 999, background: ORANGE, color: "#fff", fontSize: 13, fontWeight: 700 }, badge) : null,
  h("div", { alignItems: "center" },
    h("div", { width: 22, height: 22, borderRadius: 11, border: `3px solid ${choisie ? ORANGE : "#b9c3d3"}`, background: choisie ? ORANGE : "#fff", marginRight: 12 }),
    h("div", { fontSize: 19, fontWeight: 700, color: NAVY }, titre)),
  h("div", { alignItems: "baseline", marginTop: 6, marginLeft: 34 }, h("div", { fontSize: 32, fontWeight: 700, color: NAVY }, prix), h("div", { fontSize: 15, color: "#5b6b85", marginLeft: 6 }, "/ mois après le 1er mois")));
const e2 = ecran("liebeneloquence.com/rejoindre", h("div", { flexDirection: "column", padding: "26px 26px", height: "100%", background: "linear-gradient(180deg,#F6F8FC,#E8EFFA)" },
  h("div", { fontSize: 20, fontWeight: 700, color: NAVY }, "LEQ", h("span", { color: ORANGE }, ".")),
  h("div", { fontSize: 36, fontWeight: 700, color: NAVY, letterSpacing: -1, marginTop: 20 }, "Rejoindre la"),
  serif("LEQ'FAM", { fontSize: 50, color: ROYAL, marginTop: -6 }),
  h("div", { fontSize: 17, color: "#5b6b85", margin: "6px 0 22px" }, "1 € le premier mois, puis :"),
  formule("Avec engagement", "3,99 €", true, "Le plus avantageux"),
  formule("Sans engagement", "4,99 €", false),
  h("div", { marginTop: 10, height: 62, borderRadius: 999, background: DISCORD, alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff", border: `3px solid ${GOLD}` }, "Continuer avec Discord"),
  h("div", { marginTop: 14, fontSize: 14, color: "#5b6b85", justifyContent: "center", textAlign: "center" }, "Un seul clic : Discord vous identifie, puis vous payez."),
));

// 3. Discord : autorisation en un clic
const e3 = ecran("discord.com/oauth2/authorize", h("div", { flexDirection: "column", alignItems: "center", padding: "50px 30px", height: "100%", background: "#1e1f22" },
  h("div", { alignItems: "center" },
    h("div", { width: 76, height: 76, borderRadius: 38, background: NAVY, border: `3px solid ${GOLD}`, alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff" }, "LEQ."),
    h("div", { fontSize: 26, color: GRIS_DC, margin: "0 18px" }, "···"),
    h("div", { width: 76, height: 76, borderRadius: 38, background: "#3ba55c", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700, color: "#fff" }, "M")),
  h("div", { fontSize: 15, color: GRIS_DC, marginTop: 24 }, "UNE APPLICATION EXTERNE"),
  h("div", { fontSize: 26, fontWeight: 700, color: "#fff", marginTop: 6 }, "LEQ"),
  h("div", { fontSize: 18, color: TXT_DC, marginTop: 4 }, "veut accéder à ton compte"),
  h("div", { flexDirection: "column", width: "100%", marginTop: 28, padding: "18px 20px", borderRadius: 10, background: FOND_DC2 },
    h("div", { fontSize: 14, fontWeight: 700, color: GRIS_DC, marginBottom: 12 }, "CECI PERMETTRA À LEQ DE :"),
    ...["Accéder à ton nom d'utilisateur et ton avatar", "Te faire rejoindre le serveur Lieben Eloquence"].map((t) => h("div", { alignItems: "center", fontSize: 16, color: TXT_DC, marginBottom: 10 }, h("div", { width: 22, height: 22, borderRadius: 11, background: "#3ba55c", color: "#fff", fontSize: 14, alignItems: "center", justifyContent: "center", marginRight: 10 }, "✓"), t))),
  h("div", { width: "100%", marginTop: "auto", justifyContent: "space-between" },
    h("div", { height: 48, padding: "0 26px", alignItems: "center", fontSize: 17, color: TXT_DC }, "Annuler"),
    h("div", { height: 48, padding: "0 34px", borderRadius: 8, background: DISCORD, alignItems: "center", fontSize: 18, fontWeight: 700, color: "#fff", border: `3px solid ${GOLD}` }, "Autoriser")),
), { sombre: true });

// 4. Stripe : paiement de 1 € avec code ambassadeur
const ligne = (a, b, gras = false, couleur = NAVY) => h("div", { justifyContent: "space-between", fontSize: 17, marginBottom: 10, color: couleur, fontWeight: gras ? 700 : 400 }, h("div", {}, a), h("div", {}, b));
const e4 = ecran("checkout.stripe.com", h("div", { flexDirection: "column", padding: "26px 28px", height: "100%" },
  h("div", { fontSize: 16, color: "#5b6b85" }, "Lieben Éloquence"),
  h("div", { fontSize: 23, fontWeight: 700, color: NAVY, marginTop: 4 }, "LEQ'FAM · avec engagement"),
  h("div", { fontSize: 44, fontWeight: 700, color: NAVY, marginTop: 8 }, "1,00 €"),
  h("div", { fontSize: 16, color: "#5b6b85", marginBottom: 20 }, "aujourd'hui, puis 3,99 € par mois"),
  ligne("Premier mois (offre de lancement)", "1,00 €"),
  h("div", { alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 8, background: "#ecfdf3", marginBottom: 10 },
    h("div", { fontSize: 16, fontWeight: 700, color: "#067647" }, "Code SAM-LEQ appliqué"), h("div", { fontSize: 14, color: "#067647" }, "ambassadeur")),
  ligne("Total aujourd'hui", "1,00 €", true),
  h("div", { height: 1, background: "#e3e8ef", margin: "8px 0 18px" }),
  h("div", { fontSize: 14, color: "#5b6b85", marginBottom: 6 }, "E-mail"),
  h("div", { height: 44, borderRadius: 8, border: "1.5px solid #d5dbe5", alignItems: "center", padding: "0 12px", fontSize: 16, color: "#9aa5b8", marginBottom: 12 }, "marie@email.com"),
  h("div", { fontSize: 14, color: "#5b6b85", marginBottom: 6 }, "Carte bancaire"),
  h("div", { height: 44, borderRadius: 8, border: "1.5px solid #d5dbe5", alignItems: "center", padding: "0 12px", fontSize: 16, color: "#9aa5b8" }, "1234 1234 1234 1234"),
  h("div", { marginTop: "auto", height: 54, borderRadius: 8, background: "#0570de", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 700, color: "#fff", border: `3px solid ${GOLD}` }, "S'abonner"),
));

// 5. Retour automatique dans Discord : rôle donné, salons ouverts
const e5 = ecran("discord.com · Serveur Lieben Eloquence", h("div", { height: "100%" },
  h("div", { width: 190, flexDirection: "column", padding: "16px 8px", background: FOND_DC2 },
    h("div", { fontSize: 13, fontWeight: 700, color: GRIS_DC, margin: "0 0 8px 8px" }, "ACCUEIL"),
    salonDc("fonctionnement"), salonDc("annonces"),
    h("div", { fontSize: 13, fontWeight: 700, color: GOLD, margin: "16px 0 8px 8px" }, "LEQFAM · OUVERT"),
    salonDc("présente-toi", true), salonDc("discussion-générale"), salonDc("entraide"), salonDc("témoignages"), salonDc("ressources-et-opport…"), salonDc("grand-prix-leq"),
    h("div", { fontSize: 13, fontWeight: 700, color: GRIS_DC, margin: "16px 0 8px 8px" }, "LIVES"),
    h("div", { padding: "6px 10px", fontSize: 16, color: GRIS_DC }, "🔊 Live conseils")),
  h("div", { flex: 1, flexDirection: "column", padding: "18px 14px" },
    h("div", { fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 14 }, "# présente-toi"),
    h("div", { flexDirection: "column", padding: 14, borderRadius: 8, background: FOND_DC2, borderLeft: `4px solid ${GOLD}` },
      h("div", { alignItems: "center", marginBottom: 6 }, h("div", { fontSize: 16, fontWeight: 700, color: GOLD }, "LEQ"), h("div", { marginLeft: 6, padding: "1px 5px", borderRadius: 4, background: DISCORD, fontSize: 11, color: "#fff", fontWeight: 700 }, "APP")),
      h("div", { fontSize: 15, lineHeight: 1.5, color: TXT_DC }, "Bienvenue Marie ! Ton accès membre est activé. Présente-toi avec le modèle épinglé.")),
    h("div", { marginTop: 18, alignItems: "center", padding: "10px 12px", borderRadius: 8, background: "#1e3a2a" },
      h("div", { width: 30, height: 30, borderRadius: 15, background: "#3ba55c", marginRight: 10, alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }, "M"),
      h("div", { flexDirection: "column" }, h("div", { fontSize: 16, fontWeight: 700, color: "#7ee2a8" }, "Marie"), h("div", { fontSize: 13, color: TXT_DC }, "rôle LeqOra"))),
  )), { sombre: true });

const fleche = h("div", { width: 50, alignItems: "center", justifyContent: "center", fontSize: 46, color: GOLD, fontWeight: 700, marginTop: 470 }, "→");
const colonne = (n, titre, sous, e) => h("div", { flexDirection: "column" }, etape(n, titre, sous), e);

const page = h("div", { width: "100%", height: "100%", flexDirection: "column", padding: "50px 56px", background: "linear-gradient(165deg,#000d21 0%,#001636 50%,#0B3070 100%)", fontFamily: "SF", color: "#fff", position: "relative" },
  img(SPARKLE(GOLD), 60, 60, { position: "absolute", top: 40, right: 60 }),
  img(HEART(ORANGE), 34, 34, { position: "absolute", top: 104, right: 140 }),
  h("div", { alignItems: "baseline", marginBottom: 30 },
    h("div", { fontSize: 52, fontWeight: 700, letterSpacing: -2 }, "Rejoindre la LEQ'FAM :"),
    serif("un clic, un paiement, c'est parti.", { fontSize: 60, marginLeft: 18 })),
  h("div", { alignItems: "flex-start" },
    colonne(1, "Le visiteur clique", "dans #fonctionnement, sur Instagram ou sur le site", e1), fleche,
    colonne(2, "Il choisit sa formule", "puis « Continuer avec Discord »", e2), fleche,
    colonne(3, "Il autorise LEQ", "un seul clic, une seule fois", e3), fleche,
    colonne(4, "Il paie 1 €", "avec un code ambassadeur s'il en a un", e4), fleche,
    colonne(5, "Il est membre", "retour direct dans Discord, salons ouverts", e5)),
  h("div", { position: "absolute", bottom: 26, left: 56, fontSize: 18, color: "rgba(255,255,255,.55)" }, "Maquette · le cadre doré indique où la personne clique · les noms et le code sont des exemples"),
);

await writeFile(process.argv[2], Buffer.from(await new ImageResponse(page, { width: W, height: H, fonts }).arrayBuffer()));
console.log("ok", process.argv[2]);
