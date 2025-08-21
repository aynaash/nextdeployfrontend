"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { AirVent } from "lucide-react";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await authClient.signUp.email(
        {
          email,
          password,
          name,
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => router.push("/dashboard"),
          onError: (ctx) => setError(ctx.error.message || "Sign up failed"),
        }
      );

      if (error) {
        setError(error.message || "Sign up failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await authClient.signIn.social(
        {
          provider: "github",
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => router.push("/dashboard"),
          onError: (ctx) => setError(ctx.error.message || "Sign up failed"),
        }
      );

      if (error) {
        setError(error.message || "Sign up failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await authClient.signIn.social(
        {
          provider: "google",
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => router.push("/dashboard"),
          onError: (ctx) => setError(ctx.error.message || "Sign up failed"),
        }
      );

      if (error) {
        setError(error.message || "Sign up failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymusSignUp = async () => {
    setLoading(true);
    setError("");

      const { error } = await authClient.signIn.anonymous({
        fetchOptions: {
          onSuccess: () => {
            setLoading(false)
            redirect('/dashboard')
          },
          onError: (ctx) => setError(ctx.error.message),
          onRequest: () => {
            setLoading(true)
          },
          onResponse: () => setLoading(true)
        },
      });
      console.log(error)
      if (error) setError(error.message || "Sign up failed");
      else redirect('/dashboard')
      setError("An unexpected error occurred");
      setLoading(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-xl space-y-8 p-8 rounded-lg shadow-md border border-[#424242] bg-[#2A2A2A]">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-xl font-semibold text-[#A0A0A0]">
            <AirVent className="h-6 w-6 text-[#A0A0A0]" />
            Next / Drizzle / Better-auth.
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-[#7a7a7a]">
            Create your account
          </h2>
          <p className="text-sm text-[#7a7a7a]">
            Sign up with your GitHub or Google account
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleGithubSignUp}
            disabled={loading}
            className="flex-1 flex items-center text-[#A0A0A0] justify-center gap-2 px-4 py-2 border border-white/10 rounded-md bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            GitHub
          </button>

          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="flex-1 flex items-center text-[#A0A0A0] justify-center gap-2 px-4 py-2 border border-white/10 rounded-md bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          <button
            onClick={handleAnonymusSignUp}
            disabled={loading}
            className="flex-1 flex items-center text-[#A0A0A0] justify-center gap-2 px-4 py-2 border border-white/10 rounded-md bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Anonymous
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 p-1 bg-[#424242] border border-[#424242] rounded-md text-[#7a7a7a]">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#A0A0A0]"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#A0A0A0]"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#A0A0A0]"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#7a7a7a] bg-[#242424] hover:bg-[#424242] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7a7a7a] disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
