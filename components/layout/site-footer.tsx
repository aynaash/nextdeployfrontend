"use client"

import Link from "next/link"

import { footerLinks, siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { NewsletterForm } from "../forms/newsletter-form"
import { Icons } from "../shared/icons"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t", className)}>
      {/* Top grid with footer sections */}
      <div className="container grid max-w-6xl grid-cols-2 gap-6 py-14 md:grid-cols-5">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <span className="text-sm font-semibold tracking-wide text-foreground">
              {section.title}
            </span>
            <ul className="mt-4 space-y-3">
              {section.items?.map((link) => {
                const isExternal = link.href.startsWith("http")
                return (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {/* Newsletter block */}
        <div className="col-span-full flex flex-col items-end sm:col-span-1 md:col-span-2">
          <NewsletterForm />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t py-4">
        <div className="container flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
            >
              <Icons.gitHub className="size-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
