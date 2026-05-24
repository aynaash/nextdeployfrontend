import { Github, Twitter, Mail } from "lucide-react";
import DiscordIcon, { DISCORD_INVITE } from "./discord-icon";

export default function Footer() {
  return (
    <footer className="py-10 sm:py-12 bg-slate-950 border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h3 className="text-white font-bold text-base mb-1">NextDeploy</h3>
          <p className="text-gray-500 text-sm">
            Self-hosted Next.js deployment. Open-source & transparent.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a href="/docs" className="text-gray-400 hover:text-white text-sm transition-colors">
            Docs
          </a>
          <a
            href="https://github.com/aynaash/NextDeploy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <DiscordIcon className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com/hersiyussuf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 border-t border-slate-800/60 pt-6">
        <p className="text-gray-600 text-xs text-center">
          © 2026 NextDeploy · Open-source under MIT License
        </p>
      </div>
    </footer>
  );
}
