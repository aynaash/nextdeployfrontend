// components/markdown-renderer.tsx
import { marked } from "marked"
import hljs from "highlight.js"
import "highlight.js/styles/github-dark.css"

marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext"
    return hljs.highlight(code, { language }).value
  },
  langPrefix: "hljs language-",
})

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div
      className="prose max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
    />
  )
}
