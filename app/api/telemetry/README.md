# Telemetry ingest — activation

Powers the public "🚀 N apps shipped with NextDeploy" hero counter. Reuses the
existing **Neon Postgres + Drizzle** setup (`@/lib/db`) — no new database.

Files:

- `route.ts` — `POST /api/telemetry`: Ed25519-verifies and records ship events.
- `../stats/route.ts` — `GET /api/stats`: cached `{ shipped }` count for the hero.
- `../../../components/sections/ship-count.tsx` — drop-in `<ShipCount />`.
- table `ship_events` added to `drizzle/schema/schema.ts`.

The ingest returns `503 telemetry not configured` until `TELEMETRY_PUBLIC_KEY`
is set, so merging this is safe.

## 1. Migrate the new table

```bash
yarn drizzle:generate     # creates the ship_events migration
yarn drizzle:migrate      # drizzle-kit push to the DB in drizzle.config.ts
```

(For prod, run the generated migration against your Neon database.)

## 2. Set the public key

It's the Ed25519 **public** key from the nextdeploy keypair — safe to expose.
Add to the deployment env (and `.env.local` for dev):

```
TELEMETRY_PUBLIC_KEY=s5H7U8HbMsxMGGPoIKnSg0zMq3y5W2LPjS9VnoimNxU=
```

> The matching **private** key is a GitHub Actions secret (`TELEMETRY_SIGNING_KEY`)
> in the **nextdeploy** repo — only official release binaries can sign events.

## 3. Wire the counter into the hero

`<ShipCount />` is self-contained (fetches `/api/stats`, animates a count-up).
Drop it into `components/sections/hero-landing.tsx`:

```tsx
import { ShipCount } from '@/components/sections/ship-count';
// ...
<ShipCount className="text-sm text-muted-foreground" />
```

## 4. Add a rate-limit rule

A Cloudflare Rate Limiting rule on `/api/telemetry` (e.g. 30 req/min/IP) backstops
volume. Signature verification stops forgery; rate limiting caps a valid build
being looped.

## Verify

With a signed nextdeploy release live, run `nextdeploy ship` once and confirm a
row lands (`select count(*) from ship_events`) and the hero ticks up.

> Threat model is best-effort — see nextdeploy `shared/telemetry/README.md`. The
> signature stops scripted spoofing; it is not unbreakable against someone who
> extracts the key from the public CLI binary.
