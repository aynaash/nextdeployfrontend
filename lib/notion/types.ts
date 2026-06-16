import type {
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"

export type Kind = "Doc" | "Guide"
export type Status = "Draft" | "Review" | "Published" | "Archived"
export type Difficulty = "Beginner" | "Intermediate" | "Advanced"

/** Normalised content metadata, mapped out of Notion page properties. */
export interface ContentMeta {
  id: string
  title: string
  slug: string
  kind: Kind
  status: Status
  section?: string
  order: number
  difficulty?: Difficulty
  duration?: string
  summary?: string
  tags: string[]
  targets: string[]
  cliVersion?: string
  source?: string
  featured: boolean
  parentId?: string
  relatedIds: string[]
  lastEdited?: string
}

type AnyProps = PageObjectResponse["properties"]

// --- tiny, defensive property extractors -------------------------------------

const plain = (rt: Array<{ plain_text: string }> = []) => rt.map((t) => t.plain_text).join("")

function getProp(props: AnyProps, name: string): any {
  // tolerate case / spacing variants ("CLI version" vs "Cli Version")
  const key = Object.keys(props).find(
    (k) => k.toLowerCase().replace(/\s+/g, "") === name.toLowerCase().replace(/\s+/g, ""),
  )
  return key ? props[key] : undefined
}

const asTitle = (p: any) => (p?.type === "title" ? plain(p.title) : "")
const asRichText = (p: any) => (p?.type === "rich_text" ? plain(p.rich_text) : "")
const asSelect = (p: any) => (p?.type === "select" ? (p.select?.name ?? undefined) : undefined)
const asMulti = (p: any) =>
  p?.type === "multi_select" ? p.multi_select.map((o: any) => o.name as string) : []
const asNumber = (p: any) => (p?.type === "number" ? (p.number ?? 0) : 0)
const asCheckbox = (p: any) => (p?.type === "checkbox" ? Boolean(p.checkbox) : false)
const asUrl = (p: any) => (p?.type === "url" ? (p.url ?? undefined) : undefined)
const asRelationIds = (p: any) =>
  p?.type === "relation" ? p.relation.map((r: any) => r.id as string) : []

/** Derive a URL slug if the Slug property is empty. */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function mapPage(page: PageObjectResponse | PartialPageObjectResponse): ContentMeta | null {
  if (!("properties" in page)) return null
  const props = page.properties

  const title = asTitle(getProp(props, "Title")) || "Untitled"
  const slug = asRichText(getProp(props, "Slug")) || slugify(title)
  const kind = (asSelect(getProp(props, "Kind")) as Kind) ?? "Doc"
  const status = (asSelect(getProp(props, "Status")) as Status) ?? "Draft"

  const parentIds = asRelationIds(getProp(props, "Parent"))

  return {
    id: page.id,
    title,
    slug,
    kind,
    status,
    section: asSelect(getProp(props, "Section")),
    order: asNumber(getProp(props, "Order")),
    difficulty: asSelect(getProp(props, "Difficulty")) as Difficulty | undefined,
    duration: asRichText(getProp(props, "Duration")) || undefined,
    summary: asRichText(getProp(props, "Summary")) || undefined,
    tags: asMulti(getProp(props, "Tags")),
    targets: asMulti(getProp(props, "Targets")),
    cliVersion: asSelect(getProp(props, "CLI version")) || asRichText(getProp(props, "CLI version")) || undefined,
    source: asUrl(getProp(props, "Source")),
    featured: asCheckbox(getProp(props, "Featured")),
    parentId: parentIds[0],
    relatedIds: asRelationIds(getProp(props, "Related")),
    lastEdited: "last_edited_time" in page ? page.last_edited_time : undefined,
  }
}
