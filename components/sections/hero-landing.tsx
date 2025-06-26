import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ArrowRight, Code, Terminal, Zap, Twitter, Server } from "lucide-react"
import { Icons } from "../../components/shared/icons.tsx"

export default function HeroLanding() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      {/* Background pattern */}
      <div className="bg-grid-pattern absolute inset-0 z-0 opacity-[0.03]"></div>

      {/* Gradient orbs */}
      <div className="absolute -left-20 -top-24 z-0 size-72 rounded-full bg-purple-500/20 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-20 z-0 size-72 rounded-full bg-indigo-500/20 blur-3xl"></div>

      <div className="container relative z-10 flex max-w-5xl flex-col items-center gap-8 text-center">
        <Link
          href="https://x.com/HersiYussuf"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "border-muted-foreground/20 bg-background/80 px-4 backdrop-blur-sm transition-all duration-300 hover:bg-background/90",
          )}
          target="_blank"
        >
          <span className="mr-3">🚀</span>
          <span className="hidden md:flex">Introducing&nbsp;</span> NextDeploy
          <Icons.twitter className="ml-2 size-3.5" />
        </Link>

        <h1 className="animate-fade-in text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          Kick off with a bang a simple{" "}
          <span className="text-gradient_indigo-purple relative font-extrabold">
            automated next js deployment
            <span className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-70"></span>
          </span>
        </h1>

        <p
          className="max-w-2xl animate-fade-in text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Ship your next project using your own cloud VPS and infrastructure with our blazing fast Go-powered deployment
          engine
        </p>

         <div
          className="animate-fade-in-up flex flex-wrap justify-center gap-3 md:gap-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          {/* Commented out signup button */}
          {/* <Link
            href="/register"
            prefetch={true}
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 px-8 shadow-lg transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25",
            )}
          >
            <span>Sign Up Free</span>
            <ArrowRight className="size-4" />
          </Link> */}
          <Link
            href="/docs"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                rounded: "full",
              }),
              "border-muted-foreground/20 bg-background/80 px-8 backdrop-blur-sm transition-all duration-300 hover:bg-background/90",
            )}
          >
            <Terminal className="mr-2 size-4" />
            <span>See Docs</span>
          </Link>
        </div>

        {/* Feature highlights */}
        <div
          className="animate-fade-in-up mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3"
          style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
        >
          <div className="flex items-center gap-3 rounded-lg border border-muted-foreground/20 bg-background/80 p-4 backdrop-blur-sm">
            <Zap className="size-5 text-indigo-500" />
            <span className="text-sm">Lightning-fast deploys</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-muted-foreground/20 bg-background/80 p-4 backdrop-blur-sm">
            <Code className="size-5 text-purple-500" />
            <span className="text-sm">Zero-config setup</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-muted-foreground/20 bg-background/80 p-4 backdrop-blur-sm">
            <Server className="size-5 text-indigo-500" />
            <span className="text-sm">Your own infrastructure</span>
          </div>
        </div>
      </div>
    </section>
  )
}
