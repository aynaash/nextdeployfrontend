"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  /** Raw source. Lines are split on "\n". */
  code: string
  /** Optional language/label shown in the title bar (e.g. "nextdeploy.yml"). */
  label?: string
  /** Show hexadecimal line numbers (0x001 ...). Default true. */
  lineNumbers?: boolean
  className?: string
}

/**
 * Code blocks as "kernel modules" — hex line numbers, click-to-copy.
 * These aren't just examples, they're the surface of the machine.
 */
export function CodeBlock({ code, label, lineNumbers = true, className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const lines = code.replace(/\n$/, "").split("\n")

  const copy = React.useCallback(() => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    })
  }, [code])

  return (
    <div
      className={cn(
        "not-prose group relative my-4 overflow-hidden border border-rule bg-surface font-mono text-[13px] leading-relaxed",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-rule bg-void/60 px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 bg-term-green/70" />
          {label ?? "module"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-term-green"
          aria-label="Copy to clipboard"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-term-green" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "copied" : "copy"}
        </button>
      </div>

      <div className="overflow-x-auto p-3">
        <pre className="min-w-fit">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              {lineNumbers && (
                <span className="mr-4 select-none text-right text-term-purple/50">
                  {`0x${(i + 1).toString(16).padStart(3, "0")}`}
                </span>
              )}
              <code className="flex-1 whitespace-pre text-slate-200">{line || " "}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}
