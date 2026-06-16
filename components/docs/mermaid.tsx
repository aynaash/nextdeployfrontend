"use client"

import { useEffect, useId, useState } from "react"
import { useTheme } from "next-themes"

/**
 * Renders a Mermaid diagram in MDX. Mermaid is client-only and heavy, so it's
 * dynamically imported on first paint and code-split out of the main bundle.
 *
 * Usage in MDX (wrap the source in a template literal so MDX doesn't parse the
 * `{}`/`-->` syntax as JSX):
 *
 *   <Mermaid chart={`graph TD; A[Start] --> B{Decision} --> C[Done]`} />
 */
export function Mermaid({ chart, children }: { chart?: string; children?: string }) {
  const source = (chart ?? (typeof children === "string" ? children : "")).trim()
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "")
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!source) return
    let cancelled = false

    ;(async () => {
      try {
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === "light" ? "default" : "dark",
          fontFamily: "inherit",
        })
        const { svg } = await mermaid.render(`mermaid-${rawId}`, source)
        if (!cancelled) {
          setSvg(svg)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      }
    })()

    return () => {
      cancelled = true
    }
  }, [source, resolvedTheme, rawId])

  if (error) {
    return (
      <pre className="not-prose my-6 overflow-x-auto border border-term-amber/40 bg-term-amber/5 p-3 text-xs text-term-amber">
        Mermaid error: {error}
        {"\n\n"}
        {source}
      </pre>
    )
  }

  return (
    <div
      className="not-prose my-6 flex justify-center overflow-x-auto border border-rule bg-surface p-4 [&_svg]:max-w-full"
      // SVG is produced by Mermaid from our own trusted diagram source.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
