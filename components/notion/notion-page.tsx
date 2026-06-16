import Link from "next/link"
import { Clock, ListOrdered, ExternalLink } from "lucide-react"
import type { ContentMeta } from "@/lib/notion/types"
import type { NotionBlock } from "@/lib/notion/content"
import { NotionBlocks } from "./notion-blocks"
import { plainText } from "./rich-text"
import { FlowOverview } from "@/components/codex/steps"

const difficultyColor = (d?: string) =>
  ({
    Beginner: "border-term-green/40 text-term-green",
    Intermediate: "border-term-amber/40 text-term-amber",
    Advanced: "border-term-crimson/40 text-term-crimson",
  })[d ?? ""] ?? "border-rule text-muted-foreground"

/** Pull the numbered-step titles out of a guide's blocks for the FlowOverview. */
function stepTitles(blocks: NotionBlock[]): string[] {
  return blocks
    .filter((b) => b.type === "numbered_list_item")
    .map((b) => plainText((b as any).numbered_list_item.rich_text))
    .filter(Boolean)
}

export function NotionPage({ meta, blocks }: { meta: ContentMeta; blocks: NotionBlock[] }) {
  const steps = meta.kind === "Guide" ? stepTitles(blocks) : []

  return (
    <article className="grain font-mono">
      <header className="border-b border-rule pb-8">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-term-green">
          // {meta.kind.toLowerCase()}
        </span>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
          {meta.difficulty && (
            <span className={`border px-2 py-0.5 ${difficultyColor(meta.difficulty)}`}>{meta.difficulty}</span>
          )}
          {steps.length > 0 && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <ListOrdered className="size-3.5 text-term-green" />
              {steps.length} steps
            </span>
          )}
          {meta.duration && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3.5" />
              {meta.duration}
            </span>
          )}
          {meta.cliVersion && <span className="text-muted-foreground">{meta.cliVersion}</span>}
        </div>

        <h1 className="mt-4 font-grotesk text-4xl font-bold tracking-tight text-foreground">{meta.title}</h1>
        {meta.summary && <p className="mt-3 text-sm text-muted-foreground">{meta.summary}</p>}

        {steps.length > 0 && <FlowOverview steps={steps} className="mt-5" />}

        {(meta.tags.length > 0 || meta.source) && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {meta.tags.map((t) => (
              <span key={t} className="border border-rule px-2 py-0.5 text-[11px] text-muted-foreground">
                {t}
              </span>
            ))}
            {meta.source && (
              <Link
                href={meta.source}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center gap-1 text-[11px] text-term-blue hover:underline"
              >
                <ExternalLink className="size-3" /> source
              </Link>
            )}
          </div>
        )}
      </header>

      <div className="mt-8">
        <NotionBlocks blocks={blocks} />
      </div>

      {meta.lastEdited && (
        <p className="mt-12 border-t border-rule pt-6 font-mono text-xs text-muted-foreground">
          $ stat --updated {new Date(meta.lastEdited).toISOString().slice(0, 10)}
        </p>
      )}
    </article>
  )
}
