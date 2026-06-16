"use client"

import * as React from "react"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import {
  ScanLine,
  Package,
  KeyRound,
  UploadCloud,
  Rocket,
  RefreshCw,
  Check,
  Sparkles,
  AlertTriangle,
  Bug,
  Activity,
  Skull,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Line {
  label: string
  icon: LucideIcon
  detail?: string
  /** ms after start that this line "completes" */
  at: number
}

const LINES: Line[] = [
  { icon: ScanLine, label: "Validating nextdeploy.yml", at: 700 },
  { icon: Package, label: "Building Next.js (standalone)", detail: "12.3s", at: 1500 },
  { icon: KeyRound, label: "Injecting secrets", at: 2100 },
  { icon: UploadCloud, label: "Uploading to VPS (SSH chacha20)", detail: "47MB / 2.1s", at: 3000 },
  { icon: Rocket, label: "Activating release 1716600000-a1b2c3d", at: 3800 },
]

const WARN_AT = 250
const TREE_AT = 4000
const DONE_AT = 4600
const TOTAL = 5200

const TREE = [
  "├─ systemd unit generated",
  "├─ health check  TCP 127.0.0.1:43217 → retry → ✓",
  "├─ atomic symlink  current ──► new",
  "└─ Caddy reloaded",
]

export function TerminalHero({ className }: { className?: string }) {
  const [elapsed, setElapsed] = React.useState(0)
  const [done, setDone] = React.useState(false)

  const run = React.useCallback(() => {
    setElapsed(0)
    setDone(false)
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const e = now - start
      setElapsed(e)
      if (e < TOTAL) {
        raf = requestAnimationFrame(tick)
      } else {
        setDone(true)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  React.useEffect(() => {
    const cleanup = run()
    return cleanup
  }, [run])

  return (
    <div
      className={cn(
        "not-prose overflow-hidden border border-rule bg-surface font-mono text-[13px] shadow-[0_0_40px_-12px_rgba(0,255,157,0.18)]",
        className,
      )}
    >
      {/* title bar */}
      <div className="flex items-center justify-between border-b border-rule bg-void/80 px-4 py-2.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="size-3 rounded-full bg-term-crimson/70" />
            <span className="size-3 rounded-full bg-term-amber/70" />
            <span className="size-3 rounded-full bg-term-green/70" />
          </span>
          deploy@vps : ~/my-next-app
        </span>
        <span className="bg-rule px-1.5 py-0.5 text-term-green">v0.8.1</span>
      </div>

      <div className="space-y-1 p-5 text-slate-200">
        <div className="text-slate-300">
          <span className="text-term-green">$</span> nextdeploy ship
        </div>

        {/* dirty git warning — reality, not sterility */}
        <div
          className={cn(
            "flex items-center gap-2 text-term-amber transition-opacity",
            elapsed >= WARN_AT ? "opacity-100" : "opacity-0",
          )}
        >
          <AlertTriangle className="size-3.5 shrink-0" />
          <span>working tree has uncommitted changes — shipping anyway</span>
        </div>

        <div className="my-2 border-t border-dashed border-rule" />

        {LINES.map((line) => {
          const complete = elapsed >= line.at
          const active = !complete && elapsed >= line.at - 800
          const dots = Math.min(24, Math.floor((elapsed - (line.at - 800)) / 28))
          const Icon = line.icon
          return (
            <div
              key={line.label}
              className={cn(
                "flex items-center transition-opacity",
                elapsed < line.at - 800 ? "opacity-30" : "opacity-100",
              )}
            >
              <span className="mr-2 flex w-5 justify-center">
                <Icon className="size-4 text-term-blue" strokeWidth={1.75} />
              </span>
              <span className="text-slate-300">{line.label}</span>
              <span className="mx-1 flex-1 truncate text-rule">
                {".".repeat(complete ? 24 : active ? Math.max(0, dots) : 0)}
              </span>
              {line.detail && complete && (
                <span className="mr-2 text-muted-foreground">{line.detail}</span>
              )}
              <span className="flex w-5 justify-end">
                {complete ? (
                  <Check className="size-4 text-term-green" strokeWidth={2.5} />
                ) : active ? (
                  <RefreshCw className="size-3.5 animate-spin text-term-amber" />
                ) : null}
              </span>
            </div>
          )
        })}

        {/* activation tree — the gears, made visible */}
        <div
          className={cn(
            "ml-7 space-y-0.5 pt-0.5 text-xs text-muted-foreground transition-opacity duration-300",
            elapsed >= TREE_AT ? "opacity-100" : "opacity-0",
          )}
        >
          {TREE.map((row) => (
            <div key={row} className="whitespace-pre">
              {row.replace("✓", "")}
              {row.includes("✓") && <span className="text-term-green">✓ 1.2s</span>}
            </div>
          ))}
        </div>

        <div className="my-2 border-t border-dashed border-rule" />

        <motion.div initial={false} animate={{ opacity: done ? 1 : 0.15 }} className="flex items-center gap-1.5 text-term-green">
          <Sparkles className="size-4" /> Deployed!{" "}
          <a href="#" className="underline decoration-term-green/40 underline-offset-2">
            https://app.example.com
          </a>
        </motion.div>

        {/* meaningful results — numbers, not vibes */}
        <motion.div
          initial={false}
          animate={{ opacity: done ? 1 : 0 }}
          className="text-xs text-muted-foreground"
        >
          ttfb <span className="text-slate-300">167ms</span> · release{" "}
          <span className="text-slate-300">a1b2c3d</span> · rollback{" "}
          <span className="text-term-amber">nextdeploy rollback</span>
        </motion.div>

        {/* the next moves */}
        <div className="mt-3 flex flex-wrap gap-2 border-t border-rule pt-3">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 border border-rule px-2.5 py-1 text-xs text-slate-300 transition-colors hover:border-term-blue/60 hover:text-term-blue"
          >
            <Bug className="size-3.5" /> logs -f
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 border border-rule px-2.5 py-1 text-xs text-slate-300 transition-colors hover:border-term-green/60 hover:text-term-green"
          >
            <Activity className="size-3.5" /> status
          </button>
          <button
            type="button"
            className="group inline-flex items-center gap-1.5 border border-rule px-2.5 py-1 text-xs text-slate-300 transition-colors hover:border-term-crimson/60 hover:text-term-crimson"
          >
            <Skull className="size-3.5" />
            <span className="group-hover:animate-glitch">destroy</span>
          </button>
          <button
            type="button"
            onClick={() => run()}
            className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-white"
          >
            <RefreshCw className="size-3.5" /> replay
          </button>
        </div>
      </div>
    </div>
  )
}
