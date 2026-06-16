# NextDeploy — Notion "Content" Database Spec

This document fully specifies the Notion database that powers the NextDeploy docs +
guides site. An agent can create the database directly from this spec. **Property
names, types, and select options below are read verbatim by the site renderer
(`lib/notion/types.ts`) — do not rename them.**

The model is **one database**, not two. A single `Content` DB holds both deep
technical **Docs** and small **Guides**, discriminated by the `Kind` property.

---

## 0. Setup (one time)

1. Create an **internal integration** at <https://www.notion.so/my-integrations>; copy the secret → `NOTION_TOKEN`.
2. Create the database below (named **Content**); copy its id from the URL → `NOTION_DATABASE_ID`.
3. **Share the database with the integration** (`•••` → Connections → add it). Without this the API returns nothing.
4. Set a `REVALIDATE_SECRET` for the publish webhook (`POST /api/revalidate?secret=…`).

---

## 1. Database

- **Name:** `Content`
- **Type:** standard (table) database

---

## 2. Properties

Create these properties **exactly** (name + type). Matching is case/space-insensitive
but keep the canonical names below.

| Property | Type | Config / Options | Required | Used by | Purpose |
|----------|------|------------------|----------|---------|---------|
| **Title** | Title | — | yes | both | Page H1 / nav label |
| **Slug** | Text | unique, lowercase-kebab | yes | both | URL: `/docs/<slug>` or `/guides/<slug>`. If empty, derived from Title. |
| **Kind** | Select | `Doc`, `Guide` | yes | both | Picks route + template |
| **Status** | Select | `Draft`, `Review`, `Published`, `Archived` | yes | both | **Only `Published` renders** |
| **Section** | Select | `Getting Started`, `CLI`, `Targets`, `Security`, `Observability`, `Concepts` | Docs | Doc | Sidebar group |
| **Order** | Number | integer, default 0 | both | both | Sort within section / nav |
| **Parent** | Relation | → self (this DB), single | Docs | Doc | Hierarchy → nested sidebar tree |
| **Related** | Relation | → self (this DB), multi | optional | both | "See also" cross-links |
| **Summary** | Text | ≤160 chars | recommended | both | Meta description + card blurb |
| **Tags** | Multi-select | free (e.g. `Setup`, `SSH`, `Secrets`, `CI`) | optional | both | Search / filter |
| **Targets** | Multi-select | `VPS`, `AWS`, `Cloudflare` | optional | both | Filter docs by deploy target |
| **Difficulty** | Select | `Beginner`, `Intermediate`, `Advanced` | Guides | Guide | Badge |
| **Duration** | Text | e.g. `15 min` | Guides | Guide | Badge |
| **CLI version** | Select | e.g. `v0.8.x`, `v0.9.x` | optional | both | "Applies to" version |
| **Source** | URL | GitHub file link | optional | Doc | "View source" link |
| **Featured** | Checkbox | — | optional | both | Surface on landing/homepage |

> `Last edited time` is a Notion built-in (auto) — the renderer reads it for the
> "updated" line. No need to create it manually, but don't remove it.

### Select option colors (cosmetic, recommended)

- `Status`: Draft = gray, Review = yellow, Published = green, Archived = red
- `Difficulty`: Beginner = green, Intermediate = yellow, Advanced = red
- `Kind`: Doc = blue, Guide = green

---

## 3. Page body authoring conventions

The page **body** (blocks) is rendered into the codex/terminal UI. Author with normal
Notion blocks — the renderer maps them automatically:

| Notion block | Renders as |
|--------------|------------|
| Heading 1 / 2 / 3 | Section heading with `#` / `##` / `###` green prefix |
| **Numbered list** | **The step-by-step `Steps` flow** (numbered spine). One item = one step. |
| → numbered item whose body has a **single-line `bash`/`shell` code block** | That line becomes the step's `$ command` chip; remaining children become the step body |
| Bulleted list | Terminal-styled `›` list |
| Code block | Code module with hex line numbers + copy (set the language; caption → label) |
| Callout | Info/Warning/Success box — picked by callout **color or emoji**: green/✅ → success, yellow·orange·red / ⚠️🔥💀🚨 → warning, else → info (blue) |
| Quote | Green-rule blockquote |
| Toggle | Collapsible "explain deeper" |
| To-do | `[ ]` / `[x]` checklist |
| Image | Bordered figure (+ caption) |
| Divider | Terminal rule |

