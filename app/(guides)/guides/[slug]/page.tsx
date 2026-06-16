
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { getContentBySlug, getBlocks, getAllSlugs } from "@/lib/notion/content"
import { isNotionConfigured } from "@/lib/notion/client"
import { NotionPage } from "@/components/notion/notion-page"

// Content is sourced from Notion (Kind = Guide). The hardcoded `guides` below is
// a temporary fallback so the two seeded guides keep working until the DB is wired.
export const revalidate = 60

// This would typically come from a CMS or markdown files
const guides = {
  "getting-started": {
    title: "Getting Started with NextDeploy",
    description: "Complete setup guide from installation to your first deployment",
    difficulty: "Beginner",
    duration: "15 min",
    tags: ["Setup", "CLI", "First Steps"],
    content: `# Getting Started with NextDeploy

Welcome to NextDeploy! This guide will walk you through everything you need to know to get started with CLI-first deployments for your Next.js applications.

## Prerequisites

Before we begin, make sure you have:

- Node.js 16 or higher installed
- A Next.js application ready for deployment
- Basic familiarity with command line tools
- Access to a VPS or cloud server

## Step 1: Install NextDeploy CLI

First, install the NextDeploy CLI globally:

\`\`\`bash
npm install -g nextdeploy

# Verify the installation
nextdeploy --version
\`\`\`

## Step 2: Initialize Your Project

Navigate to your Next.js project directory and initialize NextDeploy:

\`\`\`bash
cd your-nextjs-app
nextdeploy init
\`\`\`

This will create a \`nextdeploy.config.js\` file with default settings.

## Step 3: Configure Your Deployment Target

Edit the generated configuration file to add your server details:

\`\`\`javascript
module.exports = {
  app: {
    name: 'my-app',
    framework: 'nextjs',
    buildCommand: 'npm run build',
    startCommand: 'npm start'
  },
  targets: {
    production: {
      type: 'vps',
      host: 'your-server.com',
      user: 'deploy',
      path: '/var/www/my-app'
    }
  }
}
\`\`\`

## Step 4: Deploy Your Application

Now you're ready to deploy:

\`\`\`bash
# Validate your configuration
nextdeploy validate --target production

# Deploy to production
nextdeploy deploy --target production
\`\`\`

## Next Steps

Congratulations! Your application should now be running on your server. Here are some next steps:

- Set up SSL certificates with Let's Encrypt
- Configure monitoring and logging  
- Set up automated backups
- Explore advanced deployment strategies

Check out our other guides for more advanced topics!`,
  },
  "deploy-to-digitalocean-vps": {
    title: "Deploy to DigitalOcean VPS",
    description: "Step-by-step guide to deploy your Next.js app to a DigitalOcean droplet",
    difficulty: "Intermediate",
    duration: "25 min",
    tags: ["VPS", "DigitalOcean", "Production"],
    content: `# Deploy to DigitalOcean VPS

This comprehensive guide will walk you through deploying your Next.js application to a DigitalOcean VPS using NextDeploy.

## Prerequisites

- DigitalOcean account
- NextDeploy CLI installed
- SSH key pair generated
- Next.js application ready for deployment

## Step 1: Create Your Droplet

1. Log into your DigitalOcean dashboard
2. Click "Create" → "Droplets"
3. Choose Ubuntu 22.04 LTS
4. Select Basic plan ($12/month recommended)
5. Add your SSH key
6. Create the droplet

## Step 2: Initial Server Setup

Connect to your new droplet:

\`\`\`bash
ssh root@your-droplet-ip
\`\`\`

Update the system and install essential packages:

\`\`\`bash
apt update && apt upgrade -y
apt install -y nginx nodejs npm git ufw
\`\`\`

## Step 3: Configure Security

Set up a firewall and create a deployment user:

\`\`\`bash
ufw allow OpenSSH
ufw allow 'Nginx Full' 
ufw enable

# Create deploy user
adduser deploy
usermod -aG sudo deploy
\`\`\`

## Step 4: Configure NextDeploy

Update your local \`nextdeploy.config.js\`:

\`\`\`javascript
module.exports = {
  targets: {
    production: {
      type: 'vps',
      host: 'your-droplet-ip',
      user: 'deploy',
      path: '/var/www/my-app',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
}
\`\`\`

## Step 5: Deploy

Deploy your application:

\`\`\`bash
nextdeploy deploy --target production
\`\`\`

## Step 6: Configure Nginx

Set up Nginx as a reverse proxy:

\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
\`\`\`

Your application should now be live! Visit your droplet's IP address to see your deployed Next.js app.

## Next Steps  

- Set up SSL with Let's Encrypt
- Configure monitoring
- Set up automated backups
- Implement CI/CD pipelines`,
  },
}

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  // Notion first
  const fromNotion = await getContentBySlug("Guide", slug)
  if (fromNotion) {
    return {
      title: `${fromNotion.title} | NextDeploy Guides`,
      description: fromNotion.summary,
      openGraph: { title: fromNotion.title, description: fromNotion.summary, type: "article" },
    }
  }

  const guide = guides[slug as keyof typeof guides]
  if (!guide) return { title: "Guide Not Found" }

  return {
    title: `${guide.title} | NextDeploy Guides`,
    description: guide.description,
    openGraph: { title: guide.title, description: guide.description, type: "article" },
    twitter: { card: "summary_large_image", title: guide.title, description: guide.description },
  }
}

function BackLink() {
  return (
    <Link
      href="/guides"
      className="group mb-8 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-term-green"
    >
      <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
      cd ../guides
    </Link>
  )
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params

  // 1. Notion (source of truth)
  const meta = await getContentBySlug("Guide", slug)
  if (meta) {
    const blocks = await getBlocks(meta.id)
    return (
      <div className="grain min-h-screen font-mono">
        <div className="container max-w-4xl py-12">
          <BackLink />
          <NotionPage meta={meta} blocks={blocks} />
        </div>
      </div>
    )
  }

  // 2. Fallback to seeded content until the Notion DB is connected
  const guide = guides[slug as keyof typeof guides]
  if (!guide) notFound()

  return (
    <div className="grain min-h-screen font-mono">
      <div className="container max-w-4xl py-12">
        <BackLink />

        <header className="border-b border-rule pb-8">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-term-green">// guide</span>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="border border-term-amber/40 px-2 py-0.5 text-term-amber">{guide.difficulty}</span>
            <span>{guide.duration}</span>
          </div>
          <h1 className="mt-4 font-grotesk text-4xl font-bold tracking-tight text-foreground">{guide.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{guide.description}</p>
        </header>

        <div className="prose prose-invert mt-8 max-w-none prose-headings:font-grotesk prose-pre:border prose-pre:border-rule prose-pre:bg-surface prose-code:text-term-green">
          <MarkdownRenderer content={guide.content} />
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const notionSlugs = isNotionConfigured() ? await getAllSlugs("Guide") : []
  const seeded = Object.keys(guides).map((slug) => ({ slug }))
  const seen = new Set(notionSlugs.map((s) => s.slug))
  return [...notionSlugs, ...seeded.filter((s) => !seen.has(s.slug))]
}
