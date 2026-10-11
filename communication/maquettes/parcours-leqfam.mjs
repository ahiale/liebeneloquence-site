// Maquette du parcours d'adhésion LEQ'FAM (site → Stripe → Discord), 2400 × 1130.
// Utilisation (depuis le dossier du projet) :  node communication/maquettes/parcours-leqfam.mjs communication/maquettes/parcours-leqfam.png
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
const ROOT = process.cwd();
const { ImageResponse } = await import(pathToFileURL(path.join(ROOT, "node_modules/next/dist/compiled/@vercel/og/index.node.js")).href);
const { GOLD, NAVY, ORANGE, ROYAL, SPARKLE, HEART, fonts, h, img, serif } = await import(pathToFileURL(path.join(ROOT, "communication/instagram/commun.mjs")).href);

const W = 2400, H = 1130;
const DISCORD = "#5865F2";

const step = (n, title) => h("div", { alignItems: "center", marginBottom: 22 },
  h("div", { width: 52, height: 52, borderRadius: 26, background: GOLD, color: NAVY, fontSize: 28, fontWeight: 700, alignItems: "center", justifyContent: "center", marginRight: 16 }, String(n)),
  h("div", { fontSize: 30, fontWeight: 700, color: "#fff" }, title));

const browser = (url, body, { dark = false } = {}) => h("div", { flexDirection: "column", width: 540, height: 860, borderRadius: 26, overflow: "hidden", background: dark ? "#313338" : "#fff", boxShadow: "0 40px 80px -30px rgba(0,0,0,.6)" },
  h("div", { alignItems: "center", height: 46, padding: "0 18px", background: dark ? "#1e1f22" : "#E8EFFA" },
    ...["#ff5f57", "#febc2e", "#28c840"].map((c) => h("div", { width: 12, height: 12, borderRadius: 6, background: c, marginRight: 8 })),
    h("div", { marginLeft: 14, flex: 1, height: 28, borderRadius: 14, background: dark ? "#2b2d31" : "#fff", alignItems: "center", padding: "0 14px", fontSize: 16, color: dark ? "#b5bac1" : "#5b6b85" }, url)),
  h("div", { flex: 1, flexDirection: "column" }, body));

// 1. Le site : choix de la formule
const formule = (titre, prix, sous, { mise = false, badge } = {}) => h("div", { flexDirection: "column", padding: "22px 24px", borderRadius: 22, marginBottom: 18, background: mise ? "linear-gradient(165deg,#04193c,#0e3f8b)" : "#fff", color: mise ? "#fff" : NAVY, border: mise ? "none" : "2px solid #dfe6f2", position: "relative" },
  badge ? h("div", { position: "absolute", top: -16, right: 18, padding: "6px 14px", borderRadius: 999, background: ORANGE, color: "#fff", fontSize: 15, fontWeight: 700 }, badge) : null,
  h("div", { fontSize: 22, fontWeight: 700 }, titre),
  h("div", { alignItems: "baseline", marginTop: 6 }, h("div", { fontSize: 44, fontWeight: 700, color: mise ? GOLD : NAVY, letterSpacing: -1 }, prix), h("div", { fontSize: 18, marginLeft: 8, opacity: 0.75 }, sous)),
);
const site = browser("liebeneloquence.com/communaute", h("div", { flexDirection: "column", padding: "30px 30px", background: "linear-gradient(180deg,#F6F8FC,#E8EFFA)", height: "100%" },
  h("div", { fontSize: 22, fontWeight: 700, color: NAVY }, "LEQ", h("span", { color: ORANGE }, ".")),
  h("div", { fontSize: 15, fontWeight: 700, letterSpacing: 4, color: "#CC4A00", marginTop: 26 }, "LA COMMUNAUTÉ"),
  h("div", { fontSize: 44, fontWeight: 700, color: NAVY, letterSpacing: -1.5, marginTop: 6 }, "Rejoindre la"),
  serif("LEQ'FAM", { fontSize: 60, color: ROYAL, marginTop: -6, marginBottom: 26 }),
  formule("Mensuel · sans engagement", "3,99 €", "/ mois", { mise: true, badge: "Lancement : 1 € le 1er mois" }),
  formule("Annuel · avec engagement", "XX €", "/ an (prix à définir)"),
  h("div", { marginTop: 10, height: 64, borderRadius: 999, background: "linear-gradient(96deg,#FFBD59,#FF5E01)", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: NAVY }, "Je rejoins la LEQ'FAM"),
  h("div", { marginTop: 16, fontSize: 16, color: "#5b6b85", justifyContent: "center" }, "Paiement sécurisé par Stripe · résiliable à tout moment"),
));

