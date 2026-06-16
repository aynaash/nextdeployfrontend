import * as React from "react"
import { cn } from "@/lib/utils"

export interface RT {
  plain_text: string
  href: string | null
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
}

const COLOR: Record<string, string> = {
  green: "text-term-green",
  blue: "text-term-blue",
  red: "text-term-crimson",
  yellow: "text-term-amber",
  orange: "text-term-amber",
  purple: "text-term-purple",
  pink: "text-term-purple",
  gray: "text-muted-foreground",
  brown: "text-muted-foreground",
}

export const plainText = (value: RT[] = []) => value.map((t) => t.plain_text).join("")

/** Renders a Notion rich_text array with codex styling. */
export function RichText({ value }: { value?: RT[] }) {
  if (!value?.length) return null
  return (
    <>
      {value.map((t, i) => {
        const a = t.annotations
        let node: React.ReactNode = t.plain_text
        if (a.code) {
          node = (
            <code className="border border-rule bg-surface px-1 py-0.5 text-[0.85em] text-term-green">
              {node}
            </code>
          )
        }
        const cls = cn(
          a.bold && "font-semibold text-foreground",
          a.italic && "italic",
          a.strikethrough && "line-through",
          a.underline && "underline",
          a.color && a.color !== "default" && COLOR[a.color.replace("_background", "")],
        )

        if (t.href) {
          return (
            <a
              key={i}
              href={t.href}
              target={t.href.startsWith("http") ? "_blank" : undefined}
              rel={t.href.startsWith("http") ? "noreferrer" : undefined}
              className={cn(
                "text-term-blue underline decoration-term-blue/30 underline-offset-2 hover:decoration-term-blue",
                cls,
              )}
            >
              {node}
            </a>
          )
        }
        return cls ? (
          <span key={i} className={cls}>
            {node}
          </span>
        ) : (
          <React.Fragment key={i}>{node}</React.Fragment>
        )
      })}
    </>
  )
}
