import Link from "next/link";
import * as React from "react";

// import { CustomerPortalButton } from "@/components/forms/customer-portal-button";
// import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { cn, formatDate } from "@/lib/utils";
// import { UserSubscriptionPlan } from "types";

// interface BillingInfoProps extends React.HTMLAttributes<HTMLFormElement> {
//   userSubscriptionPlan: UserSubscriptionPlan;
// }

export function BillingInfo() {
  // TODO: Billing information will be added in the future
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>
          Billing management will be available soon.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          We are currently working on our billing system. Check back later to view
          and manage your subscription details.
        </p>
      </CardContent>
    </Card>
  );

  /*
  // Original code commented out for future use:
  const {
    title,
    description,
    stripeCustomerId,
    isPaid,
    isCanceled,
    stripeCurrentPeriodEnd,
  } = userSubscriptionPlan;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          You are currently on the <strong>{title}</strong> plan.
        </CardDescription>
      </CardHeader>
      <CardContent>{description}</CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 border-t bg-accent py-2 md:flex-row md:justify-between md:space-y-0">
        {isPaid ? (
          <p className="text-sm font-medium text-muted-foreground">
            {isCanceled
              ? "Your plan will be canceled on "
              : "Your plan renews on "}
            {formatDate(stripeCurrentPeriodEnd)}.
          </p>
        ) : null}

        {isPaid && stripeCustomerId ? (
          <CustomerPortalButton userStripeId={stripeCustomerId} />
        ) : (
          <Link href="/pricing" className={cn(buttonVariants())}>
            Choose a plan
          </Link>
        )}
      </CardFooter>
    </Card>
  );
  */
}
