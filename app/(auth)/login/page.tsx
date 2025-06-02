"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { authClient as client } from "../../../auth-client";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import Logo from "../../../components/logo";
import { cn } from "../../../lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = 'force-dynamic';
const SignInSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof SignInSchema>;

const features = [
  ["Continuous Deployment", "Automated builds and deployments from GitHub with zero configuration."],
  ["Infrastructure as Code", "Manage infrastructure with version-controlled declarative files."],
  ["Monitoring & Alerts", "Real-time system metrics, logs, and health checks."],
  ["GitHub Webhooks", "Trigger deployments directly from your repos."],
  ["SSH Key Auth", "Secure deployments using private keys and VPS access."],
  ["Daemon Logs", "Log streaming and container health tracking."],
  ["Multitenancy Support", "Works for individuals and dev teams with scoped resources."],
];

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
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(SignInSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: SignInForm) => {
    setIsLoading(true);
    try {
      const signInResponse = await client.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (signInResponse.error) {
        toast.error(signInResponse.error.message);
      } else {
        toast.success("Signed in successfully!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Back Navigation */}
      <motion.div
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute left-4 top-4 z-10 md:left-8 md:top-8"
      >
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex items-center gap-2 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
          )}
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </motion.div>

      <div className="container grid h-screen items-center justify-center lg:grid-cols-2 lg:px-0">
        {/* Left Features Panel */}
        <motion.div
          className="relative hidden h-full flex-col items-center justify-center overflow-hidden bg-slate-950 p-8 lg:flex"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 30 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.2),transparent_50%)]" />

          <div className="relative z-10 max-w-md space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <Logo />
            </div>

            <h2 className="text-3xl font-bold leading-tight text-white">
              Streamline your <span className="text-emerald-400">deployment workflow</span>
            </h2>

            <div className="space-y-4">
              {features.map(([title, desc], i) => (
                <div className="flex items-start gap-4" key={i}>
                  <Check className="mt-1 size-5 text-emerald-400" />
                  <div>
                    <h4 className="font-medium text-white">{title}</h4>
                    <p className="mt-1 text-sm text-slate-300">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Sign-In Form */}
        <motion.div
          className="flex items-center justify-center p-4 sm:p-8 lg:p-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="w-full max-w-md rounded-xl bg-slate-900/80 p-6 text-white shadow-lg backdrop-blur sm:p-8"
            variants={itemVariants}
          >
            <motion.div className="mb-6 space-y-3 text-center" variants={itemVariants}>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
              <p className="text-sm text-slate-400">Sign in to continue to your account</p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    className="border-slate-700 bg-slate-800 text-white"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="border-slate-700 bg-slate-800 text-white"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-400">{errors.password.message}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Link
                    href="/reset-password"
                    className="text-sm text-emerald-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  variant="default"
                  className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-slate-400">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-emerald-400 hover:underline">
                  Sign up
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignInPage;
