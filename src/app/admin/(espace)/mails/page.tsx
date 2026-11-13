import { Badge, Carte, Titre } from "@/components/admin/ui";
import { Icon } from "@/components/ui/Icons";

/** Les mails automatiques du parcours, avec leur état réel. Modèles modifiables et activation depuis l'admin : étape suivante. */
const MAILS: { declencheur: string; mail: string; etat: "en-place" | "manuel" | "a-venir" }[] = [
  { declencheur: "Fin du quiz d'orateur", mail: "Fiche orateur et lien vers la séance découverte", etat: "en-place" },
  { declencheur: "Inscription à un événement gratuit", mail: "Confirmation, lien Google Meet et fichier agenda", etat: "en-place" },
  { declencheur: "Formulaire école ou structure", mail: "Confirmation et brochure", etat: "en-place" },
  { declencheur: "Demande de séance à l'unité, Grand Oral", mail: "Récapitulatif et lien de paiement", etat: "en-place" },
  { declencheur: "Adhésion LEQ'FAM", mail: "Bienvenue, accès Discord, lien de résiliation", etat: "en-place" },
  { declencheur: "Demande de l'e-book Mellie", mail: "Lien de téléchargement, soutien, précommande", etat: "en-place" },
  { declencheur: "Après la séance découverte", mail: "Diagnostic (depuis la fiche élève)", etat: "manuel" },
  { declencheur: "Après chaque séance", mail: "Compte-rendu et exercice (depuis la fiche élève)", etat: "manuel" },
  { declencheur: "Paiement d'un pack", mail: "Bienvenue, accès à l'espace élève, questionnaire", etat: "a-venir" },
  { declencheur: "2 jours sans questionnaire", mail: "Relance douce", etat: "a-venir" },
  { declencheur: "Veille d'une séance", mail: "Rappel avec l'heure et le lien", etat: "a-venir" },
  { declencheur: "Séance reprogrammée", mail: "Nouvel horaire et nouveau lien", etat: "a-venir" },
  { declencheur: "Exercice non rendu sous 48 h", mail: "Rappel", etat: "a-venir" },
  { declencheur: "Fin de formation", mail: "Attestation, message de Rebecca, demande d'avis", etat: "a-venir" },
];

const ETAT = { "en-place": ["vert", "Automatique"], manuel: ["bleu", "Un clic dans la fiche"], "a-venir": ["gris", "À venir"] } as const;

export default function AdminMails() {
  return (
    <>
      <Titre titre="Mails" accent="automatiques" sous="Ce qui part tout seul, ce qui part d'un clic, et ce qui arrive avec l'espace élève." />
      <p className="mb-6 flex items-center gap-2 rounded-[14px] bg-[#E3EDFB] px-5 py-3 text-[14.5px] text-royal">
        <Icon name="pen" size={17} /> Modifier le texte de chaque mail ici, et l&apos;activer ou le couper, est la prochaine étape de ce module.
      </p>
      <Carte>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[14.5px]">
            <thead>
              <tr className="text-[12px] tracking-[.06em] text-ink/50 uppercase">
                <th className="px-3 pb-3">Quand</th>
                <th className="px-3 pb-3">Mail envoyé</th>
                <th className="px-3 pb-3">État</th>
              </tr>
            </thead>
            <tbody>
              {MAILS.map((m) => (
                <tr key={m.declencheur} className="border-t border-ink/8">
                  <td className="px-3 py-3 font-semibold">{m.declencheur}</td>
                  <td className="px-3 py-3 text-ink/70">{m.mail}</td>
                  <td className="px-3 py-3">
                    <Badge ton={ETAT[m.etat][0]}>{ETAT[m.etat][1]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Carte>
    </>
  );
}
