
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, User } from "lucide-react"
import Link from "next/link"

const blogPosts = [
  {
    slug: "how-nextdeploy-works",
    title: "How NextDeploy Works: A Deep Dive into CLI-First DevOps",
    description: "Understanding the architecture and philosophy behind NextDeploy's approach to deployment automation.",
    tags: ["DevOps", "Architecture", "CLI"],
    author: "Alex Chen",
    date: "2024-01-15",
    readTime: "8 min read",
  },
  {
    slug: "docker-optimization-strategies",
    title: "Docker Optimization Strategies for Next.js Applications",
    description: "Learn how to optimize your Docker images for faster builds and smaller container sizes.",
    tags: ["Docker", "Next.js", "Performance"],
    author: "Sarah Kim",
    date: "2024-01-10",
    readTime: "12 min read",
  },
  {
    slug: "infrastructure-as-code-best-practices",
    title: "Infrastructure as Code Best Practices with NextDeploy",
    description: "Implementing IaC principles for scalable and maintainable deployment pipelines.",
    tags: ["Infra as Code", "DevOps", "Best Practices"],
    author: "Mike Rodriguez",
    date: "2024-01-05",
    readTime: "10 min read",
  },
  {
    slug: "monitoring-production-deployments",
    title: "Monitoring Production Deployments: Metrics That Matter",
    description: "Essential monitoring strategies and key metrics for production Next.js applications.",
    tags: ["Monitoring", "Production", "Observability"],
    author: "Emily Zhang",
    date: "2023-12-28",
    readTime: "15 min read",
  },
]

export default function BlogPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">NextDeploy Blog</h1>
          <p className="text-xl text-muted-foreground">
            Insights, tutorials, and best practices from our DevOps engineering team
          </p>
        </div>

        <div className="grid gap-8">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-2xl">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600 transition-colors"
                    legacyBehavior>
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">{post.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <span>{post.readTime}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
