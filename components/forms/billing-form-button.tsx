"use client";

import { SubscriptionPlan, UserSubscriptionPlan } from "@/types";
import { Button } from "@/components/ui/button";

interface BillingFormButtonProps {
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
}: BillingFormButtonProps) {
  // Temporary UI before billing is implemented
  return (
    <Button
      variant="outline"
      rounded="full"
      className="w-full cursor-not-allowed opacity-70"
      disabled
    >
      Billing coming soon
    </Button>
  );
}

/* 
// Dynamic billing logic - commented out for now

import { useTransition } from "react";
import { generateUserStripe } from "@/actions/generate-user-stripe";
import { Icons } from "@/components/shared/icons";

let [isPending, startTransition] = useTransition();
const generateUserStripeSession = generateUserStripe.bind(
  null,
  offer.stripeIds[year ? "yearly" : "monthly"],
);

const stripeSessionAction = () =>
  startTransition(async () => await generateUserStripeSession());

const userOffer =
  subscriptionPlan.stripePriceId ===
  offer.stripeIds[year ? "yearly" : "monthly"];

return (
  <Button
    variant={userOffer ? "default" : "outline"}
    rounded="full"
    className="w-full"
    disabled={isPending}
    onClick={stripeSessionAction}
  >
    {isPending ? (
      <>
        <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
      </>
    ) : (
      <>{userOffer ? "Manage Subscription" : "Upgrade"}</>
    )}
  </Button>
);
*/
