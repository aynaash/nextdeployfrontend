import Link from "next/link";
import { Suspense } from "react";
import GitHubStarButton from "./github-star-button";
import MobileNav from "./mobile-nav";
import DiscordIcon, { DISCORD_INVITE } from "./discord-icon";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 transform group-hover:rotate-12 transition-transform">
              N
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              NextDeploy
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/docs"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Documentation
            </Link>
            <a
              href="https://github.com/aynaash/NextDeploy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              <DiscordIcon className="w-4 h-4" /> Discord
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:block">
            <Suspense
              fallback={
                <div className="w-32 h-9 bg-slate-800 rounded-lg animate-pulse" />
              }
            >
              <GitHubStarButton />
            </Suspense>
          </div>

          <Link
            href="/docs"
            className="hidden sm:flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20"
          >
            Get Started
          </Link>

          <MobileNav />
        </div>
      </div>
    </nav>
  );
}
