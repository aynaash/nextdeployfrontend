"use client"

import * as React from "react"
import { Microscope, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Global "Explain Everything" mode.
 *
 * When ON, every explain-aware code block / concept reveals its internals:
 * the exact implementation, the annotations, the "why". This mirrors
 * NextDeploy's personality — simple on the surface, transparent underneath.
 */
interface ExplainContextValue {
  explain: boolean
  setExplain: (value: boolean) => void
  toggle: () => void
}

const ExplainContext = React.createContext<ExplainContextValue | null>(null)

const STORAGE_KEY = "nextdeploy:explain-mode"

export function ExplainProvider({ children }: { children: React.ReactNode }) {
  const [explain, setExplainState] = React.useState(false)

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  React.useEffect(() => {
    try {
      setExplainState(window.localStorage.getItem(STORAGE_KEY) === "1")
    } catch {
      /* ignore (private mode etc.) */
    }
  }, [])

  const setExplain = React.useCallback((value: boolean) => {
    setExplainState(value)
    try {
      window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0")
    } catch {
      /* ignore */
    }
  }, [])

  const value = React.useMemo<ExplainContextValue>(
    () => ({ explain, setExplain, toggle: () => setExplain(!explain) }),
    [explain, setExplain],
  )

  return <ExplainContext.Provider value={value}>{children}</ExplainContext.Provider>
}

export function useExplain(): ExplainContextValue {
  const ctx = React.useContext(ExplainContext)
  if (!ctx) {
    // Graceful fallback so explain-aware components can be used outside a provider.
    return { explain: false, setExplain: () => {}, toggle: () => {} }
  }
  return ctx
}

/** Segmented toggle: [📖 Regular Docs] [🔬 Explain Everything] */
export function ExplainToggle({ className }: { className?: string }) {
  const { explain, setExplain } = useExplain()

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border bg-muted/40 p-1 text-xs font-medium",
        className,
      )}
      role="radiogroup"
      aria-label="Documentation depth"
    >
      <button
        type="button"
        role="radio"
        aria-checked={!explain}
        onClick={() => setExplain(false)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors",
          !explain
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <BookOpen className="h-3.5 w-3.5" />
        Regular Docs
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={explain}
        onClick={() => setExplain(true)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors",
          explain
            ? "bg-emerald-500 text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Microscope className="h-3.5 w-3.5" />
        Explain Everything
      </button>
    </div>
  )
}
