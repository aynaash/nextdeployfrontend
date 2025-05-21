
import { pgTable, uuid, text, integer, timestamp, numeric, boolean } from "drizzle-orm/pg-core";
import { user } from "./user";
import { team } from "./team";
import { plan }from "./plan";
import { subscription } from "./subscription";

export const billing = pgTable("billing", {
  id: text("id").$defaultFn(()=> randomUUID()).primaryKey(),
  // Foreign Keys
  userId:text("user_id").references(() => user.id).notNull(),
  teamId: text("team_id").references(() => team.id),
  subscriptionId: text("subscription_id").references(() => subscription.id),
  planId: text("plan_id").references(() => plan.id).notNull(),

  // Billing Metadata
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD").notNull(),
  billingPeriod: text("billing_period").default("monthly"), // monthly, yearly
  paid: boolean("paid").default(false).notNull(),
  invoiceUrl: text("invoice_url"), // for Stripe or PDF
  provider: text("provider").default("manual"), // stripe, manual, etc.

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
