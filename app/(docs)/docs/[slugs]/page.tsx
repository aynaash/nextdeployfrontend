
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { DocsLayout } from "@/components/docs-layout"

// Import MDX files
import Installation from "@/content/docs/installation.mdx"
import QuickStart from "@/content/docs/quick-start.mdx"

const docs = {
  installation: {
    title: "Installation",
    description: "Install and set up NextDeploy CLI on your development machine",
    component: Installation,
  },
  "quick-start": {
    title: "Quick Start",
    description: "Deploy your first Next.js application with NextDeploy in under 5 minutes",
    component: QuickStart,
  },
}

interface PageProps {
  params: {
    slug: string[]
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = params.slug?.join("/") || ""
  const doc = docs[slug as keyof typeof docs]

  if (!doc) {
    return {
      title: "Documentation Not Found",
    }
  }

  return {
    title: `${doc.title} | NextDeploy Documentation`,
    description: doc.description,
  }
}

export default function DocPage({ params }: PageProps) {
  const slug = params.slug?.join("/") || ""
  const doc = docs[slug as keyof typeof docs]

  if (!doc) {
    notFound()
  }

  const ContentComponent = doc.component

  return (
    <DocsLayout>
      <ContentComponent />
    </DocsLayout>
  )
}

export async function generateStaticParams() {
  return Object.keys(docs).map((slug) => ({
    slug: slug.split("/"),
  }))
}
