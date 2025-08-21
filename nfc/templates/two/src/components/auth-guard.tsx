import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default async function AuthGuard({ children }: AuthGuardProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
