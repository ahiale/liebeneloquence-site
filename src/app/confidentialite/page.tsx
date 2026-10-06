import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL, SITE } from "@/config/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  alternates: { canonical: "/confidentialite" },
};

const TRAITEMENTS = [
  ["Demande de devis", "Nom, établissement, email, message", "Répondre à la demande et envoyer la brochure", "Mesures précontractuelles", "3 ans après le dernier contact"],
  ["Réservation Grand Oral", "Prénom, nom, email, profil, type et date de l'oral, attentes", "Gérer la réservation et l'accompagnement", "Exécution du contrat", "3 ans après la fin de l'accompagnement"],
  ["Formulaire de contact", "Nom, email, type de demande, message", "Répondre à la demande", "Intérêt légitime", "3 ans après le dernier contact"],
  ["Newsletter", "Nom, email, profil et thématique (facultatifs)", "Envoyer la newsletter", "Consentement", "Jusqu'à la désinscription"],
  ["Quiz d'orateur", "Réponses au quiz ; prénom et email si vous demandez votre résultat", "Calculer et envoyer le résultat, améliorer l'offre", "Intérêt légitime ; consentement pour l'envoi par email", "1 an"],
];

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de" accent="confidentialité" updated="6 octobre 2026">
      <h2>Qui est responsable de vos données ?</h2>
      <p>
        Le responsable du traitement est {LEGAL.owner} (Lieben Éloquence), {LEGAL.status.toLowerCase()}, SIRET {LEGAL.siret}. Pour toute question : <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      <h2>Quelles données, pourquoi et combien de temps ?</h2>
      <p>Nous ne collectons que les données nécessaires, uniquement via les formulaires que vous remplissez.</p>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Formulaire</th>
              <th>Données</th>
              <th>Finalité</th>
              <th>Base légale</th>
              <th>Conservation</th>
            </tr>
          </thead>
          <tbody>
            {TRAITEMENTS.map((row) => (
              <tr key={row[0]}>
                {row.map((cell) => (
                  <td key={cell}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Qui reçoit vos données ?</h2>
      <p>Vos données sont destinées uniquement à Lieben Éloquence. Elles ne sont jamais vendues ni louées. Elles transitent par les prestataires suivants, strictement pour faire fonctionner le service :</p>
      <ul>
        <li>{LEGAL.host.name} (Allemagne) : hébergement du site et des données des formulaires ;</li>
        <li>Google Workspace (Google Ireland Ltd) : envoi et réception des emails ;</li>
        <li>Stripe : paiement en ligne (Stripe reçoit directement vos données de paiement, Lieben Éloquence n&apos;y a jamais accès) ;</li>
        <li>Calendly : prise de rendez-vous, lorsque vous réservez une séance.</li>
      </ul>
      <p>
        Certains de ces prestataires peuvent transférer des données hors de l&apos;Union européenne ; ces transferts sont encadrés par les clauses contractuelles types de la Commission européenne ou le Data Privacy Framework.
      </p>

      <h2>Mesure d&apos;audience</h2>
      <p>
        Le site mesure sa fréquentation avec un outil installé sur son propre serveur, sans cookie et sans données permettant de vous identifier (pas d&apos;adresse IP conservée). Ces statistiques ne sont partagées avec personne. Voir la page <Link href="/cookies">cookies</Link>.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition et de portabilité de vos données, ainsi que du droit de retirer votre consentement à tout moment (par exemple, vous désinscrire de la newsletter). Pour les exercer, écrivez à <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Une réponse vous est apportée sous un mois.
      </p>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (<a href="https://www.cnil.fr">cnil.fr</a>).
      </p>

      <h2>Sécurité</h2>
      <p>Le site est servi en HTTPS. Les données des formulaires sont stockées sur un serveur protégé, accessible uniquement par Lieben Éloquence.</p>
    </LegalPage>
  );
}
