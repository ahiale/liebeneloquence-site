# Lieben Éloquence (LEQ) : V2 du site vitrine

Tu travailles sur le site Next.js existant de Lieben Éloquence (dossier `leqsaas-main`). Ta mission : appliquer la maquette V2 validée par la cliente, fidèlement, puis brancher les formulaires et préparer le déploiement.

## Règles importantes

- **La maquette fait foi.** Les fichiers du dossier `maquette/` sont la référence visuelle et textuelle, page par page. Reprends les textes **mot pour mot**. N'invente aucune phrase.
- **Pas de tirets longs (—)** dans les textes. La cliente est très attentive à l'écriture.
- Dans les fichiers de maquette, les adresses `/_blob/...` sont des fichiers hébergés. Remplace-les par les fichiers fournis :
  - polices : dossier `polices/` (SF Pro Display + Relationship of mélodrame pour les italiques d'accent) ;
  - photo : `images/formatrice.jpg` ;
  - illustrations du quiz : `images/quiz/*.svg` (dans l'ordre des réponses du quiz).
- Palette : `#001636` (bleu nuit), `#114DA8` (bleu roi), `#FFBD59` (jaune), `#FF5E01` (orange), brun `#2E1106` (à confirmer).
- Conserve les petits dessins (étoiles, cœurs, bulles, gribouillis, micro) et les animations CSS légères. Respecte `prefers-reduced-motion`.
- Le site doit être parfaitement utilisable sur mobile.
- Avant de coder, propose-moi un plan (pages, composants, ordre de travail) et pose tes questions.

## Pages (une par fichier de maquette)

1. **Accueil** (`Main.dc.html`) : hero bleu avec photo et dessins, Constat, « Ce que j'apporte réellement » (bulles de parole), Méthode (chemin en 3 étapes avec route animée), Packs (Senghor, Cicéron, Socrate avec leurs illustrations), bandeau « Vous hésitez ? », offre Grand Oral, Interventions en école (formulaire de devis), « Ce que je ne fais pas » (post-it), témoignages en carrousel défilant, Qui suis-je.
2. **Quiz** (`Quiz.dc.html`) : 6 questions avec illustrations, boutons Précédent / Suivant, résultat (nature d'orateur, niveau, points à travailler), puis choix « Séance classique » ou « Séance spéciale Grand Oral ».
3. **Grand Oral** (`GrandOral.dc.html`) : hero clair, carte tarif, compétences en badges, formulaire de réservation.
4. **À propos** (`APropos.dc.html`).
5. **Événements** (`Evenements.dc.html`) : événements à venir, newsletter, FAQ.
6. **Autres produits** (`AutresProduits.dc.html`) : LEQ'FAM, discours sur mesure, animation d'événements, coaching concours, application mobile, formulaire de contact.
7. **Communauté LEQ'FAM** (`Communaute.dc.html`), nouvelle page, accessible depuis Autres produits.
8. À créer dans le même style (sans maquette) : mentions légales, politique de confidentialité, gestion des cookies (RGPD), page 404, page de détail d'un événement.

Menu : Méthode, Formations, Grand Oral, Autres produits, Événements, À propos + bouton « Découvrir les offres ».

## Parcours et liens (à respecter partout)

- Boutons « Réserver » des packs, « Réserver ma séance », fin du quiz « Séance classique » : **lien Calendly** → `[LIEN CALENDLY]`.
- Fin du quiz « Séance spéciale Grand Oral » → page Grand Oral.
- **Grand Oral** : « Je réserve ma place » → formulaire de la page Grand Oral (prénom, nom, email, profil, type d'oral, date, attentes). À l'envoi : mail à Rebecca + mail automatique au client avec le **lien de paiement Stripe** `[LIEN STRIPE GRAND ORAL]`. Après paiement, Rebecca recontacte le client.
- **Communauté** : « Rejoindre la LEQ'FAM » → paiement Stripe de l'abonnement (3,99 €/mois) `[LIEN STRIPE LEQ'FAM]`.
- Discours sur mesure, animation, coaching concours, partenariats : **formulaire de contact** envoyé par mail à `[EMAIL DE CONTACT]`, plus un lien mailto.
- Formulaire « Demander un devis » (écoles) : mail à Rebecca + mail de confirmation à l'école avec la **brochure en PDF** en pièce jointe `[BROCHURE]`.
- Newsletter : inscription enregistrée (outil à choisir avec moi, par exemple Brevo).
- Quiz : enregistrer les réponses et le résultat, et les envoyer à Rebecca par mail.

## Espace d'administration

Un espace protégé par mot de passe pour que Rebecca puisse, sans toucher au code :
- ajouter, modifier ou retirer un événement (photo, date, texte). S'il n'y en a aucun, la page affiche « Aucun événement prévu pour le moment » ;
- recevoir et **valider les avis** avant publication dans le carrousel. Le lien pour laisser un avis est envoyé par mail en fin de parcours ;
- modifier les tarifs et quelques textes clés.

Propose-moi la solution la plus simple à maintenir (CMS intégré à Next.js ou petit back-office).

## Déploiement

Le projet contient déjà un Dockerfile et une configuration de déploiement (`.k3s/`, `.gitlab-ci.yml`). Analyse-les, explique-moi comment le site est déployé aujourd'hui, puis guide-moi pour :
1. pousser le code sur mon dépôt GitHub `[LIEN DU DÉPÔT]` ;
2. le déployer sur mon serveur avec mon nom de domaine `[NOM DE DOMAINE]`, en HTTPS.
Ne me demande jamais de coller un mot de passe dans la conversation : utilise une clé SSH.

## Informations à compléter avant de commencer

- [LIEN CALENDLY]
- [LIEN STRIPE GRAND ORAL] et [LIEN STRIPE LEQ'FAM]
- [EMAIL DE CONTACT] (contact@lieben-eloquence.fr ou formationn@liebeneloquence.com ?)
- [BROCHURE] (PDF pour les écoles)
- [LIEN DU DÉPÔT] GitHub et [NOM DE DOMAINE]
- Code exact de la couleur brune
