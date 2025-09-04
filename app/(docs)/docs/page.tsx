
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Book, Code, Zap, Shield, Activity, ArrowRight, FileText, Terminal, Layers } from "lucide-react"
import Link from "next/link"

const docSections = [
  {
    title: "Getting Started",
    description: "Everything you need to know to start using NextDeploy",
    icon: Zap,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    docs: [
      {
        title: "Installation",
        href: "/docs/installation",
        description: "Install and set up NextDeploy CLI",
        difficulty: "Beginner",
      },
      {
        title: "Quick Start",
        href: "/docs/quick-start",
        description: "Deploy your first application in 5 minutes",
        difficulty: "Beginner",
      },
      {
        title: "Configuration",
        href: "/docs/configuration",
        description: "Configure NextDeploy for your project",
        difficulty: "Beginner",
      },
    ],
  },
  {
    title: "Core Concepts",
    description: "Understand NextDeploy's architecture and principles",
    icon: Book,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    docs: [
      {
        title: "Architecture Overview",
        href: "/docs/architecture",
        description: "How NextDeploy works under the hood",
        difficulty: "Intermediate",
      },
      {
        title: "Deployment Strategies",
        href: "/docs/deployment-strategies",
        description: "Blue-green, rolling, and canary deployments",
        difficulty: "Intermediate",
      },
      {
        title: "Infrastructure as Code",
        href: "/docs/infrastructure-as-code",
        description: "Manage infrastructure with code",
        difficulty: "Advanced",
      },
    ],
  },
  {
    title: "CLI Reference",
    description: "Complete command-line interface documentation",
    icon: Terminal,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    docs: [
      {
        title: "Commands",
        href: "/docs/cli/commands",
        description: "All available CLI commands",
        difficulty: "Reference",
      },
      {
        title: "Configuration File",
        href: "/docs/cli/config-file",
        description: "nextdeploy.config.js reference",
        difficulty: "Reference",
      },
      {
        title: "Environment Variables",
        href: "/docs/cli/environment-variables",
        description: "Environment configuration options",
        difficulty: "Reference",
      },
    ],
  },
  {
    title: "Deployment Targets",
    description: "Deploy to various infrastructure platforms",
    icon: Layers,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
    docs: [
      {
        title: "VPS Deployment",
        href: "/docs/targets/vps",
        description: "Deploy to virtual private servers",
        difficulty: "Intermediate",
      },
      {
        title: "Kubernetes",
        href: "/docs/targets/kubernetes",
        description: "Deploy to Kubernetes clusters",
        difficulty: "Advanced",
      },
      {
        title: "Docker Swarm",
        href: "/docs/targets/docker-swarm",
        description: "Deploy to Docker Swarm clusters",
        difficulty: "Advanced",
      },
    ],
  },
  {
    title: "Monitoring & Observability",
    description: "Monitor and observe your deployments",
    icon: Activity,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    docs: [
      {
        title: "Metrics Collection",
        href: "/docs/monitoring/metrics",
        description: "Collect and analyze application metrics",
        difficulty: "Intermediate",
      },
      {
        title: "Logging",
        href: "/docs/monitoring/logging",
        description: "Structured logging and log management",
        difficulty: "Intermediate",
      },
      {
        title: "Alerting",
        href: "/docs/monitoring/alerting",
        description: "Set up alerts and notifications",
        difficulty: "Advanced",
      },
    ],
  },
  {
    title: "Security",
    description: "Secure your deployments and infrastructure",
    icon: Shield,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
    docs: [
      {
        title: "Authentication",
        href: "/docs/security/authentication",
        description: "Secure access to your deployments",
        difficulty: "Intermediate",
      },
      {
        title: "Secrets Management",
        href: "/docs/security/secrets",
        description: "Manage sensitive configuration data",
        difficulty: "Advanced",
      },
      {
        title: "Network Security",
        href: "/docs/security/network",
        description: "Secure network configurations",
        difficulty: "Advanced",
      },
    ],
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
    case "Reference":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
  }
}

export default function DocsPage() {
  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold">Documentation</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete documentation for NextDeploy. Learn how to deploy, monitor, and manage your Next.js applications
            with confidence.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-fit">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>New to NextDeploy?</CardTitle>
              <CardDescription>Start with our quick start guide</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link
                href="/docs/quick-start"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                Quick Start Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit">
                <Code className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>API Reference</CardTitle>
              <CardDescription>Complete CLI and API documentation</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link
                href="/docs/api"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                API Reference
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full w-fit">
                <Book className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Examples</CardTitle>
              <CardDescription>Real-world deployment examples</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link
                href="/docs/examples"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                View Examples
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Documentation Sections */}
        <div className="space-y-12">
          {docSections.map((section) => {
            const IconComponent = section.icon
            return (
              <div key={section.title} className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 ${section.bgColor} rounded-lg`}>
                    <IconComponent className={`h-6 w-6 ${section.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                    <p className="text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.docs.map((doc) => (
                    <Card key={doc.href} className="hover:shadow-lg transition-shadow group">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getDifficultyColor(doc.difficulty)}>{doc.difficulty}</Badge>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                        </div>
                        <CardTitle className="text-lg">
                          <Link
                            href={doc.href}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {doc.title}
                          </Link>
                        </CardTitle>
                        <CardDescription>{doc.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-16 pt-12 border-t">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-8">Can't find what you're looking for? We're here to help.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/guides"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Guides
              </Link>
              <Link
                href="https://github.com/nextdeploy/nextdeploy/discussions"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Community Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
