import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getContentBySlug, getBlocks, getPublishedContent } from "@/lib/notion/content"
import { NotionPage } from "@/components/notion/notion-page"
import { constructMetadata } from "@/lib/utils"

export const revalidate = 60

export const metadata: Metadata = {
  ...constructMetadata({
    title: "Documentation | NextDeploy",
    description:
      "NextDeploy documentation — deploy Next.js apps to a VPS or to Cloudflare Workers, with secrets, an edge protection guard, and a single nextdeploy.yml config file.",
  }),
  alternates: { canonical: "/docs" },
}

// The docs home is a Notion Doc with this slug. Everything here is DB-driven.
const HOME_SLUG = "index"

export default async function DocsPage() {
  // 1. The "index" doc renders as the landing page.
  const meta = await getContentBySlug("Doc", HOME_SLUG)
  if (meta) {
    const blocks = await getBlocks(meta.id)
    return <NotionPage meta={meta} blocks={blocks} />
  }

  // 2. No index doc yet → a directory of whatever Docs are published (still no static copy).
  const docs = await getPublishedContent("Doc")
  return (
    <div className="not-prose font-mono">
      <header className="border-b border-rule pb-8">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-term-green">// documentation</span>
        <h1 className="mt-5 font-grotesk text-4xl font-bold tracking-tight text-foreground">Documentation</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sourced live from Notion. {docs.length === 0 ? "No pages published yet." : `${docs.length} pages.`}
        </p>
      </header>

      {docs.length === 0 ? (
        <p className="mt-8 border-l-2 border-term-amber/40 bg-term-amber/5 px-4 py-3 text-sm text-term-amber">
          Add a <code className="text-term-green">Doc</code> in the Notion database with{" "}
          <code className="text-term-green">Slug = index</code> and{" "}
          <code className="text-term-green">Status = Published</code> to fill this page.
        </p>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {docs.map((d) => (
            <Link key={d.slug} href={`/docs/${d.slug}`} className="codex-card group block p-4">
              <div className="flex items-center justify-between">
                <span className="font-grotesk text-base font-semibold text-foreground group-hover:text-term-green">
                  {d.title}
                </span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-term-green" />
              </div>
              {d.summary && <p className="mt-1.5 text-xs text-muted-foreground">{d.summary}</p>}
              {d.section && <span className="mt-2 inline-block text-[11px] text-term-blue">{d.section}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
