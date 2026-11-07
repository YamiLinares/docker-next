# syntax=docker/dockerfile:1

# Next.js 16 requiere Node.js >= 20.9, por eso se usa la LTS 24 en lugar de 18.
ARG NODE_IMAGE=node:24-alpine

# ---------- Etapa 1: dependencias ----------
# Solo se copian los manifiestos para que esta capa quede en caché
# mientras package.json y package-lock.json no cambien.
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Etapa 2: compilación ----------
FROM ${NODE_IMAGE} AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- Etapa 3: imagen de producción ----------
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# La salida standalone ya incluye server.js y los módulos mínimos;
# public y .next/static se copian aparte porque Next.js no los incluye.
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Usuario sin privilegios incluido en la imagen oficial de Node.js.
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
