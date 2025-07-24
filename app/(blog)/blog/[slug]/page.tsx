
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, User, ArrowLeft, Clock } from "lucide-react"

// Import MDX files
import HowNextDeployWorks from "@/content/blog/how-nextdeploy-works.mdx"
import DockerOptimization from "@/content/blog/docker-optimization-strategies.mdx"
import InfrastructureAsCode from "@/content/blog/infrastructure-as-code-best-practices.mdx"
import MonitoringProduction from "@/content/blog/monitoring-production-deployments.mdx"

const blogPosts = {
  "how-nextdeploy-works": {
    title: "How NextDeploy Works: A Deep Dive into CLI-First DevOps",
    description: "Understanding the architecture and philosophy behind NextDeploy's approach to deployment automation.",
    author: "Alex Chen",
    date: "2024-01-15",
    readTime: "8 min read",
    tags: ["DevOps", "Architecture", "CLI"],
    component: HowNextDeployWorks,
  },
  "docker-optimization-strategies": {
    title: "Docker Optimization Strategies for Next.js Applications",
    description: "Learn how to optimize your Docker images for faster builds and smaller container sizes.",
    author: "Sarah Kim",
    date: "2024-01-10",
    readTime: "12 min read",
    tags: ["Docker", "Next.js", "Performance"],
    component: DockerOptimization,
  },
  "infrastructure-as-code-best-practices": {
    title: "Infrastructure as Code Best Practices with NextDeploy",
    description: "Implementing IaC principles for scalable and maintainable deployment pipelines.",
    author: "Mike Rodriguez",
    date: "2024-01-05",
    readTime: "10 min read",
    tags: ["Infra as Code", "DevOps", "Best Practices"],
    component: InfrastructureAsCode,
  },
  "monitoring-production-deployments": {
    title: "Monitoring Production Deployments: Metrics That Matter",
    description: "Essential monitoring strategies and key metrics for production Next.js applications.",
    author: "Emily Zhang",
    date: "2023-12-28",
    readTime: "15 min read",
    tags: ["Monitoring", "Production", "Observability"],
    component: MonitoringProduction,
  },
}

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = blogPosts[params.slug as keyof typeof blogPosts]

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | NextDeploy Blog`,
    description: post.description,
  }
}

export default function BlogPost({ params }: PageProps) {
  const post = blogPosts[params.slug as keyof typeof blogPosts]

  if (!post) {
    notFound()
  }

  const ContentComponent = post.component

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>

            <p className="text-xl text-muted-foreground leading-relaxed">{post.description}</p>

            <div className="flex items-center text-sm text-muted-foreground space-x-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {post.author}
              </div>
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                {new Date(post.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.readTime}
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <ContentComponent />
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Want to learn more?</h3>
              <p className="text-muted-foreground">Check out our comprehensive guides and courses.</p>
            </div>
            <div className="space-x-4">
              <Link
                href="/guides"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Read Guides
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}
