'use client';

import * as React from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface DocsCodeBlockProps {
  children: React.ReactNode;
  title?: string;
  language?: string;
}

/**
 * The docs code block — terminal-styled header with click-to-copy. Reads the
 * raw text straight from the rendered <pre>, so it copies correctly whatever
 * shape MDX hands us (template-literal string, inline nodes, …).
 */
export function DocsCodeBlock({ children, title, language = 'bash' }: DocsCodeBlockProps) {
  const preRef = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(() => {
    const text = preRef.current?.textContent ?? '';
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }, []);

  return (
    <div className="not-prose my-6 border border-rule bg-surface font-mono text-[13px]">
      <div className="flex items-center justify-between border-b border-rule bg-void/60 px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-term-green" />
          {title ?? language}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 transition-colors hover:text-term-green"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-term-green" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre ref={preRef} className="overflow-x-auto p-3 text-slate-200">
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
}
