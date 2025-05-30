import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../lib/session";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

// Define proper user type (preferably in a shared types file)
type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  role: "user" | "admin" | "moderator"; // Explicit roles
};

export default async function AdminLayout({ children }: ProtectedLayoutProps) {
  let user: User | null = null;
  
  try {
    user = await getCurrentUser() as User;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    redirect("/login?error=session_error");
  }

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    // Consider logging unauthorized access attempts
    console.warn(`Unauthorized access attempt by user ${user.id}`);
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
