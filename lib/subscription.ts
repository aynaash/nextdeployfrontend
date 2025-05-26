import { eq } from "drizzle-orm";
import { db } from "../lib/db.ts";
import { user } from "../drizzle/schema/schema.ts";
import { stripe } from "@/lib/stripe";
import { pricingData } from "@/config/subscriptions";
import { UserSubscriptionPlan } from "types";

export async function getUserSubscriptionPlan(
  userId: string,
): Promise<UserSubscriptionPlan> {
  if (!userId) throw new Error("Missing parameters");

  const [user] = await db
    .select({
      stripeSubscriptionId: users.stripeSubscriptionId,
      stripeCurrentPeriodEnd: users.stripeCurrentPeriodEnd,
      stripeCustomerId: users.stripeCustomerId,
      stripePriceId: users.stripePriceId,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!user) throw new Error("User not found");

  const isPaid =
    user.stripePriceId &&
    user.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now();

  const userPlan =
    pricingData.find((plan) => plan.stripeIds.monthly === user.stripePriceId) ||
    pricingData.find((plan) => plan.stripeIds.yearly === user.stripePriceId);

  const plan = isPaid && userPlan ? userPlan : pricingData[0];

  const interval = isPaid
    ? userPlan?.stripeIds.monthly === user.stripePriceId
      ? "month"
      : userPlan?.stripeIds.yearly === user.stripePriceId
        ? "year"
        : null
    : null;

  let isCanceled = false;
  if (isPaid && user.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId,
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime(),
    isPaid,
    interval,
    isCanceled,
  };
}
