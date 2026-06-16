import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  /** Lucide icon representing the section — crisp vector, not emoji. */
  icon: LucideIcon
  children: React.ReactNode
  id?: string
  className?: string
}

/**
 * Every heading is prefixed with an icon representing its section.
 * The Codex metaphor: you are reading the source of deployment.
 */
export function SectionHeading({ icon: Icon, children, id, className }: SectionHeadingProps) {
  return (
    <h2
      id={id}
      className={cn(
        "not-prose flex scroll-mt-24 items-center gap-3 font-grotesk text-2xl font-bold tracking-tight text-foreground",
        className,
      )}
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-term-green/30 bg-term-green/5 text-term-green shadow-[3px_3px_0_0_rgba(0,255,157,0.12)]">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
      </span>
      {children}
    </h2>
  )
}

interface FnHeadingProps {
  /** The function name, rendered as `name()`. */
  fn: string
  /** Description after the arrow. */
  desc: string
  level?: 3 | 4
  id?: string
  className?: string
}

/**
 * Subheadings use the pattern: `functionName()` → Description
 */
export function FnHeading({ fn, desc, level = 3, id, className }: FnHeadingProps) {
  const Tag = (`h${level}` as unknown) as keyof JSX.IntrinsicElements
  return (
    <Tag
      id={id}
      className={cn("not-prose scroll-mt-24 font-mono text-base font-medium text-foreground", className)}
    >
      <span className="text-term-blue">{`${fn}()`}</span>
      <span className="mx-2 text-muted-foreground">→</span>
      <span className="text-muted-foreground">{desc}</span>
    </Tag>
  )
}
