"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Laptop, Lock, Server, X, Github } from "lucide-react"
import { cn } from "@/lib/utils"

const GITHUB_BASE = "https://github.com/aynaash/nextdeploy/blob/main"

type Column = "laptop" | "tunnel" | "vps"

interface Step {
  id: string
  column: Column
  label: string
  detail: string
  code: string
  path?: string
}

const STEPS: Step[] = [
  {
    id: "build",
    column: "laptop",
    label: "next build",
    detail:
      "The Next.js app is compiled in standalone mode locally, so only the server bundle and its traced node_modules ship — not your whole repo.",
    code: "next build   # output: standalone\n# .next/standalone + .next/static",
    path: "internal/build/build.go",
  },
  {
    id: "tar",
    column: "laptop",
    label: "tar app.tar.gz",
    detail:
      "The standalone output is streamed into a single gzipped tarball so the whole release transfers as one atomic blob.",
    code: 'tar -czf - .next/standalone | ...   # streamed, never hits a temp file',
    path: "internal/build/archive.go",
  },
  {
    id: "upload",
    column: "tunnel",
    label: "cat > uploads/",
    detail:
      "No scp, no rsync daemon — the tarball is piped over the existing SSH session straight into a file on the VPS with `cat >`. One connection, no extra surface.",
    code: 'ssh host "cat > /opt/nextdeploy/uploads/app.tar.gz" < app.tar.gz',
    path: "internal/ssh/upload.go",
  },
  {
    id: "exec",
    column: "tunnel",
    label: 'ssh exec "ship"',
    detail:
      "The daemon command is invoked over the same SSH channel. The client never talks to the VPS on any other port.",
    code: 'ssh host "nextdeployd ship --release $TS"',
    path: "internal/ssh/exec.go",
  },
  {
    id: "extract",
    column: "vps",
    label: "Extract release",
    detail:
      "nextdeployd unpacks the tarball into a timestamped, immutable release directory: releases/<unix-ts>-<sha>.",
    code: "tar -xzf uploads/app.tar.gz -C releases/1716600000-a1b2c3d",
    path: "internal/daemon/ship.go",
  },
  {
    id: "systemd",
    column: "vps",
    label: "systemd start",
    detail:
      "A per-app systemd unit is generated and started, binding the server to a fresh internal port. systemd owns the process lifecycle, not a shell.",
    code: "[Service]\nExecStart=/usr/bin/node server.js\nEnvironment=PORT=43217",
    path: "internal/systemd/unit.go",
  },
  {
    id: "health",
    column: "vps",
    label: "Health check (5m)",
    detail:
      "The new release must answer on its internal port before any traffic is flipped to it. If it never goes healthy, the old release keeps serving — zero downtime.",
    code: "GET http://127.0.0.1:43217/   → 200 within 5m, else abort",
    path: "internal/daemon/health.go",
  },
  {
    id: "symlink",
    column: "vps",
    label: "Atomic symlink",
    detail:
      "The `current` symlink is re-pointed to the new release in a single atomic rename(2). There is no moment where `current` points at a half-built release.",
    code: "ln -sfn releases/1716600000-a1b2c3d current   # atomic rename(2)",
    path: "internal/daemon/activate.go",
  },
  {
    id: "caddy",
    column: "vps",
    label: "Caddy reload",
    detail:
      "Caddy is reloaded (not restarted) to pick up the new upstream port. Existing connections drain; TLS stays warm.",
    code: "caddy reload --config /etc/caddy/Caddyfile",
    path: "internal/caddy/reload.go",
  },
]

const COLUMNS: { id: Column; title: string; icon: typeof Laptop; accent: string }[] = [
  { id: "laptop", title: "Your Laptop", icon: Laptop, accent: "text-sky-400 border-sky-500/40" },
  { id: "tunnel", title: "SSH Tunnel", icon: Lock, accent: "text-amber-400 border-amber-500/40" },
  { id: "vps", title: "VPS", icon: Server, accent: "text-emerald-400 border-emerald-500/40" },
]

export function DeployTimeline({ className }: { className?: string }) {
  const [selected, setSelected] = React.useState<Step | null>(null)

  return (
    <div className={cn("not-prose my-8", className)}>
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col, colIndex) => {
          const Icon = col.icon
          const steps = STEPS.filter((s) => s.column === col.id)
          return (
            <div key={col.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className={cn("mb-4 flex items-center gap-2 border-b pb-2 text-sm font-semibold", col.accent)}>
                <Icon className="h-4 w-4" />
                {col.title}
              </div>
              <div className="space-y-2">
                {steps.map((step, i) => {
                  const globalIndex = STEPS.findIndex((s) => s.id === step.id)
                  const isActive = selected?.id === step.id
                  return (
                    <motion.button
                      key={step.id}
                      type="button"
                      onClick={() => setSelected(isActive ? null : step)}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.05 * (colIndex * 3 + i) }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors",
                        isActive
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-200"
                          : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600",
                      )}
                    >
                      <span className="text-slate-600">{String(globalIndex + 1).padStart(2, "0")}</span>
                      {step.label}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-slate-950 p-5">
              <div className="mb-2 flex items-start justify-between gap-4">
                <h4 className="font-mono text-sm font-semibold text-emerald-300">{selected.label}</h4>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-slate-500 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-slate-300">{selected.detail}</p>
              <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-black/60 p-3 font-mono text-xs text-slate-100">
                <code>{selected.code}</code>
              </pre>
              {selected.path && (
                <a
                  href={`${GITHUB_BASE}/${selected.path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
                >
                  <Github className="h-3.5 w-3.5" />
                  {selected.path}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Click any step to see the exact code that runs it.
        </p>
      )}
    </div>
  )
}
