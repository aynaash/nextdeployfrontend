import { infos } from '../../config/landing';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Shield, Activity, ArrowRight, Terminal, Rocket } from "lucide-react"
import Link from "next/link"
import BentoGrid from '@/components/sections/bentogrid';
import Features from '@/components/sections/features';
import HeroLanding from '@/components/sections/hero-landing';
import InfoLanding from '@/components/sections/info-landing';
import Powered from '@/components/sections/powered';
import PreviewLanding from '@/components/sections/preview-landing';
import Testimonials from '@/components/sections/testimonials';

export default function IndexPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Using the component from first version */}
      <HeroLanding />
      {/* Preview Section */}
      <PreviewLanding />
      {/* Powered By Section */}
      <Powered />
      {/* Three Pillars Section - From second version */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">Why Choose NextDeploy?</h2>
          <p className="mb-12 text-center text-xl text-muted-foreground">
            Built by DevOps engineers, for developers who want control
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 w-fit rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                  <Zap className="size-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Fast Deployment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Deploy Next.js apps and Docker containers in under 60 seconds. Optimized build pipelines with
                  intelligent caching and parallel processing.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 w-fit rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                  <Shield className="size-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Infrastructure Ownership</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Deploy to your own VPS, cloud instances, or on-premises servers. No vendor lock-in, full control over
                  your infrastructure and costs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 w-fit rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
                  <Activity className="size-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Real-Time Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Built-in monitoring with metrics, logs, and alerts. Track performance, uptime, and resource usage
                  across all your deployments.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Info Section - Using component from first version */}
      <InfoLanding data={infos[0]} reverse={true} />
      {/* Quick Start Section - From second version */}
      <section className="bg-slate-50 px-4 py-20 dark:bg-slate-900/50">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to Deploy?</h2>
          <p className="mb-8 text-lg text-muted-foreground">Get started with NextDeploy in minutes, not hours</p>

          <div className="rounded-lg bg-slate-900 p-6 text-left dark:bg-slate-800">
            <div className="mb-4 flex items-center">
              <Terminal className="mr-2 size-5 text-green-400" />
              <span className="font-mono text-sm text-green-400">Terminal</span>
            </div>
            <code className="block font-mono text-sm text-green-400">
              <span className="text-slate-400"># Initiate the deployment</span>
              <br />
              nextdeploy init 
              <br />
              <br />
              <span className="text-slate-400"># Build your project</span>
              <br />
              nextdeploy build
              <br />
              <br />
              <span className="text-slate-400"># Deploy to your server</span>
              <br />
              nextdeploy ship
            </code>
          </div>

          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/guides/getting-started">
                Start Your First Deployment
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Additional sections from first version can be added here */}
      {/* <Features /> */}
      {/* <Testimonials /> */}
      {/* <BentoGrid /> */}
    </div>
  );
}
