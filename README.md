# Lieben Éloquence (LEQ) : site vitrine

Site de Lieben Éloquence, formations et coaching en prise de parole : https://liebeneloquence.com

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # vérifie que tout compile
```

Sans configuration, les mails des formulaires ne partent pas : ils s'affichent dans le terminal.

## Où modifier quoi

| Je veux changer… | Fichier |
| --- | --- |
| Un événement, un avis, un tarif | `content/*.json` (mode d'emploi : `content/LISEZMOI.md`) |
| Email, téléphone, Calendly, Stripe, réseaux sociaux, mentions légales | `src/config/site.ts` |
| Le texte d'un mail automatique | `src/emails/templates.ts` |
| Les questions et profils du quiz | `src/lib/quiz.ts` |
| Les listes de choix des formulaires | `src/lib/options.ts` |
| Les couleurs, polices, boutons, animations | `src/design/` |
| La photo de la formatrice | `public/formatrice.jpg` |
| Les brochures envoyées avec les devis | `assets/brochures/` |

## Organisation du code

```
content/              contenus modifiables (format partagé avec le futur SaaS)
assets/brochures/     PDF joints aux mails de devis
src/
  app/                pages (une par dossier) et actions des formulaires (actions.ts)
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
