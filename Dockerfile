# Stage 1: Builder - Install dependencies and build the app
FROM node:20-alpine AS builder

# 1. Update and install system dependencies in a single layer
# 2. Include only essential build tools
RUN apk update --no-cache && \
    apk upgrade --no-cache && \
    apk add --no-cache --virtual .build-deps \
    libc6-compat \
    git \
    python3 \
    make \
    g++ \
    && corepack enable \
    && yarn set version stable

WORKDIR /app

# Configure Yarn for optimal performance
RUN echo 'nodeLinker: "node-modules"\n\
enableGlobalCache: true\n\
compressionLevel: 0\n\
httpTimeout: 600000' > .yarnrc.yml

# Copy package files first for better caching
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/

# Install dependencies with cache mount
RUN --mount=type=cache,target=/root/.yarn/berry/cache \
    yarn install --immutable --inline-builds

# Copy remaining files
COPY . .

# Build environment
ARG NEXT_PUBLIC_APP_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build and prune dev dependencies
RUN yarn build && \
    yarn cache clean && \
    apk del .build-deps && \
    rm -rf /var/cache/apk/*

# Stage 2: Production Runner
FROM node:20-alpine
WORKDIR /app

# Production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user and required directories
RUN addgroup -S -g 1001 nodejs && \
    adduser -S -u 1001 -G nodejs nextjs && \
    mkdir -p /app/.next/cache && \
    chown nextjs:nodejs /app/.next/cache

# Copy built assets from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Configure health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -q -O /dev/null http://localhost:3000/api/health || exit 1

# Runtime configuration
USER nextjs
EXPOSE 3000
VOLUME /app/.next/cache

# Use node directly (no need for process manager in simple cases)
CMD ["node", "server.js"]
