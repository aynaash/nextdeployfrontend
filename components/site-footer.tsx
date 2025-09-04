"use client"

import Link from "next/link"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"

type FooterProps = React.HTMLAttributes<HTMLElement>

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith("http")
  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="text-sm text-muted-foreground transition-colors hover:text-primary"
    >
      {children}
    </Link>
  )
}

export function SiteFooter({ className }: FooterProps) {
  return (
    <footer className={cn("py-10 md:py-0", className)}>
      <div className="container grid gap-6 md:h-24 md:grid-cols-2 md:items-center">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <Icons.logo className="size-6" />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by <FooterLink href={siteConfig.links.twitter}>shadcn</FooterLink>.{" "}
            Hosted on <FooterLink href="https://vercel.com">Vercel</FooterLink>.{" "}
            Illustrations by <FooterLink href="https://popsy.co">Popsy</FooterLink>.{" "}
            Source code on <FooterLink href={siteConfig.links.github}>GitHub</FooterLink>.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <ModeToggle />
        </div>
      </div>
    </footer>
  )
}
