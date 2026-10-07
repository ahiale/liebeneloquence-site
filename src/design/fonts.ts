import localFont from "next/font/local";

/* Polices de la charte, servies depuis le site (aucun appel à Google), en WOFF2 allégé.
   Les .otf/.ttf d'origine restent dans fonts/ : ils servent à l'infographie des mails.
   Pour changer de police, il suffit de modifier ce fichier. */

export const sfPro = localFont({
  src: [
    { path: "./fonts/sf-pro-display-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/sf-pro-display-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/sf-pro-display-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/sf-pro-display-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sf",
  display: "swap",
});

/* « Relationship of Mélodrame » : italiques d'accent. */
export const melodrame = localFont({
  src: "./fonts/melodrame.woff2",
  variable: "--font-melodrame",
  display: "swap",
});
