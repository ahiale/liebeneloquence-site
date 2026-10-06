# Mise en ligne de liebeneloquence.com

Ce guide se suit une seule fois, dans l'ordre. Ensuite, chaque modification envoyée sur GitHub est mise en ligne automatiquement en 3 à 5 minutes.

**Règle d'or :** aucun mot de passe, aucune clé privée ne doit être collé dans une conversation, un mail ou un fichier envoyé sur GitHub. Ils vont uniquement dans le fichier `.env` du serveur ou dans les « Secrets » de GitHub.

## Comment ça marche

```
Vous (ou Claude) modifiez le site
        │  git push
        ▼
GitHub Actions : construit l'image du site et la publie (ghcr.io)
        │  connexion SSH avec une clé dédiée
        ▼
Serveur Contabo 169.58.187.153 (/opt/leq)
  ├─ caddy     HTTPS automatique, reçoit les visiteurs
  ├─ site      le site Next.js            → liebeneloquence.com
  ├─ umami     statistiques sans cookie   → stats.liebeneloquence.com
  └─ (plus tard) le SaaS                  → app.liebeneloquence.com
```

---

## Étape 1 : votre clé SSH personnelle

Dans le terminal PowerShell de VS Code :

```powershell
ssh-keygen -t ed25519 -C "formationn@liebeneloquence.com"
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh root@169.58.187.153 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
ssh root@169.58.187.153
```

La deuxième commande demande le mot de passe du serveur une dernière fois. Si la troisième vous connecte sans mot de passe, c'est gagné : changez alors le mot de passe du serveur avec la commande `passwd`.

## Étape 2 : préparer le serveur (une seule fois)

Une fois connectée au serveur (`ssh root@169.58.187.153`) :

```bash
# Mises à jour et pare-feu
apt update && apt upgrade -y
apt install -y ufw
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw --force enable

# Docker
curl -fsSL https://get.docker.com | sh

# Dossier du site
mkdir -p /opt/leq && cd /opt/leq
```

Créez le fichier de configuration secrète :

```bash
nano /opt/leq/.env
```

Collez le contenu de `deploy/.env.example`, puis remplissez :

- `UMAMI_DB_PASSWORD` et `UMAMI_APP_SECRET` : lancez deux fois `openssl rand -hex 32` dans un autre terminal du serveur et collez chaque résultat ;
- `SMTP_PASSWORD` : voir l'étape 6 (vous pouvez le laisser vide pour l'instant).

Enregistrez avec `Ctrl+O`, `Entrée`, puis quittez avec `Ctrl+X`.

## Étape 3 : la clé de déploiement pour GitHub

Toujours sur le serveur, créez une clé réservée à GitHub :

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github-deploy -N "" -C "github-deploy"
cat ~/.ssh/github-deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github-deploy
```

La dernière commande affiche la clé privée (de `-----BEGIN` à `-----END ... KEY-----`). Copiez-la **directement** dans GitHub (étape 5), nulle part ailleurs.

## Étape 4 : le nom de domaine chez Hostinger

Dans Hostinger : Domaines → liebeneloquence.com → DNS / Nameservers. Supprimez les éventuels enregistrements A existants (page de parking), puis ajoutez :

| Type | Nom | Valeur | TTL |
| --- | --- | --- | --- |
| A | @ | 169.58.187.153 | 3600 |
| A | www | 169.58.187.153 | 3600 |
| A | stats | 169.58.187.153 | 3600 |

**Ne touchez pas** aux enregistrements MX, TXT (SPF, DKIM, DMARC) et CNAME de Google Workspace : ce sont eux qui font fonctionner vos mails.

Plus tard, pour le SaaS, il suffira d'ajouter `A app 169.58.187.153`.

## Étape 5 : GitHub

Sur https://github.com/ahiale/liebeneloquence-site → Settings :

**Secrets and variables → Actions → onglet « Secrets »** (New repository secret) :

| Nom | Valeur |
| --- | --- |
| `SSH_HOST` | `169.58.187.153` |
| `SSH_USER` | `root` |
| `SSH_PRIVATE_KEY` | la clé privée affichée à l'étape 3 |

**Même page, onglet « Variables »** :

| Nom | Valeur |
| --- | --- |
| `DEPLOY_ENABLED` | `true` |
| `UMAMI_WEBSITE_ID` | à remplir à l'étape 7 |

Puis lancez une mise en ligne : onglet **Actions → Déploiement → Run workflow**. Après 3 à 5 minutes, https://liebeneloquence.com affiche le site, en HTTPS.

## Étape 6 : les mails automatiques (Google Workspace)

1. Connectez-vous à Google avec `formationn@liebeneloquence.com`.
2. Activez la validation en 2 étapes si ce n'est pas fait : https://myaccount.google.com/security
3. Créez un mot de passe d'application : https://myaccount.google.com/apppasswords (nom : « Site LEQ »). Google affiche 16 caractères.
4. Sur le serveur : `nano /opt/leq/.env`, collez ces 16 caractères (sans espaces) après `SMTP_PASSWORD=`, enregistrez.
5. Redémarrez le site : `cd /opt/leq && docker compose up -d`.
6. Testez en remplissant le formulaire de contact du site.

Si l'option « mots de passe d'application » n'apparaît pas, c'est que l'administration Google Workspace la bloque : Admin Google → Sécurité → Validation en 2 étapes → autoriser.

## Étape 7 : les statistiques (Umami)

1. Ouvrez https://stats.liebeneloquence.com et connectez-vous avec `admin` / `umami`.
2. **Changez immédiatement ce mot de passe** (Paramètres → Profil).
3. Paramètres → Sites web → Ajouter : nom « Lieben Éloquence », domaine `liebeneloquence.com`.
4. Copiez l'**ID du site** affiché, collez-le dans la variable GitHub `UMAMI_WEBSITE_ID`, puis relancez **Actions → Déploiement → Run workflow**.

## Au quotidien

- **Modifier un événement, un avis ou un tarif :** voir `content/LISEZMOI.md`, ou demandez à Claude. Après `git push`, le site se met à jour seul.
- **Voir les données des formulaires** (sur le serveur) :
  ```bash
  cd /opt/leq
  docker compose exec site cat /data/newsletter.jsonl
  docker compose exec site cat /data/quiz.jsonl
  docker compose exec site cat /data/demandes.jsonl
  docker compose exec site cat /data/liste-attente.jsonl
  ```
- **Voir les erreurs du site :** `docker compose logs site --tail 100`

## Et le SaaS ?

Il s'ajoutera sur le même serveur : un enregistrement DNS `app`, un service `app` dans `deploy/docker-compose.yml` et un bloc `app.liebeneloquence.com` dans `deploy/Caddyfile` (déjà préparés en commentaire). Caddy obtiendra son certificat HTTPS tout seul. Prévoir au moins 4 Go de mémoire sur le serveur à ce moment-là.
