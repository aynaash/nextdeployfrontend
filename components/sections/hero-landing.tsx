import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRight, Code, Terminal, Zap, Twitter, Server } from "lucide-react"
import { Icons } from "@/components/shared/icons";


export default function HeroLanding() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-0"></div>

      {/* Gradient orbs */}
      <div className="absolute -top-24 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl z-0"></div>
      <div className="absolute -bottom-24 -right-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl z-0"></div>

      <div className="container relative z-10 flex max-w-5xl flex-col items-center gap-8 text-center">
        <Link
          href="https://twitter.com/HersiYussuf"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "px-4 backdrop-blur-sm bg-background/80 border-muted-foreground/20 hover:bg-background/90 transition-all duration-300",
          )}
          target="_blank"
        >
          <span className="mr-3">🚀</span>
          <span className="hidden md:flex">Introducing&nbsp;</span> NextDeploy
           <Icons.twitter className="ml-2 size-3.5" />

        </Link>

        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px] animate-fade-in">
          Kick off with a bang with{" "}
          <span className="text-gradient_indigo-purple font-extrabold relative">
            automated next js deployment
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-70"></span>
          </span>
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8 animate-fade-in"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Ship your next project using your own cloud VPS and infrastructure with our blazing fast Go-powered deployment
          engine
        </p>

        <div
          className="flex flex-wrap justify-center gap-3 md:gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/register"
            prefetch={true}
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "gap-2 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/25 transition-all duration-300",
            )}
          >
            <span>Sign Up Free</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/docs"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                rounded: "full",
              }),
              "px-8 backdrop-blur-sm bg-background/80 border-muted-foreground/20 hover:bg-background/90 transition-all duration-300",
            )}
          >
            <Terminal className="mr-2 size-4" />
            <span>See Docs</span>
          </Link>
        </div>

        {/* Feature highlights */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-4xl animate-fade-in-up"
          style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
        >
          <div className="flex items-center gap-3 rounded-lg border border-muted-foreground/20 bg-background/80 backdrop-blur-sm p-4">
            <Zap className="size-5 text-indigo-500" />
            <span className="text-sm">Lightning-fast deploys</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-muted-foreground/20 bg-background/80 backdrop-blur-sm p-4">
            <Code className="size-5 text-purple-500" />
            <span className="text-sm">Zero-config setup</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-muted-foreground/20 bg-background/80 backdrop-blur-sm p-4">
            <Server className="size-5 text-indigo-500" />
            <span className="text-sm">Your own infrastructure</span>
          </div>
        </div>
      </div>
    </section>
  )
}
