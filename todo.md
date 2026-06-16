# Docs site — remaining work

Status as of 2026-06-14. The docs restructure, `nextdeploy.yml` reference, prev/next
pager, Mermaid rendering, and per-doc SEO are **done and verified** (all 8 docs render
200, `yarn build` exits 0). Items below are follow-ups, not blockers.

## Content
- [ ] **Add the remaining technical docs** into the `Technical Reference` group. For each new doc:
  1. Create `content/docs/<slug>.mdx` (frontmatter must start at byte 0 — no leading blank line).
  2. Register it in the `docs` map in `app/(docs)/docs/[...slug]/page.tsx` (import + map entry, key = slug).
  3. Add it to `config/docs.ts` → `sidebarNav` "Technical Reference" `items` (order here drives sidebar + pager).
- [ ] Review the long `content/docs/configuration.mdx` (34 KB) for *visual* correctness — it now compiles, but only the one backtick bug was fixed; nothing checked its rendered layout end-to-end.

## MDX authoring gotchas to watch (these break the build, all hit this session)
- [ ] Inside `<CodeBlock>{`...`}</CodeBlock>`: escape inner backticks as `` \` `` and `${` as `\${`
      (an unescaped `${VAR}` throws `ReferenceError` at render).
- [ ] A literal `*` or `_` inside an inline `<code>…</code>` starts markdown emphasis → wrap as `<code>{`*.sql`}</code>`.

## SEO
- [ ] Trace the build-time warning: `metadataBase property … not set … using "http://localhost:3000"`.
      Doc pages are fine (built HTML has the correct `nextdeploy.one` canonical), so it comes from
      another route whose `metadata` export doesn't go through `constructMetadata()`. Find & fix it.
- [ ] Consider adding `app/sitemap.ts` that emits the `/docs/*` routes (pulls from `config/docs.ts`),
      and confirm `robots`/`site.webmanifest` resolve.

## Cleanup (dead code surfaced while working)
- [ ] `lib/docs.ts` + the `.velite/` references — dead (no Velite configured, nothing imports
      `getAllDocs`/`getDocBySlug`). Remove or wire up.
- [ ] `lib/notion/content.ts` `getDocNav()` is no longer used for the docs sidebar (now config-driven).
      Decide whether Notion still drives doc *content* (`page.tsx` still tries Notion first) or rip it out.
- [ ] Possible dead nav components: `components/pager.tsx`, `components/sidebar-nav.tsx`,
      `components/docs/sidebar-nav.tsx` — verify nothing renders them, then remove.

## Nice-to-have
- [ ] Mermaid: only the `<Mermaid chart={`...`} />` component renders; fenced ```mermaid``` blocks do not
      (no rehype plugin). Add a rehype/remark step if authors want fenced blocks.
- [ ] `mermaid` added ~115 MiB of deps and bloated the build graph (build now needs
      `NODE_OPTIONS=--max-old-space-size=4096` on the 7 GB box; don't run `yarn build` with `yarn dev` resident).
- [ ] Nothing has been committed — the docs work is all in the working tree (`git status`).

## Pre-existing (not introduced here, noted for awareness)
- Better Auth logs "default secret" + missing GitHub/Google client warnings during build — harmless.
- `next.config.js` ignores ESLint + TS errors at build time, so a green build ≠ correctness;
  verify via `yarn dev` + render, not just the build.
