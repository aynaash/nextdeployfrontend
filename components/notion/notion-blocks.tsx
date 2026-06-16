import * as React from "react"
import { ExternalLink, FileDown, Link2 } from "lucide-react"
import type { NotionBlock } from "@/lib/notion/content"
import { CodeBlock } from "@/components/codex/code-block"
import { Steps, Step } from "@/components/codex/steps"
import { RichText, plainText, type RT } from "./rich-text"
import { COMPONENTS } from "./registry"
import { cn } from "@/lib/utils"

const slugId = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

const SHELL = new Set(["bash", "shell", "shellscript", "sh", "zsh", "plain text"])

/** Normalise YouTube/Vimeo URLs to an embeddable form. */
function embedUrl(url: string): string {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return url
}

const fileUrl = (f: any) => (f?.type === "external" ? f.external.url : f?.file?.url) ?? ""

// One Notion numbered-list item → one Step in the flow.
function renderStep(item: NotionBlock, idx: number) {
  const b = item as any
  const title = plainText(b.numbered_list_item?.rich_text) || `Step ${idx + 1}`
  const children: NotionBlock[] = item.children ?? []

  let command: string | undefined
  let rest = children
  const cmdIdx = children.findIndex((c) => {
    const cb = c as any
    return (
      c.type === "code" &&
      SHELL.has(cb.code.language) &&
      plainText(cb.code.rich_text).trim().split("\n").length === 1
    )
  })
  if (cmdIdx !== -1) {
    command = plainText((children[cmdIdx] as any).code.rich_text).trim()
    rest = children.filter((_, k) => k !== cmdIdx)
  }

  return (
    <Step key={item.id} title={title} command={command}>
      {rest.length > 0 && <NotionBlocks blocks={rest} />}
    </Step>
  )
}

/** A registered component embedded via a `component`-captioned code block. */
function CustomComponent({ json }: { json: string }) {
  try {
    const spec = JSON.parse(json)
    const Comp = COMPONENTS[spec.name]
    if (Comp) {
      return (
        <div className="not-prose my-6">
          <Comp {...(spec.props ?? {})} />
        </div>
      )
    }
    return (
      <div className="my-4 border-l-2 border-term-crimson/40 bg-term-crimson/5 px-4 py-2 font-mono text-xs text-term-crimson">
        unknown component: {String(spec.name)}
      </div>
    )
  } catch {
    return null
  }
}

function MediaCard({ url, label, icon: Icon }: { url: string; label?: string; icon: any }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="not-prose my-4 flex items-center gap-3 border border-rule bg-surface px-4 py-3 font-mono text-sm text-foreground/80 transition-colors hover:border-term-blue/60 hover:text-term-blue"
    >
      <Icon className="size-4 shrink-0 text-term-blue" />
      <span className="min-w-0 flex-1 truncate">{label || url}</span>
      <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
    </a>
  )
}

