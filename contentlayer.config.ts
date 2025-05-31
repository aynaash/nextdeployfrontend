// contentlayer.config.ts

import {
  ComputedFields,
  defineDocumentType,
  makeSource,
} from "contentlayer2/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

// 🔐 Define your author whitelist
const BLOG_AUTHORS = {
  shadcn: { name: "ShadCN", avatar: "/authors/shadcn.png" },
  mickasmt: { name: "Mick Asmt", avatar: "/authors/mickasmt.png" },
  janeDoe: { name: "Jane Doe", avatar: "/authors/jane.png" },
  johnSmith: { name: "John Smith", avatar: "/authors/john.png" },
} as const;

type AuthorUsername = keyof typeof BLOG_AUTHORS;

const defaultComputedFields: ComputedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
  images: {
    type: "list",
    resolve: (doc) =>
      doc.body.raw.match(/(?<=<Image[^>]*\bsrc=")[^"]+(?="[^>]*\/>)/g) || [],
  },
};

const commonFields = {
  title: { type: "string", required: true },
  description: { type: "string" },
  published: { type: "boolean", default: true },
};

// 🧠 Merge + Normalize Post
export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields: {
    ...commonFields,
    date: { type: "date", required: true },
    image: { type: "string", required: true },
    authors: {
      type: "list",
      of: { type: "string" },
      required: true,
      resolve: (post) => {
        const raw = post.authors;
        // Defensive: allow single string or list
        if (Array.isArray(raw)) return raw;
        if (typeof raw === "string") return [raw];
        return [];
      },
    },
    categories: {
      type: "list",
      of: {
        type: "enum",
        options: ["news", "education"],
      },
      required: true,
    },
    related: {
      type: "list",
      of: { type: "string" },
    },
  },
  computedFields: {
    ...defaultComputedFields,
    authorDetails: {
      type: "json",
      resolve: (post) => {
        const authors = Array.isArray(post.authors)
          ? post.authors
          : typeof post.authors === "string"
          ? [post.authors]
          : [];
        return authors
          .filter((a): a is AuthorUsername => a in BLOG_AUTHORS)
          .map((a) => BLOG_AUTHORS[a]);
      },
    },
  },
}));

// 🧾 Other types
export const Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: `docs/**/*.mdx`,
  contentType: "mdx",
  fields: { ...commonFields },
  computedFields: defaultComputedFields,
}));

export const Guide = defineDocumentType(() => ({
  name: "Guide",
  filePathPattern: `guides/**/*.mdx`,
  contentType: "mdx",
  fields: {
    ...commonFields,
    date: { type: "date", required: true },
    featured: { type: "boolean", default: false },
  },
  computedFields: defaultComputedFields,
}));

export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `pages/**/*.mdx`,
  contentType: "mdx",
  fields: { ...commonFields },
  computedFields: defaultComputedFields,
}));

export default makeSource({
  contentDirPath: "./content",
  documentTypes: [Page, Doc, Guide, Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "pre") {
            const [codeEl] = node.children;
            if (codeEl?.tagName !== "code") return;
            node.__rawString__ = codeEl.children?.[0].value;
          }
        });
      },
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          keepBackground: false,
          onVisitLine(node) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
        },
      ],
      () => (tree) => {
        visit(tree, (node) => {
          if (
            node?.type === "element" &&
            node?.tagName === "figure" &&
            "data-rehype-pretty-code-figure" in node.properties
          ) {
            const pre = node.children.at(-1);
            if (pre?.tagName === "pre") {
              pre.properties["__rawString__"] = node.__rawString__;
            }
          }
        });
      },
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});
