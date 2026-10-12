import type { Metadata } from "next";
import Link from "next/link";
import { getPricing } from "@/content";
import { LEGAL, SITE } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = pageMeta({
  title: "Conditions générales de vente",
  description: "Conditions générales de vente de Lieben Éloquence : abonnement à la communauté LEQ'FAM, formules, paiement, rétractation et résiliation.",
  path: "/cgv",
});

export default async function CgvPage() {
  const { leqfam } = await getPricing();
  const { engagement, libre } = leqfam.formules;
  const l = leqfam.lancement;

  return (
    <LegalPage title="Conditions générales" accent="de vente" updated="12 octobre 2026">
      <h2>1. Qui vend ?</h2>
      <p>
        Les services sont proposés par <strong>{LEGAL.owner}</strong>, {LEGAL.status.toLowerCase()} exerçant sous le nom commercial « Lieben Éloquence » (SIREN {LEGAL.siren}), joignable à <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        {LEGAL.address ? ` Adresse : ${LEGAL.address}.` : " Adresse : [ADRESSE DE DOMICILIATION À COMPLÉTER]."}
      </p>
      <p>Les présentes conditions s&apos;appliquent à l&apos;abonnement à la communauté LEQ&apos;FAM souscrit sur {SITE.url.replace("https://", "")}. Elles sont acceptées en cochant la case prévue avant le paiement.</p>

      <h2>2. Le service LEQ&apos;FAM</h2>
      <p>
        La LEQ&apos;FAM est une communauté en ligne dédiée à la prise de parole en public et à l&apos;éloquence, hébergée sur Discord. L&apos;abonnement donne accès aux salons réservés aux membres : échanges et entraide, ateliers en direct, ressources et opportunités, Grand Prix LEQ. Un compte Discord est nécessaire ; l&apos;accès est activé automatiquement après le paiement.
      </p>

      <h2>3. Les formules et les prix</h2>
      <ul>
        <li><strong>{libre.label}</strong> : {formatPrice(libre.monthlyPrice)} par mois, résiliable à tout moment.</li>
        <li><strong>{engagement.label}</strong> : {formatPrice(engagement.monthlyPrice)} par mois, avec un engagement de {engagement.engagementMonths} mois. À la fin de l&apos;engagement, l&apos;abonnement est reconduit de mois en mois et devient résiliable à tout moment.</li>
        <li><strong>Offre de lancement</strong> : {formatPrice(l.prixPremierMois)} le premier mois, pendant {l.jours} jours à compter de l&apos;ouverture des adhésions et dans la limite des {l.places} premières inscriptions.</li>
        <li><strong>Code ambassadeur ou association partenaire</strong> : {formatPrice(leqfam.partnerMonthlyPrice)} par mois pendant {leqfam.partnerDurationMonths} mois (dont le premier mois au prix de l&apos;offre de lancement si elle est en cours), puis le prix normal de la formule choisie.</li>
      </ul>
      <p>Les prix sont indiqués en euros, toutes taxes comprises. [À CONFIRMER : TVA non applicable, article 293 B du CGI.] Le détail exact de ce que vous paierez est affiché avant la validation du paiement.</p>

      <h2>4. Paiement</h2>
      <p>
        Le paiement s&apos;effectue par carte bancaire sur la page sécurisée de notre prestataire Stripe. Le premier mois est payé à l&apos;adhésion, puis l&apos;abonnement est prélevé automatiquement chaque mois à la même date. Un reçu est envoyé par email à chaque prélèvement.
      </p>
      <p>
        En cas d&apos;échec d&apos;un prélèvement, de nouvelles tentatives sont faites automatiquement et vous êtes prévenu par email. Si le paiement ne peut pas aboutir, l&apos;accès aux salons membres est suspendu. Pour la formule avec engagement, les mensualités restant à courir jusqu&apos;à la fin de l&apos;engagement demeurent dues.
      </p>

      <h2>5. Droit de rétractation</h2>
      <p>
        Vous disposez de 14 jours à compter de votre adhésion pour vous rétracter, sans avoir à vous justifier, en écrivant à <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. En demandant l&apos;accès immédiat à la communauté lors de l&apos;adhésion, vous acceptez que le service commence avant la fin de ce délai : en cas de rétractation, le montant correspondant à la période déjà écoulée reste dû et le reste vous est remboursé sous 14 jours.
      </p>

      <h2>6. Résiliation</h2>
      <p>
        Vous pouvez résilier à tout moment, en ligne, sur la page <Link href="/communaute/resilier">Résilier mon abonnement</Link>, ou par email. Sans engagement, la résiliation prend effet à la fin du mois déjà payé. Avec engagement, elle prend effet à la fin de la période d&apos;engagement en cours ; après celle-ci, à la fin du mois déjà payé. Aucun prélèvement n&apos;a lieu après la date de fin, et l&apos;accès reste ouvert jusqu&apos;à cette date.
      </p>
      <p>Pour la formule avec engagement, vous êtes informé par email avant la fin de la période d&apos;engagement de la possibilité de ne pas reconduire votre abonnement.</p>

      <h2>7. Règles de la communauté</h2>
      <p>
        Les membres s&apos;engagent à respecter les règles affichées sur le serveur (respect, bienveillance, confidentialité des contenus partagés). En cas de manquement grave ou répété, l&apos;accès peut être suspendu ou retiré, après avertissement sauf urgence. Les contenus partagés par les membres restent leur propriété et ne doivent pas être diffusés hors de la communauté sans l&apos;accord de leur auteur.
      </p>

      <h2>8. Disponibilité et responsabilité</h2>
      <p>
        Le service repose sur la plateforme Discord, dont la disponibilité ne dépend pas de Lieben Éloquence. Les ateliers, ressources et contenus sont fournis à titre d&apos;accompagnement pédagogique ; les résultats obtenus (examens, concours, entretiens) dépendent de chacun.
      </p>

      <h2>9. Données personnelles</h2>
      <p>
        Les données nécessaires à l&apos;abonnement (identifiant Discord, email, formule, paiements) sont traitées pour gérer votre accès et vos paiements. Les données de carte bancaire sont traitées uniquement par Stripe. Pour en savoir plus et exercer vos droits, consultez la <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>10. Médiation et litiges</h2>
      <p>
        En cas de difficulté, écrivez-nous d&apos;abord à <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Conformément à l&apos;article L612-1 du Code de la consommation, vous pouvez recourir gratuitement à un médiateur de la consommation : [MÉDIATEUR À COMPLÉTER]. Les présentes conditions sont soumises au droit français.
      </p>
    </LegalPage>
  );
}
