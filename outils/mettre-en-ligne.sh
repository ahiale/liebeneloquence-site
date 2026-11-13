#!/bin/sh
# Mise en ligne directe sur le serveur, sans GitHub Actions (à utiliser quand GitHub Actions est indisponible).
# Fait la même chose que .github/workflows/deploy.yml : envoie le code (dernier commit), construit l'image
# du site sur le serveur, la démarre, met à jour la configuration du serveur (docker-compose.yml, Caddyfile).
# Utilisation (Git Bash, depuis le dossier du projet, après un commit) :  sh outils/mettre-en-ligne.sh
# Il faut la clé SSH du serveur sur cet ordinateur. Les secrets restent dans /opt/leq/.env, jamais envoyés.
set -e
SERVEUR=root@169.58.187.153
IMAGE=ghcr.io/ahiale/liebeneloquence-site:latest

echo "Envoi du code ($(git log --oneline -1))…"
git archive --format=tar HEAD | ssh -o BatchMode=yes "$SERVEUR" 'rm -rf /opt/leq/build && mkdir -p /opt/leq/build && tar -x -C /opt/leq/build'

echo "Construction et démarrage sur le serveur (3 à 5 minutes)…"
ssh -o BatchMode=yes "$SERVEUR" "set -e
  cp /opt/leq/build/deploy/docker-compose.yml /opt/leq/build/deploy/Caddyfile /opt/leq/
  docker build -q -t $IMAGE /opt/leq/build
  cd /opt/leq
  docker compose up -d --remove-orphans
  docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile || true
  docker image prune -f >/dev/null
  rm -rf /opt/leq/build"
echo "En ligne."
