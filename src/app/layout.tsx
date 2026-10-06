import type { Metadata, Viewport } from "next";
import { melodrame, sfPro } from "@/design/fonts";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Lieben Éloquence · Parlez pour plaire, convaincre, impacter",
    template: "%s · Lieben Éloquence",
  },
  description:
    "Formations et coaching en prise de parole pour lycéens, étudiants et professionnels. Séance diagnostic offerte, en visio ou en présentiel.",
  keywords: ["prise de parole en public", "éloquence", "Grand Oral", "coaching oral", "formation prise de parole", "art oratoire"],
  authors: [{ name: SITE.founder }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE.name,
    title: "Lieben Éloquence · Formations en prise de parole",
    description: "Parlez pour plaire, convaincre, impacter. Séance diagnostic offerte.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#001636",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${sfPro.variable} ${melodrame.variable}`}>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
