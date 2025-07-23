import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allPosts } from '../../../../../.contentlayer/generated';
import { BLOG_CATEGORIES } from '../../../../../config/blog';
import { constructMetadata, getBlurDataURL } from '../../../../../lib/utils';
import { BlogCard } from '@/components/content/blog-card';

// Extract the CategorySlug type from BLOG_CATEGORIES
type CategorySlug = (typeof BLOG_CATEGORIES)[number]['slug'];

// Type guard to verify valid category slugs
function isValidCategory(slug: string): slug is CategorySlug {
  return BLOG_CATEGORIES.some((category) => category.slug === slug);
}

export async function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!isValidCategory(slug)) {
    return {};
  }

  const category = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!category) {
    return {};
  }

  return constructMetadata({
    title: `${category.title} Posts – NextDeploy`,
    description: category.description,
  });
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!isValidCategory(slug)) {
    notFound();
  }

  const category = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!category) {
    notFound();
  }

  const articles = await Promise.all(
    allPosts
      .filter((post) => {
        // More explicit type-safe filtering
        return post.categories.some((category: string) => category === slug);
      })
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(async (post) => ({
        ...post,
        blurDataURL: await getBlurDataURL(post.image),
      }))
  );

  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {articles.map((article, idx) => (
        <BlogCard key={article._id} data={article} priority={idx <= 2} />
      ))}
    </div>
  );
}
