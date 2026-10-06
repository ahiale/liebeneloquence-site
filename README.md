# Lieben Éloquence (LEQ)

Plateforme vitrine de Lieben Éloquence : formations et coaching en prise de
parole, quiz de profilage d'orateur, offre Grand Oral, événements et newsletter.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** strict
- **Tailwind CSS v4** (tokens déclarés dans `@theme`)
- **lucide-react** pour les icônes (logos de marque tracés à la main dans
  `src/components/ui/BrandIcons.tsx`)

Aucun emoji dans l'interface : toutes les illustrations sont des icônes
vectorielles ou des SVG maison (`MicEmblem`, `CalendarEmblem`).

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
npm run start    # serveur de production
```

## Charte graphique

| Rôle | Valeur |
| --- | --- |
| Bleu nuit (fond) | `#001636` |
| Bleu royal | `#114DA8` |
| Or / ambre | `#FFBD59` |
| Orange (CTA) | `#FF5E01` |
| Brun braise | `#2E1106` |

- **Police principale :** SF Pro Display (pile système Apple), repli **Inter**
  via `next/font` hors écosystème Apple.
- **Accents didone italiques** (« PLAIRE, CONVAINCRE, IMPACTER », « GRAND ORAL »,
  « école ») : **Bodoni Moda**, la plus proche alternative libre de la police
  Melodrame de la charte.

Tokens, fonds (`.bg-night`, `.bg-ember`, `.bg-steel`, `.bg-quiz`, `.bg-light`),
surfaces (`.surface`, `.panel`, `.card-light`) et champs (`.field`) sont définis
dans `src/app/globals.css`.

## Pages

| Route | Contenu |
| --- | --- |
| `/` | Landing : hero, constat, pour qui, apports, méthode, offres, écoles, transparence, témoignages, qui suis-je |
| `/quiz` | Quiz d'orateur : intro → 6 questions → résultat détaillé + réservation |
| `/grand-oral` | Offre Grand Oral : tarif, compétences travaillées, déroulé des séances |
| `/evenements` | Événements & actualités : prochain événement, liste filtrable, newsletter |
| `/evenements/[slug]` | Fiche événement : infos pratiques, programme, public visé |
| `/a-propos` | Parcours, distinctions et expériences de la formatrice |
| `/mentions-legales` | Mentions légales et traitement des données |

`sitemap.xml` et `robots.txt` sont générés par `src/app/sitemap.ts` et
`src/app/robots.ts`.

## Structure

```
src/
  app/
    layout.tsx            # polices + metadata globales
    globals.css           # design system
    page.tsx              # landing
    quiz/ grand-oral/ evenements/ a-propos/ mentions-legales/
    sitemap.ts robots.ts not-found.tsx
  components/
    layout/               # Header, Footer, FooterMinimal, BackHeader
    landing/              # sections de la page d'accueil
    quiz/                 # QuizApp (intro → questions → résultat)
    pages/                # GrandOral, Evenements
    ui/                   # Button, Logo, Reveal, Section, IconTile, emblèmes
  data/
    site.ts               # navigation, contacts, liens externes
    packs.ts              # packs + offre Grand Oral
    quiz.ts               # 6 questions, scoring, 5 profils
    events.ts             # événements
    parcours.ts           # jalons et expériences de la formatrice
```

## Quiz

6 questions, score de 0 à 17 points, 5 profils (`src/data/quiz.ts`). Le calcul
est instantané côté client ; le résultat affiche le profil, ses forces, ses axes
de travail, ce que LEQ change, le conseil et le **pack recommandé**, avec un
formulaire de réservation.

| Score | Profil | Référence | Pack |
| --- | --- | --- | --- |
| 0–4 | L'Orateur Silencieux | Le jeune Malcolm | Senghor |
| 5–8 | L'Orateur en Construction | Le jeune Obama | Senghor |
| 9–12 | L'Orateur Affirmatif | Yann Barthès | Cicéron |
| 13–15 | L'Orateur Inspiré | Chimamanda | Socrate |
| 16–17 | L'Orateur Accompli | Mandela | Socrate |

## À compléter avant mise en ligne

- **Liens externes** : `SITE.instagram`, `SITE.linkedin`, `SITE.calendly` et
  `SITE.email` dans `src/data/site.ts` sont des placeholders.
- **Tarifs étudiants** (`priceStudent` dans `src/data/packs.ts`) : valeurs
  indicatives (−20 % environ) à confirmer. Les tarifs standards viennent des
  maquettes (89 / 149 / 225 €, Grand Oral 120 €).
- **Formulaires** (devis école, réservation quiz, newsletter) : l'UI est
  complète — validation, état de confirmation — mais aucun envoi n'est branché.
  Connecter un endpoint ou un service mail.
- **Portrait** : `public/formatrice.jpg` (ratio ~4:5). Remplacer le fichier
  suffit, aucun code à modifier.
- **Événements** : les dates et lieux de `src/data/events.ts` sont à confirmer
  (« lieu à confirmer » dans les maquettes).
- **Domaine** : `metadataBase`, `sitemap.ts` et `robots.ts` pointent vers
  `https://lieben-eloquence.fr`.
