# NextDeploy Frontend

Marketing site, documentation, and install-script delivery for
**[NextDeploy](https://github.com/aynaash/NextDeploy)** — the open-source
deployment tool for Next.js.

Live at **[nextdeploy.org](https://nextdeploy.org)**.

## Stack

- Next.js 16 (App Router) on React 19
- Tailwind CSS v4 + shadcn/ui
- Bun for install + dev
- MDX-flavored Markdown for docs (`content/docs/`)

## Develop

```bash
bun install
bun dev
```

Open <http://localhost:3000>. Hot reload covers pages, components, and
docs. To produce a static build:

```bash
bun run build
bun run start
```

## Install scripts (important)

The CLI install one-liner that ships in the engine README points at this
site:

- `public/install.sh`  — POSIX installer for macOS and Linux
- `public/install.bat` — PowerShell-driven installer for Windows
- `public/daemon.sh`   — `nextdeployd` bootstrap for VPS targets

These files are served verbatim from `/install.sh` etc. They resolve the
latest GoReleaser-built archive from the engine repo and verify the
SHA-256 checksum before installing. Edit them carefully — a broken file
here breaks `curl | bash` for every new user.

## Layout

```
app/                 Next.js routes (marketing pages + /docs)
components/          UI primitives + page sections
content/docs/        Markdown source for the docs site
public/              Static assets, including the install scripts
lib/                 Helpers (MDX loader, site config, utils)
nextdeploy.yml       Self-hosted: this site is deployed with NextDeploy
```

## Deploy

This site dogfoods NextDeploy. The `nextdeploy.yml` at the repo root
points at the production Cloudflare target, and pushing to `main`
triggers `nextdeploy ship` from CI.

## Editing docs

Docs are plain Markdown in `content/docs/`. Frontmatter sets title,
order, and section. Adding a file makes it appear in the sidebar
automatically.

## Links

- Engine: [aynaash/NextDeploy](https://github.com/aynaash/NextDeploy)
- Issues: file against the engine repo
- Twitter/X: [@hersiyussuf](https://x.com/hersiyussuf)

## License

MIT.