function Block({ block }: { block: NotionBlock }) {
  const b = block as any

  switch (block.type) {
    case "paragraph": {
      const rt: RT[] = b.paragraph.rich_text
      if (!rt.length) return <div className="h-3" />
      return (
        <p className="my-3 font-mono text-sm leading-relaxed text-muted-foreground">
          <RichText value={rt} />
        </p>
      )
    }

    case "heading_1":
    case "heading_2":
    case "heading_3": {
      const level = Number(block.type.slice(-1)) as 1 | 2 | 3
      const rt: RT[] = b[block.type].rich_text
      const id = slugId(plainText(rt))
      const size = { 1: "text-2xl", 2: "text-xl", 3: "text-lg" }[level]
      const Tag = (`h${level + 1}` as unknown) as keyof JSX.IntrinsicElements
      return (
        <Tag
          id={id}
          className={cn(
            "not-prose scroll-mt-24 font-grotesk font-bold text-foreground",
            size,
            level === 1 ? "mt-10" : "mt-8",
          )}
        >
          <span className="mr-2 select-none text-term-green">{"#".repeat(level)}</span>
          <RichText value={rt} />
        </Tag>
      )
    }

    case "code": {
      const caption = plainText(b.code.caption).trim().toLowerCase()
      const codeStr = plainText(b.code.rich_text)
      if (caption === "component") return <CustomComponent json={codeStr} />
      const label = plainText(b.code.caption) || b.code.language || "code"
      return <CodeBlock code={codeStr} label={label} lineNumbers={codeStr.split("\n").length > 1} />
    }

    case "callout": {
      const rt: RT[] = b.callout.rich_text
      const color: string = b.callout.color ?? ""
      const emoji = b.callout.icon?.type === "emoji" ? b.callout.icon.emoji : ""
      let tone = "border-term-blue/40 bg-term-blue/5 text-term-blue"
      if (color.includes("green") || emoji === "✅") tone = "border-term-green/40 bg-term-green/5 text-term-green"
      else if (
        color.includes("yellow") || color.includes("orange") || color.includes("red") ||
        ["⚠️", "🔥", "💀", "🚨"].includes(emoji)
      )
        tone = "border-term-amber/40 bg-term-amber/5 text-term-amber"
      return (
        <div className={cn("my-5 border-l-2 px-4 py-3", tone)}>
          <div className="text-sm leading-relaxed text-slate-300">
            <RichText value={rt} />
            {block.children && <NotionBlocks blocks={block.children} />}
          </div>
        </div>
      )
    }

    case "quote":
      return (
        <blockquote className="my-4 border-l-2 border-term-green/40 bg-surface px-4 py-2 font-mono text-sm italic text-muted-foreground">
          <RichText value={b.quote.rich_text} />
          {block.children && <NotionBlocks blocks={block.children} />}
        </blockquote>
      )

    case "divider":
      return <hr className="my-6 border-rule" />

    case "to_do":
      return (
        <div className="my-1 flex items-center gap-2 font-mono text-sm text-muted-foreground">
          <span className={b.to_do.checked ? "text-term-green" : "text-rule"}>
            {b.to_do.checked ? "[x]" : "[ ]"}
          </span>
          <span className={cn(b.to_do.checked && "line-through")}>
            <RichText value={b.to_do.rich_text} />
          </span>
        </div>
      )

    case "toggle":
      return (
        <details className="group my-3 border border-rule bg-surface px-4 py-2">
          <summary className="cursor-pointer font-mono text-sm text-foreground">
            <RichText value={b.toggle.rich_text} />
          </summary>
          {block.children && (
            <div className="mt-2 border-t border-rule pt-2">
              <NotionBlocks blocks={block.children} />
            </div>
          )}
        </details>
      )

    case "image": {
      const url = fileUrl(b.image)
      const cap = plainText(b.image.caption)
      return (
        <figure className="my-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={cap || ""} className="w-full border border-rule" />
          {cap && <figcaption className="mt-1 font-mono text-xs text-muted-foreground">{cap}</figcaption>}
        </figure>
      )
    }

    case "video": {
      const url = fileUrl(b.video)
      const cap = plainText(b.video.caption)
      if (b.video.type === "external") {
        return (
          <figure className="my-5">
            <div className="aspect-video w-full border border-rule">
              <iframe src={embedUrl(url)} className="size-full" allowFullScreen title={cap || "video"} />
            </div>
            {cap && <figcaption className="mt-1 font-mono text-xs text-muted-foreground">{cap}</figcaption>}
          </figure>
        )
      }
      return (
        <figure className="my-5">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video src={url} controls className="w-full border border-rule" />
          {cap && <figcaption className="mt-1 font-mono text-xs text-muted-foreground">{cap}</figcaption>}
        </figure>
      )
    }

    case "audio":
      return (
        <figure className="my-4">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio src={fileUrl(b.audio)} controls className="w-full" />
        </figure>
      )

    case "embed":
    case "pdf": {
      const url = block.type === "embed" ? b.embed.url : fileUrl(b.pdf)
      const cap = plainText(b[block.type].caption)
      return (
        <figure className="my-5">
          <div className="aspect-video w-full border border-rule">
            <iframe src={embedUrl(url)} className="size-full" allowFullScreen title={cap || block.type} />
          </div>
          {cap && <figcaption className="mt-1 font-mono text-xs text-muted-foreground">{cap}</figcaption>}
        </figure>
      )
    }

    case "bookmark":
      return <MediaCard url={b.bookmark.url} label={plainText(b.bookmark.caption) || b.bookmark.url} icon={Link2} />

    case "link_preview":
      return <MediaCard url={b.link_preview.url} icon={Link2} />

    case "file":
      return (
        <MediaCard
          url={fileUrl(b.file)}
          label={b.file.name || plainText(b.file.caption) || "Download file"}
          icon={FileDown}
        />
      )

    case "equation":
      return (
        <pre className="my-4 overflow-x-auto border border-rule bg-surface px-4 py-3 text-center font-mono text-sm text-term-blue">
          {b.equation.expression}
        </pre>
      )

    case "synced_block":
      return block.children ? <NotionBlocks blocks={block.children} /> : null

    case "column_list": {
      const cols = (block.children ?? []).filter((c) => c.type === "column")
      return (
        <div
          className="my-5 grid gap-5"
          style={{ gridTemplateColumns: `repeat(${Math.max(1, cols.length)}, minmax(0, 1fr))` }}
        >
          {cols.map((c) => (
            <div key={c.id}>
              <NotionBlocks blocks={c.children ?? []} />
            </div>
          ))}
        </div>
      )
    }

    case "table": {
      const rows = (block.children ?? []).filter((c) => c.type === "table_row")
      const hasHeader = b.table.has_column_header
      return (
        <div className="my-5 overflow-x-auto border border-rule">
          <table className="w-full border-collapse font-mono text-sm">
            <tbody>
              {rows.map((r, ri) => {
                const cells: RT[][] = (r as any).table_row.cells
                const isHeader = hasHeader && ri === 0
                const CellTag = isHeader ? "th" : "td"
                return (
                  <tr key={r.id} className="border-b border-rule last:border-b-0">
                    {cells.map((cell, ci) => (
                      <CellTag
                        key={ci}
                        className={cn(
                          "border-r border-rule px-3 py-2 text-left align-top last:border-r-0",
                          isHeader ? "bg-void/60 font-semibold text-term-green" : "text-muted-foreground",
                        )}
                      >
                        <RichText value={cell} />
                      </CellTag>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    }

    // Intentionally skipped: table_of_contents, breadcrumb, child_page, child_database.
    default:
      return null
  }
}

/**
 * Renders a Notion block tree as codex components.
 * Consecutive numbered_list_items collapse into the <Steps> flow;
 * bulleted lists become a terminal-styled <ul>.
 */
export function NotionBlocks({ blocks }: { blocks: NotionBlock[] }) {
  const out: React.ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === "numbered_list_item") {
      const group: NotionBlock[] = []
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        group.push(blocks[i])
        i++
      }
      out.push(<Steps key={block.id}>{group.map((g, k) => renderStep(g, k))}</Steps>)
      continue
    }

    if (block.type === "bulleted_list_item") {
      const group: NotionBlock[] = []
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        group.push(blocks[i])
        i++
      }
      out.push(
        <ul key={block.id} className="my-4 space-y-1.5">
          {group.map((g) => {
            const gb = g as any
            return (
              <li key={g.id} className="flex gap-2 font-mono text-sm text-muted-foreground">
                <span className="mt-0.5 text-term-green">›</span>
                <span className="min-w-0">
                  <RichText value={gb.bulleted_list_item.rich_text} />
                  {g.children && <NotionBlocks blocks={g.children} />}
                </span>
              </li>
            )
          })}
        </ul>,
      )
      continue
    }

    out.push(<Block key={block.id} block={block} />)
    i++
  }

  return <>{out}</>
}
