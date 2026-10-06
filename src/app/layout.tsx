import type { Metadata } from "next";
import { Inter, Bodoni_Moda } from "next/font/google";
import "./globals.css";

/* SF Pro Display est servie en priorité via la pile système (cf. globals.css).
   Inter prend le relais hors écosystème Apple : même largeur apparente,
   même sobriété. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Didone italique : les mots mis en valeur de la charte
   (« PLAIRE, CONVAINCRE, IMPACTER », « GRAND ORAL », « école »…). */
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bodoni",
  display: "swap",
});

const SITE = "https://lieben-eloquence.fr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Lieben Éloquence — Parlez pour plaire, convaincre, impacter",
    template: "%s · Lieben Éloquence",
  },
  description:
    "Formations et coaching en prise de parole. Lycéens, étudiants, professionnels : diagnostic offert, parcours structuré et suivi personnalisé pour prendre la parole avec impact.",
  keywords: [
    "prise de parole en public",
    "éloquence",
    "Grand Oral",
    "coaching oral",
    "formation prise de parole",
    "art oratoire",
  ],
  authors: [{ name: "Rebecca Lieben Ahiale" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Lieben Éloquence",
    title: "Lieben Éloquence — Formations en prise de parole",
    description:
      "Diagnostic offert, parcours sur mesure et suivi. Devenez l'orateur que vous voulez être.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lieben Éloquence",
    description:
      "Formations et coaching en prise de parole pour tous les profils.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${bodoni.variable}`}>
      <body>{children}</body>
    </html>
  );
}