**Guides = numbered lists.** Because numbered lists become the `Steps` flow, every
guide should be authored primarily as a **numbered list of steps**, each step
containing a short command (single-line `bash` code block) plus an explanation.
This makes "step-by-step flow everywhere" automatic.

**Docs = headings + prose + code.** Deep docs use Heading 2/3 for structure, code
blocks for the engine surface, and the `Parent` relation to nest under a section.

---

## 4. Example rows

### 4a. A Guide

| Property | Value |
|----------|-------|
| Title | `Deploy to a DigitalOcean VPS` |
| Slug | `deploy-to-digitalocean-vps` |
| Kind | `Guide` |
| Status | `Published` |
| Order | `20` |
| Difficulty | `Intermediate` |
| Duration | `25 min` |
| Summary | `Stand up a fresh droplet and ship a production Next.js app over SSH.` |
| Tags | `VPS`, `DigitalOcean`, `Production` |
| Targets | `VPS` |
| CLI version | `v0.8.x` |

**Body (authored as a numbered list = the flow):**

```
1. Create the droplet
   Ubuntu 22.04, Basic plan, add your SSH key.

2. Prepare the box
   [bash code block]  nextdeploy prepare
   Installs Caddy, nextdeployd, and Fail2Ban on a fresh server.

3. Initialize the project
   [bash code block]  nextdeploy init
   Pick "VPS" and fill in host + ssh_key. Writes nextdeploy.yml.

4. Load secrets
   [bash code block]  nextdeploy secrets load .env

5. Ship
   [bash code block]  nextdeploy ship
   Builds, uploads over SSH, activates atomically, health-checks.

6. Verify
   [bash code block]  nextdeploy status
   Confirms current release and route health.
```

> Each numbered item → one `Step`; each single-line bash block → that step's `$ command` chip.

### 4b. A Doc

| Property | Value |
|----------|-------|
| Title | `ship() — build, upload, activate, verify` |
| Slug | `cli/ship` |
| Kind | `Doc` |
| Status | `Published` |
| Section | `CLI` |
| Order | `10` |
| Parent | → (the `CLI Reference` doc row) |
| Related | → `rollback`, `status` doc rows |
| Summary | `What nextdeploy ship does, end to end.` |
| Targets | `VPS`, `AWS`, `Cloudflare` |
| Source | `https://github.com/aynaash/NextDeploy/blob/main/internal/ship/ship.go` |

**Body:** Heading 2/3 sections, code blocks for the Go surface, callouts for
hardening notes, and a `Related` relation for cross-links.

---

## 5. Validation rules

- `Slug` must be **unique** and lowercase-kebab (`a-z 0-9 -`). Docs may use a path-like slug (`cli/ship`).
- `Kind` and `Status` must be set; rows that aren't `Published` never appear on the site.
- `Guide` rows should set `Difficulty` + `Duration` and be authored as a numbered list.
- `Doc` rows should set `Section`; use `Parent` to nest (root docs have no Parent).
- `Order` controls sort within a section / the guide list (ascending).
- Self-relations (`Parent`, `Related`) point at other rows **in this same database**.

---

## 5b. Media & embeds (all supported)

The renderer handles every common Notion media/layout block — just drop them in:

| Block | Renders as |
|-------|------------|
| Image | Bordered figure + caption |
| Video (upload) | `<video controls>` |
| Video (YouTube/Vimeo URL) | Responsive embedded iframe |
| Audio | `<audio controls>` |
| File | Download card |
| PDF | Embedded iframe |
| Bookmark / Link preview | Link card |
| Embed (any URL) | iframe |
| Equation | Mono expression block |
| Table | Codex-styled table (header row honored) |
| Columns (column_list) | Responsive grid |
| Synced block | Renders its content inline |

## 5c. Embedding live components ("custom pages")

To drop a live React component into a page, add a **code block** whose **caption is
`component`** and whose content is JSON:

```
caption: component
content:
{ "name": "TerminalHero" }
```

With props:

```
{ "name": "SyscallButton", "props": { "command": "ship", "tone": "success", "hint": "deploy" } }
```

Registered components live in `components/notion/registry.tsx`:
`TerminalHero`, `DeployTimeline`, `SecurityGates`, `StructCard`, `SyscallButton`,
`FlowOverview`. Add more there to expose them to authors. Unknown names render a
visible "unknown component" notice rather than failing.

---

## 6. What the site reads (reference)

`lib/notion/types.ts → mapPage()` reads these property names. If you must rename a
property, update that file too. The query layer (`lib/notion/content.ts`) filters
`Status = Published` and sorts by `Order`, and builds the docs sidebar tree from
`Parent`.
