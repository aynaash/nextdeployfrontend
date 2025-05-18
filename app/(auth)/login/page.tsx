"use client"
import { Suspense } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Terminal, ArrowLeft, Github, Check } from "lucide-react"
import Logo from "../../../components/logo.tsx"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/forms/user-auth-form"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Back to Home */}
      <motion.div
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute left-4 top-4 md:left-8 md:top-8 z-10"
      >
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex items-center gap-2 backdrop-blur-sm bg-white/10 text-white hover:bg-white/20"
          )}
        >
          <ArrowLeft className="size-4" />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      <div className="container grid h-screen items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left Feature Panel */}
        <motion.div
          className="hidden h-full lg:flex flex-col items-center justify-center p-8 bg-slate-950 relative overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 30 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.2),transparent_50%)]" />

          <div className="relative z-10 w-full max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <Logo/>
                                      </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white leading-tight">
                Streamline your <span className="text-emerald-400">deployment workflow</span>
              </h2>

              <div className="space-y-4">
                {[
                  ["Continuous Deployment", "Automated builds and deployments from GitHub with zero configuration."],
                  ["Infrastructure as Code", "Manage infrastructure with version-controlled declarative files."],
                  ["Monitoring & Alerts", "Real-time system metrics, logs, and health checks."],
                  ["GitHub Webhooks", "Trigger deployments directly from your repos."],
                  ["SSH Key Auth", "Secure deployments using private keys and VPS access."],
                  ["Daemon Logs", "Log streaming and container health tracking."],
                  ["Multitenancy Support", "Works for individuals and dev teams with scoped resources."],
                ].map(([title, desc], i) => (
                  <div className="flex items-start gap-4" key={i}>
                    <Check className="size-5 text-emerald-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">{title}</h4>
                      <p className="text-slate-300 text-sm mt-1">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Auth Panel */}
        <motion.div 
          className="flex items-center justify-center p-4 sm:p-8 lg:p-12"
          initial="hidden" 
          animate="visible" 
          variants={containerVariants}
        >
          <div className="mx-auto w-full max-w-md bg-slate-900/80 text-white rounded-xl shadow-lg p-6 sm:p-8 backdrop-blur">
            <motion.div className="text-center space-y-3 mb-6" variants={itemVariants}>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
              <p className="text-sm text-slate-400">
                Sign in to manage your deployments
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <Suspense fallback={<div className="h-[250px] flex items-center justify-center animate-pulse">Loading authentication...</div>}>
                <UserAuthForm />
              </Suspense>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  )
}
