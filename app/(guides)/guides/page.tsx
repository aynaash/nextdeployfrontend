
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

const guides = [
  {
    slug: "getting-started",
    title: "Getting Started with NextDeploy",
    description: "Complete setup guide from installation to your first deployment",
    difficulty: "Beginner",
    duration: "15 min",
    tags: ["Setup", "CLI", "First Steps"],
  },
  {
    slug: "deploy-to-digitalocean-vps",
    title: "Deploy to DigitalOcean VPS",
    description: "Step-by-step guide to deploy your Next.js app to a DigitalOcean droplet",
    difficulty: "Intermediate",
    duration: "25 min",
    tags: ["VPS", "DigitalOcean", "Production"],
  },
  {
    slug: "connect-external-database",
    title: "Connect with External Database",
    description: "Configure and connect your application to external databases like PostgreSQL and MongoDB",
    difficulty: "Intermediate",
    duration: "20 min",
    tags: ["Database", "PostgreSQL", "MongoDB"],
  },
  {
    slug: "docker-containerization",
    title: "Docker Containerization Best Practices",
    description: "Optimize your Docker setup for faster builds and smaller images",
    difficulty: "Advanced",
    duration: "30 min",
    tags: ["Docker", "Optimization", "Containers"],
  },
  {
    slug: "ssl-certificates",
    title: "SSL Certificates with Let's Encrypt",
    description: "Automatically provision and renew SSL certificates for your domains",
    difficulty: "Intermediate",
    duration: "18 min",
    tags: ["SSL", "Security", "Let's Encrypt"],
  },
  {
    slug: "monitoring-setup",
    title: "Production Monitoring Setup",
    description: "Configure comprehensive monitoring for your production deployments",
    difficulty: "Advanced",
    duration: "35 min",
    tags: ["Monitoring", "Observability", "Production"],
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
    case "Advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
  }
}

export default function GuidesPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Deployment Guides</h1>
          <p className="text-xl text-muted-foreground">
            Practical, step-by-step guides to master NextDeploy deployment workflows
          </p>
        </div>

        <div className="grid gap-6">
          {guides.map((guide) => (
            <Card key={guide.slug} className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(guide.difficulty)}>{guide.difficulty}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {guide.duration}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="text-xl">
                  <Link href={`/guides/${guide.slug}`} className="hover:text-blue-600 transition-colors">
                    {guide.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-base">{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {guide.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
