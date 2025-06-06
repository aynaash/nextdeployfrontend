# ---------- STAGE 1: Build ----------
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN corepack enable && corepack prepare yarn@4.9.1 --activate
RUN yarn install --frozen-lockfile

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# Run the build during the build phase
#ARG DOPPLER_TOKEN
RUN  npm run build
# ---------- STAGE 2: Runtime ----------
FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN useradd -m nextjs && chown -R nextjs:nextjs /app
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", "server.js"]
