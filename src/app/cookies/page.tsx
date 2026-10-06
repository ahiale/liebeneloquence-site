import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Gestion des cookies",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalPage title="Gestion des" accent="cookies" updated="6 octobre 2026">
      <h2>Ce site ne vous piste pas</h2>
      <p>
        Le site Lieben Éloquence ne dépose <strong>aucun cookie publicitaire, aucun cookie de réseau social et aucun cookie de traçage</strong>. C&apos;est pourquoi aucun bandeau ne vous demande votre consentement.
      </p>

      <h2>Mesure d&apos;audience sans cookie</h2>
      <p>
        Pour savoir quelles pages sont consultées et améliorer le site, nous utilisons Umami, un outil de statistiques installé sur notre propre serveur. Il ne dépose aucun cookie, ne conserve pas votre adresse IP et ne permet pas de vous identifier ou de vous suivre d&apos;un site à l&apos;autre. Conformément aux recommandations de la CNIL, cette mesure d&apos;audience est exemptée de consentement.
      </p>

      <h2>Services externes</h2>
      <p>
        Lorsque vous cliquez sur un lien vers un service externe (Calendly pour réserver une séance, Stripe pour payer, Discord, Instagram, LinkedIn), vous quittez le site Lieben Éloquence. Ces services peuvent alors déposer leurs propres cookies, selon leurs politiques respectives, que nous vous invitons à consulter.
      </p>

      <h2>Mémorisation technique</h2>
      <p>
        Pour ne pas vous présenter plusieurs fois la fenêtre d&apos;invitation à la communauté LEQ&apos;FAM, le site enregistre dans votre navigateur la date à laquelle elle vous a été montrée (stockage local, conservé 30 jours). Cette information reste sur votre appareil, n&apos;est jamais transmise et ne sert à aucun suivi. Elle est exemptée de consentement car strictement nécessaire à ce fonctionnement.
      </p>

      <h2>Une question ?</h2>
      <p>
        Consultez la <Link href="/confidentialite">politique de confidentialité</Link> ou écrivez-nous.
      </p>
    </LegalPage>
  );
}
