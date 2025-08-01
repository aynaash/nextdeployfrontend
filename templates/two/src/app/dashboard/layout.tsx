import { DashboardLayoutClient } from "@/components/DashboardLayoutClient";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    console.log('session :', session);
    if (!session) {
      redirect("/sign-in");
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") console.error("Auth error:", error);
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen bg-[#1a1a1a] dark:bg-[#030314]">
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </div>
  );
}
