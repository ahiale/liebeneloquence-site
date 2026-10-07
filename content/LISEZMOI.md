# Contenus modifiables

Trois fichiers, un par type de contenu. Le site vérifie leur format à chaque mise en ligne : en cas d'erreur, la mise en ligne s'arrête et indique la ligne fautive.

| Fichier | Contenu |
| --- | --- |
| `evenements.json` | Événements (page Événements + pages détail) |
| `avis.json` | Avis du carrousel de l'accueil |
| `tarifs.json` | Prix des packs, Grand Oral, LEQ'FAM |

## Publier ou masquer

Chaque événement et chaque avis a un champ `"status"` :

- `"published"` : visible sur le site ;
- `"draft"` : brouillon, invisible.

## Ajouter un avis

Copier le bloc `modele-avis` de `avis.json`, puis :

- donner un `id` unique (ex. `"amina-2026-10"`) ;
- remplir `author` (« Prénom N. »), `role` (« Étudiante en master, Paris »), `rating` (1 à 5), `text` et `date` (AAAA-MM-JJ) ;
- passer `status` à `"published"`.

Le carrousel n'apparaît sur l'accueil que s'il y a au moins un avis publié.

## Ajouter un événement

Copier un bloc de `evenements.json`. Le `slug` devient l'adresse de la page : `/evenements/<slug>` (minuscules, chiffres et tirets). Les photos vont dans `public/evenements/` et se renseignent ainsi : `"image": "/evenements/ma-photo.jpg"`. Un champ inconnu se met à `null`.

Ces noms de champs sont ceux que reprendra le futur SaaS.

## Événement gratuit avec inscription (rendez-vous mensuel…)

Pour un événement gratuit en visio, mettez `"registrationUrl": null` et ajoutez :

```json
"signup": { "meetingUrl": "https://meet.google.com/xxx-xxxx-xxx", "durationMinutes": 60 }
```

La page affiche alors un formulaire (prénom, nom, email, comment nous avez-vous connus). Chaque inscrit reçoit aussitôt un mail avec le lien de la visio et un fichier pour l'ajouter à son agenda. Le lien n'est jamais affiché sur le site. Une même adresse ne peut pas s'inscrire deux fois au même événement, et le formulaire se ferme seul une fois l'événement passé. Les inscrits apparaissent dans l'onglet « Inscriptions événements » du tableau de bord Excel.

Pour le rendez-vous du mois suivant : copiez le bloc du rendez-vous mensuel, changez le `slug` (par exemple `rendez-vous-mensuel-leq-novembre-2026`), la date (`dateLabel` et `startsAt`) et le lien Meet si besoin. Passez l'ancien en `"draft"`.

## Ouvrir la communauté LEQ'FAM

Tant que `leqfam.availability` contient un texte dans `tarifs.json` (ex. « Bientôt disponible · fin octobre »), la page Communauté affiche une **liste d'attente**. Le jour du lancement :

1. renseigner le lien Stripe LEQ'FAM dans `src/config/site.ts` ;
2. mettre `"availability": null` dans `tarifs.json`.

Les boutons mènent alors au paiement. Les inscrits à la liste d'attente sont dans `/data/liste-attente.jsonl` sur le serveur.
