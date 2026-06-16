import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "../shared/icons"

const links = [
  { title: "docs", href: "/docs" },
  { title: "github", href: siteConfig.links.github },
  { title: "discord", href: "https://discord.gg/xd9Cub9fm" },
]

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t border-rule", className)}>
      <div className="container flex max-w-6xl flex-col items-center justify-between gap-4 py-8 font-mono md:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-term-green">$</span>
          <span className="text-foreground">NextDeploy</span>
          <span className="hidden text-muted-foreground sm:inline">
            — deploy Next.js to your own infrastructure
          </span>
        </div>

        <nav className="flex items-center gap-5 text-xs text-muted-foreground">
          {links.map((link) => {
            const isExternal = link.href.startsWith("http")
            return (
              <Link
                key={link.title}
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="transition-colors hover:text-term-green"
              >
                {link.title}
              </Link>
            )
          })}
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <Icons.gitHub className="size-4" />
          </Link>
        </nav>
      </div>
    </footer>
  )
}
