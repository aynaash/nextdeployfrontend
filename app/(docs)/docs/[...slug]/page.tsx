import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getContentBySlug, getBlocks, getAllSlugs } from '@/lib/notion/content';
import { isNotionConfigured } from '@/lib/notion/client';
import { NotionPage } from '@/components/notion/notion-page';
import { DocsPager } from '@/components/docs/pager';
import { constructMetadata, absoluteUrl } from '@/lib/utils';

// Import MDX files (fallback until everything lives in Notion)
import Installation from '@/content/docs/installation.mdx';
import QuickStart from '@/content/docs/quick-start.mdx';
import VpsDeployment from '@/content/docs/vps-deployment.mdx';
import CloudflareDeployment from '@/content/docs/cloudflare-deployment.mdx';
import CloudflareProtection from '@/content/docs/cloudflare-protection.mdx';
import Configuration from '@/content/docs/configuration.mdx';
import Secrets from '@/content/docs/secrets.mdx';
import NextDeployYml from '@/content/docs/nextdeploy-yml.mdx';

export const revalidate = 60;

const docs = {
  installation: {
    title: 'Installation',
    description: 'Install and set up NextDeploy CLI on your development machine',
    component: Installation,
  },
  'quick-start': {
    title: 'Quick Start',
    description: 'Deploy your first Next.js application with NextDeploy in under 5 minutes',
    component: QuickStart,
  },
  'vps-deployment': {
    title: 'VPS Deployment',
    description:
      'Deploy a Next.js app to your own VPS over SSH — HTTPS, zero-downtime redeploys, and instant rollbacks',
    component: VpsDeployment,
  },
  'cloudflare-deployment': {
    title: 'Cloudflare Deployment',
    description:
      'Deploy a Next.js app to Cloudflare Workers + R2 — D1/Hyperdrive, KV, R2, Workers AI, an edge protection guard, and one-command provisioning',
    component: CloudflareDeployment,
  },
  'cloudflare-protection': {
    title: 'Cloudflare Protection',
    description: 'Edge protection guard reference for NextDeploy — coming soon',
    component: CloudflareProtection,
  },
  configuration: {
    title: 'Configuration',
    description: 'Configuration reference for NextDeploy — coming soon',
    component: Configuration,
  },
  secrets: {
    title: 'Secrets & Credentials',
    description: 'Secrets & credentials reference for NextDeploy — coming soon',
    component: Secrets,
  },
  'nextdeploy-yml': {
    title: 'nextdeploy.yml Reference',
    description: 'Full nextdeploy.yml key reference — coming soon',
    component: NextDeployYml,
  },
};

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

// Build per-doc metadata: full OG/Twitter/metadataBase via constructMetadata,
// plus a self-referencing canonical and an `article` OG type for the doc page.
function docMetadata(slug: string, title: string, description?: string): Metadata {
  const canonical = slug ? `/docs/${slug}` : '/docs';
  const base = constructMetadata({
    title: `${title} | NextDeploy Documentation`,
    description,
  });
  return {
    ...base,
    alternates: { canonical },
    openGraph: {
      ...base.openGraph,
      type: 'article',
      url: canonical,
      title,
      siteName: 'NextDeploy',
    },
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugParts } = await params;
  const slug = slugParts?.join('/') || '';

  const fromNotion = await getContentBySlug('Doc', slug);
  if (fromNotion) {
    return docMetadata(slug, fromNotion.title, fromNotion.summary);
  }

  const doc = docs[slug as keyof typeof docs];
  if (!doc) return constructMetadata({ title: 'Documentation Not Found', noIndex: true });
  return docMetadata(slug, doc.title, doc.description);
}

// Schema.org TechArticle + breadcrumb trail — lets search engines show the doc
// as a rich result and understand the /docs hierarchy.
function DocJsonLd({
  slug,
  title,
  description,
}: {
  slug: string;
  title: string;
  description?: string;
}) {
  const url = absoluteUrl(slug ? `/docs/${slug}` : '/docs');
  const json = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: title,
        description,
        url,
        inLanguage: 'en',
        isPartOf: { '@type': 'WebSite', name: 'NextDeploy', url: absoluteUrl('/') },
        author: { '@type': 'Organization', name: 'NextDeploy' },
        publisher: { '@type': 'Organization', name: 'NextDeploy' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Documentation', item: absoluteUrl('/docs') },
          { '@type': 'ListItem', position: 2, name: title, item: url },
        ],
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}

export default async function DocPage({ params }: PageProps) {
  const { slug: slugParts } = await params;
  const slug = slugParts?.join('/') || '';

  // 1. Notion (source of truth)
  const meta = await getContentBySlug('Doc', slug);
  if (meta) {
    const blocks = await getBlocks(meta.id);
    return (
      <>
        <DocJsonLd slug={slug} title={meta.title} description={meta.summary} />
        <NotionPage meta={meta} blocks={blocks} />
        <DocsPager slug={slug} />
      </>
    );
  }

  // 2. MDX fallback
  const doc = docs[slug as keyof typeof docs];
  if (!doc) notFound();
  const ContentComponent = doc.component;
  return (
    <>
      <DocJsonLd slug={slug} title={doc.title} description={doc.description} />
      <ContentComponent />
      <DocsPager slug={slug} />
    </>
  );
}

export async function generateStaticParams() {
  const notionSlugs = isNotionConfigured() ? await getAllSlugs('Doc') : [];
  const mdx = Object.keys(docs).map((slug) => ({ slug: slug.split('/') }));
  const seen = new Set(notionSlugs.map((s) => s.slug));
  return [
    ...notionSlugs.map((s) => ({ slug: s.slug.split('/') })),
    ...mdx.filter((m) => !seen.has(m.slug.join('/'))),
  ];
}
