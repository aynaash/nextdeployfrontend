"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Terminal, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-md space-y-6 px-4 text-center">
        <div className="flex justify-center">
          <Terminal className="size-24 text-blue-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold text-muted-foreground">Page Not Found</h2>
          <p className="text-muted-foregroup">The page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild>
            <Link href="/" legacyBehavior>
              <Home className="mr-2 size-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 size-4" />
            Go Back
          </Button>
        </div>

        <div className="border-t pt-6">
          <p className="mb-4 text-sm text-muted-foreground">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <Link href="/guides" className="text-blue-600 hover:underline">
              Guides
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/courses" className="text-blue-600 hover:underline">
              Courses
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/blog" className="text-blue-600 hover:underline">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
