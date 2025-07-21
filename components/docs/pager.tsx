import Link from "next/link"
import { Doc } from "../../.contentlayer/generated"
import { docsConfig } from "../../config/docs"
import { cn } from "../../lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"

// ---- TYPES ----
interface SidebarNavItem {
  title: string
  href?: string
  items?: SidebarNavItem[]
}

interface DocsPagerProps {
  doc: Doc
}

interface FlattenedLink {
  title: string
  href: string
}

// ---- COMPONENT ----
export function DocsPager({ doc }: DocsPagerProps) {
  const pager = getPagerForDoc(doc)

  if (!pager) return null

  return (
    <div className="flex flex-row items-center justify-between">
      {pager.prev && (
        <Link
          href={pager.prev.href}
          className={cn(buttonVariants({ variant: "outline" }))}
          legacyBehavior>
          <Icons.chevronLeft className="mr-2 size-4" />
          {pager.prev.title}
        </Link>
      )}
      {pager.next && (
        <Link
          href={pager.next.href}
          className={cn(buttonVariants({ variant: "outline" }), "ml-auto")}
          legacyBehavior>
          {pager.next.title}
          <Icons.chevronRight className="ml-2 size-4" />
        </Link>
      )}
    </div>
  );
}

// ---- LOGIC ----
function getPagerForDoc(doc: Doc): { prev: FlattenedLink | null; next: FlattenedLink | null } | null {
  const links = flattenSidebarNav(docsConfig.sidebarNav)
  const activeIndex = links.findIndex((link) => doc.slug === link.href)

  if (activeIndex === -1) return null

  return {
    prev: activeIndex > 0 ? links[activeIndex - 1] : null,
    next: activeIndex < links.length - 1 ? links[activeIndex + 1] : null,
  }
}

// ---- FLATTENING ----
function flattenSidebarNav(items: SidebarNavItem[]): FlattenedLink[] {
  const flat: FlattenedLink[] = []

  for (const item of items) {
    if (item.href) {
      flat.push({ title: item.title, href: item.href })
    }

    if (item.items) {
      flat.push(...flattenSidebarNav(item.items))
    }
  }

  return flat
}
