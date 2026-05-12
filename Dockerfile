# syntax=docker/dockerfile:1.6

# ---------- Stage 1: install deps ----------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./

# React 19 + several Radix packages still publish peer ranges that resolve as
# "incompatible" in npm's strict resolver. --legacy-peer-deps prevents the
# build from aborting on those false-positive peer warnings.
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps --no-audit --no-fund; \
    else \
      npm install --legacy-peer-deps --no-audit --no-fund; \
    fi

# ---------- Stage 2: build ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# ---------- Stage 3: runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Default writable folder for leads.json / app-settings.json inside the container.
# Override at runtime by setting LEADS_DATA_DIR in docker-compose / Hostinger env.
ENV LEADS_DATA_DIR=/app/data

# wget is used by the docker-compose healthcheck below.
RUN apk add --no-cache wget \
    && addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Pre-create the data directory the app writes to and give the nextjs user
# ownership, so the very first lead submission never fails on EACCES.
RUN mkdir -p /app/data \
    && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
