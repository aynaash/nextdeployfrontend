import type * as React from "react"
import { TerminalHero } from "@/components/docs/terminal-hero"
import { DeployTimeline } from "@/components/docs/deploy-timeline"
import { SecurityGates } from "@/components/docs/security-gates"
import { StructCard } from "@/components/codex/struct-card"
import { SyscallButton } from "@/components/codex/syscall-button"
import { FlowOverview } from "@/components/codex/steps"

/**
 * Custom components authors can embed from Notion.
 *
 * In Notion, add a **code block** whose **caption is `component`** and whose
 * content is JSON:  { "name": "TerminalHero", "props": { ... } }
 * The block renderer looks the name up here and renders the live component.
 *
 * Register any codex/interactive component here to make it available to writers.
 */
export const COMPONENTS: Record<string, React.ComponentType<any>> = {
  TerminalHero,
  DeployTimeline,
  SecurityGates,
  StructCard,
  SyscallButton,
  FlowOverview,
}
