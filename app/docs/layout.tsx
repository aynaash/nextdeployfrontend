import React from "react"
import DocsFooter from '@/components/docs-footer'

export const metadata = {
  title: 'NextDeploy Documentation',
  description: 'Auto-generated overview for NextDeploy — install, quickstart, CLI reference. Self-hosted Next.js deployment to a VPS, AWS Lambda, or Cloudflare Workers.',
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      <main className="relative mx-auto max-w-4xl">
        <div className="py-8 sm:py-10 px-4 sm:px-6 lg:px-12">
          {children}
          <DocsFooter />
        </div>
      </main>
    </div>
  )
}
