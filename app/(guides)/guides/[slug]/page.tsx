
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { MarkdownRenderer } from "@/components/markdown-renderer"

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
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = guides[params.slug as keyof typeof guides]

  if (!guide) {
    return {
      title: "Guide Not Found",
    }
  }

  return {
    title: `${guide.title} | NextDeploy Guides`,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "Advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export default async function GuidePage({ params }: PageProps) {
  const guide = guides[params.slug as keyof typeof guides]

  if (!guide) {
    notFound()
  }

  return (
    <div className="container py-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/guides"
            className="group mb-6 inline-flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
            <ArrowLeft className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
            Back to Guides
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Badge className={cn("rounded-md px-3 py-1 text-sm font-medium", getDifficultyColor(guide.difficulty))}>
                {guide.difficulty}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1.5 size-4" />
                {guide.duration}
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{guide.title}</h1>

            <p className="text-lg text-muted-foreground">{guide.description}</p>

            <div className="flex flex-wrap gap-2">
              {guide.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-md px-2.5 py-0.5 text-xs font-medium"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <MarkdownRenderer content={guide.content} />
        </div>

        <div className="mt-12 border-t pt-8 dark:border-t-gray-800">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Ready for more advanced topics?</h3>
              <p className="text-muted-foreground">Explore our comprehensive courses for deeper learning.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                Browse Courses
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Read Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(guides).map((slug) => ({
    slug,
  }))
}
