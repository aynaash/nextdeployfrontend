import "server-only"
import { Client } from "@notionhq/client"

/**
 * Notion is the source of truth for docs + guides content.
 * The schema is one "Content" database with a `Kind` (Doc | Guide) discriminator.
 *
 * Required env:
 *   NOTION_TOKEN        — internal integration secret
 *   NOTION_DATABASE_ID  — the Content database id
 */
export const NOTION_TOKEN = process.env.NOTION_TOKEN
export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

let cached: Client | null = null

/** True when both env vars are present — callers degrade gracefully otherwise. */
export function isNotionConfigured(): boolean {
  return Boolean(NOTION_TOKEN && NOTION_DATABASE_ID)
}

/** Lazily-constructed Notion client. Throws only if used while unconfigured. */
export function notion(): Client {
  if (!NOTION_TOKEN) {
    throw new Error("NOTION_TOKEN is not set — cannot reach Notion.")
  }
  if (!cached) {
    cached = new Client({ auth: NOTION_TOKEN })
  }
  return cached
}
