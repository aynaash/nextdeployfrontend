import Image from "next/image";
import Link from "next/link";
// import { client } from "../../../auth-client.ts";
// import { getCurrentUser } from "@/lib/session";
// import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
// import { ComparePlans } from "@/components/pricing/compare-plans";
// import { PricingCards } from "@/components/pricing/pricing-cards";
// import { PricingFaq } from "@/components/pricing/pricing-faq";

export const metadata = constructMetadata({
  title: "Pricing – NextDeploy",
  description: "Explore our subscription plans.",
});

export default async function PricingPage() {
  // TODO: Pricing support will be added in the future
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Pricing Coming Soon</h1>
        <p className="text-lg text-muted-foreground">
          We are working on our subscription plans and pricing options.
        </p>
        <p className="text-muted-foreground">
          Check back later or contact us for more information.
        </p>
      </div>
      
      <Image
        src="/_static/illustrations/call-waiting.svg"
        alt="Coming soon"
        width={400}
        height={400}
        className="pointer-events-none dark:invert"
      />
      
      <Link
        href="/"
        className="text-muted-foreground underline underline-offset-4 hover:text-purple-500"
      >
        Return to Home
      </Link>
    </div>
  );

  /*
  // Original code commented out for future use:
  // Get session from auth client
  // Get user info - but don't block if not logged in
  const user = await getCurrentUser();
  // Admin redirect section (only if user is logged in and is admin)
  if (user?.role === "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">Seriously?</h1>
        <Image
          src="/_static/illustrations/call-waiting.svg"
          alt="403"
          width={560}
          height={560}
          className="pointer-events-none -my-20 dark:invert"
        />
        <p className="text-balance px-4 text-center text-2xl font-medium">
          You are an <strong>{user.role}</strong>. Back to{" "}
          <Link
            href="/admin"
            className="text-muted-foreground underline underline-offset-4 hover:text-purple-500"
          >
            Dashboard
          </Link>
          .
        </p>
      </div>
    );
  }

  // Get subscription info only if user is logged in
  const subscriptionPlan = user?.id
    ? await getUserSubscriptionPlan(user.id)
    : null;

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <PricingCards 
        userId={user?.id} 
        subscriptionPlan={subscriptionPlan} 
        isSignedIn={!!user}
      />
      <hr className="container" />
      <ComparePlans />
      <PricingFaq />
    </div>
  );
  */
}
