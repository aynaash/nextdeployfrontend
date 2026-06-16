import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { docsConfig } from "@/config/docs"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface FlatLink {
  title: string
  href: string
}

// Flatten config/docs.ts into a single reading order — the same list the
// sidebar renders, so prev/next walks groups in the order they're declared.
function flattenDocs(): FlatLink[] {
  return docsConfig.sidebarNav.flatMap((group) =>
    group.items.map((item) => ({ title: item.title, href: item.href })),
  )
}

/** Previous / next navigation, derived from the docs sidebar order. */
export function DocsPager({ slug }: { slug: string }) {
  const currentHref = slug ? `/docs/${slug}` : "/docs"
  const links = flattenDocs()
  const index = links.findIndex((link) => link.href === currentHref)
  if (index === -1) return null

  const prev = index > 0 ? links[index - 1] : null
  const next = index < links.length - 1 ? links[index + 1] : null
  if (!prev && !next) return null

  return (
    <div className="not-prose mt-12 flex flex-row items-center justify-between gap-4 border-t border-rule pt-6">
      {prev ? (
        <Link href={prev.href} className={cn(buttonVariants({ variant: "outline" }), "h-auto py-2")}>
          <ChevronLeft className="mr-2 size-4 shrink-0" />
          <span className="flex flex-col items-start text-left">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Previous</span>
            <span>{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className={cn(buttonVariants({ variant: "outline" }), "ml-auto h-auto py-2")}>
          <span className="flex flex-col items-end text-right">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Next</span>
            <span>{next.title}</span>
          </span>
          <ChevronRight className="ml-2 size-4 shrink-0" />
        </Link>
      ) : null}
    </div>
  )
}
