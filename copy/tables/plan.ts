
import { pgTable, text, timestamp, real, index, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";

export const plan = pgTable("plan", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),

  name: text("name").notNull().unique(),
  description: text("description"),
  price: real("price").notNull(),
  interval: text("interval").default("monthly"),

  stripePriceId: text("stripe_price_id").notNull(),

  features: jsonb("features").notNull(),
  featureList: jsonb("feature_list"),

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
