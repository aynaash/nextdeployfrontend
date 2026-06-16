import Link from "next/link"
import { Clock, ArrowRight, ListOrdered, Hammer } from "lucide-react"
import { getPublishedContent } from "@/lib/notion/content"

export const revalidate = 60

interface GuideCard {
  slug: string
  title: string
  description?: string
  difficulty?: string
  duration?: string
  steps?: number
  tags: string[]
}

// Fallback until the Notion DB has published guides.
const SEEDED: GuideCard[] = [
  {
    slug: "getting-started",
    title: "Getting Started with NextDeploy",
    description: "Install the binary, init your project, and ship your first release — end to end.",
    difficulty: "Beginner",
    duration: "15 min",
    steps: 4,
    tags: ["Setup", "CLI", "First Steps"],
  },
  {
    slug: "deploy-to-digitalocean-vps",
    title: "Deploy to a DigitalOcean VPS",
    description: "Stand up a fresh droplet and ship a production Next.js app over SSH.",
    difficulty: "Intermediate",
    duration: "25 min",
    steps: 6,
    tags: ["VPS", "DigitalOcean", "Production"],
  },
]

const planned = [
  "Connect an external database (Postgres / MySQL)",
  "SSL & custom domains with Caddy",
  "Production monitoring & log streaming",
  "GitHub Actions CI with nextdeploy generate-ci",
]

const difficultyColor = (d?: string) =>
  ({
    Beginner: "border-term-green/40 text-term-green",
    Intermediate: "border-term-amber/40 text-term-amber",
    Advanced: "border-term-crimson/40 text-term-crimson",
  })[d ?? ""] ?? "border-rule text-muted-foreground"

export default async function GuidesPage() {
  const fromNotion = await getPublishedContent("Guide")
  const guides: GuideCard[] = fromNotion.length
    ? fromNotion.map((g) => ({
        slug: g.slug,
        title: g.title,
        description: g.summary,
        difficulty: g.difficulty,
        duration: g.duration,
        tags: g.tags,
      }))
    : SEEDED

  return (
    <div className="grain min-h-screen font-mono">
      <div className="container max-w-4xl py-16">
        <header className="border-b border-rule pb-8">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-term-green">// guides</span>
          <h1 className="mt-5 font-grotesk text-4xl font-bold tracking-tight text-foreground">Guides</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Practical, step-by-step walkthroughs. One sequence at a time — no hand-waving.
          </p>
        </header>

        <div className="mt-8 space-y-4">
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="codex-card group block p-5">
              <div className="flex items-center gap-3 text-xs">
                <span className={`border px-2 py-0.5 ${difficultyColor(guide.difficulty)}`}>
                  {guide.difficulty ?? "Guide"}
                </span>
                {guide.steps != null && (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <ListOrdered className="size-3.5 text-term-green" />
                    {guide.steps} steps
                  </span>
                )}
                {guide.duration && (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-3.5" />
                    {guide.duration}
                  </span>
                )}
                <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-term-green" />
              </div>

              <h2 className="mt-3 font-grotesk text-xl font-bold text-foreground group-hover:text-term-green">
                {guide.title}
              </h2>
              {guide.description && <p className="mt-1.5 text-sm text-muted-foreground">{guide.description}</p>}

              <div className="mt-3 flex flex-wrap gap-2">
                {guide.tags.map((tag) => (
                  <span key={tag} className="border border-rule px-2 py-0.5 text-[11px] text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 border-t border-rule pt-8">
          <h3 className="flex items-center gap-2 font-grotesk text-sm font-semibold text-foreground">
            <Hammer className="size-4 text-term-amber" />
            Being written by hand
          </h3>
          <ul className="mt-4 space-y-2">
            {planned.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-rule">$</span>
                <span className="opacity-60">{p}</span>
                <span className="text-[11px] text-term-amber/70">// soon</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
