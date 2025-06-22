# ─────────────────────────────────────────────
# Stage 1 — Dependency Installation
# ─────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Install only essential system dependencies
RUN apk add --no-cache libc6-compat

# Enable Corepack and pin exact Yarn version
RUN corepack enable
RUN yarn set version 4.9.1

# Copy only files needed for dependency installation
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/

# Install dependencies
RUN yarn install --immutable

# ─────────────────────────────────────────────
# Stage 2 — Builder
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# First enable Corepack and set Yarn version (same as deps stage)
RUN corepack enable
RUN yarn set version 4.9.1

# Copy installed dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn
COPY --from=deps /app/.yarnrc.yml .

# Copy all source files
COPY . .

# Environment for production build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN yarn build

# Prune dev dependencies for production
RUN yarn workspaces focus --production

# ─────────────────────────────────────────────
# Stage 3 — Runtime
# ─────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S -G nodejs nextjs

# Copy production dependencies and build artifacts
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Minimal health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:3000 >/dev/null || exit 1

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
