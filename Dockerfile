
# syntax=docker.io/docker/dockerfile:1
### ---- BASE IMAGE ---- ###
FROM node:22-slim AS base
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat bash

### ---- DEPENDENCIES ---- ###
FROM base AS deps

# Copy only the files needed to determine lockfile
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Install the appropriate package manager deps
RUN bash -c '\
  if [ -f yarn.lock ]; then \
    echo "📦 Using Yarn"; yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    echo "📦 Using npm"; npm ci; \
  elif [ -f pnpm-lock.yaml ]; then \
    echo "📦 Using pnpm"; corepack enable pnpm && pnpm install --frozen-lockfile; \
  else \
    echo "⚠️  No lockfile found. Skipping install." && mkdir node_modules; \
  fi'

### ---- BUILDER ---- ###
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Optional: Add build script fallback
RUN bash -c '\
  if [ -f yarn.lock ]; then \
    yarn build; \
  elif [ -f package-lock.json ]; then \
    npm run build; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm run build; \
  else \
    echo "⚠️  No lockfile found. Skipping build."; \
  fi'

### ---- RUNTIME ---- ###
FROM base AS runner

# Setup app directory and user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
WORKDIR /app

# Copy only needed files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Handle both standalone and traditional builds safely
RUN bash -c '\
  mkdir -p .next && \
  if [ -d /app/.next/standalone ]; then \
    echo "🚀 Using standalone build"; \
    cp -r /app/.next/standalone/* ./ && \
    cp -r /app/.next/static ./public/static; \
  else \
    echo "📦 Using traditional .next build"; \
    mkdir -p .next && \
    cp -r /app/.next/* .next/; \
  fi'
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
