
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  ChevronRight,
  ChevronDown,
  Terminal,
  Compass,
  Book,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ExplainProvider, ExplainToggle } from "@/components/docs/explain-context"
import { docsConfig } from "@/config/docs"

interface DocSection {
  title: string
  icon: any
  items: {
    title: string
    href: string
    description?: string
  }[]
}

// Per-group sidebar icon, keyed by the group titles in config/docs.ts.
const SECTION_ICONS: Record<string, any> = {
  Guides: Compass,
  "Technical Reference": Terminal,
}

interface DocsLayoutProps {
  children: React.ReactNode
}

// The docs sidebar is config-driven — config/docs.ts is the single source of
// truth. Group + item order there defines both this sidebar and the pager flow.
const navSections: DocSection[] = docsConfig.sidebarNav.map((group) => ({
  title: group.title,
  icon: SECTION_ICONS[group.title] ?? Book,
  items: group.items,
}))

export function DocsLayout({ children }: DocsLayoutProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(
    navSections.map((s) => s.title),
  )

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionTitle) ? prev.filter((title) => title !== sectionTitle) : [...prev, sectionTitle],
    )
  }

  const isActive = (href: string) => pathname === href
  const isInSection = (section: DocSection) => section.items.some((item) => pathname.startsWith(item.href))

  const SidebarContent = () => (
    <div className="space-y-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 flex items-center gap-2 px-4 font-grotesk text-lg font-semibold tracking-tight">
          <Terminal className="h-4 w-4 text-term-green" />
          Documentation
        </h2>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)] px-1">
        <div className="space-y-2">
          {navSections.map((section) => {
            const IconComponent = section.icon
            const isExpanded = expandedSections.includes(section.title)
            const hasActiveItem = isInSection(section)

            return (
              <div key={section.title}>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start px-4 py-2 h-auto font-normal", hasActiveItem && "bg-muted")}
                  onClick={() => toggleSection(section.title)}
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  <span className="flex-1 text-left">{section.title}</span>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "block border-l px-4 py-1.5 font-mono text-sm transition-colors",
                          isActive(item.href)
                            ? "border-term-green bg-term-green/10 text-term-green"
                            : "border-rule text-muted-foreground hover:border-term-green/50 hover:text-foreground",
                        )}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <ExplainProvider>
    <div className="min-h-screen bg-background">
      {/* Explain Everything toolbar */}
      <div className="sticky top-14 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Compass className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Curious how it works under the hood?</span>
          </div>
          <ExplainToggle />
        </div>
      </div>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Mobile Sidebar */}
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <SidebarContent />
          </div>
        </aside>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="mr-2">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          <div className="mx-auto w-full min-w-0">
            <div className="prose prose-slate max-w-none dark:prose-invert">{children}</div>
          </div>

          {/* Table of Contents */}
          <div className="hidden text-sm xl:block">
            <div className="sticky top-16 -mt-10 pt-4">
              <div className="space-y-2">
                <p className="font-medium">On This Page</p>
                <div className="space-y-1">
                  {[
                    ["#install", "Install"],
                    ["#quickstart", "Quickstart"],
                    ["#cli", "CLI commands"],
                    ["#configuration", "Configuration"],
                    ["#next", "Where to go next"],
                  ].map(([href, label]) => (
                    <Link key={href} href={href} className="block py-1 text-muted-foreground hover:text-term-green">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </ExplainProvider>
  )
}
