import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL, SITE } from "@/config/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions" accent="légales" updated="6 octobre 2026">
      <h2>Éditeur du site</h2>
      <p>
        Le site {SITE.url.replace("https://", "")} est édité par <strong>{LEGAL.owner}</strong>, {LEGAL.status.toLowerCase()} exerçant sous le nom commercial « Lieben Éloquence ».
      </p>
      <ul>
        <li>SIREN : {LEGAL.siren}</li>
        <li>SIRET : {LEGAL.siret}</li>
        <li>
          Email : <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </li>
      </ul>
      <p>Directrice de la publication : {LEGAL.owner}.</p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par {LEGAL.host.name}, {LEGAL.host.address} (<a href={LEGAL.host.url}>{LEGAL.host.url.replace("https://", "")}</a>).
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus de ce site (textes, illustrations, logo LEQ, photographies, quiz, supports) est la propriété de {LEGAL.owner}, sauf mention contraire. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Les informations recueillies via les formulaires du site sont traitées conformément au Règlement général sur la protection des données (RGPD). Pour en savoir plus et exercer vos droits, consultez la <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site ne dépose aucun cookie publicitaire ni de traçage. Le détail figure sur la page <Link href="/cookies">gestion des cookies</Link>.
      </p>

      <h2>Liens externes</h2>
      <p>
        Le site contient des liens vers des services tiers (Calendly pour la prise de rendez-vous, Stripe pour le paiement, Discord, Instagram, LinkedIn). Lieben Éloquence n&apos;est pas responsable du contenu ni des pratiques de ces services.
      </p>

      <h2>Médiation de la consommation</h2>
      <p>
        Conformément à l&apos;article L612-1 du Code de la consommation, en cas de litige non résolu, le client consommateur peut recourir gratuitement à un médiateur de la consommation. Coordonnées du médiateur : [MÉDIATEUR À COMPLÉTER].
      </p>
    </LegalPage>
  );
}
