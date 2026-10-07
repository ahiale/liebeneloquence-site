# Où modifier les textes du site

Pour changer une phrase : ouvrez le fichier indiqué, faites `Ctrl+F` et tapez quelques mots de la phrase, modifiez le texte **entre les guillemets ou entre les balises**, sans toucher au reste. Le plus simple reste de demander à Claude : « remplace la phrase X par Y ».

Dans le code, l'apostrophe s'écrit parfois `&apos;` (ex. `l&apos;éloquence`) : c'est normal, gardez-la telle quelle.

## Pages

| Page | Section | Fichier |
| --- | --- | --- |
| **Accueil** | Grand titre, texte et boutons du haut | `src/components/home/Hero.tsx` |
| | Le constat (texte, pastilles, chiffres 75 % / 3x / 7 min) | `src/components/home/Constat.tsx` |
| | Ce que j'apporte (6 bulles) | `src/components/home/Apports.tsx` |
| | La méthode (3 étapes) | `src/components/home/Methode.tsx` |
| | Les packs, « Vous hésitez ? », encart Grand Oral | `src/components/home/Offres.tsx` (prix et contenu des packs : `content/tarifs.json`) |
| | Interventions en école + formulaire de devis | `src/components/home/Ecoles.tsx` |
| | Ce que je ne fais pas (post-it) | `src/components/home/Transparence.tsx` |
| | Avis | `content/avis.json` |
| | Qui suis-je ? | `src/components/home/QuiSuisJe.tsx` |
| **Quiz** | Accueil du quiz, page résultat | `src/components/quiz/Quiz.tsx` |
| | Questions, réponses, profils, niveaux, points à travailler, exercices | `src/lib/quiz.ts` |
| **Grand Oral** | Toute la page | `src/app/grand-oral/page.tsx` (prix et liste de la carte : `content/tarifs.json`) |
| | Formulaire (choix « Vous êtes », « Votre oral ») | `src/components/grand-oral/GrandOralForm.tsx` et `src/lib/options.ts` |
| **Autres services** | Toute la page | `src/app/autres-services/page.tsx` |
| | Formulaire de contact (types de demande) | `src/components/autres-services/ContactForm.tsx` et `src/lib/options.ts` |
| **Communauté** | Toute la page | `src/app/communaute/page.tsx` (prix : `content/tarifs.json`) |
| | Pop-up « Rejoignez la communauté » | `src/components/communaute/CommunityPopup.tsx` |
| **Événements** | Page, newsletter, FAQ | `src/app/evenements/page.tsx` |
| | Les événements eux-mêmes | `content/evenements.json` |
| **À propos** | Toute la page (parcours année par année) | `src/app/a-propos/page.tsx` |
| **Mentions légales, confidentialité, cookies** | | `src/app/mentions-legales/`, `src/app/confidentialite/`, `src/app/cookies/` (fichiers `page.tsx`) |
| **Page 404** | | `src/app/not-found.tsx` |
| **Menu et pied de page** | Liens et intitulés | `src/config/site.ts` |

## Ailleurs

| Quoi | Fichier |
| --- | --- |
| Email, téléphone, Calendly, liens Stripe, Instagram, LinkedIn, SIRET, adresse | `src/config/site.ts` |
| Textes des mails automatiques | `src/emails/templates.ts` |
| Fiche orateur (infographie envoyée avec le quiz) | `src/emails/fiche-orateur.tsx` |
| Titre et description de chaque page dans Google | En haut de chaque `page.tsx`, bloc `metadata` |
| Photos de la formatrice | `public/images/rebecca/` (remplacer un fichier en gardant exactement le même nom) |
| Brochures envoyées avec les devis | `assets/brochures/` (remplacer le PDF, même nom) |

## Après une modification

Les changements partent en ligne quand ils sont envoyés sur GitHub (`git push`). Le site se met à jour tout seul en 3 à 5 minutes. La marche à suivre pas à pas est dans `TRAVAILLER-EN-AUTONOMIE.md`.
