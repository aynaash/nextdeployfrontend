
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
  Book,
  Zap,
  Terminal,
  Layers,
  Activity,
  Shield,
  Code,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DocSection {
  title: string
  icon: any
  items: {
    title: string
    href: string
    description?: string
  }[]
}

const docSections: DocSection[] = [
  {
    title: "Getting Started",
    icon: Zap,
    items: [
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick Start", href: "/docs/quick-start" },
      { title: "Configuration", href: "/docs/configuration" },
      { title: "First Deployment", href: "/docs/first-deployment" },
    ],
  },
  {
    title: "Core Concepts",
    icon: Book,
    items: [
      { title: "Architecture", href: "/docs/architecture" },
      { title: "Deployment Strategies", href: "/docs/deployment-strategies" },
      { title: "Infrastructure as Code", href: "/docs/infrastructure-as-code" },
      { title: "Environment Management", href: "/docs/environments" },
    ],
  },
  {
    title: "CLI Reference",
    icon: Terminal,
    items: [
      { title: "Commands", href: "/docs/cli/commands" },
      { title: "Configuration File", href: "/docs/cli/config-file" },
      { title: "Environment Variables", href: "/docs/cli/environment-variables" },
      { title: "Hooks & Scripts", href: "/docs/cli/hooks" },
    ],
  },
  {
    title: "Deployment Targets",
    icon: Layers,
    items: [
      { title: "VPS Deployment", href: "/docs/targets/vps" },
      { title: "Kubernetes", href: "/docs/targets/kubernetes" },
      { title: "Docker Swarm", href: "/docs/targets/docker-swarm" },
      { title: "Cloud Providers", href: "/docs/targets/cloud" },
    ],
  },
  {
    title: "Monitoring",
    icon: Activity,
    items: [
      { title: "Metrics Collection", href: "/docs/monitoring/metrics" },
      { title: "Logging", href: "/docs/monitoring/logging" },
      { title: "Alerting", href: "/docs/monitoring/alerting" },
      { title: "Dashboards", href: "/docs/monitoring/dashboards" },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    items: [
      { title: "Authentication", href: "/docs/security/authentication" },
      { title: "Secrets Management", href: "/docs/security/secrets" },
      { title: "Network Security", href: "/docs/security/network" },
      { title: "SSL/TLS", href: "/docs/security/ssl" },
    ],
  },
  {
    title: "API Reference",
    icon: Code,
    items: [
      { title: "REST API", href: "/docs/api/rest" },
      { title: "GraphQL API", href: "/docs/api/graphql" },
      { title: "Webhooks", href: "/docs/api/webhooks" },
      { title: "SDKs", href: "/docs/api/sdks" },
    ],
  },
  {
    title: "Examples",
    icon: FileText,
    items: [
      { title: "Basic Next.js App", href: "/docs/examples/basic-nextjs" },
      { title: "Full-Stack App", href: "/docs/examples/fullstack" },
      { title: "Microservices", href: "/docs/examples/microservices" },
      { title: "Multi-Environment", href: "/docs/examples/multi-env" },
    ],
  },
]

interface DocsLayoutProps {
  children: React.ReactNode
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Getting Started", // Expand getting started by default
  ])

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
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Documentation</h2>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)] px-1">
        <div className="space-y-2">
          {docSections.map((section) => {
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
                          "block px-4 py-2 text-sm rounded-md transition-colors hover:bg-muted",
                          isActive(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        legacyBehavior>
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
    <div className="min-h-screen bg-background">
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
                  {/* This would be populated by extracting headings from the content */}
                  <Link href="#overview" className="block py-1 text-muted-foreground hover:text-foreground">
                    Overview
                  </Link>
                  <Link href="#installation" className="block py-1 text-muted-foreground hover:text-foreground">
                    Installation
                  </Link>
                  <Link href="#configuration" className="block py-1 text-muted-foreground hover:text-foreground">
                    Configuration
                  </Link>
                  <Link href="#examples" className="block py-1 text-muted-foreground hover:text-foreground">
                    Examples
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
