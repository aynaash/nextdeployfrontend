# ---------- STAGE 1: Base ----------
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies needed by some node modules
RUN apk add --no-cache libc6-compat

# ---------- STAGE 2: Dependencies ----------
FROM base AS deps

# Copy package files first
COPY package.json yarn.lock ./

# Configure Yarn to use node_modules instead of PnP
RUN echo "nodeLinker: node-modules" > .yarnrc.yml

# Install Yarn Berry and dependencies
RUN corepack enable && \
    yarn set version stable && \
    yarn install --immutable
# ---------- STAGE 3: Builder ----------
FROM base AS builder

# First copy only the files needed for dependency installation
COPY --from=deps /app/ ./

# Then copy all other files
COPY . .
RUN corepack enable 
# set yarn version to stable 
RUN yarn set version stable 
# Install production dependencies
# Build the Next.js application 
# Build the application
RUN yarn build

# ---------- STAGE 4: Runner ----------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
