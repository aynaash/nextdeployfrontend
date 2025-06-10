# Stage 1: Builder
FROM node:20-alpine AS builder

# Install system dependencies
RUN apk add --no-cache libc6-compat git
RUN corepack enable && yarn set version stable

WORKDIR /app

# Configure Yarn 4 zero-installs
RUN echo 'nodeLinker: "node-modules"' > .yarnrc.yml

# Copy Yarn files first for better caching
COPY .yarn/ ./.yarn/
COPY .yarnrc.yml package.json yarn.lock ./

# Install dependencies
RUN yarn install --immutable

# Copy the rest of the files
COPY . .

# Build the application
RUN yarn build

# Stage 2: Runner (production)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Optional: If you need .yarn/cache for zero-installs in production
# COPY --from=builder --chown=nextjs:nodejs /app/.yarn/cache ./.yarn/cache
# COPY --from=builder --chown=nextjs:nodejs /app/.yarnrc.yml ./

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
