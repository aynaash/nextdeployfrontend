import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

/**
 * On-demand revalidation — Notion has no native webhooks, so trigger this
 * from a Notion automation / button, a cron, or a manual curl after publishing:
 *
 *   curl -X POST "https://site/api/revalidate?secret=$REVALIDATE_SECRET&path=/docs"
 *
 * Omit `path` to refresh the whole docs + guides surface.
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret")
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, error: "invalid secret" }, { status: 401 })
  }

  const path = req.nextUrl.searchParams.get("path")
  const paths = path ? [path] : ["/docs", "/guides"]
  for (const p of paths) revalidatePath(p, "page")

  return NextResponse.json({ revalidated: true, paths, now: Date.now() })
}
