import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = pageMeta({
  title: "Gestion des cookies",
  description: "Aucun cookie publicitaire sur liebeneloquence.com : détail des stockages techniques et de la mesure d'audience sans cookie.",
  path: "/cookies",
});

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
        Pour ne pas vous présenter plusieurs fois la fenêtre d&apos;invitation à la communauté LEQ&apos;FAM, le site enregistre dans votre navigateur qu'elle vous a été montrée (stockage de session, effacé à la fermeture de l'onglet). De même, vos réponses au quiz d&apos;orateur sont gardées dans votre navigateur pour vous réafficher votre résultat si vous revenez sur la page. Ces informations restent sur votre appareil, ne sont jamais transmises par ce biais et ne servent à aucun suivi. Elles sont exemptées de consentement car strictement nécessaires à ces fonctionnements.
      </p>

      <h2>Une question ?</h2>
      <p>
        Consultez la <Link href="/confidentialite">politique de confidentialité</Link> ou écrivez-nous.
      </p>
    </LegalPage>
  );
}
