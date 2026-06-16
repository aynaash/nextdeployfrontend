# Handoff — wire up the new Cloudflare deployment doc pages

Paste the block below into a fresh Claude Code session **opened in the
`nextdeployfrontend` repo**. It sets up and verifies the new docs.

---

You are working in the `nextdeployfrontend` repo (Next.js App Router, MDX docs,
Yarn PnP, deploys to Cloudflare via OpenNext). Two new documentation pages were
just authored and need to render correctly on the docs site.

## What was already added (do not rewrite the prose, just make them render)

1. `content/docs/cloudflare-deployment.mdx` — main Cloudflare deployment guide.
2. `content/docs/cloudflare-protection.mdx` — edge protection guard deep-dive.
3. `content/docs/secrets.mdx` — secrets & credentials across all pipelines.
4. `config/docs.ts` — a new **"Deployment"** sidebar group linking:
   - `/docs/vps-deployment` (already existed)
   - `/docs/cloudflare-deployment`
   - `/docs/cloudflare-protection`
   - `/docs/secrets`

These MDX files follow the exact conventions of the existing
`content/docs/vps-deployment.mdx`:
- Frontmatter: `title` + `description`.
- `import { CodeBlock, Info, Warning, Success, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/mdx-components"`.
- Any code containing `{` or `<` is wrapped as `` <CodeBlock>{`...raw code...`}</CodeBlock> `` (template literal) so MDX doesn't parse it as JSX/expressions.

## Your tasks

1. **Find the docs build/index mechanism.** `lib/docs.ts` reads
   `.velite/docs.json`, and `app/(docs)/docs/[...slug]/page.tsx` renders docs by
   slug from it. But there appears to be **no Velite config** and **no `.velite/`
   directory** in the repo. Determine how `.velite/docs.json` is meant to be
   generated:
   - Look for `velite.config.{ts,js,mjs}`, a `velite` key in `package.json`, a
     `prebuild`/`predev` script, or a Next plugin in `next.config.js`.
   - If Velite is configured but not run, run it (e.g. `yarn velite` or whatever
     the script is) and confirm `.velite/docs.json` now includes
     `cloudflare-deployment` and `cloudflare-protection` (check `slugAsParams`).
   - If Velite is **not** actually set up, either (a) add a minimal Velite config
     with a `docs` collection over `content/docs/**/*.mdx` producing the `Doc`
     shape in `lib/docs.ts` (`slug, title, description, published, toc, body,
     slugAsParams`) and wire it to run before `dev`/`build`, **or** (b) adapt
     `lib/docs.ts` + `[...slug]/page.tsx` to read and compile the MDX from
     `content/docs` directly (e.g. with `next-mdx-remote` or `@next/mdx`).
     Prefer matching whatever already renders the existing docs.

2. **Use Yarn (PnP).** This repo uses `.pnp.cjs`. Run `yarn install` if needed,
   and use `yarn dev` / `yarn build` (not npm).

3. **Verify the new pages render** at:
   - `/docs/cloudflare-deployment`
   - `/docs/cloudflare-protection`
   - `/docs/secrets`
   Confirm: styled `CodeBlock`s (with titles/language), `Info`/`Warning`/`Success`
   callouts, and the `Tabs` all render. No raw `{` `}` leaking into the page and
   no MDX/JSX compile errors. The sidebar shows the new **Deployment** group and
   links navigate correctly.

4. **Fix any rendering issues** you find — most likely either a missing Velite
   run/config, or a code block that needs the `` {`...`} `` template-literal
   wrapper. If you must edit the MDX, keep the wording; only fix the syntax.

5. **Build clean.** `yarn build` must succeed. Note: `next.config.js` sets
   `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`, so rely on a
   real page render (dev server) to confirm correctness, not just a passing build.

## Acceptance criteria

- Visiting `/docs/cloudflare-deployment` and `/docs/cloudflare-protection` shows
  fully rendered, styled docs (code blocks, callouts, tabs) with no errors.
- The docs sidebar lists the **Deployment** group with VPS + both Cloudflare pages.
- `yarn build` succeeds.

Report what the doc-generation mechanism turned out to be and exactly what you
changed to make the pages render.
