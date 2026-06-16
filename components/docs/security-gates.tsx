"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Gauge, ListFilter, Fingerprint, Repeat, ScrollText, Github, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const GITHUB_BASE = "https://github.com/aynaash/nextdeploy/blob/main"

interface Gate {
  n: number
  title: string
  icon: typeof Gauge
  pct: number
  stats: string[]
  prevents: string
  why: string
  code: string
  path: string
  line?: number
}

const GATES: Gate[] = [
  {
    n: 1,
    title: "Rate Limiter",
    icon: Gauge,
    pct: 97,
    stats: ["100 req/min per IP"],
    prevents: "Brute-force and floods — an attacker can't hammer the command endpoint.",
    why: "Cheapest check first: reject abusive volume before spending CPU on crypto.",
    code: "if !limiter.Allow(ip) {\n    return ErrRateLimited\n}",
    path: "internal/command/command_handler.go",
    line: 41,
  },
  {
    n: 2,
    title: "IP Whitelist",
    icon: ListFilter,
    pct: 100,
    stats: ["1,234 allowed", "42 blocked last hour"],
    prevents: "Commands from unknown hosts — only your control plane's IPs get past.",
    why: "A static allowlist is near-free and eliminates the entire internet as an attacker.",
    code: 'if !whitelist.Contains(ip) {\n    return ErrForbidden\n}',
    path: "internal/command/command_handler.go",
    line: 48,
  },
  {
    n: 3,
    title: "HMAC Signature",
    icon: Fingerprint,
    pct: 100,
    stats: ["Fail-closed on empty secret", "SHA256-HMAC · 32-byte random secret"],
    prevents: "Forged or tampered commands — the payload must be signed with the shared secret.",
    why: "Proves authenticity and integrity. Fails closed: an empty secret rejects everything.",
    code: "func VerifySignature(payload []byte, signature, secret string) bool {\n    if secret == \"\" {\n        return false // fail closed\n    }\n    mac := hmac.New(sha256.New, []byte(secret))\n    mac.Write(payload)\n    return hmac.Equal(mac.Sum(nil), decode(signature))\n}",
    path: "internal/command/command_handler.go",
    line: 55,
  },
  {
    n: 4,
    title: "Replay Guard",
    icon: Repeat,
    pct: 100,
    stats: ["Timestamp ±5m + nonce", "0 replays blocked (good!)"],
    prevents: "Replay attacks — a captured valid request can't be re-sent later.",
    why: "A signature alone is replayable. The timestamp window + single-use nonce make each command one-shot.",
    code: "if abs(now - ts) > 5*time.Minute { return ErrStale }\nif seen.Has(nonce) { return ErrReplay }\nseen.Add(nonce)",
    path: "internal/command/command_handler.go",
    line: 72,
  },
  {
    n: 5,
    title: "Audit Log",
    icon: ScrollText,
    pct: 94,
    stats: ["12,345 commands logged this month"],
    prevents: "Silent action — every command that passes the gates is recorded, signed, and timestamped.",
    why: "Last gate: once a command is authorized, you want an immutable record of who did what, when.",
    code: 'audit.Record(ctx, AuditEntry{\n    Command: cmd, IP: ip, Nonce: nonce, At: now,\n})',
    path: "internal/command/audit.go",
    line: 18,
  },
]

function barColor(pct: number) {
  if (pct >= 100) return "bg-emerald-500"
  if (pct >= 95) return "bg-lime-500"
  return "bg-amber-500"
}

export function SecurityGates({ className }: { className?: string }) {
  const [open, setOpen] = React.useState<number | null>(null)

  return (
    <div
      className={cn(
        "not-prose my-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-950",
        className,
      )}
    >
      <div className="border-b border-slate-800 bg-slate-900 px-5 py-3 text-center font-mono text-sm font-semibold tracking-wide text-slate-200">
        🔒 COMMAND AUTHENTICATION
      </div>

      <div className="divide-y divide-slate-800">
        {GATES.map((gate) => {
          const Icon = gate.icon
          const isOpen = open === gate.n
          return (
            <div key={gate.n}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : gate.n)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-900/60"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-700 bg-slate-900 text-slate-300">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-slate-500">GATE {gate.n}</span>
                    <span className="text-sm font-medium text-slate-100">{gate.title}</span>
                  </span>
                  <span className="mt-1.5 flex items-center gap-3">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                      <motion.span
                        initial={{ width: 0 }}
                        whileInView={{ width: `${gate.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={cn("block h-full rounded-full", barColor(gate.pct))}
                      />
                    </span>
                    <span className="w-10 text-right font-mono text-xs text-slate-400">{gate.pct}%</span>
                  </span>
                </span>
                <ChevronDown
                  className={cn("h-4 w-4 shrink-0 text-slate-500 transition-transform", isOpen && "rotate-180")}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 px-5 pb-5 pl-[4.25rem]">
                      <div className="flex flex-wrap gap-2">
                        {gate.stats.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-0.5 font-mono text-[11px] text-slate-400"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-red-400">Prevents: </span>
                        {gate.prevents}
                      </p>
                      <p className="text-sm text-slate-400">
                        <span className="font-semibold text-sky-400">Why here: </span>
                        {gate.why}
                      </p>
                      <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-black/60 p-3 font-mono text-xs text-slate-100">
                        <code>{gate.code}</code>
                      </pre>
                      <a
                        href={`${GITHUB_BASE}/${gate.path}${gate.line ? `#L${gate.line}` : ""}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        <Github className="h-3.5 w-3.5" />
                        {gate.path}
                        {gate.line ? `:${gate.line}` : ""}
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className="border-t border-slate-800 bg-slate-900/60 px-5 py-2.5 text-center text-xs text-slate-500">
        Gates run cheapest-first — volume is rejected before crypto is ever computed.
      </div>
    </div>
  )
}
