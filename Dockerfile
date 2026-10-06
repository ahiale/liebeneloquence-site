# Image de production du site Lieben Éloquence (Next.js en mode « standalone »)

# ---------- Dépendances ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Build ----------
FROM node:22-alpine AS builder
WORKDIR /app
# Identifiant Umami (mesure d'audience), injecté au build. Vide = pas de statistiques.
ARG UMAMI_WEBSITE_ID=""
ENV UMAMI_WEBSITE_ID=$UMAMI_WEBSITE_ID
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- Exécution ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATA_DIR=/data

RUN addgroup -S leq && adduser -S leq -G leq && mkdir -p /data && chown leq:leq /data

COPY --from=builder --chown=leq:leq /app/.next/standalone ./
COPY --from=builder --chown=leq:leq /app/.next/static ./.next/static
COPY --from=builder --chown=leq:leq /app/public ./public
# Brochures jointes aux mails de devis
COPY --from=builder --chown=leq:leq /app/assets ./assets

USER leq
EXPOSE 3000
# Données des formulaires (newsletter, quiz, demandes) : volume persistant
VOLUME ["/data"]

CMD ["node", "server.js"]
