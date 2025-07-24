import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, InfoIcon, CheckCircle, Terminal } from "lucide-react"

export function CodeBlock({
  children,
  title,
  language = "bash",
}: { children: React.ReactNode; title?: string; language?: string }) {
  return (
    <div className="my-6">
      {title && (
        <div className="flex items-center bg-slate-800 text-slate-200 px-4 py-2 rounded-t-lg text-sm font-medium">
          <Terminal className="h-4 w-4 mr-2" />
          {title}
        </div>
      )}
      <pre className={`bg-slate-900 text-slate-100 p-4 overflow-x-auto ${title ? "rounded-b-lg" : "rounded-lg"}`}>
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  )
}

export function Warning({ children }: { children: React.ReactNode }) {
  return (
    <Alert className="my-6 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800 dark:text-yellow-200">Warning</AlertTitle>
      <AlertDescription className="text-yellow-700 dark:text-yellow-300">{children}</AlertDescription>
    </Alert>
  )
}

export function Success({ children }: { children: React.ReactNode }) {
  return (
    <Alert className="my-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800 dark:text-green-200">Success</AlertTitle>
      <AlertDescription className="text-green-700 dark:text-green-300">{children}</AlertDescription>
    </Alert>
  )
}

export {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  InfoIcon as Info,
}
