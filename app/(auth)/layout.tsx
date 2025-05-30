import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth/session";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  role?: "admin" | "user"; // Make role optional
}

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  try {
    // Adjust the type to match what getCurrentUser actually returns
    const user = await getCurrentUser() as User | null | undefined;

    if (!user) {
      return <div className="min-h-screen">{children}</div>;
    }

    // Handle redirection based on role (with optional chaining)
    if (user.role === "admin") {
      redirect("/admin");
    }
    
    // Default redirect for all other logged-in users
    redirect("/dashboard");

  } catch (error) {
    console.error("Error in AuthLayout:", error);
    
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground">
            We are having trouble loading this page. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
