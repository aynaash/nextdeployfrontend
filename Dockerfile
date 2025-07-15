# Stage 1 — Builder
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install system deps: required for some packages (like sharp), and git

# Enable and set exact Yarn version for reproducibility
RUN corepack enable && corepack prepare yarn@4.9.1 --activate

# Configure Yarn for speed and node_modules mode
RUN echo 'nodeLinker: "node-modules"\n\
enableGlobalCache: true\n\
compressionLevel: 0\n\
httpTimeout: 600000' > .yarnrc.yml

# Copy dependency files first for cache efficiency
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/

# Install dependencies (use immutable for strict lockfile validation)
RUN yarn install --immutable

# Copy the full source after deps installed
COPY . .

# Environment for production build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build app
RUN yarn build && yarn cache clean

# ─────────────────────────────────────────────
# Stage 2 — Runtime
# ─────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Add non-root user
RUN addgroup -S -g 1001 nodejs && \
    adduser -S -u 1001 -G nodejs nextjs

# Copy built output
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Remove this line as it's not needed in standalone mode:
# COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Remove the server.js copy line unless you specifically need it
# COPY --from=builder --chown=nextjs:nodejs /app/server.js ./server.js

# Install curl for health checks

USER nextjs
EXPOSE 3000

# For standalone mode, the server is already in the .next/standalone directory
CMD ["node", "server.js"]
