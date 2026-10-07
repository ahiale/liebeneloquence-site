# Travailler sur le site en autonomie

Le cycle est toujours le même : **modifier → vérifier en local → envoyer sur GitHub**. L'envoi déclenche la mise en ligne automatique.

Toutes les commandes se tapent dans le terminal de VS Code (menu *Terminal → Nouveau terminal*), ouvert dans le dossier `leqsaas-main`.

## 1. Modifier

| Je veux changer… | Fichier |
| --- | --- |
| Un événement (ajout, date, prix, lien Stripe, brouillon) | `content/evenements.json` |
| Les avis | `content/avis.json` |
| Les prix et le contenu des packs | `content/tarifs.json` |
| Un texte de page | voir `OU-MODIFIER-LES-TEXTES.md` |
| Email, Calendly, liens Stripe, réseaux sociaux | `src/config/site.ts` |

Les fichiers `content/*.json` sont expliqués dans `content/LISEZMOI.md`. Attention aux virgules et aux guillemets : une virgule oubliée empêche le site de se construire (et donc de se mettre en ligne).

## 2. Vérifier en local (recommandé)

```powershell
npm run dev
```

Ouvrez http://localhost:3000 : le site s'affiche avec vos modifications et se recharge à chaque enregistrement. `Ctrl + C` dans le terminal pour arrêter.

Pour être sûre que tout se construit comme en production :

```powershell
npm run build
```

S'il y a une erreur, le message indique le fichier et la ligne.

## 3. Envoyer en ligne

```powershell
git add -A
git commit -m "Ajout de l'atelier du 12 novembre"
git push
```

Le message entre guillemets décrit ce que vous avez changé, en une phrase.

Sans terminal, c'est aussi possible depuis VS Code : icône **Contrôle de code source** (barre de gauche), écrire le message, **Valider**, puis **Synchroniser les modifications**.

## 4. Suivre la mise en ligne

Sur https://github.com/ahiale/liebeneloquence-site/actions :

- rond jaune : en cours (3 à 5 minutes) ;
- coche verte : en ligne, rechargez liebeneloquence.com ;
- croix rouge : rien n'a changé sur le site, l'ancienne version reste en ligne. Cliquez sur la ligne pour lire l'erreur, corrigez, puis recommencez l'étape 3.

## Revenir en arrière

Pour annuler le dernier envoi :

```powershell
git revert HEAD
git push
```

L'historique complet est visible avec `git log --oneline`.

## Les données des formulaires

**Le tableau de bord** `LEQ-donnees.xlsx` est dans le dossier `leqsaas-main` (celui qui contient le projet). Ouvrez-le avec **Microsoft Excel** (clic droit → *Ouvrir avec* → *Excel*) : sur cet ordinateur, le double-clic ouvre WPS Office, qui ne sait pas actualiser les données. Dans Excel, il se met à jour tout seul à l'ouverture, puis toutes les 5 minutes tant qu'il est ouvert. Pour forcer : *Données → Actualiser tout*.

| Onglet | Contenu |
| --- | --- |
| Tableau de bord | les chiffres clés, les profils du quiz, les 14 derniers jours en tableau et en graphique |
| Liste d'attente | une ligne par personne inscrite à LEQ'FAM |
| Fiches orateur | les personnes qui ont laissé prénom et email pour recevoir leur fiche |
| Quiz réalisés | chaque quiz terminé, anonyme (qu'il y ait eu une demande de fiche ou non) |
| Demandes | devis, Grand Oral, contact |
| Newsletter | les inscriptions à la newsletter |

Une même adresse email ne peut plus s'inscrire deux fois (liste d'attente, newsletter, fiche orateur) : le site affiche « déjà inscrite ». Les doublons d'avant ce blocage sont masqués dans le tableau de bord.

Si Excel affiche une barre jaune « Les connexions de données ont été désactivées », cliquez sur *Options → Activer ce contenu*.

**Ce fichier reste sur votre ordinateur** : il contient la clé d'accès aux données et des données personnelles. Ne l'envoyez pas, ne le mettez pas sur GitHub (il est exclu automatiquement). S'il est perdu ou supprimé, recréez-le :

```powershell
powershell -ExecutionPolicy Bypass -File outils\creer-tableau-de-bord.ps1
```

Pour un export ponctuel en CSV (sauvegarde, import ailleurs) :

```powershell
powershell -ExecutionPolicy Bypass -File outils\exporter-donnees.ps1
```

## Les modèles PowerPoint (ateliers et publications)

Dans `communication/` :

| Dossier | Contenu |
| --- | --- |
| `atelier/` | `LEQ-modele-atelier.pptx` : 12 diapositives 16:9 pour vos interventions |
| `publications/` | `LEQ-modeles-publications.pptx` : 9 publications 4:5 (1080 × 1350) et `logo-fun.png` |
| `instagram/` | le carrousel « le site est en ligne » |

**Le plus simple :** ouvrez le `.pptx`, dupliquez la diapositive qui vous intéresse (clic droit → *Dupliquer*), remplacez les textes. Pour exporter une publication en image : *Fichier → Exporter → PNG*.

**Polices.** Installez les polices du dossier `LEQ-maquette-v2/polices` (double-clic → *Installer*). Sur cet ordinateur, 18 graisses de SF Pro sont installées sous le même nom : certains logiciels (WPS Office notamment) affichent alors le texte normal en très gras. Ouvrez les modèles avec Microsoft PowerPoint (clic droit → *Ouvrir avec*). Si le texte reste trop gras : *Paramètres Windows → Personnalisation → Polices*, cherchez « SF Pro Display » et désinstallez les graisses inutiles (Black, Heavy, Thin, Ultralight, Light et leurs italiques) en gardant Regular, Medium, Semibold, Bold et Italic. Puis redémarrez PowerPoint.

**Canva.** *Créer un design → Importer* le fichier `.pptx`. Canva n'a pas SF Pro ni Relationship of Mélodrame : avec Canva Pro, importez-les dans le *Brand Kit* (*Marque → Polices*) ; sinon Canva les remplace par une police proche.

**Régénérer les modèles** (seulement si vous modifiez les scripts `.py`) :

```powershell
pip install python-pptx pillow qrcode
python communication/atelier/generer-modele.py
python communication/publications/generer-modeles.py
```

Attention : régénérer écrase le `.pptx`. Faites vos versions remplies dans une copie, pas dans le modèle.

## Sécurité

- Aucun mot de passe ni clé privée dans un fichier envoyé sur GitHub, un mail ou une conversation.
- Les secrets vivent uniquement dans `/opt/leq/.env` sur le serveur et dans *GitHub → Settings → Secrets*.
- Accès au serveur : `ssh root@169.58.187.153` (par clé, sans mot de passe). Détails dans `DEPLOIEMENT.md`.
