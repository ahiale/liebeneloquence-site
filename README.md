# Lieben Éloquence (LEQ) : site vitrine

Site de Lieben Éloquence, formations et coaching en prise de parole : https://liebeneloquence.com

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # vérifie que tout compile
```

Sans configuration, les mails des formulaires ne partent pas : ils s'affichent dans le terminal.

## Documentation

| Guide | Pour… |
| --- | --- |
| [TRAVAILLER-EN-AUTONOMIE.md](TRAVAILLER-EN-AUTONOMIE.md) | modifier, vérifier, mettre en ligne, annuler ; tableau de bord des données ; modèles PowerPoint |
| [OU-MODIFIER-LES-TEXTES.md](OU-MODIFIER-LES-TEXTES.md) | trouver le fichier de chaque texte du site, page par page |
| [content/LISEZMOI.md](content/LISEZMOI.md) | ajouter un événement, un avis, changer un tarif |
| [DEPLOIEMENT.md](DEPLOIEMENT.md) | installation du serveur (déjà faite) et dépannage |

## Où modifier quoi

| Je veux changer… | Fichier |
| --- | --- |
| Un événement, un avis, un tarif | `content/*.json` (mode d'emploi : `content/LISEZMOI.md`) |
| Email, téléphone, Calendly, Stripe, réseaux sociaux, mentions légales | `src/config/site.ts` |
| Le texte d'un mail automatique | `src/emails/templates.ts` |
| Les questions et profils du quiz | `src/lib/quiz.ts` |
| Les listes de choix des formulaires | `src/lib/options.ts` |
| Les couleurs, polices, boutons, animations | `src/design/` |
| Les photos de la formatrice | `public/images/rebecca/` (photos non utilisées : `assets/photos-reserve/`) |
| Les brochures envoyées avec les devis | `assets/brochures/` |

## Organisation du code

```
content/              contenus modifiables (format partagé avec le futur SaaS)
assets/brochures/     PDF joints aux mails de devis
assets/photos-reserve/ photos non publiées sur le site (banque d'images)
communication/        modèles PowerPoint (atelier, publications) et carrousel Instagram, avec leurs scripts
outils/               export CSV des données et création du tableau de bord Excel
LEQ-maquette-v2/      maquettes d'origine et polices (référence de design)
src/
  app/                pages (une par dossier), actions des formulaires (actions.ts),
                      pages d'erreur (not-found.tsx, error.tsx), api/donnees (données pour Excel)
  components/         sections et composants par page ; ui/ = composants réutilisables
  config/site.ts      coordonnées et liens externes
  content/            lecture des contenus (schema.ts = format, index.ts = accès)
  design/             système de design partagé : tokens.css, fonts.ts, polices
  emails/templates.ts textes des mails automatiques
  lib/                quiz, envoi de mails (SMTP Google Workspace), stockage des formulaires
deploy/               configuration du serveur (Docker Compose, Caddy, modèle .env)
```

## Prêt pour le SaaS

- Les pages ne lisent les contenus que via `src/content/index.ts`. Pour basculer sur l'API du SaaS, seul ce fichier change.
- `src/content/schema.ts` définit le format exact des événements, avis et tarifs : le SaaS reprend les mêmes noms de champs.
- Les envois de formulaires sont enregistrés ligne par ligne dans `/data/*.jsonl` sur le serveur, importables dans le SaaS.
- `src/design/` (couleurs, polices, classes) ne dépend pas du reste du site et peut être partagé tel quel.

## Mise en ligne

Voir [DEPLOIEMENT.md](DEPLOIEMENT.md). Chaque `git push` sur `main` met le site à jour automatiquement.
