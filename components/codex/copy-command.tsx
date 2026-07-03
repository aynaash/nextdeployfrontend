'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyCommandProps {
  /** The command that gets copied to the clipboard. */
  command: string;
  /** Label shown in the title bar (e.g. "install.sh"). */
  label?: string;
  /** Optional dimmed comment rendered above the command (not copied). */
  comment?: string;
  className?: string;
}

/**
 * A terminal-styled command block with click-to-copy — for install one-liners
 * on marketing pages. Only the command is copied; the comment is decoration.
 */
export function CopyCommand({ command, label = 'sh', comment, className }: CopyCommandProps) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(() => {
    navigator.clipboard?.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }, [command]);

  return (
    <div className={cn('border border-rule bg-surface text-left', className)}>
      <div className="flex items-center justify-between border-b border-rule bg-void/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 transition-colors hover:text-term-green"
          aria-label="Copy command to clipboard"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-term-green" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm text-term-green">
        {comment && (
          <span className="text-muted-foreground">
            {comment}
            {'\n'}
          </span>
        )}
        {command}
      </pre>
    </div>
  );
}