// 2. Stripe : paiement avec code promo
const ligne = (a, b, { gras = false, couleur = NAVY } = {}) => h("div", { justifyContent: "space-between", fontSize: 19, marginBottom: 12, color: couleur, fontWeight: gras ? 700 : 400 }, h("div", {}, a), h("div", {}, b));
const champ = (label, val) => h("div", { flexDirection: "column", marginBottom: 14 }, h("div", { fontSize: 15, color: "#5b6b85", marginBottom: 6 }, label), h("div", { height: 46, borderRadius: 10, border: "1.5px solid #d5dbe5", alignItems: "center", padding: "0 14px", fontSize: 18, color: "#9aa5b8" }, val));
const stripe = browser("checkout.stripe.com", h("div", { flexDirection: "column", padding: "30px 32px", height: "100%" },
  h("div", { fontSize: 17, color: "#5b6b85" }, "Lieben Éloquence"),
  h("div", { fontSize: 26, fontWeight: 700, color: NAVY, marginTop: 6 }, "Abonnement LEQ'FAM"),
  h("div", { fontSize: 46, fontWeight: 700, color: NAVY, marginTop: 10, letterSpacing: -1 }, "1,00 €"),
  h("div", { fontSize: 18, color: "#5b6b85", marginBottom: 24 }, "le 1er mois, puis 3,99 € par mois"),
  ligne("LEQ'FAM · mensuel", "3,99 €"),
  h("div", { alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: "#ecfdf3", marginBottom: 12 },
    h("div", { fontSize: 18, fontWeight: 700, color: "#067647" }, "Code LANCEMENT appliqué"), h("div", { fontSize: 18, color: "#067647" }, "− 2,99 €")),
  ligne("Total aujourd'hui", "1,00 €", { gras: true }),
  h("div", { height: 1, background: "#e3e8ef", margin: "10px 0 20px" }),
  champ("E-mail", "marie@email.com"),
  champ("Carte bancaire", "1234 1234 1234 1234"),
  h("div", { marginTop: 8, height: 56, borderRadius: 10, background: "#0570de", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff" }, "S'abonner"),
));

// 3. Le site : connecter Discord
const bienvenue = browser("liebeneloquence.com/communaute/bienvenue", h("div", { flexDirection: "column", alignItems: "center", textAlign: "center", padding: "60px 34px", height: "100%", background: "linear-gradient(160deg,#0B3070,#114DA8 55%,#2A64C4)", color: "#fff", position: "relative" },
  img(SPARKLE(GOLD), 60, 60, { position: "absolute", top: 40, right: 40 }),
  img(HEART(ORANGE), 40, 40, { position: "absolute", top: 230, left: 40 }),
  h("div", { width: 110, height: 110, borderRadius: 55, background: "rgba(255,255,255,.15)", border: `4px solid ${GOLD}`, alignItems: "center", justifyContent: "center", fontSize: 60, color: GOLD, fontWeight: 700 }, "✓"),
  h("div", { fontSize: 44, fontWeight: 700, letterSpacing: -1.5, marginTop: 30 }, "Bienvenue"),
  serif("dans la LEQ'FAM !", { fontSize: 54 }),
  h("div", { fontSize: 21, lineHeight: 1.5, marginTop: 20, color: "rgba(255,255,255,.88)", maxWidth: 440, justifyContent: "center" }, "Paiement confirmé. Dernière étape : connectez votre compte Discord pour recevoir votre accès."),
  h("div", { marginTop: 38, height: 70, padding: "0 40px", borderRadius: 999, background: DISCORD, alignItems: "center", fontSize: 23, fontWeight: 700, color: "#fff", boxShadow: "0 16px 30px -12px rgba(0,0,0,.5)" }, "Connecter mon Discord"),
  h("div", { marginTop: 22, fontSize: 17, color: "rgba(255,255,255,.7)" }, "Un clic : vous êtes ajouté·e au serveur avec votre rôle."),
));

// 4. Discord : le membre arrive avec son rôle
const membre = (nom, couleur, role) => h("div", { alignItems: "center", marginBottom: 14 },
  h("div", { width: 38, height: 38, flexShrink: 0, borderRadius: 19, background: couleur, marginRight: 12, alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 17, fontWeight: 700 }, nom[0]),
  h("div", { flexDirection: "column" }, h("div", { fontSize: 18, fontWeight: 600, color: couleur === "#3ba55c" ? "#3ba55c" : "#f2f3f5" }, nom), h("div", { fontSize: 14, color: "#949ba4" }, role)));
const discord = browser("discord.com/channels/leqfam", h("div", { height: "100%" },
  h("div", { width: 330, flexDirection: "column", padding: "22px 20px", background: "#313338" },
    h("div", { fontSize: 17, fontWeight: 700, color: "#949ba4", letterSpacing: 1, marginBottom: 14 }, "# bienvenue"),
    h("div", { flexDirection: "column", padding: 16, borderRadius: 12, background: "#2b2d31", borderLeft: `5px solid ${GOLD}` },
      h("div", { alignItems: "center", marginBottom: 8 }, h("div", { fontSize: 17, fontWeight: 700, color: GOLD }, "LEQ Bot"), h("div", { marginLeft: 8, padding: "2px 6px", borderRadius: 4, background: DISCORD, fontSize: 12, color: "#fff", fontWeight: 700 }, "APP")),
      h("div", { fontSize: 17, lineHeight: 1.5, color: "#dbdee1" }, "Bienvenue Marie ! Ton accès Membre LEQ'FAM est activé. Présente-toi dans #presentations.")),
    h("div", { flexDirection: "column", marginTop: 26, padding: 16, borderRadius: 12, background: "#2b2d31" },
      h("div", { fontSize: 15, fontWeight: 700, color: "#949ba4", marginBottom: 10 }, "AUTOMATIQUE"),
      h("div", { fontSize: 16, lineHeight: 1.5, color: "#dbdee1" }, "Abonnement arrêté ou paiement refusé : le rôle est retiré tout seul."))),
  h("div", { flex: 1, flexDirection: "column", padding: "22px 18px", background: "#2b2d31" },
    h("div", { fontSize: 14, fontWeight: 700, color: "#949ba4", marginBottom: 12 }, "AMBASSADEURS · 2"),
    membre("Sam", "#e67e22", "rôle donné par vous"),
    membre("Lina", "#e67e22", "rôle donné par vous"),
    h("div", { fontSize: 14, fontWeight: 700, color: "#949ba4", margin: "10px 0 12px" }, "MEMBRES LEQ'FAM · 128"),
    membre("Marie", "#3ba55c", "nouvelle · payé"),
    membre("Yann", "#5865F2", "pack Socrate · offert"),
    membre("Ade", "#5865F2", "partenaire · gratuit"),
    membre("Tom", "#5865F2", "membre · payé"),
  ),
), { dark: true });

const fleche = h("div", { width: 60, alignItems: "center", justifyContent: "center", fontSize: 50, color: GOLD, fontWeight: 700 }, "→");

const page = h("div", { width: "100%", height: "100%", flexDirection: "column", padding: "56px 60px", background: "linear-gradient(165deg,#000d21 0%,#001636 50%,#0B3070 100%)", fontFamily: "SF", color: "#fff" },
  h("div", { alignItems: "baseline", marginBottom: 34 },
    h("div", { fontSize: 54, fontWeight: 700, letterSpacing: -2 }, "Rejoindre la LEQ'FAM :"),
    serif("le parcours d'un membre", { fontSize: 64, marginLeft: 18 }),
    h("div", { marginLeft: "auto", fontSize: 22, color: "rgba(255,255,255,.6)" }, "Maquette · prix et textes à valider")),
  h("div", { alignItems: "flex-start" },
    h("div", { flexDirection: "column" }, step(1, "Choisir sa formule"), site), fleche,
    h("div", { flexDirection: "column" }, step(2, "Payer (code promo)"), stripe), fleche,
    h("div", { flexDirection: "column" }, step(3, "Connecter Discord"), bienvenue), fleche,
    h("div", { flexDirection: "column" }, step(4, "Rôle donné tout seul"), discord)),
);

const out = process.argv[2];
await writeFile(out, Buffer.from(await new ImageResponse(page, { width: W, height: H, fonts }).arrayBuffer()));
console.log("ok", out);
