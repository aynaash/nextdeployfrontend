"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Github, Sparkles } from "lucide-react"
import { useExplain } from "@/components/docs/explain-context"
import { cn } from "@/lib/utils"

const GITHUB_BASE = "https://github.com/aynaash/nextdeploy/blob/main"

/**
 * A code block that has two faces:
 *  - `code`         the regular, clean version
 *  - `explained`    the annotated / "exploded" version (optional)
 *
 * In Explain Everything mode it swaps to `explained` and reveals the
 * GitHub line link. Outside explain mode it shows the clean `code`.
 */
export function ExplainableCode({
  code,
  explained,
  language = "bash",
  title,
  path,
  line,
}: {
  code: string
  explained?: string
  language?: string
  title?: string
  /** Repo-relative path, e.g. "internal/command/command_handler.go" */
  path?: string
  line?: number
}) {
  const { explain } = useExplain()
  const showExploded = explain && explained
  const body = showExploded ? explained! : code
  const githubUrl = path ? `${GITHUB_BASE}/${path}${line ? `#L${line}` : ""}` : null

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-slate-800 bg-slate-950 text-sm shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 font-mono text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </span>
          {title ?? language}
        </span>
        <span className="flex items-center gap-3">
          <AnimatePresence>
            {showExploded && (
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                className="flex items-center gap-1 text-emerald-400"
              >
                <Sparkles className="h-3 w-3" /> exploded
              </motion.span>
            )}
          </AnimatePresence>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-slate-400 transition-colors hover:text-white"
              title="View exact line on GitHub"
            >
              <Github className="h-3.5 w-3.5" />
              {line ? `L${line}` : "src"}
            </a>
          )}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.pre
          key={showExploded ? "exploded" : "clean"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="overflow-x-auto p-4 leading-relaxed text-slate-100"
        >
          <code className={`language-${language}`}>{body}</code>
        </motion.pre>
      </AnimatePresence>
    </div>
  )
}

/**
 * Inline-block concept that reveals a deeper explanation in Explain mode.
 * Usage in MDX:
 *   <Explainable summary="...regular paragraph...">
 *     ...the deeper why, shown only when Explain Everything is on...
 *   </Explainable>
 */
export function Explainable({
  summary,
  children,
  className,
}: {
  summary: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const { explain } = useExplain()
  return (
    <div className={cn("my-4", className)}>
      <div>{summary}</div>
      <AnimatePresence initial={false}>
        {explain && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 overflow-hidden rounded-md border-l-2 border-emerald-500 bg-emerald-500/5 px-4 py-3 text-sm text-muted-foreground"
          >
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-500">
              <Sparkles className="h-3 w-3" /> Under the hood
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
