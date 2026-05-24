"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Github } from "lucide-react";
import DiscordIcon, { DISCORD_INVITE } from "./discord-icon";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="p-2 -mr-2 rounded-md text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div
          className="fixed inset-0 top-16 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800"
          onClick={() => setOpen(false)}
        >
          <nav
            className="flex flex-col p-6 gap-1 max-w-7xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href="/docs"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-base font-medium text-gray-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Documentation
            </Link>
            <a
              href="https://github.com/aynaash/NextDeploy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-base font-medium text-gray-200 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-base font-medium text-gray-200 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
            >
              <DiscordIcon className="w-4 h-4" /> Discord
            </a>
            <Link
              href="/docs"
              onClick={() => setOpen(false)}
              className="mt-3 px-4 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-base font-bold text-center transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
