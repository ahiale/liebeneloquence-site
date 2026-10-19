# Agent hebdomadaire : opportunités et ressources LEQ'FAM

Consignes de l'agent Claude programmé chaque lundi matin. Il remplit `content/opportunites.json` ; le robot LEQ publie ensuite chaque nouvelle entrée en fiche dans le forum **#ressources-et-opportunités** (toutes les 5 minutes, voir `src/lib/publications-discord.ts`).

## Ce que l'agent cherche (5 à 8 fiches par semaine)
Des informations peu connues, vérifiées, en français ou en anglais, avec un lien fort à la France ou à la francophonie quand c'est possible :
- **Concours** : éloquence, plaidoirie, débat, prise de parole, ouverts aux francophones (lycéens, étudiants, adultes), inscription encore ouverte.
- **Opportunité internationale** (la majorité des fiches) : appels à candidatures et appels à projets de l'ONU, de l'UNESCO, de l'OIF, de l'OFAJ, de l'OFQJ, de l'Union européenne, du Conseil de l'Europe, de fondations et d'universités ; programmes de leadership, bourses, conférences, forums jeunesse, entrepreneuriat. Chercher au-delà des premiers résultats : pages « appels à candidatures » des institutions, sites spécialisés en opportunités.
- **Ressource** (2 ou 3 au maximum) : articles, études, podcasts ou vidéos de la semaine utiles pour progresser à l'oral.

## Règles
- Vérifier chaque information sur la page officielle (date limite, public, conditions) et mettre ce lien. Jamais d'invention.
- Une date limite passée ou introuvable : on n'ajoute pas. Signaler les conditions importantes (pays éligibles, frais de candidature…).
- Écarter ce qui est payant ou douteux (frais de candidature, places « autofinancées »).
- Pas de doublon : vérifier que l'`id` et le sujet ne sont pas déjà dans `content/opportunites.json`.
- Ton de la communauté : tutoiement, simple, chaleureux, sans tiret cadratin. Toujours « LEQ ».

## Format d'une entrée (une carte Discord avec un bouton « En savoir plus »)
```json
{
  "id": "2026-10-grande-finale-eloquence-etudiants-2027",
  "titre": "Grande finale d'éloquence des étudiants 2027",
  "resume": "Ce que c'est, ce qu'on y gagne, comment candidater : 2 à 4 phrases explicites.",
  "pourQui": "Étudiants francophones, partout dans le monde",
  "dateLimite": "2 novembre 2026",
  "lieu": "Finale le 8 mai 2027 à Aix-en-Provence",
  "lien": "https://lien-officiel",
  "etiquettes": ["Concours"],
  "ajout": "2026-10-19"
}
```
- `etiquettes` : « Concours », « Opportunité internationale » ou « Ressource » (la première donne la couleur de la carte).
- `dateLimite` et `lieu` : `null` si sans objet (ressources).
- Ajouter `"brouillon": true` pour qu'une fiche ne soit pas publiée : elle peut alors être envoyée en aperçu dans #staffchat.

## Fin de tâche
Ajouter les entrées à la fin du tableau, vérifier le JSON (`node -e "require('./content/opportunites.json')"`), puis commit et push sur `main` avec le message « Opportunités de la semaine ». La mise en ligne et la publication sur Discord se font toutes seules.
