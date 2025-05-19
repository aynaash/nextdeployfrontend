
import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";

export const subscription = pgTable("subscription", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),

  plan: text("plan").notNull(),

  referenceId: text("reference_id").notNull(),

  stripeCustomerId: text("stripe_customer_id"),

  stripeSubscriptionId: text("stripe_subscription_id"),

  status: text("status").default("incomplete"),

  periodStart: timestamp("period_start"),

  periodEnd: timestamp("period_end"),

  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),

  seats: integer("seats").default(1),
});
