import { redirect } from "next/navigation";

// Mocked user subscription plan used during development
import { mockUserSubscriptionPlan } from "../../../../lib/mockData";

// Function to get the current user session
import { getCurrentUser } from "../../../../lib/session";

// Function to fetch real subscription data (commented out for now)
// import { getUserSubscriptionPlan } from "../../../../lib/subscription";

// Utility to generate page metadata
import { constructMetadata } from "../../../../lib/utils";

// UI components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardHeader } from "@/components/dashboard/header";
import { BillingInfo } from "@/components/pricing/billing-info";
import { Icons } from "@/components/shared/icons";
import { UserSubscriptionPlan } from "../../../../lib/types";

// Static page metadata for SEO
export const metadata = constructMetadata({
  title: "Billing – NextDeploy",
  description: "Manage billing and your subscription plan.",
});
export const dynamic = 'force-dynamic';
export default async function BillingPage() {
  // Get the currently logged-in user
  const user = await getCurrentUser();

  // Declare variable to hold user's subscription data
  let userSubscriptionPlan;

  if (user) {
    // In production, use the real subscription plan from Stripe
    // userSubscriptionPlan = await getUserSubscriptionPlan(user.id);

    // During development/testing, use mock data instead
    userSubscriptionPlan = mockUserSubscriptionPlan;
    console.log("User sub found");
  } else {
    // If no user is logged in, redirect to login page
    redirect("/login");
  }

  return (
    <>
      {/* Page heading and description */}
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />

      <div className="grid gap-8">
        {/* Dev/demo alert banner */}
        <Alert className="!pl-14">
          <Icons.warning />
          <AlertTitle>This is a demo app.</AlertTitle>
          <AlertDescription className="text-balance">
            SaaS Starter app is running in test mode using Stripe’s sandbox. You
            can try it out using{" "}
            <a
              href="https://stripe.com/docs/testing#cards"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-8"
            >
              Stripe test cards
            </a>
            .
          </AlertDescription>
        </Alert>

        {/* Coming Soon alert for billing system */}
        <Alert className="border-yellow-400 bg-yellow-50 !pl-14 text-yellow-800">
          <Icons.warning />
          <AlertTitle>Billing System Coming Soon</AlertTitle>
          <AlertDescription className="text-balance">
            We’re currently finalizing our billing system. Subscriptions will be
            available shortly. Stay tuned!
          </AlertDescription>
        </Alert>

        {/* Displays subscription details (currently using mock data) */}
        <BillingInfo userSubscriptionPlan={userSubscriptionPlan} />
      </div>
    </>
  );
}
