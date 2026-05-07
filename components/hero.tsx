"use client";

import { useState } from "react";
import {
  Terminal,
  Github,
  Zap,
  ArrowRight,
  Server,
  Monitor,
  Copy,
  Check,
  Play,
  Clock,
  Eye,
  Calendar,
} from "lucide-react";
import GitHubStarButton from "@/components/github-star-button";

const installOptions = [
  {
    id: "cli-unix",
    name: "Mac/Linux CLI",
    icon: Terminal,
    cmd: "curl -sSf https://nextdeploy.org/install.sh | sh",
    desc: "Install the NextDeploy CLI on macOS or Linux.",
  },
  {
    id: "cli-win",
    name: "Windows CLI",
    icon: Monitor,
    cmd: "curl.exe -sSfO https://nextdeploy.org/install.bat && install.bat",
    desc: "Install the NextDeploy CLI on Windows.",
  },
  {
    id: "daemon",
    name: "Ubuntu Server",
    icon: Server,
    cmd: "curl -sSf https://nextdeploy.org/daemon.sh | sh",
    desc: "Manual install of the nextdeployd control plane on a VPS — `nextdeploy ship` does this for you automatically.",
  },
];

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(installOptions[0]);

  const copyCmd = () => {
    navigator.clipboard.writeText(activeTab.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 min-h-[calc(100vh-4rem)] lg:min-h-screen">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Main headline */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-emerald-100 via-green-200 to-emerald-100 bg-clip-text text-transparent leading-tight text-center">
          Deploy Next.js to a VPS, AWS, or Cloudflare.
          <br />
          One config file, one command.
        </h1>

        {/* Tagline */}
        <p className="text-sm md:text-base text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed text-center">
          Open-source CLI written in Go. Ships to a Linux VPS over SSH, AWS
          Lambda + S3, or Cloudflare Workers + R2 — with{" "}
          <strong>zero-downtime rollouts</strong> and{" "}
          <strong>total ownership</strong> of your infrastructure.
        </p>

        {/* Action Buttons - more compact */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <a
            href="#install"
            className="px-6 py-3 w-full sm:w-auto rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-emerald-500/20 text-sm"
          >
            Start Shipping Now
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/docs"
            className="px-6 py-3 w-full sm:w-auto rounded-xl bg-slate-800/50 hover:bg-slate-800 text-white font-medium border border-slate-700 hover:border-slate-600 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm text-sm"
          >
            Read Documentation
          </a>
        </div>

        <div className="mb-4"></div>

        {/* Install command box - Slightly smaller to maintain balance */}
        <div id="install" className="max-w-2xl mx-auto group scroll-mt-24">
          <div className="relative bg-gradient-to-br from-slate-950/80 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl text-left">
            {/* Tabs header */}
            <div className="flex border-b border-slate-700/50 bg-slate-900/80 overflow-x-auto">
              {installOptions.map((option) => {
                const Icon = option.icon;
                const isActive = activeTab.id === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setActiveTab(option)}
                    className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 text-xs font-medium transition-colors border-b-2 whitespace-nowrap ${
                      isActive
                        ? "text-emerald-400 border-emerald-500 bg-slate-800/50"
                        : "text-gray-400 border-transparent hover:text-gray-200 hover:bg-slate-800/30"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {option.name}
                  </button>
                );
              })}
            </div>

            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-slate-800/40 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                <span className="ml-3 text-xs text-gray-500 font-mono">
                  {activeTab.id === "cli-win" ? "install.bat" : "install.sh"}
                </span>
              </div>
              <button
                onClick={copyCmd}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-400 hover:text-emerald-300 hover:bg-slate-700/50 rounded-md transition-all duration-200 font-medium"
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Code Execution Block */}
            <div className="p-4 sm:p-6 md:p-8 font-mono text-xs sm:text-sm">
              <div className="flex flex-col gap-3 group">
                <div className="flex items-start gap-3">
                  <span className="text-gray-600 select-none flex-shrink-0 mt-0.5">
                    $
                  </span>
                  <div className="flex-1">
                    <code className="text-emerald-300 break-all font-medium leading-relaxed">
                      {activeTab.cmd}
                    </code>
                    <div className="text-gray-500 mt-4 text-xs flex items-center gap-1.5 italic">
                      # {activeTab.desc}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* YouTube Tutorial Section */}
        <div className="mt-12 sm:mt-20 max-w-4xl mx-auto text-center">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-white">
              See it ship
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              End-to-end walkthrough: a Next.js app to a fresh VPS.
            </p>
          </div>
          <div className="relative group aspect-video w-full rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-900/50">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent z-10 pointer-events-none" />
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/9C8WNZSS5o0"
              title="NextDeploy VPS Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full relative z-0 border-none"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
