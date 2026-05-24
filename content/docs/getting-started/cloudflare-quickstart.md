---
title: Cloudflare Quickstart
lede: Deploy a Next.js app to Cloudflare Workers + R2. Same flow as every other target — `nextdeploy init`, set your env and secrets, `nextdeploy ship`.
status: in-progress
sourceRef: cli/cmd/init.go, cli/cmd/ship.go, cli/internal/serverless/cloudflare*.go
related:
  - title: Cloudflare Overview
    href: /docs/cloudflare/overview
  - title: Workers Runtime
    href: /docs/cloudflare/workers
  - title: Bindings
    href: /docs/cloudflare/bindings
---

## The flow

NextDeploy has one universal flow, regardless of where you deploy:

1. `nextdeploy init` — pick your deployment platform.
2. Set the env and secrets that platform needs.
3. `nextdeploy ship` — build and deploy.

For Cloudflare, that's: pick **Serverless (Cloudflare Workers + R2)** at the prompt, give it a Cloudflare API token and your app's secrets, then ship.

## Prerequisites

A Cloudflare account, an API token with Workers + R2 + DNS scopes (DNS only if you want a custom domain), and a domain on Cloudflare or willingness to use `*.workers.dev`.

## 1. Initialize

Run `nextdeploy init` and choose **Serverless (Cloudflare Workers + R2)**. NextDeploy writes a `nextdeploy.yml` with `target_type: cloudflare`, a sensible compatibility date, and a `cloudflare` block where you can declare R2 buckets, KV, and other bindings.

## 2. Configure Cloudflare credentials + app secrets

Set your Cloudflare API token and account ID in the environment NextDeploy reads (or in `nextdeploy.yml`). Then load any runtime env your app needs:

```sh
nextdeploy secrets set DATABASE_URL=...
nextdeploy secrets set NEXTAUTH_SECRET=...
# or bulk-load from a .env file
nextdeploy secrets load .env.production
```

Secrets become Worker secrets — they're not bundled into the script.

## 3. Ship

```sh
nextdeploy ship
```

For Cloudflare, `ship` runs the build with the webpack path (required by the Workers runtime), uploads static assets to R2, reconciles bindings declared in `nextdeploy.yml`, and deploys the Worker. Subsequent ships only upload changed assets.

## 4. Tail logs

```sh
nextdeploy logs --follow
```

Wraps the `wrangler tail`-style live log stream from your Worker.

## 5. Iterate

Edit code, edit `nextdeploy.yml`, run `nextdeploy ship` again. Bindings are declarative — adding an R2 bucket or KV namespace to the yaml and re-shipping reconciles it. Removing one from the yaml detaches it from the Worker (the underlying resource is preserved; use `nextdeploy destroy` if you actually want it gone).

## What if your app isn't supported on Workers yet?

Some Next.js features don't work on the Workers runtime — see [limitations](/docs/reference/limitations) and the [roadmap](/docs/roadmap). The same `nextdeploy.yml` can target AWS instead — re-run `nextdeploy init` and pick AWS, or edit `target_type` directly.
