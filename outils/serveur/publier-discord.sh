#!/bin/sh
# Publications automatiques du robot LEQ sur Discord (planning Google Sheets et opportunités).
# Installé sur le serveur dans /opt/leq/publier-discord.sh et lancé toutes les 5 minutes par cron :
#   */5 * * * * /opt/leq/publier-discord.sh
# La clé est lue dans /opt/leq/.env, jamais affichée. Journal : /var/log/leq-discord.log (1000 dernières lignes).
CLE=$(grep '^DATA_API_KEY=' /opt/leq/.env | cut -d= -f2-)
JOURNAL=/var/log/leq-discord.log
REPONSE=$(curl -sS -m 240 -X POST -H "X-LEQ-Cle: $CLE" https://liebeneloquence.com/api/discord/publier 2>&1)
case "$REPONSE" in
  *'"publies":[]'*'"erreurs":[]'*) ;; # rien à publier : on n'encombre pas le journal
  *) echo "$(date '+%F %T') $REPONSE" >> "$JOURNAL" ;;
esac
tail -n 1000 "$JOURNAL" > "$JOURNAL.tmp" 2>/dev/null && mv "$JOURNAL.tmp" "$JOURNAL"
