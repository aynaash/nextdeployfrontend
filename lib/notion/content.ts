import "server-only"
import { cache } from "react"
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"
import { notion, isNotionConfigured, NOTION_DATABASE_ID } from "./client"
import { mapPage, type ContentMeta, type Kind } from "./types"

export type NotionBlock = BlockObjectResponse & { children?: NotionBlock[] }

/**
 * All Published rows of the given kind, sorted by Order then title.
 * Returns [] when Notion isn't configured so the site still builds.
 */
/**
 * Notion's 2025 API nests properties under a "data source". A database can have
 * several; we use the first. Resolve its id from the database id (cached), so
 * callers only need NOTION_DATABASE_ID. Override with NOTION_DATA_SOURCE_ID.
 */
export const getDataSourceId = cache(async (): Promise<string | null> => {
  if (!isNotionConfigured()) return null
  if (process.env.NOTION_DATA_SOURCE_ID) return process.env.NOTION_DATA_SOURCE_ID
  const db: any = await notion().databases.retrieve({ database_id: NOTION_DATABASE_ID! })
  return db.data_sources?.[0]?.id ?? null
})

export const getPublishedContent = cache(async (kind?: Kind): Promise<ContentMeta[]> => {
  const data_source_id = await getDataSourceId()
  if (!data_source_id) return []

  const filters: any[] = [{ property: "Status", select: { equals: "Published" } }]
  if (kind) filters.push({ property: "Kind", select: { equals: kind } })

  const results: PageObjectResponse[] = []
  let cursor: string | undefined

  do {
    const res = await notion().dataSources.query({
      data_source_id,
      filter: { and: filters },
      sorts: [{ property: "Order", direction: "ascending" }],
      start_cursor: cursor,
      page_size: 100,
    })
    results.push(...(res.results as PageObjectResponse[]))
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  return results.map(mapPage).filter((m): m is ContentMeta => m !== null)
})

/** One published page's metadata by kind + slug. */
export const getContentBySlug = cache(
  async (kind: Kind, slug: string): Promise<ContentMeta | null> => {
    const all = await getPublishedContent(kind)
    return all.find((c) => c.slug === slug) ?? null
  },
)

/** For generateStaticParams. */
export const getAllSlugs = cache(async (kind: Kind): Promise<{ slug: string }[]> => {
  const all = await getPublishedContent(kind)
  return all.map((c) => ({ slug: c.slug }))
})

/** Recursively fetch a page's block tree (children inlined on each block). */
export const getBlocks = cache(async (blockId: string): Promise<NotionBlock[]> => {
  if (!isNotionConfigured()) return []

  const blocks: NotionBlock[] = []
  let cursor: string | undefined

  do {
    const res = await notion().blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    })
    for (const block of res.results as BlockObjectResponse[]) {
      const node: NotionBlock = block
      if (block.has_children) {
        node.children = await getBlocks(block.id)
      }
      blocks.push(node)
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  return blocks
})

export interface DocNavSection {
  title: string
  items: { title: string; href: string }[]
}

const SECTION_ORDER = ["Getting Started", "CLI", "Targets", "Security", "Observability", "Concepts"]

/** Published docs grouped by Section for the sidebar (ordered). */
export const getDocNav = cache(async (): Promise<DocNavSection[]> => {
  const docs = await getPublishedContent("Doc")
  const groups = new Map<string, { title: string; href: string }[]>()
  for (const d of docs) {
    const sec = d.section || "Docs"
    if (!groups.has(sec)) groups.set(sec, [])
    groups.get(sec)!.push({ title: d.title, href: `/docs/${d.slug}` })
  }
  const rank = (s: string) => {
    const i = SECTION_ORDER.indexOf(s)
    return i === -1 ? 99 : i
  }
  return [...groups.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]))
    .map(([title, items]) => ({ title, items }))
})

export interface DocNode extends ContentMeta {
  items: DocNode[]
}

/** Build the hierarchical doc tree (via Parent relation) for the sidebar. */
export const getDocTree = cache(async (): Promise<DocNode[]> => {
  const docs = await getPublishedContent("Doc")
  const byId = new Map<string, DocNode>(docs.map((d) => [d.id, { ...d, items: [] }]))
  const roots: DocNode[] = []

  for (const node of byId.values()) {
    const parent = node.parentId ? byId.get(node.parentId) : undefined
    if (parent) parent.items.push(node)
    else roots.push(node)
  }
  const sort = (ns: DocNode[]) => {
    ns.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    ns.forEach((n) => sort(n.items))
  }
  sort(roots)
  return roots
})
