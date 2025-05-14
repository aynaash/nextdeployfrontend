
import { pgTable, text, timestamp, real, index, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";

export const plans = pgTable("plans", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),

  name: text("name").notNull().unique(),
  description: text("description"), // short description for UI/landing
  price: real("price").notNull(), // in USD
  interval: text("interval").default("monthly"), // monthly or yearly

  stripePriceId: text("stripe_price_id").notNull(), // links to Stripe billing

  features: jsonb("features").notNull(), // ex: ["ci_cd", "webhooks", "analytics"]
  featureList: jsonb("feature_list"), // optional marketing-rich structure

  // Enforcement fields
  maxProjects: integer("max_projects").notNull().default(1),
  maxDeployments: integer("max_deployments").notNull().default(5),
  maxTeamMembers: integer("max_team_members").notNull().default(1),

  // Trial support
  isTrial: boolean("is_trial").default(false),
  trialDays: integer("trial_days").default(14),

  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    planPriceIdx: index("plan_price_idx").on(table.price),
  };
});
