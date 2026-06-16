import Link from "next/link"
import {
  Server,
  Cloud,
  CloudCog,
  Zap,
  Shield,
  Activity,
  ArrowRight,
  Rocket,
  Globe,
  Github,
} from "lucide-react"
import HeroLanding from "@/components/sections/hero-landing"
import { StructCard } from "@/components/codex/struct-card"
import { SectionHeading } from "@/components/codex/section-heading"

const REPO = "https://github.com/aynaash/NextDeploy"

const steps = [
  { cmd: "nextdeploy init", desc: "Pick your target — VPS / AWS / Cloudflare. Writes nextdeploy.yml." },
  { cmd: "nextdeploy secrets load .env", desc: "Inject the env and secrets your platform needs." },
  { cmd: "nextdeploy ship", desc: "Build, upload, activate, verify — zero downtime, instant rollback." },
]

const targets = [
  { icon: Server, name: "VPS", tagline: "Your box. Your rules. Our automation.", detail: "Deploys over SSH (chacha20-poly1305). Caddy, nextdeployd, and Fail2Ban provisioned in one command." },
  { icon: Cloud, name: "AWS", tagline: "Provisioned, not configured.", detail: "Lambda, S3, ACM and CloudFront stood up on first ship from a single nextdeploy.yml." },
  { icon: CloudCog, name: "Cloudflare", tagline: "The edge. Now with Next.js.", detail: "Workers + R2, with R2 credentials derived from your API token automatically." },
]

const pillars = [
  { icon: Zap, title: "Fast deployment", desc: "A Go-powered engine ships your Next.js app in seconds — standalone build, parallel upload, atomic cutover." },
  { icon: Shield, title: "Infrastructure ownership", desc: "Deploy to your own VPS or cloud account. No vendor lock-in, full control over your infrastructure and costs." },
  { icon: Activity, title: "Observability built in", desc: "Tail live logs, check health and current release, and roll back the moment a deploy goes sideways." },
]

export default function IndexPage() {
  return (
    <div className="grain min-h-screen font-mono">
      <HeroLanding />

      {/* How it works */}
      <section className="relative z-10 border-b border-rule py-20">
        <div className="container max-w-5xl">
          <SectionHeading icon={Rocket}>Three commands to production</SectionHeading>
          <p className="mt-3 font-mono text-sm text-muted-foreground">Type less. Understand more.</p>

          <div className="mt-8 border border-rule">
            {steps.map((s, i) => (
              <div
                key={s.cmd}
                className="flex flex-col gap-1 border-b border-rule px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:gap-5"
              >
                <span className="select-none font-mono text-sm font-bold text-term-purple">{`0x00${i + 1}`}</span>
                <code className="font-mono text-sm text-term-green">
                  <span className="text-muted-foreground">$ </span>
                  {s.cmd}
                </code>
                <span className="font-mono text-xs text-muted-foreground sm:ml-auto sm:max-w-md sm:text-right">
                  {s.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Targets */}
      <section className="relative z-10 border-b border-rule py-20">
        <div className="container max-w-6xl">
          <SectionHeading icon={Globe}>One flow, three targets</SectionHeading>
          <p className="mt-3 font-mono text-sm text-muted-foreground">
            The same <code className="text-term-green">nextdeploy ship</code> — your choice of machine.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {targets.map((t) => {
              const Icon = t.icon
              return (
                <StructCard key={t.name} className="flex flex-col">
                  <Icon className="size-6 text-term-blue" strokeWidth={1.5} />
                  <h3 className="mt-4 font-grotesk text-xl font-bold text-foreground">{t.name}</h3>
                  <p className="mt-1 font-mono text-xs text-term-green">{t.tagline}</p>
                  <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">{t.detail}</p>
                </StructCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="relative z-10 border-b border-rule py-20">
        <div className="container max-w-6xl">
          <SectionHeading icon={Shield}>Why NextDeploy</SectionHeading>
          <p className="mt-3 font-mono text-sm text-muted-foreground">
            Built by DevOps engineers, for developers who want control.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {pillars.map((p) => {
              const Icon = p.icon
              return (
                <StructCard key={p.title}>
                  <Icon className="size-6 text-term-green" strokeWidth={1.5} />
                  <h3 className="mt-4 font-grotesk text-lg font-bold text-foreground">{p.title}</h3>
                  <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                </StructCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20">
        <div className="container max-w-3xl text-center">
          <h2 className="font-grotesk text-3xl font-bold text-foreground">Ready to ship?</h2>
          <p className="mx-auto mt-3 max-w-xl font-mono text-sm text-muted-foreground">
            One binary. No Node runtime. Just curl and ship.
          </p>

          <div className="mx-auto mt-8 max-w-xl border border-rule bg-surface text-left">
            <div className="border-b border-rule bg-void/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              install.sh
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-sm text-term-green">
              <span className="text-muted-foreground"># one line, no dependencies</span>
              {"\n"}curl -fsSL https://nextdeploy.org/install.sh | bash
            </pre>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 font-mono">
            <Link
              href="/docs"
              className="group inline-flex items-center gap-2 border border-term-green/40 bg-term-green/5 px-5 py-2.5 text-sm text-term-green transition-colors hover:border-term-green"
            >
              <span className="text-muted-foreground">$</span>
              read the docs
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-rule px-5 py-2.5 text-sm text-foreground/70 transition-colors hover:border-term-blue/60 hover:text-term-blue"
            >
              <Github className="size-4" />
              Star on GitHub
            </Link>
          </div>

          <p className="mt-12 font-mono text-xs text-muted-foreground">
            $ nextdeploy docs --built-with=curiosity
            <span className="ml-1 inline-block h-3.5 w-2 animate-cursor-blink bg-term-green align-middle" />
          </p>
        </div>
      </section>
    </div>
  )
}
