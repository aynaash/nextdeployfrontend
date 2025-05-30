import { notFound } from "next/navigation"
import { allDocs } from "../../../../.contentlayer/generated"
import { getTableOfContents } from "@/lib/toc"
import { Mdx } from "@/components/content/mdx-components"
import { DocsPageHeader } from "@/components/docs/page-header"
import { DocsPager } from "@/components/docs/pager"
import { DashboardTableOfContents } from "@/components/shared/toc"
import "@/styles/mdx.css"
import type { Metadata } from "next"
import { constructMetadata, getBlurDataURL } from "@/lib/utils"

type tParams = Promise<{ slug?: string[] }>

async function getDocFromParams(slug?: string[]) {
  const slugPath = slug?.join("/") || ""
  const doc = allDocs.find((doc) => doc.slugAsParams === slugPath)
  return doc ?? null
}

export async function generateMetadata({
  params,
}: {
  params: tParams
}): Promise<Metadata> {
  const { slug }: { slug?: string[] } = await params
  const doc = await getDocFromParams(slug)
  if (!doc) return {}
  return constructMetadata({
    title: `${doc.title} – SaaS Starter`,
    description: doc.description,
  })
}

export async function generateStaticParams() {
  return allDocs.map((doc) => ({
    slug: doc.slugAsParams.split("/"),
  }))
}

export default async function DocPage({
  params,
}: {
  params: tParams
}) {
  const { slug }: { slug?: string[] } = await params
  const doc = await getDocFromParams(slug)
  if (!doc) notFound()

  const [toc, images] = await Promise.all([
    getTableOfContents(doc.body.raw),
    Promise.all(
      doc.images.map(async (src: string) => ({
        src,
        blurDataURL: await getBlurDataURL(src),
      })),
    ),
  ])

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <DocsPageHeader heading={doc.title} text={doc.description} />
        <div className="pb-4 pt-11">
          <Mdx code={doc.body.code} images={images} />
        </div>
        <hr className="my-4 md:my-6" />
        <DocsPager doc={doc} />
      </div>
      <div className="hidden text-sm xl:block">
        <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-8">
          <DashboardTableOfContents toc={toc} />
        </div>
      </div>
    </main>
  )
}
