import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * The canonical step-by-step flow. A vertical spine threads numbered nodes —
 * every guide, quickstart, and walkthrough reads as an explicit sequence.
 *
 *   <Steps>
 *     <Step title="Initialize" command="nextdeploy init">Writes nextdeploy.yml.</Step>
 *     <Step title="Ship" command="nextdeploy ship">Build, upload, activate.</Step>
 *   </Steps>
 */
export function Steps({ children, className }: { children: React.ReactNode; className?: string }) {
  const steps = React.Children.toArray(children).filter(React.isValidElement)
  return (
    <div className={cn("not-prose relative my-6", className)}>
      {/* the spine */}
      <div className="absolute bottom-3 left-[15px] top-3 w-px bg-rule" aria-hidden />
      <div className="space-y-6">
        {steps.map((child, i) =>
          React.cloneElement(child as React.ReactElement, { index: i + 1, total: steps.length }),
        )}
      </div>
    </div>
  )
}

interface StepProps {
  title: string
  /** Optional command this step runs, rendered as `$ command`. */
  command?: string
  /** Marks the step done (filled green node). */
  done?: boolean
  children?: React.ReactNode
  /** Injected by <Steps>. */
  index?: number
  className?: string
}

export function Step({ title, command, done, children, index = 1, className }: StepProps) {
  return (
    <div className={cn("relative flex gap-4", className)}>
      <div
        className={cn(
          "relative z-10 flex size-8 shrink-0 items-center justify-center border font-mono text-xs",
          done
            ? "border-term-green bg-term-green/15 text-term-green"
            : "border-term-green/40 bg-void text-term-green",
        )}
      >
        {String(index).padStart(2, "0")}
      </div>

      <div className="min-w-0 flex-1 pb-1">
        <h3 className="font-grotesk text-base font-semibold text-foreground">{title}</h3>

        {command && (
          <div className="mt-2 inline-flex items-center gap-2 border border-rule bg-surface px-3 py-1.5 font-mono text-xs text-term-green">
            <span className="text-muted-foreground">$</span>
            {command}
          </div>
        )}

        {children && (
          <div className="mt-2 font-mono text-sm leading-relaxed text-muted-foreground [&_code]:text-term-green">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Compact, read-only flow overview — a horizontal/wrapped list of step labels.
 * Use at the top of a guide to show the whole journey at a glance.
 */
export function FlowOverview({ steps, className }: { steps: string[]; className?: string }) {
  return (
    <div className={cn("not-prose flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-xs", className)}>
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          {i > 0 && <span className="text-rule">→</span>}
          <span className="inline-flex items-center gap-1.5 border border-rule bg-surface px-2.5 py-1 text-muted-foreground">
            <span className="text-term-green">{String(i + 1).padStart(2, "0")}</span>
            {label}
          </span>
        </React.Fragment>
      ))}
    </div>
  )
}
