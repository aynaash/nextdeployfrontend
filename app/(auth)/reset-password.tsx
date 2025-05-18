
"use client"

import { Suspense } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ResetPasswordForm } from "@/components/forms/reset-password-form"
import Logo from "../../components/logo"

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Back Navigation */}
      <motion.div
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute top-4 left-4 md:top-8 md:left-8 z-10"
      >
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex items-center gap-2 backdrop-blur-sm bg-white/10 text-white hover:bg-white/20",
          )}
        >
          <ArrowLeft className="size-4" />
          Back to Login
        </Link>
      </motion.div>

      <div className="container flex h-screen items-center justify-center">
        <motion.div
          className="w-full max-w-md bg-slate-900/80 text-white rounded-xl shadow-lg p-6 sm:p-8 backdrop-blur"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          <div className="text-center space-y-3 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
            <p className="text-sm text-slate-400">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <Suspense
            fallback={<div className="h-[150px] flex items-center justify-center animate-pulse">Loading...</div>}
          >
            <ResetPasswordForm />
          </Suspense>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Remember your password?{" "}
              <Link href="/login" className="text-emerald-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
