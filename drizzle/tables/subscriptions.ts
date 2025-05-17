
import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";

export const subscription = pgTable("subscription", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),

  plan: text("plan").notNull(), // e.g. 'starter', 'pro', 'enterprise'

  referenceId: text("reference_id").notNull(), // Could reference a `user.id` or `organization.id`

  stripeCustomerId: text("stripe_customer_id"), // Optional, only for Stripe users

  stripeSubscriptionId: text("stripe_subscription_id"),

  status: text("status").default("incomplete"), // 'active', 'incomplete', 'cancelled'

  periodStart: timestamp("period_start"), // Stripe’s `current_period_start`

  periodEnd: timestamp("period_end"), // Stripe’s `current_period_end`

  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),

  seats: integer("seats").default(1), // Useful for org-based plans
});
