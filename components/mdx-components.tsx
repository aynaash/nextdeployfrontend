import type React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, InfoIcon, CheckCircle } from 'lucide-react';
import { DocsCodeBlock } from '@/components/codex/docs-code-block';

export function CodeBlock({
  children,
  title,
  language = 'bash',
}: {
  children: React.ReactNode;
  title?: string;
  language?: string;
}) {
  return (
    <DocsCodeBlock title={title} language={language}>
      {children}
    </DocsCodeBlock>
  );
}

/** Codex callout — terminal-styled, sharp left rule. */
function Callout({
  tone,
  label,
  icon: Icon,
  children,
}: {
  tone: 'info' | 'warning' | 'success';
  label: string;
  icon: typeof InfoIcon;
  children: React.ReactNode;
}) {
  const tones = {
    info: 'border-term-blue/40 bg-term-blue/5 text-term-blue',
    warning: 'border-term-amber/40 bg-term-amber/5 text-term-amber',
    success: 'border-term-green/40 bg-term-green/5 text-term-green',
  }[tone];
  return (
    <div className={`not-prose my-6 border-l-2 px-4 py-3 ${tones}`}>
      <div className="mb-1 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="text-sm leading-relaxed text-slate-300">{children}</div>
    </div>
  );
}

export function Info({ children }: { children: React.ReactNode }) {
  return (
    <Callout tone="info" label="Note" icon={InfoIcon}>
      {children}
    </Callout>
  );
}

export function Warning({ children }: { children: React.ReactNode }) {
  return (
    <Callout tone="warning" label="Warning" icon={AlertTriangle}>
      {children}
    </Callout>
  );
}

export function Success({ children }: { children: React.ReactNode }) {
  return (
    <Callout tone="success" label="Success" icon={CheckCircle}>
      {children}
    </Callout>
  );
}

// Step-by-step flow — the canonical guide primitive.
export { Steps, Step, FlowOverview } from '@/components/codex/steps';

// Interactive, explain-aware doc primitives.
export { Explainable, ExplainableCode } from '@/components/docs/explainable';
export { Mermaid } from '@/components/docs/mermaid';
export { TerminalHero } from '@/components/docs/terminal-hero';
export { DeployTimeline } from '@/components/docs/deploy-timeline';
export { SecurityGates } from '@/components/docs/security-gates';

export {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
};
