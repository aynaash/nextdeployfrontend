
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

const courses = [
  {
    slug: "deploying-nextjs-to-vps",
    title: "Deploying Next.js to VPS",
    description: "Complete course on deploying Next.js applications to your own VPS infrastructure",
    level: "Beginner to Intermediate",
    duration: "2.5 hours",
    lessons: 4,
    enrolled: 1247,
    progress: 0,
    tags: ["Next.js", "VPS", "Production"],
    status: "Available",
  },
  {
    slug: "docker-mastery-for-nextjs",
    title: "Docker Mastery for Next.js",
    description: "Master Docker containerization for Next.js applications with optimization techniques",
    level: "Intermediate",
    duration: "3 hours",
    lessons: 6,
    enrolled: 892,
    progress: 0,
    tags: ["Docker", "Containers", "Optimization"],
    status: "Available",
  },
  {
    slug: "production-monitoring-observability",
    title: "Production Monitoring & Observability",
    description: "Implement comprehensive monitoring and observability for production deployments",
    level: "Advanced",
    duration: "4 hours",
    lessons: 8,
    enrolled: 634,
    progress: 0,
    tags: ["Monitoring", "Observability", "Production"],
    status: "Available",
  },
  {
    slug: "cicd-automation-nextdeploy",
    title: "CI/CD Automation with NextDeploy",
    description: "Build robust CI/CD pipelines using NextDeploy and popular automation tools",
    level: "Intermediate to Advanced",
    duration: "3.5 hours",
    lessons: 7,
    enrolled: 445,
    progress: 0,
    tags: ["CI/CD", "Automation", "DevOps"],
    status: "Coming Soon",
  },
]

const getLevelColor = (level: string) => {
  if (level.includes("Beginner")) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
  if (level.includes("Advanced")) return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
  return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    case "Coming Soon":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
  }
}

export default function CoursesPage() {
  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">NextDeploy Courses</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive courses to master deployment automation and DevOps practices
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <Card key={course.slug} className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <Badge className={getStatusColor(course.status)}>{course.status}</Badge>
                  <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                </div>

                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  <Link href={`/courses/${course.slug}`} className="flex items-center justify-between">
                    {course.title}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardTitle>

                <CardDescription className="text-base leading-relaxed">{course.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {course.lessons} lessons
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.enrolled.toLocaleString()} enrolled
                  </div>
                </div>

                {course.progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
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
