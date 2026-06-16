import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Cards as "structs" — sharp edges, hard offset shadow, snap on hover.
 * Terminals don't round their corners. Neither do we.
 */
export function StructCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("codex-card relative p-5", className)} {...props}>
      {children}
    </div>
  )
}

export function StructCardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-grotesk text-base font-semibold text-foreground", className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function StructCardBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-1.5 text-sm leading-relaxed text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}
