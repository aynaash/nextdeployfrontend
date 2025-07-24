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
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Choose NextDeploy?</h2>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Built by DevOps engineers, for developers who want control
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-fit">
                  <Zap className="h-8 w-8 text-green-600" />
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

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit">
                  <Shield className="h-8 w-8 text-blue-600" />
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

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full w-fit">
                  <Activity className="h-8 w-8 text-purple-600" />
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
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Deploy?</h2>
          <p className="text-lg text-muted-foreground mb-8">Get started with NextDeploy in minutes, not hours</p>

          <div className="bg-slate-900 dark:bg-slate-800 rounded-lg p-6 text-left">
            <div className="flex items-center mb-4">
              <Terminal className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-green-400 font-mono text-sm">Terminal</span>
            </div>
            <code className="text-green-400 font-mono text-sm block">
              <span className="text-slate-400"># Install NextDeploy CLI</span>
              <br />
              npm install -g nextdeploy
              <br />
              <br />
              <span className="text-slate-400"># Initialize your project</span>
              <br />
              nextdeploy init
              <br />
              <br />
              <span className="text-slate-400"># Deploy to your server</span>
              <br />
              nextdeploy deploy
            </code>
          </div>

          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/guides/getting-started">
                Start Your First Deployment
                <ArrowRight className="ml-2 h-5 w-5" />
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
