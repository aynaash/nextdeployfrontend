import { Banana } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-[#2A2A2A] border-b border-[#424242]">
      <div className="container-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Banana className="h-6 w-6 text-[#A0A0A0]" />
            <span className="font-bold text-[#A0A0A0]">
              Next / Drizzle / Better-auth.
            </span>
          </Link>

          <div>
            {session ? (
              <form
                action={async () => {
                  "use server";
                  await auth.api.signOut({
                    headers: await headers(),
                  });
                  redirect("/");
                }}
              >
                <Button
                  className="bg-[#424242] text-[#7a7a7a] py-1 px-4 text-xs rounded-md hover:bg-[#363636] cursor-pointer"
                  type="submit"
                >
                  Sign Out
                </Button>
              </form>
            ) : (
              <Link href="/sign-in" className={buttonVariants()}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
