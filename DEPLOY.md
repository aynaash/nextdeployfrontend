# Deploying nextdeploy.org to Cloudflare Workers (OpenNext)

The site is configured for Cloudflare via the **OpenNext** adapter. Config is already in
the repo: `wrangler.jsonc`, `open-next.config.ts`, `.dev.vars`, and `cf:*` npm scripts.
You run the build + deploy locally (the build is memory-heavy). Wrangler is already
authenticated as `caynaashow@gmail.com`.

---

## 1. Switch Yarn to the node-modules linker (one time, required)

OpenNext's bundler can't resolve modules under Yarn PnP. Switch the linker and reinstall:

```bash
yarn config set nodeLinker node-modules
yarn install
```

This creates a real `node_modules/`. Your `next dev` still works exactly the same.

## 2. Install the adapter

```bash
yarn add -D @opennextjs/cloudflare@latest wrangler@latest
```

## 3. Resolve Node-only dependencies (expect 1–2 here)

The Workers runtime isn't Node. The known offender is **`nodemailer`** (`lib/email.ts`) —
it uses `node:net`/`node:tls` and won't run on Workers. Options:
- If email isn't used by any rendered route, the build still succeeds (it only fails if a
  request path imports it). Verify with the build in step 4.
- Otherwise, swap nodemailer for an HTTP email API (Resend/Cloudflare Email) or guard it
  behind a route that isn't deployed.

Other Node deps (better-auth, stripe, drizzle, `@neondatabase/serverless`) work with the
`nodejs_compat` flag, which is already set in `wrangler.jsonc`.

## 4. Build locally to validate (no deploy yet)

```bash
yarn cf:build
```

Fix any "module not found / unsupported" errors it reports (usually a Node-only import).
Re-run until it completes. Output lands in `.open-next/`.

## 5. Set secrets (after the first deploy creates the Worker)

`NOTION_DATABASE_ID` is already a public var in `wrangler.jsonc`. Set the secrets:

```bash
wrangler secret put NOTION_TOKEN          # paste the integration token (rotate the old one!)
wrangler secret put REVALIDATE_SECRET     # paste the value from your .env.local
```

(If the Worker doesn't exist yet, run `wrangler deploy --dry-run` once, or set them right
after the first `yarn cf:deploy`.)

## 6. Deploy

```bash
yarn cf:deploy
```

This builds and deploys. With the `routes` block in `wrangler.jsonc`, it binds
**nextdeploy.org** + **www** as custom domains — this requires the `nextdeploy.org` zone to
already exist in this Cloudflare account.

> **Test on workers.dev first (recommended):** comment out the `routes` block in
> `wrangler.jsonc`, run `yarn cf:deploy`, open the `https://nextdeploy.<subdomain>.workers.dev`
> URL it prints, confirm it works, then uncomment `routes` and redeploy to go live.

## 7. Point the domain (if the zone isn't in Cloudflare yet)

If `nextdeploy.org` isn't already a Cloudflare zone: add the site in the Cloudflare
dashboard, update the registrar's nameservers to Cloudflare's, then re-run `yarn cf:deploy`.

## 8. Wire the publish webhook (optional)

Content is revalidated every 60s. To refresh instantly after editing in Notion:

```bash
curl -X POST "https://nextdeploy.org/api/revalidate?secret=$REVALIDATE_SECRET&path=/docs"
```

Trigger it from a Notion automation/button when you publish.

---

## Quick reference

| Task | Command |
|------|---------|
| Build for CF (validate) | `yarn cf:build` |
| Local CF preview | `yarn cf:preview` |
| Build + deploy | `yarn cf:deploy` |
| Set a secret | `wrangler secret put NAME` |
| Live logs | `wrangler tail nextdeploy` |
| Rollback | `wrangler rollback` |
| Generate binding types | `yarn cf:typegen` |
