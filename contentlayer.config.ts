/**
 * Contentlayer configuration for MDX content processing
 * @file config/contentlayer.ts
 * @description Defines document types, fields, and MDX processing pipeline
 */

import type { Element } from 'hast';
import {
  ComputedFields,
  defineDocumentType,
  makeSource,
  type FieldDef,
} from 'contentlayer2/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

// --- Constants and Type Definitions --- //

/**
 * Whitelist of allowed authors with their metadata
 * @constant {Object} BLOG_AUTHORS
 */
const BLOG_AUTHORS = {
  yussuf: { name: 'yussuf', avatar: '/authors/yussuf.png' },
} as const;

type AuthorUsername = keyof typeof BLOG_AUTHORS;

// --- Shared Configuration --- //

/**
 * Default computed fields for all document types
 * @constant {ComputedFields} defaultComputedFields
 */
const defaultComputedFields: ComputedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
  },
  images: {
    type: 'list',
    resolve: (doc) => doc.body.raw.match(/(?<=<Image[^>]*\bsrc=")[^"]+(?="[^>]*\/>)/g) || [],
  },
};

/**
 * Common fields shared across multiple document types
 * @constant {Record<string, FieldDef>} commonFields
 */
const commonFields: Record<string, FieldDef> = {
  title: { type: 'string', required: true },
  description: { type: 'string' },
  published: { type: 'boolean', default: true },
};

// --- Document Type Definitions --- //

/**
 * Blog Post document type configuration
 * @type {import('contentlayer2/source-files').DocumentTypeDef}
 */
export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    ...commonFields,
    date: { type: 'date', required: true },
    image: { type: 'string', required: true },
    authors: {
      type: 'list',
      of: { type: 'string' },
      required: true,
    },
    categories: {
      type: 'list',
      of: {
        type: 'enum',
        options: ['news', 'education'],
      },
      required: true,
    },
    related: {
      type: 'list',
      of: { type: 'string' },
    },
  },
  computedFields: {
    ...defaultComputedFields,
    authorDetails: {
      type: 'json',
      resolve: (post) => {
        const authors = Array.isArray(post.authors)
          ? post.authors
          : typeof post.authors === 'string'
            ? [post.authors]
            : [];
        return authors
          .filter((a): a is AuthorUsername => a in BLOG_AUTHORS)
          .map((a) => BLOG_AUTHORS[a]);
      },
    },
  },
}));

/**
 * Documentation document type configuration
 * @type {import('contentlayer2/source-files').DocumentTypeDef}
 */
export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: `docs/**/*.mdx`,
  contentType: 'mdx',
  fields: commonFields,
  computedFields: defaultComputedFields,
}));

/**
 * Guide document type configuration
 * @type {import('contentlayer2/source-files').DocumentTypeDef}
 */
export const Guide = defineDocumentType(() => ({
  name: 'Guide',
  filePathPattern: `guides/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    ...commonFields,
    date: { type: 'date', required: true },
    featured: { type: 'boolean', default: false },
  },
  computedFields: defaultComputedFields,
}));

/**
 * Page document type configuration
 * @type {import('contentlayer2/source-files').DocumentTypeDef}
 */
export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: `pages/**/*.mdx`,
  contentType: 'mdx',
  fields: commonFields,
  computedFields: defaultComputedFields,
}));

// --- MDX Processing Configuration --- //

/**
 * Rehype plugin to extract raw code from pre elements
 */
const extractCodeFromPre = () => (tree: any) => {
  visit(tree, (node) => {
    if (node?.type === 'element' && node?.tagName === 'pre') {
      const [codeEl] = node.children;
      if (codeEl?.tagName !== 'code') return;
      node.__rawString__ = codeEl.children?.[0].value;
    }
  });
};

/**
 * Rehype plugin to attach raw code string to pretty code figures
 */
const attachRawStringToFigures = () => (tree: any) => {
  visit(tree, (node) => {
    if (
      node?.type === 'element' &&
      node?.tagName === 'figure' &&
      'data-rehype-pretty-code-figure' in node.properties
    ) {
      const pre = node.children.at(-1);
      if (pre?.tagName === 'pre') {
        pre.properties['__rawString__'] = node.__rawString__;
      }
    }
  });
};

// --- Contentlayer Source Configuration --- //

/**
 * Contentlayer source configuration
 * @type {import('contentlayer2/source-files').MakeSourceOptions}
 */
export default makeSource({
  contentDirPath: './content',
  documentTypes: [Page, Doc, Guide, Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug, // Add IDs to headings
      extractCodeFromPre,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          keepBackground: false,
          onVisitLine(node: Element) {
            // Prevent empty lines from collapsing
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
        },
      ],
      attachRawStringToFigures,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
});
