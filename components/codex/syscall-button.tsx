import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tone = "success" | "warning" | "error" | "neutral"

const TONES: Record<Tone, string> = {
  success: "border-term-green/40 text-term-green hover:bg-term-green/10 hover:border-term-green",
  warning: "border-term-amber/40 text-term-amber hover:bg-term-amber/10 hover:border-term-amber",
  error: "border-term-crimson/40 text-term-crimson hover:bg-term-crimson/10 hover:border-term-crimson",
  neutral: "border-rule text-slate-300 hover:border-term-blue/60 hover:text-term-blue",
}

interface SyscallButtonProps {
  /** The command this runs, e.g. "ship". Rendered as `$ ship`. */
  command: string
  /** Plain-language hint shown under the command. */
  hint?: string
  tone?: Tone
  href?: string
  className?: string
  /** Renders the glitch effect — reserve for destructive syscalls. */
  glitch?: boolean
}

/**
 * Buttons as "syscalls" — each shows the command it runs, not just a label.
 */
export function SyscallButton({
  command,
  hint,
  tone = "neutral",
  href,
  className,
  glitch,
}: SyscallButtonProps) {
  const inner = (
    <span className="flex flex-col items-start gap-0.5">
      <span className={cn("font-mono text-sm", glitch && "group-hover:animate-glitch")}>
        <span className="text-muted-foreground">$ </span>
        {command}
      </span>
      {hint && <span className="font-mono text-[11px] text-muted-foreground">{hint}</span>}
    </span>
  )

  const classes = cn(
    "group inline-flex min-w-[150px] items-center border bg-void/40 px-4 py-2.5 transition-colors",
    TONES[tone],
    className,
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    )
  }
  return (
    <button type="button" className={classes}>
      {inner}
    </button>
  )
}
