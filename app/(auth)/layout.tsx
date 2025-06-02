import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { NextDeployLogo } from "@/components/logo";
import { Loader2 } from "lucide-react";

//TODO: fix error Failed to retrieve session: Dynamic server usage: 
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
  const { user, error } = await getUserSession();

  if (error) return <AuthErrorScreen error={error} />;

  if (!user) {
    return (
      <AuthContainer>
        <Suspense fallback={<AuthLoadingScreen />}>{children}</Suspense>
      </AuthContainer>
    );
  }

  // Role-based redirect
  switch (user.role) {
    case "admin":
      redirect("/admin");
    case "user":
      redirect("/dashboard");
    default:
      return (
        <AuthContainer>
          <Suspense fallback={<AuthLoadingScreen />}>{children}</Suspense>
        </AuthContainer>
      );
  }
}

// ----------- Session Utils -----------
async function getUserSession(): Promise<{ user: User | null; error: Error | null }> {
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
      error: err instanceof Error ? err : new Error("Unknown authentication error"),
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

// ----------- UI Components -----------

function AuthContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="relative flex h-screen flex-col items-center justify-center px-4">
        <header className="absolute left-0 top-0 w-full px-4 py-6">
          <NextDeployLogo/>
        </header>

        <main className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">{children}</main>

        <footer className="absolute bottom-0 w-full py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} NextDeploy. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

function AuthLoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <Loader2 className="size-8 animate-spin text-indigo-600" />
      <p className="text-gray-600">Loading authentication...</p>
    </div>
  );
}

function AuthErrorScreen({ error }: { error: Error | null }) {
  return (
    <AuthContainer>
      <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
        <div className="rounded-full bg-red-100 p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-8 text-red-600"
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
        <h2 className="text-2xl font-bold text-gray-800">Authentication Error</h2>
        <p className="text-gray-600">{error?.message || "We encountered an issue during authentication."}</p>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Try Again
          </button>
          <button
            onClick={() => redirect("/")}
            className="mt-4 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Go Home
          </button>
        </div>
      </div>
    </AuthContainer>
  );
}
