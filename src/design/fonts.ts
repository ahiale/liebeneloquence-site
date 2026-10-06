import localFont from "next/font/local";

/* Polices de la charte, servies depuis le site (aucun appel à Google).
   Pour changer de police, il suffit de modifier ce fichier. */

export const sfPro = localFont({
  src: [
    { path: "./fonts/sf-pro-display-400.otf", weight: "400", style: "normal" },
    { path: "./fonts/sf-pro-display-500.otf", weight: "500", style: "normal" },
    { path: "./fonts/sf-pro-display-600.otf", weight: "600", style: "normal" },
    { path: "./fonts/sf-pro-display-700.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-sf",
  display: "swap",
});

/* « Relationship of Mélodrame » : italiques d'accent. */
export const melodrame = localFont({
  src: "./fonts/melodrame.ttf",
  variable: "--font-melodrame",
  display: "swap",
});
