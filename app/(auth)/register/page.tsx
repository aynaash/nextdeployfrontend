"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authClient as client } from "../../../auth-client";
import Logo from "../../../components/logo";
import { cn } from "../../../lib/utils"; 

const RegisterSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["user", "admin"]),
});

export const dynamic = "force-dynamic";
type RegisterForm = z.infer<typeof RegisterSchema>;

const features = [
  [
    "Continuous Deployment",
    "Automated builds and deployments from GitHub with zero configuration.",
  ],
  [
    "Infrastructure as Code",
    "Manage infrastructure with version-controlled declarative files.",
  ],
  ["Monitoring & Alerts", "Real-time system metrics, logs, and health checks."],
  ["GitHub Webhooks", "Trigger deployments directly from your repos."],
  ["SSH Key Auth", "Secure deployments using private keys and VPS access."],
  ["Daemon Logs", "Log streaming and container health tracking."],
  [
    "Multitenancy Support",
    "Works for individuals and dev teams with scoped resources.",
  ],
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
};

const featureVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  }),
};

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "user",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      console.log("Submitting registration data:", data);

      const signResponse = await client.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      console.log("Signup response:", signResponse);

      if (signResponse.error) {
        toast.error(signResponse.error.message);
      } else {
        toast.success("Registered successfully!");
        router.replace("/dashboard");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 blur-3xl delay-1000" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-gradient-to-r from-violet-500/10 to-pink-500/10 blur-3xl delay-500" />
      </div>

      {/* Back Navigation */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 z-20 flex items-center gap-2 border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 md:left-8 md:top-8",
        )}
      >
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex items-center gap-2 border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10",
          )}
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </motion.div>

      <div className="container relative z-10 grid h-screen items-center justify-center lg:grid-cols-2 lg:px-0">
        {/* Left Features Panel */}
        <motion.div
          className="relative hidden h-full flex-col items-center justify-center overflow-hidden p-8 lg:flex"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 30,
            delay: 0.3,
          }}
        >
          <div className="relative z-10 max-w-lg space-y-8">
            <motion.div
              className="mb-8 flex items-center gap-3"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            >
              <Logo />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
            >
              <h2 className="mb-4 text-4xl font-bold leading-tight text-white">
                Streamline your{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  deployment workflow
                </span>
              </h2>
              <p className="text-lg text-slate-300">
                Deploy with confidence using our modern infrastructure platform
              </p>
            </motion.div>

            <div className="space-y-6">
              {features.map(([title, desc], i) => (
                <motion.div
                  className="group flex items-start gap-4"
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={featureVariants}
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-transform duration-300 group-hover:scale-110">
                    <Check className="size-4 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white transition-colors duration-300 group-hover:text-emerald-300">
                      {title}
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Registration Form */}
        <motion.div
          className="flex items-center justify-center p-4 sm:p-8 lg:p-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div
              className="mb-8 space-y-3 text-center"
              variants={itemVariants}
            >
              <div className="mb-4 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Create an account
              </h1>
              <p className="text-slate-400">
                Enter your details to get started
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="name" className="font-medium text-white">
                    Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      {...register("name")}
                      placeholder="Enter your name"
                      disabled={isLoading}
                      className="border-white/20 bg-white/5 pl-10 text-white transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                  </div>
                  {errors.name && (
                    <motion.p
                      className="text-sm text-red-400"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="email" className="font-medium text-white">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="Enter your email"
                      disabled={isLoading}
                      className="border-white/20 bg-white/5 pl-10 text-white transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      className="text-sm text-red-400"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="password" className="font-medium text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Enter your password"
                      disabled={isLoading}
                      className="border-white/20 bg-white/5 pl-10 pr-10 text-white transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transform text-slate-400 transition-colors duration-200 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      className="text-sm text-red-400"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full transform rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:from-emerald-700 hover:to-cyan-700 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Creating account...
                      </div>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div
                className="mt-6 text-center text-sm text-slate-400"
                variants={itemVariants}
              >
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-emerald-400 transition-colors duration-200 hover:text-emerald-300 hover:underline"
                >
                  Sign in
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;

