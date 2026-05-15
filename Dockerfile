# ── Backend Dockerfile ──────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias primero (cache de capas)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copiar código fuente
COPY src/ ./src/

EXPOSE 3000

CMD ["node", "src/index.js"]


