import type React from "react";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCurrentUser } from "@/lib/session";
type UserRole = "admin" | "user" | null;

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean | null;
  role: UserRole;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  twoFactorEnabled?: boolean | null;
  stripeCustomerId?: string | null;
}

interface AuthLayoutProps {
  children: React.ReactNode;
}

// ----------- Layout Component -----------
export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user ? transformUser(session.user) : null;


  if (!user) {
    return <Suspense fallback={<AuthLoadingScreen />}>{children}</Suspense>;
  }

  // Role-based redirect
  switch (user.role) {
    case "admin":
      redirect("/admin");
    case "user":
      redirect("/dashboard");
    default:
      return <Suspense fallback={<AuthLoadingScreen />}>{children}</Suspense>;
  }
}

// ----------- UI Components -----------

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <div className="size-12 animate-spin rounded-full border-4 border-emerald-500/30 border-t-emerald-500" />
        <p className="text-slate-300">Loading authentication...</p>
      </div>
    </div>
  );
}

function AuthErrorScreen({ error }: { error: Error | null }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              Authentication Error
            </h2>
            <p className="text-slate-400">
              {error?.message ||
                "We encountered an issue during authentication."}
            </p>
          </div>
          <div className="flex w-full gap-4">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:from-emerald-700 hover:to-cyan-700"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/20"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------- Session Utils -----------
async function getUserSession(): Promise<{
  user: User | null;
  error: Error | null;
}> {
  try {
    const user = await getCurrentUser();
    return {
      user: user ? transformUser(user) : null,
      error: null,
    };
  } catch (err) {
    console.error("Authentication error:", err);
    return {
      user: null,
      error:
        err instanceof Error ? err : new Error("Unknown authentication error"),
    };
  }
}

function transformUser(user: any): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    role: ["admin", "user"].includes(user.role) ? user.role : null,
    image: user.image ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    twoFactorEnabled: user.twoFactorEnabled ?? null,
    stripeCustomerId: user.stripeCustomerId ?? null,
  };
}


