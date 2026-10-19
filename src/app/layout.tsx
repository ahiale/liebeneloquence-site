import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { melodrame, sfPro } from "@/design/fonts";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/config/site";
import { getPricing } from "@/content";
import { formatPrice } from "@/lib/format";
import { CommunityPopup } from "@/components/communaute/CommunityPopup";
import { RetourHaut } from "@/components/layout/RetourHaut";
import { JsonLd, KEYWORDS, pageMeta, siteGraph } from "@/lib/seo";
import { DISTINCTIONS } from "@/components/home/QuiSuisJe";
import "./globals.css";

const HOME = pageMeta({
  title: "Coaching prise de parole et formation éloquence · Lieben Éloquence",
  description:
    "Coaching prise de parole et formation éloquence : packs individuels, préparation au Grand Oral, à l'oral de BTS et aux soutenances. Diagnostic offert.",
  path: "/",
  absolute: true,
});

export const metadata: Metadata = {
  ...HOME,
  metadataBase: new URL(SITE.url),
  title: { default: "Coaching prise de parole et formation éloquence · Lieben Éloquence", template: "%s · Lieben Éloquence" },
  keywords: KEYWORDS,
  authors: [{ name: SITE.founder, url: `${SITE.url}/a-propos` }],
  creator: SITE.founder,
  robots: { index: true, follow: true, "max-image-preview": "large" },
};

export const viewport: Viewport = {
  themeColor: "#001636",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pricing = await getPricing();
  const { leqfam } = pricing;
  return (
    <html lang="fr" className={`${sfPro.variable} ${melodrame.variable}`} data-scroll-behavior="smooth">
      <body>
        <JsonLd data={siteGraph(pricing, DISTINCTIONS)} />
        {children}
        <Footer />
        <RetourHaut />
        <CommunityPopup price={formatPrice(leqfam.monthlyPrice)} availability={leqfam.availability} />
        {/* Mesure d'audience Umami (sans cookie), active seulement si configurée au build */}
        {process.env.UMAMI_WEBSITE_ID && (
          <Script src={process.env.UMAMI_SCRIPT_URL || "https://stats.liebeneloquence.com/script.js"} data-website-id={process.env.UMAMI_WEBSITE_ID} strategy="lazyOnload" />
        )}
      </body>
    </html>
  );
}
