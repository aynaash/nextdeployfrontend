// lib/docs.ts
import { promises as fs } from 'fs'
import path from 'path'

export interface Doc {
  slug: string
  title: string
  description: string
  published: boolean
  toc: any[]
  body: string
  slugAsParams: string
}

export async function getAllDocs(): Promise<Doc[]> {
  const docsPath = path.join(process.cwd(), '.velite', 'docs.json')
  const fileContents = await fs.readFile(docsPath, 'utf-8')
  return JSON.parse(fileContents)
}

export async function getDocBySlug(slug: string): Promise<Doc | undefined> {
  const allDocs = await getAllDocs()
  const slugPath = slug.join('/')
  return allDocs.find((doc) => doc.slugAsParams === slugPath)
}
