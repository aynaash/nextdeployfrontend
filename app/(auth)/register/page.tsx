"use client"
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { authClient as client } from "../../../auth-client.ts";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import Logo from "../../../components/logo.tsx";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const RegisterSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

type RegisterForm = z.infer<typeof RegisterSchema>;

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

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      console.log("Submitting registration data:", data);

      const signResponse = await client.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
          role: "USER",
        },
        {
          fetchOptions: {},
        }
      );

      console.log("Signup response:", signResponse);

      if (signResponse.error) {
        toast.error(signResponse.error.message);
      } else {
        toast.success("Registered successfully!");
        router.replace("/");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
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
        className="absolute top-4 left-4 md:top-8 md:left-8 z-10"
      >
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex items-center gap-2 backdrop-blur-sm bg-white/10 text-white hover:bg-white/20"
          )}
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </motion.div>

      <div className="container grid h-screen items-center justify-center lg:grid-cols-2 lg:px-0">
        {/* Left Features */}
        <motion.div
          className="hidden lg:flex h-full flex-col items-center justify-center p-8 bg-slate-950 relative overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 30 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.2),transparent_50%)]" />

          <div className="relative z-10 max-w-md space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Logo />
            </div>

            <h2 className="text-3xl font-bold text-white leading-tight">
              Streamline your <span className="text-emerald-400">deployment workflow</span>
            </h2>

            <div className="space-y-4">
              {features.map(([title, desc], i) => (
                <div className="flex items-start gap-4" key={i}>
                  <Check className="size-5 text-emerald-400 mt-1" />
                  <div>
                    <h4 className="text-white font-medium">{title}</h4>
                    <p className="text-slate-300 text-sm mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Auth Form */}
        <motion.div
          className="flex items-center justify-center p-4 sm:p-8 lg:p-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="w-full max-w-md bg-slate-900/80 text-white rounded-xl shadow-lg p-6 sm:p-8 backdrop-blur"
            variants={itemVariants}
          >
            <motion.div className="text-center space-y-3 mb-6" variants={itemVariants}>
              <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
              <p className="text-sm text-slate-400">Enter your details to get started</p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    {...register("name")}
                    placeholder="Enter your name"
                    disabled={isLoading}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    className="bg-slate-800 border-slate-700 text-white"
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
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-400">{errors.password.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  variant="default"
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-emerald-400 hover:underline">
                  Sign in
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
