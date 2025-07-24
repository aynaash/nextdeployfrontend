
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Users, ArrowLeft, PlayCircle } from "lucide-react"

// This would typically come from a CMS or database
const courses = {
  "deploying-nextjs-to-vps": {
    title: "Deploying Next.js to VPS",
    description: "Complete course on deploying Next.js applications to your own VPS infrastructure",
    level: "Beginner to Intermediate",
    duration: "2.5 hours",
    lessons: 4,
    enrolled: 1247,
    tags: ["Next.js", "VPS", "Production"],
    syllabus: [
      {
        id: 1,
        title: "Project Initialization",
        duration: "30 min",
        description: "Set up your Next.js project and configure NextDeploy",
        completed: false,
        slug: "01-init-project",
      },
      {
        id: 2,
        title: "Building Docker Images",
        duration: "45 min",
        description: "Create optimized Docker images for your Next.js application",
        completed: false,
        slug: "02-build-image",
      },
      {
        id: 3,
        title: "SSH Deployment",
        duration: "50 min",
        description: "Deploy your application to VPS using SSH and automation",
        completed: false,
        slug: "03-ssh-deploy",
      },
      {
        id: 4,
        title: "Monitoring Setup",
        duration: "35 min",
        description: "Implement monitoring, logging, and alerting for production",
        completed: false,
        slug: "04-monitoring-setup",
      },
    ],
  },
}

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const course = courses[params.slug as keyof typeof courses]

  if (!course) {
    return {
      title: "Course Not Found",
    }
  }

  return {
    title: `${course.title} | NextDeploy Courses`,
    description: course.description,
  }
}

const getLevelColor = (level: string) => {
  if (level.includes("Beginner")) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
  if (level.includes("Advanced")) return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
  return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
}

export default function CoursePage({ params }: PageProps) {
  const course = courses[params.slug as keyof typeof courses]

  if (!course) {
    notFound()
  }

  const progress = 0 // This would be calculated based on user progress

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/courses"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {course.lessons} lessons
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {course.enrolled.toLocaleString()} enrolled
                  </div>
                </div>

                <h1 className="text-4xl font-bold leading-tight">{course.title}</h1>

                <p className="text-xl text-muted-foreground leading-relaxed">{course.description}</p>

                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Progress Section */}
              {progress > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Your Progress</h3>
                    <span className="text-sm text-muted-foreground">{progress}% complete</span>
                  </div>
                  <Progress value={progress} className="mb-4" />
                  <p className="text-sm text-muted-foreground">Keep going! You're making great progress.</p>
                </div>
              )}

              {/* Course Syllabus */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Course Content</h2>
                <div className="space-y-3">
                  {course.syllabus.map((lesson, index) => (
                    <div key={lesson.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-full text-sm font-semibold">
                            {lesson.id}
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              <Link
                                href={`/courses/${params.slug}/${lesson.slug}`}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {lesson.title}
                              </Link>
                            </h3>
                            <p className="text-sm text-muted-foreground">{lesson.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                          <Link
                            href={`/courses/${params.slug}/${lesson.slug}`}
                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                          >
                            <PlayCircle className="h-5 w-5 text-blue-600" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What You'll Learn */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">What You'll Learn</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Production-Ready Deployments</h4>
                        <p className="text-sm text-muted-foreground">
                          Learn to deploy Next.js apps to your own infrastructure with confidence
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Docker Optimization</h4>
                        <p className="text-sm text-muted-foreground">
                          Master Docker containerization with size and performance optimizations
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Zero-Downtime Deployments</h4>
                        <p className="text-sm text-muted-foreground">
                          Implement blue-green deployments and automated rollback strategies
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Production Monitoring</h4>
                        <p className="text-sm text-muted-foreground">
                          Set up comprehensive monitoring, logging, and alerting systems
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Start Course Card */}
              <div className="bg-card border rounded-lg p-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">Ready to start learning?</h3>
                  <Link
                    href={`/courses/${params.slug}/${course.syllabus[0].slug}`}
                    className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Start Course
                  </Link>
                  <p className="text-sm text-muted-foreground">Lifetime access • Self-paced learning</p>
                </div>
              </div>

              {/* Course Features */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">This course includes:</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>HD video recordings</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Complete source code</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Deployment checklists</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Community support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>

              {/* Instructor */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Your Instructor</h3>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">ND</span>
                  </div>
                  <div>
                    <h4 className="font-medium">NextDeploy Team</h4>
                    <p className="text-sm text-muted-foreground">
                      DevOps engineers with 10+ years of production deployment experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return Object.keys(courses).map((slug) => ({
    slug,
  }))
}
