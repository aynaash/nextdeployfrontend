'use client';
import Link from 'next/link';
import { marketingConfig } from '@/config/marketing';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/shared/icons';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';

interface NavBarProps {
  scroll?: boolean;
}

export function NavBar({ scroll = false }: NavBarProps) {
  const navItems = marketingConfig.mainNav;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex w-full justify-center border-b border-rule bg-void/80 font-mono backdrop-blur-xl'
      )}
    >
      <MaxWidthWrapper className='flex h-12 items-center justify-between' large={false}>
        <div className='flex items-center gap-6'>
          {/* terminal title bar — traffic lights + prompt */}
          <Link href='/' className='flex items-center gap-2.5'>
            <span className='hidden items-center gap-1.5 sm:flex'>
              <span className='size-2.5 rounded-full bg-term-crimson/70' />
              <span className='size-2.5 rounded-full bg-term-amber/70' />
              <span className='size-2.5 rounded-full bg-term-green/70' />
            </span>
            <span className='text-sm'>
              <span className='text-term-green'>nextdeploy</span>
              <span className='text-muted-foreground'>:~$</span>
            </span>
          </Link>

          {navItems.length > 0 && (
            <nav className='hidden items-center gap-1 md:flex'>
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? '#' : item.href}
                  prefetch={true}
                  className={cn(
                    'px-2 py-1 text-xs text-foreground/55 transition-colors hover:text-term-green',
                    item.disabled && 'cursor-not-allowed opacity-80'
                  )}
                >
                  <span className='text-rule'>./</span>
                  {item.title.toLowerCase()}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className='flex items-center gap-2 text-xs'>
          <Link
            href={siteConfig.links.github}
            target='_blank'
            rel='noreferrer'
            className='hidden items-center gap-1.5 border border-rule px-3 py-1.5 text-foreground/70 transition-colors hover:border-term-green/60 hover:text-term-green sm:inline-flex'
          >
            <Icons.gitHub className='size-3.5' />
            <span>star</span>
          </Link>
          <Link
            href='/docs'
            className='inline-flex items-center gap-1.5 border border-term-green/40 bg-term-green/5 px-3 py-1.5 text-term-green transition-colors hover:border-term-green'
          >
            <span className='text-foreground/50'>$</span>
            <span>docs</span>
          </Link>
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
