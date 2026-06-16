import Link from 'next/link';
import { ShieldCheck, GitBranch, Binary, Download, BookText, Github } from 'lucide-react';
import { TerminalHero } from '@/components/docs/terminal-hero';

const REPO = 'https://github.com/aynaash/NextDeploy';

// Specific. Not table-stakes. Every claim has a number or a mechanism.
const differentiators = [
  {
    icon: ShieldCheck,
    title: '5 Gates',
    lines: ['HMAC + replay protection.', 'Fail-closed, not open.'],
  },
  {
    icon: GitBranch,
    title: 'Atomic',
    lines: ['Symlink flip, zero downtime.', 'Rollback = same code as deploy.'],
  },
  {
    icon: Binary,
    title: '27k lines of Go',
    lines: ['One static binary.', 'No Node runtime. Single file.'],
  },
];

const stats = ['v0.8.1', 'Go 1.22', '27,020 lines', '5 security gates', '0 vendor lock-in'];

export default function HeroLanding() {
  return (
    <section className='grain relative overflow-hidden border-b border-rule py-16 sm:py-20'>
      <div className='scanlines absolute inset-0 z-0' />

      <div className='container relative z-10 grid max-w-6xl items-center gap-12 lg:grid-cols-2'>
        {/* Left: the pitch — with hierarchy */}
        <div className='flex flex-col items-start gap-5 text-left'>
          <span className='font-mono text-sm text-term-green'>
            nextdeploy
            <span className='ml-0.5 inline-block h-4 w-2 animate-cursor-blink bg-term-green align-middle' />
          </span>

          <h1 className='font-grotesk text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[56px]'>
            Deploy Next.js to <span className='text-term-green'>your own infrastructure</span>.
          </h1>

          <p className='font-mono text-lg text-foreground/90'>
            <span className='text-muted-foreground'>$ </span>nextdeploy ship.{' '}
            <span className='text-term-green'>That&apos;s it.</span>
          </p>

          <p className='max-w-xl font-mono text-sm leading-relaxed text-muted-foreground'>
            You know how to SSH into a box. You know what a systemd unit is. We don&apos;t need to
            sell you on paradigm shifts — we show you the <code className='text-term-green'>nextdeploy.yml</code>{' '}
            and get out of your way.
          </p>

          <div className='flex flex-wrap gap-3 font-mono'>
            <Link
              href='/docs#install'
              className='group inline-flex items-center gap-2 border border-term-green/40 bg-term-green/5 px-5 py-2.5 text-sm text-term-green transition-colors hover:border-term-green'
            >
              <Download className='size-4' />
              Install
            </Link>
            <Link
              href='/docs'
              className='inline-flex items-center gap-2 border border-rule px-5 py-2.5 text-sm text-foreground/70 transition-colors hover:border-term-blue/60 hover:text-term-blue'
            >
              <BookText className='size-4' />
              Docs
            </Link>
            <Link
              href={REPO}
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center gap-2 border border-rule px-5 py-2.5 text-sm text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground'
            >
              <Github className='size-4' />
              GitHub
            </Link>
          </div>
        </div>

        {/* Right: the machine, with character */}
        <div className='relative z-10'>
          <TerminalHero />
        </div>
      </div>

      {/* Differentiators — specific, gridlined, no fluff */}
      <div className='container relative z-10 mt-14 max-w-6xl'>
        <div className='grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-3'>
          {differentiators.map(({ icon: Icon, title, lines }) => (
            <div key={title} className='bg-void px-5 py-5'>
              <div className='flex items-center gap-2.5'>
                <Icon className='size-5 text-term-green' strokeWidth={1.75} />
                <span className='font-grotesk text-base font-bold text-foreground'>{title}</span>
              </div>
              <div className='mt-2.5 space-y-0.5 font-mono text-xs leading-relaxed text-muted-foreground'>
                {lines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* The meaningful footer — actual information, not "N 2x1" */}
        <div className='mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground'>
          {stats.map((s, i) => (
            <span key={s} className='flex items-center gap-3'>
              {i > 0 && <span className='text-rule'>·</span>}
              <span className={i === 0 ? 'text-term-green' : ''}>{s}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
