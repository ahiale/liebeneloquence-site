import "server-only";

/**
 * Ajout automatique des inscrits newsletter dans Brevo (outil d'envoi de newsletters).
 * Facultatif : actif seulement si BREVO_API_KEY et BREVO_LIST_ID sont renseignés dans .env.
 * Les inscriptions restent de toute façon enregistrées dans /data/newsletter.jsonl.
 */
export async function addToNewsletterList(contact: { email: string; nom: string; profil?: string; thematique?: string }): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!apiKey || !listId) return;

  const [prenom, ...reste] = contact.nom.trim().split(/\s+/);
  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      email: contact.email,
      listIds: [listId],
      updateEnabled: true,
      attributes: { PRENOM: prenom, NOM: reste.join(" "), PROFIL: contact.profil || undefined, THEMATIQUE: contact.thematique || undefined },
    }),
  });
  if (!res.ok && res.status !== 204) console.error(`Brevo : ajout du contact impossible (${res.status}) ${await res.text()}`);
}
