# Agent hebdomadaire : opportunités et ressources LEQ'FAM

Consignes de l'agent Claude programmé chaque lundi matin. Il remplit `content/opportunites.json` ; le robot LEQ publie ensuite chaque nouvelle entrée en fiche dans le forum **#ressources-et-opportunités** (toutes les 5 minutes, voir `src/lib/publications-discord.ts`).

## Ce que l'agent cherche (3 à 5 fiches par semaine)
- **Concours** : concours d'éloquence, de plaidoirie, de débat, de prise de parole, ouverts aux francophones (étudiants, jeunes, adultes), avec inscription encore ouverte.
- **Opportunité internationale** : programmes, bourses, appels à candidatures d'organisations internationales, d'associations ou d'universités, liés à la prise de parole, au leadership ou au débat.
- **Ressource** : article, podcast, vidéo ou outil utile pour progresser à l'oral (sources fiables, accès gratuit de préférence).

## Règles
- Uniquement des informations vérifiées sur la source officielle, avec le lien. Jamais d'invention.
- Une date limite passée ou absente pour un concours : on n'ajoute pas.
- Pas de doublon : vérifier que l'`id` et le sujet ne sont pas déjà dans `content/opportunites.json`.
- Ton de la communauté : tutoiement, simple, chaleureux, sans tiret cadratin. Toujours « LEQ ».

## Format d'une entrée
```json
{
  "id": "2026-10-concours-eloquence-exemple",
  "titre": "Concours d'éloquence Exemple 2026",
  "texte": "De quoi il s'agit, pour qui, la date limite et comment participer.\n\n🔗 https://lien-officiel",
  "etiquettes": ["Concours"],
  "ajout": "2026-10-26"
}
```
`etiquettes` : une ou plusieurs parmi « Concours », « Opportunité internationale », « Ressource » (les étiquettes du forum).

## Fin de tâche
Ajouter les entrées à la fin du tableau, vérifier le JSON (`node -e "require('./content/opportunites.json')"`), puis commit et push sur `main` avec le message « Opportunités de la semaine ». La mise en ligne et la publication sur Discord se font toutes seules.
