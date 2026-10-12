# Serveur Discord LEQ'FAM

Le robot **LEQ** (application Discord 1559182612637950053) a les droits d'administration sur le serveur « Serveur Lieben Eloquence ». Son token est uniquement sur le serveur web (`/opt/leq/.env`, variable `DISCORD_BOT_TOKEN`).

## Qui voit quoi

| Espace | Visiteurs | Membres (LeqOra) | Ambassadeurs (LeqAmbassadeur) | Admins |
| --- | --- | --- | --- | --- |
| 📌 Accueil & informations | lecture | lecture | lecture | tout |
| 👥 LeqFam et 📹 LeqAteliers | rien | lecture et écriture (lecture seule pour défis, ressources, organisations internationales, Grand Prix, programme des lives : on répond dans les fils) | idem | tout |
| 🌟 LeqAmbassadeurs | rien | rien | lecture et écriture | tout |
| 🪿 Staff | rien | rien | rien | tout |

- **LeqOra** = membre de la LEQ'FAM. Donné automatiquement aux abonnés (quand le paiement sera branché), à la main pour les partenaires. Le robot ne retire que les rôles qu'il a donnés lui-même.
- **LeqAmbassadeur** = ambassadeurs, donné à la main.

## Refaire ou modifier la mise en place

Textes, salons et permissions sont décrits dans `configurer-serveur.mjs`. Après une modification :

```powershell
node communication/discord/generer-bannieres.mjs
scp communication/discord/bannieres/*.png root@169.58.187.153:/opt/leq/discord/bannieres/
ssh root@169.58.187.153 "cd /opt/leq && for f in discord/bannieres/*.png; do docker cp `$f `$(docker compose ps -q site):/tmp/bannieres/; done"
Get-Content communication/discord/configurer-serveur.mjs | ssh root@169.58.187.153 "cd /opt/leq && docker compose exec -T site node --input-type=module -"
```

Le script peut être relancé sans risque : rien n'est dupliqué, les messages du robot sont remplacés. Discord limite à 2 changements de nom ou de sujet par salon toutes les 10 minutes : en cas d'erreur « limite Discord », relancer plus tard.

Les robots ne peuvent pas modifier le **Guide du serveur** (étapes proposées aux nouveaux arrivants) : cela se fait dans Discord, *Paramètres du serveur → Onboarding / Guide du serveur*.
