---
title: VPS Quickstart
lede: Deploy a Next.js app to your own Linux server. Same flow as every other target — `nextdeploy init`, set your env and secrets, `nextdeploy ship`.
status: draft
sourceRef: cli/cmd/init.go, cli/cmd/ship.go, cli/cmd/secrets.go
related:
  - title: VPS Overview
    href: /docs/vps/overview
  - title: Daemon
    href: /docs/vps/daemon
  - title: Caddy & TLS
    href: /docs/vps/caddy
---

## The flow

NextDeploy has one universal flow, regardless of where you deploy:

1. `nextdeploy init` — pick your deployment platform.
2. Set the env and secrets that platform needs.
3. `nextdeploy ship` — build and deploy.

For VPS, that's: pick **VPS (Virtual Private Server - SSH)** at the prompt, fill in host/SSH details + secrets, then ship.

## Prerequisites

A Linux VPS reachable over SSH, a domain pointed at the server's IP (for TLS), and Node.js locally for the build.

## 1. Initialize

Run `nextdeploy init` in your Next.js project. You'll be asked where to deploy — choose **VPS (Virtual Private Server - SSH)**. NextDeploy detects your package manager and Next.js version, then writes a `nextdeploy.yml` scaffolded for VPS.

## 2. Configure host + secrets

Edit `nextdeploy.yml` to point at your server (host, SSH key, username, port) and set your domain. Then load the env your app needs:

```sh
nextdeploy secrets set DATABASE_URL=...
nextdeploy secrets set NEXTAUTH_SECRET=...
# or bulk-load from a .env file
nextdeploy secrets load .env.production
```

Secrets are encrypted locally and synced to the daemon on the server — never committed.

## 3. Ship

```sh
nextdeploy ship
```

`ship` runs the build flow itself (target-aware `next build`), packages a deployment tarball, uploads it over SSH, and hands off to `nextdeployd` on the server, which performs an atomic port swap behind Caddy. No more separate `build` step — `ship` does it all.

## 4. Verify

```sh
nextdeploy status
nextdeploy logs --follow
```

Then hit your domain. After the first deploy, `dns.md` is generated with the DNS records you need to point at the server.

## Common first-deploy issues

- Cert pending — Caddy needs DNS to resolve before it can issue. Wait for propagation, then `nextdeploy logs --follow` will show the issuance.
- Ports 80/443 closed by firewall — open them on the VPS.
- SSH key permissions — must be `0600` locally, key must be in the server's `authorized_keys`.
