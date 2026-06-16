import type React from "react"
import { DocsLayout } from "@/components/docs-layout"

export const revalidate = 60

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>
}
